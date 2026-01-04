import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/apiService";
import { useAlert } from "./AlertContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Initialize cart from localStorage if available
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showAlert } = useAlert();

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Fetch cart from API on initial load
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const res = await API.get("/cart");
        const cartData = res.data?.data?.cart?.items || [];
        setCart(cartData);
        setError(null);
      } catch (err) {
        console.error("Error fetching cart:", err);
        setError("Failed to load cart");
        // If API fails, try to use localStorage data
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const addToCart = async (productId, quantity = 1, size = null) => {
    try {
      setLoading(true);
      
      // Check if product already exists in cart
      const existingItem = cart.find(
        (item) =>
          item?.product?._id === productId &&
          (item.size || null) === size
      );
      
      const res = await API.post("/cart/add", { productId, quantity, size });
      const cartData = res.data?.data?.cart?.items || [];
      setCart(cartData);
      setError(null);
      
      // Show appropriate message
      showAlert(
        existingItem
          ? "Quantity increased in cart"
          : "Added to cart",
        "success"
      );
      
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Failed to add to cart";
      setError(message);
      showAlert(message, "danger");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const updateQty = async (productId, quantity, size = null) => {
    try {
      setLoading(true);
      const res = await API.put("/cart/update", { productId, quantity, size });
      const cartData = res.data?.data?.cart?.items || [];
      setCart(cartData);
      setError(null);
      showAlert("Cart updated", "success");
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update cart";
      setError(message);
      showAlert(message, "danger");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId, size = null) => {
    try {
      setLoading(true);
      const res = await API.delete(`/cart/remove/${productId}`, {
        params: { size },
      });
      const cartData = res.data?.data?.cart?.items || [];
      setCart(cartData);
      setError(null);
      showAlert("Removed from cart", "warning");
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Failed to remove from cart";
      setError(message);
      showAlert(message, "danger");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      await API.delete("/cart/clear");
      setCart([]);
      setError(null);
      showAlert("Cart cleared", "success");
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Failed to clear cart";
      setError(message);
      showAlert(message, "danger");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const getTotalPrice = () => {
    return cart.reduce(
      (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 0),
      0
    );
  };

  const getCartCount = () => {
    return cart.reduce(
      (total, item) => total + (item.quantity || 0),
      0
    );
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
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);