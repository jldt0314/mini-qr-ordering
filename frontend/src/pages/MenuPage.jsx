import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useNavigate } from 'react-router-dom';
import MenuList from "../components/MenuList";
import Cart from "../components/Cart";



export default function MenuPage() {
  const [searchParams]          = useSearchParams();
  const { setTableNumber, totalItems } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const table = searchParams.get("table") || "Unknown";
  const navigate = useNavigate();

  // Sub-task 1: Read ?table=<value> from the URL on page load and check for active orders for that table.
  useEffect(() => {
    setTableNumber(table);
    async function checkActiveOrder() {
    
      const res  = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/table/${table}`);
      const json = await res.json();
      // If an active order exists, redirect to /order-status?table=<value>.
      if (json.success && json.data.length > 0) {
        // active order exists — redirect with the order data
        navigate(`/order-status?table=${table}`);
      }
    }

    if (table !== "Unknown") checkActiveOrder();
  }, [table, setTableNumber, navigate]);
  
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top Nav */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">🍔 CubeTech Eats</h1>
            <p className="text-sm text-orange-500 font-medium">
              Table {searchParams.get("table") || "—"}
            </p>
          </div>

          {/* Cart Button */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2 rounded-xl transition-colors"
          >
            🛒 Cart
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Menu Grid */}
      <main className="max-w-4xl mx-auto py-4">
        <h2 className="px-4 text-lg font-semibold text-gray-700 mb-2">
          Our Menu
        </h2>
        <MenuList />
      </main>

      {/* Cart Drawer */}
      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}