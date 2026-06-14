import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminGuard({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("admin_authenticated");
    if (!isAuthenticated) {
      navigate("/admin-login");
    }
  }, [navigate]);

  const isAuthenticated = sessionStorage.getItem("admin_authenticated");
  if (!isAuthenticated) return null;

  return children;
}