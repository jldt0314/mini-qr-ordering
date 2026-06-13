import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems]     = useState([]);
  const [tableNumber, setTableNumber] = useState("");

  // Add item or increment if already in cart
  function addToCart(product) {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }

  // Increment quantity
  function increment(productId) {
    setCartItems((prev) =>
      prev.map((i) =>
        i.id === productId ? { ...i, quantity: i.quantity + 1 } : i
      )
    );
  }

  // Decrement quantity — remove if reaches 0
  function decrement(productId) {
    setCartItems((prev) =>
      prev
        .map((i) =>
          i.id === productId ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0)
    );
  }

  // Remove item entirely
  function removeItem(productId) {
    setCartItems((prev) => prev.filter((i) => i.id !== productId));
  }

  // Clear the entire cart
  function clearCart() {
    setCartItems([]);
  }

  // Calculate total
  const total = cartItems.reduce(
    (sum, i) => sum + parseFloat(i.price) * i.quantity,
    0
  );

  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        tableNumber,
        setTableNumber,
        addToCart,
        increment,
        decrement,
        removeItem,
        clearCart,
        total,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom hook for clean imports
export function useCart() {
  return useContext(CartContext);
}