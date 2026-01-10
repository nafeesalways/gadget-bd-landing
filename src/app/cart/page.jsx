"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/app/context/CartContext";
import { FiX, FiMinus, FiPlus, FiShoppingCart } from "react-icons/fi";
import toast from "react-hot-toast";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  // ✅ Update page title dynamically (client-side)
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = "Shopping Cart - Review Your Items | Gadget BD";
    }
  }, []);

  // ✅ Same image logic as checkout
  const getProductImage = (item) => {
    const isValidUrl = (url) => {
      return typeof url === 'string' && 
             url.length > 10 && 
             (url.startsWith('http://') || url.startsWith('https://'));
    };

    // ✅ PRIORITY 1: Variant image from selectedVariant
    if (item?.selectedVariant?.image) {
      if (Array.isArray(item.selectedVariant.image)) {
        const firstVariantImg = item.selectedVariant.image[0];
        if (firstVariantImg && isValidUrl(firstVariantImg)) {
          return firstVariantImg;
        }
      }
      else if (isValidUrl(item.selectedVariant.image)) {
        return item.selectedVariant.image;
      }
    }

    // ✅ PRIORITY 2: Main imageURLs (fallback)
    if (item?.imageURLs) {
      if (isValidUrl(item.imageURLs)) {
        return item.imageURLs;
      }
      if (Array.isArray(item.imageURLs) && item.imageURLs.length > 0) {
        const firstImg = item.imageURLs[0];
        if (isValidUrl(firstImg)) {
          return firstImg;
        }
      }
    }
    
    // ✅ PRIORITY 3: item.image
    if (item?.image) {
      if (isValidUrl(item.image)) {
        return item.image;
      }
      if (Array.isArray(item.image) && item.image.length > 0) {
        const firstImg = item.image[0];
        if (isValidUrl(firstImg)) {
          return firstImg;
        }
      }
    }
    
    return '/placeholder.jpg';
  };

  const handleIncrease = (cartItemId, currentQuantity) => {
    updateQuantity(cartItemId, currentQuantity + 1);
  };

  const handleDecrease = (cartItemId, currentQuantity) => {
    if (currentQuantity > 1) {
      updateQuantity(cartItemId, currentQuantity - 1);
    }
  };

  const subtotal = getCartTotal();
  const discount = Math.round(subtotal * 0.1);
  const total = subtotal - discount;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <FiShoppingCart className="text-gray-300 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some products to get started</p>
          <Link
            href="/"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-500 mt-2">{cart.length} item{cart.length > 1 ? 's' : ''} in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="space-y-4">
                {cart.map((item) => {
                  const productImage = getProductImage(item);
                  
                  return (
                    <div key={item.cartItemId} className="flex gap-4 pb-4 border-b last:border-b-0">
                      <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={productImage}
                          alt={item.name || 'Product'}
                          fill
                          className="object-contain p-2"
                          onError={(e) => {
                            e.target.src = '/placeholder.jpg';
                          }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
                          {item.name}
                        </h3>
                        
                        {item.variantName && (
                          <p className="text-sm text-gray-500 mb-2">
                            Variant: <span className="font-medium">{item.variantName}</span>
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDecrease(item.cartItemId, item.quantity)}
                              className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 transition"
                            >
                              <FiMinus size={14} />
                            </button>
                            <span className="w-12 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => handleIncrease(item.cartItemId, item.quantity)}
                              className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 transition"
                            >
                              <FiPlus size={14} />
                            </button>
                          </div>

                          <div className="text-right">
                            <p className="text-lg font-bold text-orange-600">
                              ৳ {(item.salePrice * item.quantity).toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              ৳ {item.salePrice.toLocaleString()} each
                            </p>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          removeFromCart(item.cartItemId);
                          toast.success("Item removed from cart");
                        }}
                        className="text-red-500 hover:text-red-600 p-2 self-start"
                        title="Remove item"
                      >
                        <FiX size={20} />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t flex items-center justify-between">
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to clear your cart?")) {
                      clearCart();
                      toast.success("Cart cleared");
                    }
                  }}
                  className="text-red-500 hover:text-red-600 text-sm font-medium transition"
                >
                  Clear Cart
                </button>
                
                <Link
                  href="/"
                  className="text-orange-500 hover:text-orange-600 text-sm font-medium transition"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.length} item{cart.length > 1 ? 's' : ''})</span>
                  <span>৳ {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Discount (10%)</span>
                  <span className="text-green-600 font-medium">-৳ {discount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charge</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-orange-600">৳ {total.toLocaleString()}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full bg-orange-500 hover:bg-orange-600 text-white text-center py-3 rounded-lg font-medium transition mb-3"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/"
                className="block w-full text-center text-orange-500 hover:text-orange-600 py-3 font-medium transition"
              >
                Continue Shopping
              </Link>

              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Free delivery available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
