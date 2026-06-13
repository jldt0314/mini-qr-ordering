import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import MenuPage from "./pages/MenuPage";
import QRPage   from "./pages/QRPage";

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"   element={<MenuPage />} />
          <Route path="/qr" element={<QRPage />}   />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}