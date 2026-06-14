import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const STATUS_FLOW = ["pending", "confirmed", "preparing", "ready", "completed"];

const STATUS_LABELS = {
  pending:   { emoji: "🕐", label: "Order Received",    desc: "Your order is waiting to be confirmed." },
  confirmed: { emoji: "✅", label: "Order Confirmed",   desc: "The restaurant has confirmed your order." },
  preparing: { emoji: "👨‍🍳", label: "Being Prepared",  desc: "The kitchen is preparing your food." },
  ready:     { emoji: "🍽️", label: "Ready for Pickup", desc: "Your order is ready! A staff will serve you shortly." },
  completed: { emoji: "🎉", label: "Served!",           desc: "Enjoy your meal!" },
  cancelled: { emoji: "❌", label: "Cancelled",         desc: "This order has been cancelled." },
};

export default function OrderStatusPage() {
  const [order,        setOrder]       = useState(null);
  const [loading,      setLoading]     = useState(true);
  const [searchParams]                 = useSearchParams();
  const navigate                       = useNavigate();
  const table                          = searchParams.get("table") || "Unknown";

  async function fetchOrder() {
    try {
      const res  = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/table/${table}`);
      const json = await res.json();

      if (json.success && json.data.length > 0) {
        setOrder(json.data[0]);
      } else {
        // No active order found — send back to menu
        navigate(`/?table=${table}`);
      }
    } catch (err) {
      console.error("Failed to fetch order status:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
  if (table === "Unknown") return;

  // Wrap in async IIFE so ESLint sees it as properly handled
  const controller = new AbortController();

  async function run() {
    await fetchOrder();
  }

  run();

  // Auto-refresh every 15 seconds
  const interval = setInterval(fetchOrder, 15000);
  return () => {
    clearInterval(interval);
    controller.abort();
  };

}, [table]);

  // ── Loading ──────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-400">
        <div className="text-5xl mb-4 animate-spin">🍽️</div>
        <p className="text-lg font-medium">Checking your order...</p>
      </div>
    );
  }

  if (!order) return null;

  const isCancelled    = order.status === "cancelled";
  const isCompleted    = order.status === "completed";
  const isDone         = isCancelled || isCompleted;
  const currentIndex   = STATUS_FLOW.indexOf(order.status);
  const currentMeta    = STATUS_LABELS[order.status];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-800">🍔 CubeTech Eats</h1>
          <p className="text-sm text-orange-500 font-medium">Table {table}</p>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8 space-y-6">

        {/* Current Status Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
          <div className="text-6xl mb-3">{currentMeta.emoji}</div>
          <h2 className="text-2xl font-bold text-gray-800">{currentMeta.label}</h2>
          <p className="text-gray-500 mt-2 text-sm">{currentMeta.desc}</p>
        </div>

        {/* Progress Tracker */}
        {!isCancelled && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wide">
              Order Progress
            </h3>
            <div className="space-y-3">
              {STATUS_FLOW.map((s, idx) => {
                const isDone    = idx < currentIndex;
                const isCurrent = idx === currentIndex;
                const meta      = STATUS_LABELS[s];

                return (
                  <div key={s} className="flex items-center gap-3">
                    {/* Step indicator */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0
                      ${isDone    ? "bg-green-500 text-white" : ""}
                      ${isCurrent ? "bg-orange-500 text-white" : ""}
                      ${!isDone && !isCurrent ? "bg-gray-100 text-gray-400" : ""}`}
                    >
                      {isDone ? "✓" : idx + 1}
                    </div>

                    {/* Step label */}
                    <span className={`text-sm font-medium
                      ${isDone    ? "text-green-600" : ""}
                      ${isCurrent ? "text-orange-500" : ""}
                      ${!isDone && !isCurrent ? "text-gray-400" : ""}`}
                    >
                      {meta.label}
                    </span>

                    {/* Current pulse indicator */}
                    {isCurrent && (
                      <span className="ml-auto text-xs bg-orange-100 text-orange-500 font-semibold px-2 py-0.5 rounded-full animate-pulse">
                        Now
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
            Order Summary
          </h3>
          <div className="space-y-2">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm text-gray-600">
                <span>× {item.quantity} &nbsp; {item.product_name}</span>
                <span className="text-gray-400">
                  ₱{(parseFloat(item.unit_price) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2 flex justify-between font-bold text-gray-800">
              <span>Total</span>
              <span className="text-orange-500">
                ₱{parseFloat(order.total_amount).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Auto-refresh note */}
        {!isDone && (
          <p className="text-center text-xs text-gray-400">
            🔄 Status updates automatically every 15 seconds
          </p>
        )}

        {/* Done — Place New Order button */}
        {isDone && (
          <button
            onClick={() => navigate(`/?table=${table}`)}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-colors text-lg"
          >
            Place New Order
          </button>
        )}

      </main>
    </div>
  );
}