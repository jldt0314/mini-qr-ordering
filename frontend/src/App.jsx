import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider }    from "./context/CartContext";
import MenuPage            from "./pages/MenuPage";
import QRPage              from "./pages/QRPage";
import AdminPage           from "./pages/AdminPage";
import AdminLoginPage      from "./pages/AdminLoginPage";
import OrderStatusPage     from "./pages/OrderStatusPage";
import AdminGuard          from "./components/AdminGuard";

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"            element={<MenuPage />}       />
          <Route path="/qr"          element={<QRPage />}         />
          <Route path="/order-status" element={<OrderStatusPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/admin"       element={
            <AdminGuard>
              <AdminPage />
            </AdminGuard>
          } />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}