import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import MenuPage  from "./pages/MenuPage";
import QRPage    from "./pages/QRPage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"      element={<MenuPage />}  />
          <Route path="/qr"    element={<QRPage />}    />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}