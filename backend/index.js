import express from 'express';
import dotenv from 'dotenv';
import './config/db.js'; // triggers pool creation and connection test on startup

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

// Middleware — allows Express to read JSON request bodies
app.use(express.json());

// Test route — confirms the server and DB are both alive
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is running and database is connected! 🚀',
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});