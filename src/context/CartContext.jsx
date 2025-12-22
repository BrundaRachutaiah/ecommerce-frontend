// src/context/CartContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/apiService";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load cart
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await API.get("/cart");
        // Check if response is HTML (indicates routing issue)
        if (typeof res.data === 'string' && res.data.includes('<!doctype html>')) {
          throw new Error("API request was routed to frontend instead of backend");
        }
        
        // Safely access nested properties
        const cartData = res.data?.data?.cart?.items || [];
        setCart(cartData);
        setError(null);
      } catch (error) {
        console.error("Error fetching cart:", error);
        setError(error.message || "Failed to load cart");
        setCart([]); // Set empty cart as fallback
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const addToCart = async (productId, quantity = 1, size) => {
    try {
      setLoading(true);
      const res = await API.post("/cart/add", {
        productId,
        quantity,
        size,
      });
      
      // Check if response is HTML
      if (typeof res.data === 'string' && res.data.includes('<!doctype html>')) {
        throw new Error("API request was routed to frontend instead of backend");
      }
      
      // Safely access nested properties
      const cartData = res.data?.data?.cart?.items || [];
      setCart(cartData);
      setError(null);
      return { success: true, message: res.data?.data?.message || "Added to cart" };
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Failed to add to cart";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const updateQty = async (productId, quantity, size) => {
    try {
      setLoading(true);
      const res = await API.put("/cart/update", {
        productId,
        quantity,
        size,
      });
      
      // Check if response is HTML
      if (typeof res.data === 'string' && res.data.includes('<!doctype html>')) {
        throw new Error("API request was routed to frontend instead of backend");
      }
      
      // Safely access nested properties
      const cartData = res.data?.data?.cart?.items || [];
      setCart(cartData);
      setError(null);
      return { success: true, message: res.data?.data?.message || "Cart updated" };
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Failed to update cart";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId, size) => {
    try {
      setLoading(true);
      const res = await API.delete(`/cart/remove/${productId}`, {
        params: { size },
      });
      
      // Check if response is HTML
      if (typeof res.data === 'string' && res.data.includes('<!doctype html>')) {
        throw new Error("API request was routed to frontend instead of backend");
      }
      
      // Safely access nested properties
      const cartData = res.data?.data?.cart?.items || [];
      setCart(cartData);
      setError(null);
      return { success: true, message: res.data?.data?.message || "Removed from cart" };
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Failed to remove from cart";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      const res = await API.delete("/cart/clear");
      
      // Check if response is HTML
      if (typeof res.data === 'string' && res.data.includes('<!doctype html>')) {
        throw new Error("API request was routed to frontend instead of backend");
      }
      
      // Safely access nested properties
      const cartData = res.data?.data?.cart?.items || [];
      setCart(cartData);
      setError(null);
      return { success: true, message: res.data?.data?.message || "Cart cleared" };
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Failed to clear cart";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.product?.price || 0) * (item.quantity || 0), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);