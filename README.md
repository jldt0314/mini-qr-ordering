# 🍔 Mini QR Ordering System
> CubeTech OJT Take-Home Assessment — Full Stack Web Application

A QR code-based food ordering system where customers scan a table QR code,
browse the menu, and place orders — which appear live on a protected Admin 
Dashboard for restaurant staff to manage.

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
├── backend/
│   ├── config/
│   │   └── db.js              # MySQL connection pool
│   ├── routes/
│   │   ├── products.js        # GET /api/products
│   │   └── orders.js          # POST, GET, PATCH /api/orders
│   ├── .env                   # environment variables (not committed)
│   ├── .env.example           # environment variable template
│   └── index.js               # Express server entry point
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminGuard.jsx     # Route protection for admin
│   │   │   ├── Cart.jsx           # Sliding cart drawer
│   │   │   ├── MenuCard.jsx       # Single product card
│   │   │   ├── MenuList.jsx       # Product grid
│   │   │   └── PaymentModal.jsx   # Mock payment flow
│   │   ├── context/
│   │   │   └── CartContext.jsx    # Global cart state
│   │   └── pages/
│   │       ├── AdminLoginPage.jsx # Admin authentication
│   │       ├── AdminPage.jsx      # Order management dashboard
│   │       ├── MenuPage.jsx       # Customer menu page
│   │       ├── OrderStatusPage.jsx # Live order tracking
│   │       └── QRPage.jsx         # QR code generator
│   ├── .env                   # environment variables (not committed)
│   └── .env.example           # environment variable template
└── db/
    └── schema.sql             # database schema + seed data
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/jldt0314/mini-qr-ordering.git
cd mini-qr-ordering
```

### 2. Database Setup
- Open MySQL via DBCode or MySQL Workbench
- Run the contents of `db/schema.sql` to create the database, tables, and seed data
- Verify 3 tables exist: `products`, `orders`, `order_items`
- Verify 5 seed products are inserted

### 3. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` (refer to `.env.example`):
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=your_db_name
FRONTEND_URL=http://localhost:5173
```

Start the backend:
```bash
npm run dev
```

Expected output:
```
✅ MySQL connection pool established successfully.
🚀 Server is running on http://localhost:5000
```

### 4. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/` (refer to `.env.example`):
```env
VITE_API_URL=http://localhost:5000
VITE_APP_URL=http://YOUR_LOCAL_IP:5173
VITE_ADMIN_PASSWORD=your_admin_password
```

> To find your local IP run `ipconfig` in PowerShell and look for IPv4 Address.

Start the frontend:
```bash
npm run dev -- --host
```

---

## 🚀 Usage

| URL | Description |
|-----|-------------|
| `http://localhost:5173/?table=A1` | Customer menu page for Table A1 |
| `http://localhost:5173/order-status?table=A1` | Live order tracking for Table A1 |
| `http://localhost:5173/admin-login` | Admin login page |
| `http://localhost:5173/admin` | Admin dashboard (requires login) |
| `http://localhost:5173/qr?table=A1` | QR code generator for Table A1 |

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Fetch all available menu items |
| POST | `/api/orders` | Place a new order (with DB transaction) |
| GET | `/api/orders` | Fetch all orders with items (Admin) |
| GET | `/api/orders/table/:tableNumber` | Fetch active order for a specific table |
| PATCH | `/api/orders/:id/status` | Update an order's status |

---

## 👥 User Flows

### Customer Flow
1. Scan QR code on physical table
2. Browse menu and add items to cart
3. Place order via mock payment flow
4. Track order status in real time on OrderStatusPage
5. Once completed, option to place a new order

### Admin Flow
1. Login at `/admin-login` with admin password
2. View all orders sorted by status and age
3. Update order status through the workflow
4. Monitor order aging with color indicators
5. Generate and print QR codes per table
6. Auto-refresh every 30 seconds

---

## 🗄️ Database Schema

```sql
products     — menu items with price and availability
orders       — one row per customer order session
order_items  — junction table linking orders to products
```

Key design decisions:
- `unit_price` stored on `order_items` — preserves historical price accuracy
- `ENUM` on `orders.status` — enforces valid status values at DB level
- `ON DELETE CASCADE` — order_items removed when parent order is deleted
- DB transaction on order placement — prevents orphaned/incomplete data

---

## 🔐 Security Notes

- Admin password stored in `frontend/.env` — never committed to Git
- Database credentials stored in `backend/.env` — never committed to Git
- CORS configured to only allow requests from the frontend URL
- Session-based admin authentication using `sessionStorage`

---

## 👨‍💻 Author

**Lyle** — OJT Intern Applicant
Built with assistance from AI tools (Gemini & Claude)