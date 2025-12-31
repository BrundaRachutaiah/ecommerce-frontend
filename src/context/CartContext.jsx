// src/context/CartContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/apiService";
import { useAlert } from "./AlertContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { showAlert } = useAlert();

  /* ============================
     LOAD CART
  ============================ */
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await API.get("/cart");

        if (typeof res.data === "string" && res.data.includes("<!doctype html>")) {
          throw new Error("API routed to frontend instead of backend");
        }

        const cartData = res.data?.data?.cart?.items || [];
        setCart(cartData);
        setError(null);
      } catch (error) {
        setError(error.message || "Failed to load cart");
        setCart([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  /* ============================
     ADD TO CART (WITH TOAST)
  ============================ */
  const addToCart = async (productId, quantity = 1, size = null) => {
    try {
      setLoading(true);

      const existingItem = cart.find(
        (item) =>
          item?.product?._id === productId &&
          (item.size || null) === size
      );

      const res = await API.post("/cart/add", {
        productId,
        quantity,
        size,
      });

      if (typeof res.data === "string") {
        throw new Error("Invalid response");
      }

      const cartData = res.data?.data?.cart?.items || [];
      setCart(cartData);
      setError(null);

      showAlert(
        existingItem
          ? "Quantity increased in cart"
          : "Added to cart",
        "success"
      );

      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to add to cart";
      setError(message);
      showAlert(message, "danger");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  /* ============================
     UPDATE QUANTITY (WITH TOAST)
  ============================ */
  const updateQty = async (productId, quantity, size) => {
    try {
      setLoading(true);

      const res = await API.put("/cart/update", {
        productId,
        quantity,
        size,
      });

      const cartData = res.data?.data?.cart?.items || [];
      setCart(cartData);
      setError(null);

      showAlert("Cart quantity updated", "success");
      return { success: true };
    } catch (error) {
      const message = error.message || "Failed to update cart";
      setError(message);
      showAlert(message, "danger");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  /* ============================
     REMOVE FROM CART (WITH TOAST)
  ============================ */
const removeFromCart = async (productId, size = null) => {
  try {
    setLoading(true);

    const res = await API.delete(`/cart/remove/${productId}`, {
      params: { size },
    });

    if (typeof res.data === "string" && res.data.includes("<!doctype html>")) {
      throw new Error("API routed to frontend instead of backend");
    }

    const cartData = res.data?.data?.cart?.items || [];
    setCart(cartData);
    setError(null);

    showAlert("Removed from cart", "warning");
    return { success: true };
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to remove from cart";
    setError(message);
    showAlert(message, "danger");
    return { success: false };
  } finally {
    setLoading(false);
  }
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
