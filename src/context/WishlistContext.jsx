// src/context/WishlistContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/apiService";
import { useAlert } from "./AlertContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { showAlert } = useAlert();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await API.get("/wishlist");
        const wishlistData = res.data?.data?.wishlist || [];
        setWishlist(wishlistData);
        setError(null);
      } catch (error) {
        setError(error.message || "Failed to load wishlist");
        setWishlist([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  /* ============================
     ADD TO WISHLIST (WITH TOAST)
  ============================ */
  const addToWishlist = async (productId) => {
    try {
      setLoading(true);
      const res = await API.post("/wishlist/add", { productId });

      const wishlistData = res.data?.data?.wishlist || [];
      setWishlist(wishlistData);
      setError(null);

      showAlert("Added to wishlist", "success");
      return { success: true };
    } catch (error) {
      const message = error.message || "Failed to add to wishlist";
      setError(message);
      showAlert(message, "danger");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  /* ============================
     REMOVE FROM WISHLIST (WITH TOAST)
  ============================ */
  const removeFromWishlist = async (productId) => {
    try {
      setLoading(true);
      const res = await API.delete(`/wishlist/remove/${productId}`);

      const wishlistData = res.data?.data?.wishlist || [];
      setWishlist(wishlistData);
      setError(null);

      showAlert("Removed from wishlist", "warning");
      return { success: true };
    } catch (error) {
      const message = error.message || "Failed to remove from wishlist";
      setError(message);
      showAlert(message, "danger");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId) =>
    wishlist.some(
      (item) =>
        String(item.product?._id || item.product) === String(productId)
    );

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        error,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);