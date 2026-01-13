"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [userId, setUserId] = useState(null);

  //  Load user ID on mount
  useEffect(() => {
    const loadUserCart = () => {
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("user");
      
      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          const uid = user.data?._id || user.data?.id || user._id || user.id;
          setUserId(uid);        
          // Load user-specific cart
          const userCartKey = `cart_${uid}`;
          const savedCart = localStorage.getItem(userCartKey);
          if (savedCart) {
            setCart(JSON.parse(savedCart));

          } else {
            setCart([]);
          }
        } catch (error) {
          console.error("Error loading user cart:", error);
          setCart([]);
        }
      } else {
        // No user logged in - guest mode
        setUserId(null);
        const guestCart = localStorage.getItem("cart_guest");
        if (guestCart) {
          setCart(JSON.parse(guestCart));
        } else {
          setCart([]);
        }
      }
    };

    loadUserCart();

    // Listen for storage changes (login/logout)
    window.addEventListener('storage', loadUserCart);
    
    return () => {
      window.removeEventListener('storage', loadUserCart);
    };
  }, []);

  // Save cart to user-specific localStorage
  useEffect(() => {
    if (userId) {
      const userCartKey = `cart_${userId}`;
      localStorage.setItem(userCartKey, JSON.stringify(cart));
    } else {
      localStorage.setItem("cart_guest", JSON.stringify(cart));
    }
  }, [cart, userId]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const variantKey = product.selectedVariant
        ? `${product.id}_${product.selectedVariant._id || product.variantName}`
        : product.id;

      const existingItemIndex = prevCart.findIndex((item) => {
        const itemVariantKey = item.selectedVariant
          ? `${item.id}_${item.selectedVariant._id || item.variantName}`
          : item.id;
        return itemVariantKey === variantKey;
      });

      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + 1,
        };
        return updatedCart;
      } else {
        return [
          ...prevCart,
          {
            ...product,
            quantity: 1,
            cartItemId: variantKey,
          },
        ];
      }
    });
  };

  const removeFromCart = (cartItemId) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.cartItemId !== cartItemId)
    );
  };

  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.cartItemId === cartItemId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const getCartTotal = () => {
    return cart.reduce(
      (total, item) => total + item.salePrice * item.quantity,
      0
    );
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const clearCart = () => {
    setCart([]);
  };

  // Reset cart (on logout)
  const resetCart = () => {
    console.log('🗑️ Resetting cart');
    setCart([]);
    setUserId(null);
  };

  // Reload cart (after login)
  const reloadCart = () => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("user");
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        const uid = user.data?._id || user.data?.id || user._id || user.id;
        setUserId(uid);
        
        const userCartKey = `cart_${uid}`;
        const savedCart = localStorage.getItem(userCartKey);
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        } else {
          setCart([]);
        }
      } catch (error) {
        console.error("Error reloading cart:", error);
      }
    } else {
      setCart([]);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        getCartTotal,
        getCartCount,
        clearCart,
        resetCart,
        reloadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
