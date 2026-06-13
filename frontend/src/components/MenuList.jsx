import { useState, useEffect } from "react";
import MenuCard from "./MenuCard";

export default function MenuList() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res  = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
        const json = await res.json();

        if (!json.success) throw new Error("Failed to load products.");
        setProducts(json.data);

      } catch (err) {
        console.error(err);
        setError("Could not load menu. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []); // runs once on mount

  // ── Loading state ──────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <div className="text-5xl mb-4 animate-spin">🍽️</div>
        <p className="text-lg font-medium">Loading menu...</p>
      </div>
    );
  }

  // ── Error state ────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-red-400">
        <div className="text-5xl mb-4">⚠️</div>
        <p className="text-lg font-medium">{error}</p>
      </div>
    );
  }

  // ── Menu grid ──────────────────────────────
  return (
    <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <MenuCard key={product.id} product={product} />
      ))}
    </div>
  );
}