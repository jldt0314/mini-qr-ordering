import { useState, useEffect } from "react";

const STATUS_OPTIONS = ["pending", "confirmed", "preparing", "ready", "completed", "cancelled"];

const STATUS_FLOW = ["pending", "confirmed", "preparing", "ready", "completed"];


function timeAgo(dateString) {
  const now     = new Date();
  const created = new Date(dateString);
  const seconds = Math.floor((now - created) / 1000);

  if (seconds < 60)                       return `${seconds}s ago`;
  if (seconds < 3600)                     return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400)                    return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function timeAgoColor(dateString, status) {
  if (status === "completed" || status === "cancelled") return "text-gray-400";
  // To correspond time with urgency
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  const minutes = seconds / 60;

  if (minutes < 5)  return "text-green-600 font-bold";
  if (minutes < 16) return "text-yellow-500 font-bold";
  if (minutes < 31) return "text-orange-500 font-bold";
  return "text-red-600 font-bold";
}

function getStatusButtons(currentStatus) {
  const currentIndex = STATUS_FLOW.indexOf(currentStatus);

  return STATUS_FLOW.filter((s, idx) => {
    // Never show current status itself
    if (idx === currentIndex) return false;
    // Never show pending as a return option
    if (s === "pending") return false;
    // Only show one step forward
    if (idx > currentIndex) return idx === currentIndex + 1;
    // Show all steps behind (return options)
    return true;
  });
}
const STATUS_COLORS = {
  pending:   "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  preparing: "bg-orange-100 text-orange-700",
  ready:     "bg-green-100 text-green-700",
  completed: "bg-gray-100 text-gray-500",
  cancelled: "bg-red-100 text-red-500",
};

