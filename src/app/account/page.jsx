"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  FiUser,
  FiHeart,
  FiShoppingCart,
  FiLogOut,
  FiMail,
  FiPhone,
  FiPackage,
  FiX,
  FiMinus,
  FiPlus,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";

const BASE_URL = "https://ecommerce-saas-server-wine.vercel.app/api/v1";

function OrdersList({ userId }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const endpoints = [
          `${BASE_URL}/order/user`,
          `${BASE_URL}/dashboard/user/order`,
        ];

        let result = null;

        for (const endpoint of endpoints) {
          try {
            const response = await fetch(endpoint, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: token,
              },
            });

            if (response.ok) {
              result = await response.json();
              break;
            }
          } catch (err) {
            console.log(`❌ Failed from ${endpoint}:`, err);
          }
        }

        if (result) {
          let ordersData = null;

          if (result.data && Array.isArray(result.data)) {
            ordersData = result.data;
          } else if (
            result.data &&
            result.data.data &&
            Array.isArray(result.data.data)
          ) {
            ordersData = result.data.data;
          } else if (result.data && typeof result.data === "object") {
            ordersData = [result.data];
          }

          if (ordersData && ordersData.length > 0) {
            console.log("🎯 Processing orders:", ordersData.length);
            ordersData.forEach((order, i) => {
              console.log(`Order ${i + 1}:`, {
                id: order._id,
                totalAmount: order.totalAmount,
                afterDiscountPrice: order.afterDiscountPrice,
                status: order.status,
              });
            });
            setOrders(ordersData);
          } else {
            console.log("No valid orders found");
            setOrders([]);
          }
        } else {
          console.log("❌ No result from API");
          setOrders([]);
        }
      } catch (error) {
        console.error("❌ Error fetching orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <FiPackage size={64} className="text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg mb-4">No orders yet</p>
        <Link
          href="/"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard key={order._id} order={order} />
      ))}
    </div>
  );
}

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower.includes("delivered") || statusLower.includes("complete")) {
      return "bg-green-100 text-green-700 border-green-300";
    }
    if (statusLower.includes("confirmed")) {
      return "bg-blue-100 text-blue-700 border-blue-300";
    }
    if (statusLower.includes("pending") || statusLower.includes("processing")) {
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
    }
    if (statusLower.includes("cancelled") || statusLower.includes("failed")) {
      return "bg-red-100 text-red-700 border-red-300";
    }
    if (statusLower.includes("shipped") || statusLower.includes("transit")) {
      return "bg-purple-100 text-purple-700 border-purple-300";
    }
    return "bg-gray-100 text-gray-700 border-gray-300";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  const getOrderNumber = () => {
    if (order.orderNumber) return order.orderNumber;
    if (order._id) return order._id.slice(-8).toUpperCase();
    return "N/A";
  };

  const getTotalAmount = () => {
    // Priority order matching API body structure
    if (order.totalAmount != null && order.totalAmount > 0) {
      return order.totalAmount;
    }
    if (order.afterDiscountPrice != null && order.afterDiscountPrice > 0) {
      return order.afterDiscountPrice;
    }
    if (order.originalProductPrice != null && order.originalProductPrice > 0) {
      return order.originalProductPrice;
    }

    // Calculate from orderItem if nothing else works
    if (
      order.orderItem &&
      Array.isArray(order.orderItem) &&
      order.orderItem.length > 0
    ) {
      const itemsTotal = order.orderItem.reduce((sum, item) => {
        return sum + (item.price || 0) * (item.quantity || 1);
      }, 0);

      // Add shipping if available
      const shipping = order.shippingPrice || 0;
      return itemsTotal + shipping;
    }

    return 0;
  };

  const hasOrderItems =
    order.orderItem &&
    Array.isArray(order.orderItem) &&
    order.orderItem.length > 0;

  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-md transition">
      {/* Order Header */}
      <div className="bg-gray-50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-semibold text-gray-900">
              Order #{getOrderNumber()}
            </span>
            <span
              className={`text-xs font-medium px-3 py-1 rounded-full border ${getStatusColor(
                order.status
              )}`}
            >
              {order.status || "Pending"}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-gray-600">Total Amount</p>
            <p className="text-lg font-bold text-orange-600">
              ৳ {getTotalAmount().toLocaleString()}
            </p>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 hover:bg-gray-200 rounded-lg transition"
          >
            <svg
              className={`w-5 h-5 transform transition ${
                expanded ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Order Details */}
      {expanded && (
        <div className="p-4 border-t">
          {/* Order Items */}
          {hasOrderItems ? (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                Order Items
              </h4>
              <div className="space-y-3">
                {order.orderItem.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex gap-3 items-start bg-gray-50 p-3 rounded-lg"
                  >
                    <div className="relative w-16 h-16 bg-white rounded overflow-hidden shrink-0">
                      <Image
                        src={item.imageURL || item.image || "/placeholder.jpg"}
                        alt={item.name || "Product"}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">
                        {item.name || "Product"}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Qty: {item.quantity || 1} × ৳
                        {(item.price || 0).toLocaleString()}
                      </p>
                      {item.originalProductPrice && (
                        <p className="text-xs text-gray-500">
                          Original: ৳
                          {item.originalProductPrice.toLocaleString()}
                        </p>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      ৳
                      {(
                        (item.price || 0) * (item.quantity || 1)
                      ).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-gray-700">
                Order items information is being processed.
              </p>
            </div>
          )}

          {/* Price Breakdown */}
          {(order.originalProductPrice ||
            order.couponDiscount ||
            order.shippingPrice != null) && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                Price Details
              </h4>
              <div className="space-y-2 text-sm">
                {order.originalProductPrice &&
                  order.originalProductPrice > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Original Price:</span>
                      <span className="text-gray-900">
                        ৳ {order.originalProductPrice.toLocaleString()}
                      </span>
                    </div>
                  )}
                {order.couponDiscount && order.couponDiscount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount:</span>
                    <span className="text-green-600">
                      -৳ {order.couponDiscount.toLocaleString()}
                    </span>
                  </div>
                )}
                {order.shippingPrice != null && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="text-gray-900">
                      {order.shippingPrice === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `৳ ${order.shippingPrice.toLocaleString()}`
                      )}
                    </span>
                  </div>
                )}
                {order.afterDiscountPrice && (
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600">After Discount:</span>
                    <span className="font-semibold text-gray-900">
                      ৳ {order.afterDiscountPrice.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Shipping Address */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">
              Shipping Information
            </h4>
            <div className="space-y-1 text-sm">
              <p className="font-medium text-gray-900">
                {order.fullName || order.shippingAddress?.firstName || "N/A"}
              </p>
              {order.shippingAddress?.address && (
                <p className="text-gray-600">{order.shippingAddress.address}</p>
              )}
              <div className="flex gap-4 text-gray-600 pt-1">
                <span>
                  📞{" "}
                  {order.mobileNumber || order.shippingAddress?.phone || "N/A"}
                </span>
              </div>
              {order.shippingAddress?.email && (
                <p className="text-gray-600">
                  ✉️ {order.shippingAddress.email}
                </p>
              )}
              {order.shippingAddress?.note && (
                <p className="text-gray-600 mt-2 p-2 bg-white rounded border-l-2 border-orange-500">
                  <span className="font-medium">Note:</span>{" "}
                  {order.shippingAddress.note}
                </p>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div className="flex justify-between items-center text-sm bg-gray-50 p-3 rounded-lg">
            <span className="text-gray-600">Payment Method:</span>
            <span className="font-medium text-gray-900 capitalize">
              {order.paymentDetails.method || "Cash on Delivery"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// MAIN ACCOUNT PAGE COMPONENT - STARTS HERE
export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile"); // profile, wishlist, cart, orders

  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } =
    useCart();
  const {
    wishlist,
    removeFromWishlist,
    addToCart: addWishlistToCart,
  } = useWishlist();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      toast.error("Please login first!");
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

 const handleLogout = () => {
    // ✅ Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    localStorage.removeItem('gadget-wishlist');
    
    // ✅ Reset context states
    resetCart();
    resetWishlist();
    
    toast.success('Logged out successfully!');
    
    // ✅ Redirect and force reload
    router.push('/');
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId);
    toast.success("Removed from wishlist!");
  };

  const handleMoveToCart = (product) => {
    addWishlistToCart(product);
    removeFromWishlist(product.id || product._id);
    toast.success("Moved to cart!");
  };

  const handleIncreaseQuantity = (cartItemId) => {
    const item = cart.find((item) => item.cartItemId === cartItemId);
    if (item) {
      updateQuantity(cartItemId, item.quantity + 1);
    }
  };

  const handleDecreaseQuantity = (cartItemId) => {
    const item = cart.find((item) => item.cartItemId === cartItemId);
    if (item && item.quantity > 1) {
      updateQuantity(cartItemId, item.quantity - 1);
    }
  };

  const handleRemoveFromCart = (cartItemId) => {
    removeFromCart(cartItemId);
    toast.success("Removed from cart!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const userData = user.data || user;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-4">
              {/* User Profile Header */}
              <div className="bg-linear-to-r from-orange-500 to-orange-600 p-6 text-white text-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-3 text-orange-600 font-bold text-2xl">
                  {userData.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <h2 className="text-xl font-bold">{userData.name || "User"}</h2>
                <p className="text-orange-100 text-sm mt-1">
                  {userData.email || userData.phoneNumber}
                </p>
              </div>

              {/* Navigation Menu */}
              <nav className="py-2">
                {/* My Profile */}
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center gap-3 px-6 py-4 transition ${
                    activeTab === "profile"
                      ? "bg-orange-50 text-orange-600 border-r-4 border-orange-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <FiUser size={20} />
                  <span className="font-medium">My Profile</span>
                </button>

                {/* My Wishlist */}
                <button
                  onClick={() => setActiveTab("wishlist")}
                  className={`w-full flex items-center justify-between px-6 py-4 transition ${
                    activeTab === "wishlist"
                      ? "bg-orange-50 text-orange-600 border-r-4 border-orange-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FiHeart size={20} />
                    <span className="font-medium">My Wishlist</span>
                  </div>
                  {wishlist.length > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 font-bold">
                      {wishlist.length}
                    </span>
                  )}
                </button>

                {/* My Cart */}
                <button
                  onClick={() => setActiveTab("cart")}
                  className={`w-full flex items-center justify-between px-6 py-4 transition ${
                    activeTab === "cart"
                      ? "bg-orange-50 text-orange-600 border-r-4 border-orange-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FiShoppingCart size={20} />
                    <span className="font-medium">My Cart</span>
                  </div>
                  {cart.length > 0 && (
                    <span className="bg-orange-500 text-white text-xs rounded-full px-2 py-1 font-bold">
                      {cart.length}
                    </span>
                  )}
                </button>

                {/* My Orders */}
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full flex items-center gap-3 px-6 py-4 transition ${
                    activeTab === "orders"
                      ? "bg-orange-50 text-orange-600 border-r-4 border-orange-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <FiPackage size={20} />
                  <span className="font-medium">My Orders</span>
                </button>

                {/* Divider */}
                <div className="border-t my-2"></div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-6 py-4 text-red-600 hover:bg-red-50 transition"
                >
                  <FiLogOut size={20} />
                  <span className="font-medium">Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md">
              {/* My Profile Tab */}
              {activeTab === "profile" && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b">
                    My Profile
                  </h2>

                  <div className="space-y-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <FiUser className="text-gray-400" size={20} />
                        <span className="text-gray-900 font-medium">
                          {userData.name || "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <FiMail className="text-gray-400" size={20} />
                        <span className="text-gray-900 font-medium">
                          {userData.email || "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <FiPhone className="text-gray-400" size={20} />
                        <span className="text-gray-900 font-medium">
                          {userData.phoneNumber || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* My Wishlist Tab */}
              {activeTab === "wishlist" && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b">
                    My Wishlist ({wishlist.length} items)
                  </h2>

                  {wishlist.length === 0 ? (
                    <div className="text-center py-12">
                      <FiHeart
                        size={64}
                        className="text-gray-300 mx-auto mb-4"
                      />
                      <p className="text-gray-500 text-lg mb-4">
                        Your wishlist is empty
                      </p>
                      <Link
                        href="/"
                        className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition"
                      >
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {wishlist.map((item) => (
                        <div
                          key={item.id || item._id}
                          className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg hover:shadow-md transition"
                        >
                          {/* Product Image */}
                          <div className="relative w-full sm:w-24 h-24 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                            <Image
                              src={
                                item.imageURL ||
                                item.image ||
                                "/placeholder.jpg"
                              }
                              alt={item.name}
                              fill
                              className="object-contain p-2"
                            />
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                              {item.name}
                            </h3>
                            <p className="text-orange-600 font-bold text-lg">
                              ৳ {item.salePrice?.toLocaleString()}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex sm:flex-col gap-2">
                            <button
                              onClick={() => handleMoveToCart(item)}
                              className="flex-1 sm:flex-initial bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                            >
                              Add to Cart
                            </button>
                            <button
                              onClick={() =>
                                handleRemoveFromWishlist(item.id || item._id)
                              }
                              className="flex-1 sm:flex-initial border-2 border-red-500 text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium transition"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* My Cart Tab */}
              {activeTab === "cart" && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b">
                    My Cart ({cart.length} items)
                  </h2>

                  {cart.length === 0 ? (
                    <div className="text-center py-12">
                      <FiShoppingCart
                        size={64}
                        className="text-gray-300 mx-auto mb-4"
                      />
                      <p className="text-gray-500 text-lg mb-4">
                        Your cart is empty
                      </p>
                      <Link
                        href="/"
                        className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition"
                      >
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4 mb-6">
                        {cart.map((item) => (
                          <div
                            key={item.cartItemId}
                            className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg hover:shadow-md transition"
                          >
                            {/* Product Image */}
                            <div className="relative w-full sm:w-24 h-24 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                              <Image
                                src={item.imageURLs || "/placeholder.jpg"}
                                alt={item.name}
                                fill
                                className="object-contain p-2"
                              />
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                                {item.name}
                              </h3>
                              {item.variantName && (
                                <p className="text-sm text-gray-600 mb-1">
                                  Variant:{" "}
                                  <span className="font-medium">
                                    {item.variantName}
                                  </span>
                                </p>
                              )}
                              <p className="text-orange-600 font-bold text-lg">
                                ৳ {item.salePrice?.toLocaleString()} ×{" "}
                                {item.quantity}
                              </p>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2 border-2 border-gray-300 rounded-lg">
                                <button
                                  onClick={() =>
                                    handleDecreaseQuantity(item.cartItemId)
                                  }
                                  disabled={item.quantity <= 1}
                                  className="p-2 hover:bg-gray-100 transition disabled:opacity-50"
                                >
                                  <FiMinus size={16} />
                                </button>
                                <span className="px-3 font-semibold">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    handleIncreaseQuantity(item.cartItemId)
                                  }
                                  className="p-2 hover:bg-gray-100 transition"
                                >
                                  <FiPlus size={16} />
                                </button>
                              </div>

                              <button
                                onClick={() =>
                                  handleRemoveFromCart(item.cartItemId)
                                }
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                              >
                                <FiX size={20} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Cart Summary */}
                      <div className="border-t pt-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-lg font-semibold text-gray-900">
                            Total:
                          </span>
                          <span className="text-2xl font-bold text-orange-600">
                            ৳ {getCartTotal().toLocaleString()}
                          </span>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={clearCart}
                            className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition"
                          >
                            Clear Cart
                          </button>
                          <Link
                            href="/checkout"
                            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg text-center transition"
                          >
                            Proceed to Checkout
                          </Link>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* MY ORDERS TAB - USE ORDERLIST COMPONENT HERE */}
              {activeTab === "orders" && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b">
                    My Orders
                  </h2>

                  <OrdersList userId={userData._id || userData.id} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
