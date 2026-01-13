"use client";

import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [userId, setUserId] = useState(null);

  // Load user ID and wishlist on mount
  useEffect(() => {
    const loadUserWishlist = () => {
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("user");
      
      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          const uid = user.data?._id || user.data?.id || user._id || user.id;
          setUserId(uid);   
          // Load user-specific wishlist
          const userWishlistKey = `wishlist_${uid}`;
          const savedWishlist = localStorage.getItem(userWishlistKey);
          if (savedWishlist) {
            setWishlist(JSON.parse(savedWishlist));
            console.log('User wishlist loaded');
          } else {
            setWishlist([]);
          }
        } catch (error) {
          console.error("Error loading user wishlist:", error);
          setWishlist([]);
        }
      } else {
        // No user logged in - guest mode
        setUserId(null);
        const guestWishlist = localStorage.getItem("gadget-wishlist");
        if (guestWishlist) {
          setWishlist(JSON.parse(guestWishlist));
        } else {
          setWishlist([]);
        }
      }
    };

    loadUserWishlist();

    // Listen for storage changes
    window.addEventListener('storage', loadUserWishlist);
    
    return () => {
      window.removeEventListener('storage', loadUserWishlist);
    };
  }, []);

  // Save wishlist to user-specific localStorage
  useEffect(() => {
    if (userId) {
      const userWishlistKey = `wishlist_${userId}`;
      localStorage.setItem(userWishlistKey, JSON.stringify(wishlist));
    } else {
      localStorage.setItem("gadget-wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, userId]);

  const addToWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item._id === product._id);
      if (exists) {
        toast.error("Already in wishlist!");
        return prev;
      }
      toast.success("Added to wishlist!");
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item._id !== productId));
    toast.success("Removed from wishlist!");
  };

  const toggleWishlist = (product) => {
    const exists = wishlist.some((item) => item._id === product._id);
    if (exists) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item._id === productId);
  };

  // Reset wishlist (on logout)
  const resetWishlist = () => {
    setWishlist([]);
    setUserId(null);
  };

  // Reload wishlist (after login)
  const reloadWishlist = () => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("user");
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        const uid = user.data?._id || user.data?.id || user._id || user.id;
        setUserId(uid);
        
        const userWishlistKey = `wishlist_${uid}`;
        const savedWishlist = localStorage.getItem(userWishlistKey);
        if (savedWishlist) {
          setWishlist(JSON.parse(savedWishlist));
        } else {
          setWishlist([]);
        }
      } catch (error) {
        console.error("Error reloading wishlist:", error);
      }
    } else {
      setWishlist([]);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        resetWishlist,
        reloadWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
}