export default function AdminPage() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [updating, setUpdating] = useState(null); // tracks which order is being updated
  const inProgressCount = orders.filter(o => !["completed", "cancelled"].includes(o.status)).length;
  const completedCount  = orders.filter(o => o.status === "completed").length;
  const cancelledCount  = orders.filter(o => o.status === "cancelled").length;
  const [, setTick] = useState(0);
  
  const [qrTable, setQrTable] = useState("");

  

  function handleGenerateQR() {
    if (!qrTable.trim()) return alert("Please enter a table number.");
    window.open(`/qr?table=${qrTable.trim()}`, "_blank");
  }
  // ── Fetch all orders on mount ──────────────
  useEffect(() => {
    fetchOrders();
  }, []);

  // Auto-refresh relative time of orders every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 45000); // refresh every 45s
    return () => clearInterval(timer);
  }, []);

  async function fetchOrders() {
    try {
      setLoading(true);
      const res  = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`);
      const json = await res.json();
      if (!json.success) throw new Error("Failed to fetch orders.");
      setOrders(json.data);
    } catch (err) {
      console.error(err);
      setError("Could not load orders. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  // ── PATCH order status ─────────────────────
  async function updateStatus(orderId, newStatus) {
    setUpdating(orderId);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders/${orderId}/status`,
        {
          method:  "PATCH",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ status: newStatus }),
        }
      );
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message);

      // Update local state instantly — no need to refetch everything
      setOrders((prev) =>
        prev.map((o) =>
          o.order_id === orderId ? { ...o, status: newStatus } : o
        )
      );
    } catch (err) {
      console.error("Status update failed:", err);
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdating(null);
    }
  }

  // ── Loading ────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-400">
        <div className="text-5xl mb-4 animate-spin">📋</div>
        <p className="text-lg font-medium">Loading orders...</p>
      </div>
    );
  }

  // ── Error ──────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-400">
        <div className="text-5xl mb-4">⚠️</div>
        <p className="text-lg font-medium">{error}</p>
        <button
          onClick={fetchOrders}
          className="mt-4 px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    );
  }

  // ── Dashboard ──────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">🛠️ Admin Dashboard</h1>
            <p className="text-sm text-gray-400">CubeTech Eats — Order Management</p>
          </div>
          
          {/* Generate QR — hover to reveal input */}
          <div className="flex items-center gap-2">
            <div className="group flex items-center gap-2">
              <input
                type="text"
                value={qrTable}
                onChange={(e) => setQrTable(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerateQR()}
                placeholder="Table no."
                className="
                  w-0 opacity-0 pointer-events-none
                  group-hover:w-28 group-hover:opacity-100 group-hover:pointer-events-auto
                  transition-all duration-300 ease-in-out
                  text-sm border border-gray-200 rounded-xl px-3 py-2
                  focus:outline-none focus:ring-2 focus:ring-orange-300
                "
              />
              <button
                onClick={handleGenerateQR}
                className="text-sm bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 rounded-xl transition-colors whitespace-nowrap"
              >
                📱 Generate QR
              </button>
            </div>

            <button
              onClick={fetchOrders}
              className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium px-4 py-2 rounded-xl transition-colors"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">

        {/* Empty state */}
        {orders.length === 0 ? (
          <div className="text-center text-gray-400 py-24">
            <div className="text-6xl mb-4">🗒️</div>
            <p className="text-lg font-medium">No orders yet.</p>
            <p className="text-sm mt-1">Orders will appear here once customers place them.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div class="grid grid-cols-3 gap-4">
              <div class="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm flex flex-col justify-between">
                <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">In-Progress</span>
                <span class="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">{inProgressCount}</span>
              </div>

              <div class="bg-green-100 border border-gray-200 p-4 rounded-lg shadow-sm flex flex-col justify-between">
                <span class="text-xs font-semibold text-green-500 uppercase tracking-wider">Completed</span>
                <span class="text-2xl sm:text-3xl font-extrabold text-green-600 mt-1">{completedCount}</span>
              </div>

              <div class="bg-gray-50 border border-red-200 p-4 rounded-lg shadow-sm flex flex-col justify-between">
                <span class="text-xs font-semibold text-red-500 uppercase tracking-wider">Cancelled</span>
                <span class="text-2xl sm:text-3xl font-extrabold text-red-700 mt-1">{cancelledCount}</span>
              </div>
            </div>
            {orders.map((order) => (
              <div
                key={order.order_id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
              >
                {/* Order header */}
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-bold text-gray-800 text-lg">
                        Order #{order.order_id}
                      </h2>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLORS[order.status]}`}>
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                    <p className={`text-sm mt-0.5 ${timeAgoColor(order.created_at, order.status)}`}>
                      🪑 Table {order.table_number} &nbsp;·&nbsp;
                      🕐 {timeAgo(order.created_at)}
                    </p>
                  </div>
                  <p className="text-orange-500 font-bold text-xl">
                    ₱{parseFloat(order.total_amount).toFixed(2)}
                  </p>
                </div>

                {/* Order items */}
                <div className="mt-3 border-t pt-3 space-y-1">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm text-gray-600">
                      <span>× {item.quantity} &nbsp; {item.product_name}</span>
                      <span className="text-gray-400">
                        ₱{(parseFloat(item.unit_price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Status actions */}
                {order.status !== "completed" && order.status !== "cancelled" && (
                <div className="mt-4 flex flex-wrap gap-2">

                    {/* Forward + Return buttons */}
                    {getStatusButtons(order.status).map((targetStatus) => {
                    const isForward =
                        STATUS_FLOW.indexOf(targetStatus) > STATUS_FLOW.indexOf(order.status);

                    const label = isForward
                        ? `Mark as ${targetStatus}`
                        : `Return to ${targetStatus}`;

                    const btnStyle = isForward
                        ? "bg-orange-500 text-white hover:bg-orange-600"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300";

                    return (
                        <button
                        key={targetStatus}
                        onClick={() => updateStatus(order.order_id, targetStatus)}
                        disabled={updating === order.order_id}
                        className={`text-xs font-semibold px-3 py-2 rounded-xl transition-colors
                            ${updating === order.order_id
                            ? "opacity-50 cursor-not-allowed"
                            : btnStyle
                            }`}
                        >
                        {updating === order.order_id ? "Updating..." : label}
                        </button>
                    );
                    })}

                    {/* Standalone Cancel button */}
                    <button
                    onClick={() => updateStatus(order.order_id, "cancelled")}
                    disabled={updating === order.order_id}
                    className="text-xs font-semibold px-3 py-2 rounded-xl transition-colors
                        bg-red-50 text-red-500 hover:bg-red-100 border border-red-200
                        disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                    Cancel Order
                    </button>

                </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}