// src/context/WishlistContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/apiService";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await API.get("/wishlist");
        
        // Check if response is HTML (indicates routing issue)
        if (typeof res.data === 'string' && res.data.includes('<!doctype html>')) {
          throw new Error("API request was routed to frontend instead of backend");
        }
        
        // Safely access nested properties
        const wishlistData = res.data?.data?.wishlist || [];
        setWishlist(wishlistData);
        setError(null);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        setError(error.message || "Failed to load wishlist");
        setWishlist([]); // Set empty wishlist as fallback
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const addToWishlist = async (productId) => {
    try {
      setLoading(true);
      const res = await API.post("/wishlist/add", { productId });
      
      // Check if response is HTML
      if (typeof res.data === 'string' && res.data.includes('<!doctype html>')) {
        throw new Error("API request was routed to frontend instead of backend");
      }
      
      // Safely access nested properties
      const wishlistData = res.data?.data?.wishlist || [];
      setWishlist(wishlistData);
      setError(null);
      return { success: true, message: res.data?.data?.message || "Added to wishlist" };
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Failed to add to wishlist";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      setLoading(true);
      const res = await API.delete(`/wishlist/remove/${productId}`);
      
      // Check if response is HTML
      if (typeof res.data === 'string' && res.data.includes('<!doctype html>')) {
        throw new Error("API request were routed to frontend instead of backend");
      }
      
      // Safely access nested properties
      const wishlistData = res.data?.data?.wishlist || [];
      setWishlist(wishlistData);
      setError(null);
      return { success: true, message: res.data?.data?.message || "Removed from wishlist" };
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Failed to remove from wishlist";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => {
      const itemId = item.product?._id || item.product || item;
      return String(itemId) === String(productId);
    });
  };

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