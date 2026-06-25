import { createContext, useContext, useEffect, useState } from "react";
import {
  getCart,
  addToCart as addToCartService,
  updateCart,
  removeFromCart as removeFromCartService,
  clearCart as clearCartService,
} from "../services/cartServices";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch Cart
  const fetchCart = async () => {
    try {
      setLoading(true);

      const cart = await getCart();

      setCartItems(cart.items || []);
    } catch (error) {
      console.error(error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Add Item
  const addToCart = async (productId) => {
    try {
      const cart = await addToCartService(productId);

      setCartItems(cart.items);
    } catch (error) {
      console.error(error);
    }
  };

  // Update Quantity
  const updateQty = async (productId, quantity) => {
    try {
      const cart = await updateCart(productId, quantity);

      setCartItems(cart.items);
    } catch (error) {
      console.error(error);
    }
  };

  // Remove Item — renamed to avoid shadowing the imported removeFromCartService
  const removeFromCart = async (productId) => {
    try {
      const cart = await removeFromCartService(productId);

      setCartItems(cart.items);
    } catch (error) {
      console.error(error);
    }
  };

  // Clear Cart
  const clearCart = async () => {
    try {
      await clearCartService();

      setCartItems([]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const count = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        total,
        count,
        fetchCart,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}