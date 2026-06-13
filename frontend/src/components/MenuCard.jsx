import { useCart } from "../context/CartContext";

export default function MenuCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
      {/* Image placeholder */}
      <div className="bg-orange-100 h-36 flex items-center justify-center text-5xl">
        🍽️
      </div>

      {/* Details */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-800 text-lg leading-tight">
          {product.name}
        </h3>
        <p className="text-gray-500 text-sm mt-1 flex-1">
          {product.description}
        </p>

        {/* Price + Button */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-orange-500 font-bold text-lg">
            ₱{parseFloat(product.price).toFixed(2)}
          </span>
          <button
            onClick={() => addToCart(product)}
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  );
}