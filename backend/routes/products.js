import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// GET /api/products
// Fetches all available menu items from the products table
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM products WHERE is_available = 1 ORDER BY id ASC'
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('GET /api/products error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products.' });
  }
});

export default router;