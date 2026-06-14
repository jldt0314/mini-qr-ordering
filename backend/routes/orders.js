import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// ─────────────────────────────────────────────
// POST /api/orders
// Creates a new order using a DB transaction
// ─────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { table_number, items, total_amount } = req.body;

  // Basic validation
  if (!table_number || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'table_number and a non-empty items array are required.',
    });
  }

  // Borrow a single connection from the pool for the transaction
  const connection = await pool.getConnection();

  try {
    const [existing] = await connection.query(
      `SELECT id, status FROM orders 
      WHERE table_number = ? 
      AND status NOT IN ('completed', 'cancelled')
      ORDER BY `,
      [table_number]
    );

    if (existing.length > 0) {
      // return an error response — don't proceed with the insert
      return res.status(400).json({
        success: false,
        message: 'An active order already exists for this table.',
      });
    }
    // ── START TRANSACTION ──────────────────────────────
    await connection.beginTransaction();

    // Step 1: Insert the parent order row
    const [orderResult] = await connection.query(
      'INSERT INTO orders (table_number, total_amount) VALUES (?, ?)',
      [table_number, total_amount]
    );

    const newOrderId = orderResult.insertId;

    // Step 2: Loop through items and insert each into order_items
    for (const item of items) {
      await connection.query(
        'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
        [newOrderId, item.product_id, item.quantity, item.unit_price]
      );
    }

    // ── COMMIT — everything succeeded ─────────────────
    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully.',
      data: { order_id: newOrderId },
    });

  } catch (error) {
    // ── ROLLBACK — something failed, undo everything ──
    await connection.rollback();
    console.error('POST /api/orders error:', error);
    res.status(500).json({ success: false, message: 'Failed to place order.' });

  } finally {
    // Always release the connection back to the pool
    connection.release();
  }
});

// ─────────────────────────────────────────────
// GET /api/orders/table/:tableNumber
// Fetches all orders for a specific table (Customer)
// ─────────────────────────────────────────────
router.get('/table/:tableNumber', async (req, res) => {
  try {
    const { tableNumber } = req.params;
    const [rows] = await pool.query(`
      SELECT
        o.id            AS order_id,
        o.table_number,
        o.status,
        o.total_amount,
        o.created_at,
        oi.quantity,
        oi.unit_price,
        p.name          AS product_name
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p     ON oi.product_id = p.id
      WHERE o.table_number = ?
      AND o.status IN ('pending', 'confirmed', 'preparing', 'ready')
      ORDER BY o.created_at DESC
      LIMIT 1
    `, [tableNumber]);

    // Group flat JOIN rows into nested order objects
    const ordersMap = {};
    for (const row of rows) {
      if (!ordersMap[row.order_id]) {
        ordersMap[row.order_id] = {
          order_id:     row.order_id,
          table_number: row.table_number,
          status:       row.status,
          total_amount: row.total_amount,
          created_at:   row.created_at,
          items:        [],
        };
      }
      ordersMap[row.order_id].items.push({
        product_name: row.product_name,
        quantity:     row.quantity,
        unit_price:   row.unit_price,
      });
    }

    res.json({ success: true, data: Object.values(ordersMap) });

  } catch (error) {
    console.error('GET /api/orders error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
  }
});

// ─────────────────────────────────────────────
// GET /api/orders
// Fetches all orders with their items (Admin)
// ─────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        o.id            AS order_id,
        o.table_number,
        o.status,
        o.total_amount,
        o.created_at,
        oi.quantity,
        oi.unit_price,
        p.name          AS product_name
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p     ON oi.product_id = p.id
      ORDER BY 
        FIELD(o.status, 'pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'),
        o.created_at ASC
    `);

    // Group flat JOIN rows into nested order objects
    const ordersMap = new Map();
      for (const row of rows) {
        if (!ordersMap.has(row.order_id)) {
          ordersMap.set(row.order_id, {
            order_id:     row.order_id,
            table_number: row.table_number,
            status:       row.status,
            total_amount: row.total_amount,
            created_at:   row.created_at,
            items:        [],
          });
        }
        ordersMap.get(row.order_id).items.push({
          product_name: row.product_name,
          quantity:     row.quantity,
          unit_price:   row.unit_price,
        });
      }
      res.json({ success: true, data: Array.from(ordersMap.values()) });

  } catch (error) {
    console.error('GET /api/orders error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
  }
});

// ─────────────────────────────────────────────
// PATCH /api/orders/:id/status
// Updates an order's status (Admin + Payment)
// ─────────────────────────────────────────────
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `status must be one of: ${validStatuses.join(', ')}`,
    });
  }

  try {
    const [result] = await pool.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    res.json({ success: true, message: `Order ${id} status updated to '${status}'.` });

  } catch (error) {
    console.error('PATCH /api/orders/:id/status error:', error);
    res.status(500).json({ success: false, message: 'Failed to update order status.' });
  }
});

export default router;