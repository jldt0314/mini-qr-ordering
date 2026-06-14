import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const navigate                = useNavigate();

  function handleLogin() {
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_authenticated", "true");
      navigate("/admin");
    } else {
      setError("Incorrect password. Please try again.");
      setPassword("");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm text-center">

        <div className="text-5xl mb-4">🔐</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Admin Access</h1>
        <p className="text-gray-400 text-sm mb-6">CubeTech Eats — Dashboard</p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          placeholder="Enter admin password"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm
            focus:outline-none focus:ring-2 focus:ring-orange-300 mb-3"
        />

        {error && (
          <p className="text-red-500 text-xs mb-3">{error}</p>
        )}

        <button
          onClick={handleLogin}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white
            font-bold py-3 rounded-xl transition-colors"
        >
          Login
        </button>

      </div>
    </div>
  );
}