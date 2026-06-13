import express  from 'express';
import dotenv   from 'dotenv';
import cors     from 'cors';
import './config/db.js';
import productRoutes from './routes/products.js';
import orderRoutes   from './routes/orders.js';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ─────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
}));
app.use(express.json());

// ── Routes ────────────────────────────────────
app.use('/api/products', productRoutes);
app.use('/api/orders',   orderRoutes);

// ── Health Check ──────────────────────────────
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'Backend is running! 🚀' });
});

// ── Start Server ──────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});