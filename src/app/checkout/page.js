"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import { FiX, FiMinus, FiPlus, FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import toast from "react-hot-toast";

const BASE_URL = 'https://ecommerce-saas-server-wine.vercel.app/api/v1';
const STORE_ID = '0000125';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    division: "",
    fullAddress: "",
    note: "",
    paymentMethod: "cash",
  });

  // ✅ Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // Pre-fill form with user data
        const userInfo = parsedUser.data || parsedUser;
        setFormData(prev => ({
          ...prev,
          fullName: userInfo.name || '',
          email: userInfo.email || '',
          phone: userInfo.phoneNumber || '',
        }));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  // ✅ Update page title
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = "Checkout - Complete Your Order | Gadget BD";
    }
  }, []);

  // ✅ Get product image
  const getProductImage = (item) => {
    const isValidUrl = (url) => {
      return typeof url === 'string' && 
             url.length > 10 && 
             (url.startsWith('http://') || url.startsWith('https://'));
    };

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

  const subtotal = getCartTotal();
  const discount = Math.round(subtotal * 0.1);
  const deliveryCharge = 0;
  const grandTotal = subtotal - discount + deliveryCharge;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleIncrease = (cartItemId, currentQuantity) => {
    updateQuantity(cartItemId, currentQuantity + 1);
  };

  const handleDecrease = (cartItemId, currentQuantity) => {
    if (currentQuantity > 1) {
      updateQuantity(cartItemId, currentQuantity - 1);
    }
  };

const handleConfirmOrder = async () => {
  console.log('🚀 Step 1: Starting order creation...');
  
  // Validation
  if (!formData.fullName || formData.fullName.trim() === '') {
    toast.error("Full name is required");
    return;
  }

  if (!formData.phone || formData.phone.trim() === '') {
    toast.error("Phone number is required");
    return;
  }

  const cleanPhone = formData.phone.replace(/\D/g, '');
  
  if (cleanPhone.length !== 11) {
    toast.error(`Phone must be 11 digits (you entered ${cleanPhone.length})`);
    return;
  }

  if (!formData.division || formData.division === '') {
    toast.error("Please select a division");
    return;
  }

  if (!formData.fullAddress || formData.fullAddress.trim() === '') {
    toast.error("Full address is required");
    return;
  }

  if (!cart || cart.length === 0) {
    toast.error("Your cart is empty");
    return;
  }

  setLoading(true);

  try {
    const orderItems = cart.map((item) => ({
      product: item.id,
      name: item.name,
      price: item.salePrice,
      quantity: item.quantity,
      originalProductPrice: item.productPrice || item.salePrice,
      imageURL: getProductImage(item),
      variant: item.selectedVariant?._id || null,
      category: item.category || "General",
    }));

    const userId = user?.data?._id || user?.data?.id || user?._id || null;

    // ✅✅ ADD PAYMENT DETAILS ✅✅
    const orderData = {
      orderItem: orderItems,
      user: userId,
      shippingPrice: deliveryCharge,
      mobileNumber: cleanPhone,
      fullName: formData.fullName.trim(),
      totalAmount: grandTotal,
      afterDiscountPrice: subtotal - discount,
      originalProductPrice: subtotal,
      couponDiscount: discount,
      orderType: "website",
      shippingAddress: {
        address: formData.fullAddress.trim(),
        email: formData.email?.trim() || "",
        firstName: formData.fullName.trim(),
        phone: cleanPhone,
        note: formData.note?.trim() || "",
      },
      paymentMethod: formData.paymentMethod,
      division: formData.division,
      
      // ✅ ADD THIS: Payment Details (REQUIRED)
      paymentDetails: {
        method: formData.paymentMethod, // "cash", "bkash", "nagad"
        status: "pending", // pending, paid, failed
        transactionId: null, // null for cash on delivery
        paidAmount: formData.paymentMethod === "cash" ? 0 : grandTotal,
      },
    };

    console.log('✅ Order data with payment details:', JSON.stringify(orderData, null, 2));

    const response = await fetch(`${BASE_URL}/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'store-id': STORE_ID,
      },
      body: JSON.stringify(orderData),
    });

    const result = await response.json();
    console.log('📬 Response:', result);

    if (response.ok && result.success) {
      const orderNum = result.data?.orderNumber || result.data?._id || `GBD${Date.now().toString().slice(-6)}`;
      setOrderNumber(orderNum);
      setIsOrderPlaced(true);
      toast.success("Order placed successfully! 🎉");
      clearCart();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      if (result.errors && Array.isArray(result.errors)) {
        result.errors.forEach((error, idx) => {
          setTimeout(() => {
            const message = error.msg || error.message || "Validation error";
            const field = error.path || error.param || "";
            const fullMessage = field ? `${field}: ${message}` : message;
            toast.error(fullMessage, { id: `error-${idx}`, duration: 5000 });
          }, idx * 200);
        });
      } else {
        const errorMsg = result.error || result.message || "Failed to place order";
        toast.error(errorMsg, { duration: 5000 });
      }
    }
  } catch (error) {
    console.error('💥 Error:', error);
    toast.error(`Error: ${error.message}`, { duration: 5000 });
  } finally {
    setLoading(false);
  }
};


  // ✅ Order Success Screen
  if (isOrderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle className="text-green-500 text-5xl" />
          </div>
          
          <h2 className="text-sm text-gray-600 mb-2 uppercase tracking-wide">Thank You</h2>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your Order is Placed!</h1>
          <p className="text-gray-600 mb-2">
            We received your order and will begin processing it soon.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 my-6">
            <p className="text-sm text-gray-500 mb-1">Order Number</p>
            <p className="text-2xl font-bold text-orange-600">#{orderNumber}</p>
          </div>

          <div className="space-y-3">
            <Link
              href="/account"
              className="block bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              View My Orders
            </Link>
            
            <Link
              href="/"
              className="block border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Empty Cart Screen
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-gray-300 mb-4">
            <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some products to checkout</p>
          <Link href="/" className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-200 rounded-full transition"
          >
            <FiArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-500 mt-1">{cart.length} items in your cart</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            
            {/* Cart Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Cart Items</h2>
              <div className="space-y-4">
                {cart.map((item) => {
                  const productImage = getProductImage(item);
                  
                  return (
                    <div key={item.cartItemId} className="flex gap-4 pb-4 border-b last:border-b-0">
                      <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
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
                        <h3 className="font-medium text-gray-900 line-clamp-2 mb-1">
                          {item.name}
                        </h3>
                        
                        {item.variantName && (
                          <p className="text-sm text-gray-500">
                            Variant: {item.variantName}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 mt-2">
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

                          <div className="text-right flex-1">
                            <p className="text-lg font-bold text-orange-600">
                              ৳ {(item.salePrice * item.quantity).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500">
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
                        className="text-red-500 hover:text-red-600 p-2"
                      >
                        <FiX size={20} />
                      </button>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => {
                  if (confirm("Are you sure you want to clear your cart?")) {
                    clearCart();
                    toast.success("Cart cleared");
                  }
                }}
                className="text-red-500 hover:text-red-600 text-sm font-medium mt-4"
              >
                Clear Cart
              </button>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Customer Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    maxLength="11"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="01XXXXXXXXX"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.phone.replace(/\D/g, '').length}/11 digits
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Division *
                  </label>
                  <select
                    name="division"
                    value={formData.division}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Division</option>
                    <option value="Dhaka">Dhaka</option>
                    <option value="Chittagong">Chittagong</option>
                    <option value="Rajshahi">Rajshahi</option>
                    <option value="Khulna">Khulna</option>
                    <option value="Barisal">Barisal</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Rangpur">Rangpur</option>
                    <option value="Mymensingh">Mymensingh</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Address *
                  </label>
                  <textarea
                    name="fullAddress"
                    value={formData.fullAddress}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="House/Road/Area details"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Note (Optional)
                  </label>
                  <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Any special instructions?"
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Payment Method
                  </label>
                  <div className="space-y-2">
                    <label className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition ${
                      formData.paymentMethod === 'cash' ? 'border-orange-500 bg-orange-50' : 'border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={formData.paymentMethod === "cash"}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-orange-500"
                      />
                      <span className="font-medium">Cash on Delivery</span>
                    </label>

                    <label className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition ${
                      formData.paymentMethod === 'bkash' ? 'border-orange-500 bg-orange-50' : 'border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bkash"
                        checked={formData.paymentMethod === "bkash"}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-orange-500"
                      />
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Bkash</span>
                        <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded">Mobile Payment</span>
                      </div>
                    </label>

                    <label className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition ${
                      formData.paymentMethod === 'nagad' ? 'border-orange-500 bg-orange-50' : 'border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="nagad"
                        checked={formData.paymentMethod === "nagad"}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-orange-500"
                      />
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Nagad</span>
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">Mobile Payment</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.length} items)</span>
                  <span>৳ {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Discount (10%)</span>
                  <span className="text-green-600">-৳ {discount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charge</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-orange-600">৳ {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleConfirmOrder}
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium transition mb-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                )}
                {loading ? 'Processing...' : 'Confirm Order'}
              </button>

              <Link
                href="/"
                className="block w-full text-center text-orange-500 hover:text-orange-600 py-3 font-medium transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
