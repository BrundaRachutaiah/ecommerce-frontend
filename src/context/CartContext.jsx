import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/apiService";
import { useAlert } from "./AlertContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [loading, setLoading] = useState(true); // global cart loading
  const [error, setError] = useState(null);
  const { showAlert } = useAlert();

  // Persist cart
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Fetch cart initially
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
        const savedCart = localStorage.getItem("cart");
        if (savedCart) setCart(JSON.parse(savedCart));
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const addToCart = async (productId, quantity = 1, size = null) => {
    try {
      setLoading(true);

      const existingItem = cart.find(
        (item) =>
          item?.product?._id === productId &&
          (item.size || null) === size
      );

      const res = await API.post("/cart/add", { productId, quantity, size });
      const cartData = res.data?.data?.cart?.items || [];
      setCart(cartData);
      setError(null);

      showAlert(
        existingItem ? "Quantity increased in cart" : "Added to cart",
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
      setCart(res.data?.data?.cart?.items || []);
      showAlert("Cart updated", "success");
      return { success: true };
    } catch (err) {
      showAlert("Failed to update cart", "danger");
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
      setCart(res.data?.data?.cart?.items || []);
      showAlert("Removed from cart", "warning");
      return { success: true };
    } catch (err) {
      showAlert("Failed to remove from cart", "danger");
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
      showAlert("Cart cleared", "success");
      return { success: true };
    } catch (err) {
      showAlert("Failed to clear cart", "danger");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const getTotalPrice = () =>
    cart.reduce(
      (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 0),
      0
    );

  const getCartCount = () =>
    cart.reduce((total, item) => total + (item.quantity || 0), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading, // kept for cart page / header
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