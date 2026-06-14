# 🍔 Mini QR Ordering System
> CubeTech OJT Take-Home Assessment — Full Stack Web Application

A QR code-based food ordering system where customers scan a table QR code,
browse the menu, and place orders — which appear live on an Admin Dashboard
for restaurant staff to manage.

---

## 🧱 Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS v4   |
| Backend    | Node.js, Express.js               |
| Database   | MySQL 8 (mysql2/promise pool)     |
| Dev Tools  | Nodemon, Git, VS Code + DBCode    |

---

## 📁 Project Structure

```
mini-qr-ordering/
├── backend/          # Express API server
│   ├── config/       # MySQL connection pool
│   ├── routes/       # products.js, orders.js
│   ├── .env          # environment variables (not committed)
│   └── index.js      # server entry point
├── frontend/         # React + Vite client
│   ├── src/
│   │   ├── components/   # MenuCard, MenuList, Cart, PaymentModal
│   │   ├── context/      # CartContext (global state)
│   │   └── pages/        # MenuPage, AdminPage, QRPage
│   └── .env          # VITE_API_URL (not committed)
└── db/
    └── schema.sql    # database schema + seed data
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/mini-qr-ordering.git
cd mini-qr-ordering
```

### 2. Database Setup
- Open MySQL (via DBCode or MySQL Workbench)
- Run the contents of `db/schema.sql` to create the database, tables, and seed data

### 3. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=cubetech_qr_ordering
```

Start the backend:
```bash
npm run dev
```

### 4. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/`:
```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```

---

## 🚀 Usage

| URL | Description |
|-----|-------------|
| `http://localhost:5173/?table=A1` | Customer menu page for Table A1 |
| `http://localhost:5173/admin`     | Admin dashboard — view & update orders |
| `http://localhost:5173/qr`        | QR code generator for a table |

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/products` | Fetch all available menu items |
| POST   | `/api/orders`   | Place a new order (with transaction) |
| GET    | `/api/orders`   | Fetch all orders with items (Admin) |
| PATCH  | `/api/orders/:id/status` | Update an order's status |

---

## 👨‍💻 Author

**Lyle** 