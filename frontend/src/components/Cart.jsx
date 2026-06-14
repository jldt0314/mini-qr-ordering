import { useState } from "react";
import { useCart } from "../context/CartContext";
import PaymentModal from "./PaymentModal";
import { useNavigate } from 'react-router-dom';

export default function Cart({ isOpen, onClose }) {
  const { cartItems, increment, decrement, removeItem, clearCart, total, tableNumber } = useCart();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const navigate = useNavigate();
  // null | 'processing' | 'success' | 'failed'

  async function handlePlaceOrder() {
  setPaymentStatus("processing");

  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/orders`,
      {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table_number: tableNumber,
          total_amount: total,
          items: cartItems.map((item) => ({
            product_id: item.id,
            quantity:   item.quantity,
            unit_price: parseFloat(item.price),
          })),
        }),
      }
    );

    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error(json.message || "Order failed.");
    }

    setPaymentStatus("success");
    await new Promise((resolve) => setTimeout(resolve, 2500)); // 2.5 second delay
    navigate(`/order-status?table=${tableNumber}`);

  } catch (err) {
    console.error("Order error:", err);
    setPaymentStatus("failed");
  }
}

  function handleModalClose() {
    setPaymentStatus(null);
    clearCart();
    onClose();
  }

  function handleRetry() {
    setPaymentStatus(null);
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-40 shadow-2xl
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Your Order</h2>
            {tableNumber && (
              <p className="text-sm text-orange-500 font-medium">
                Table {tableNumber}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3"
          style={{ maxHeight: "calc(100vh - 200px)" }}>
          {cartItems.length === 0 ? (
            <div className="text-center text-gray-400 mt-16">
              <div className="text-5xl mb-3">🛒</div>
              <p>Your cart is empty.</p>
              <p className="text-sm mt-1">Add items from the menu!</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id}
                className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">
                    {item.name}
                  </p>
                  <p className="text-orange-500 text-sm font-medium">
                    ₱{(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </p>
                </div>

                {/* Quantity controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decrement(item.id)}
                    className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 font-bold text-gray-700 flex items-center justify-center"
                  >
                    −
                  </button>
                  <span className="w-5 text-center font-semibold text-sm">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => increment(item.id)}
                    className="w-7 h-7 rounded-full bg-orange-500 hover:bg-orange-600 font-bold text-white flex items-center justify-center"
                  >
                    +
                  </button>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-gray-300 hover:text-red-400 text-lg ml-1"
                >
                  🗑
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t p-5 space-y-4">
            <div className="flex justify-between text-lg font-bold text-gray-800">
              <span>Total</span>
              <span className="text-orange-500">₱{total.toFixed(2)}</span>
            </div>
            <button
              onClick={handlePlaceOrder}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-colors text-lg"
            >
              Place Order
            </button>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {paymentStatus && (
        <PaymentModal
          status={paymentStatus}
          onClose={handleModalClose}
          onRetry={handleRetry}
        />
      )}
    </>
  );
}