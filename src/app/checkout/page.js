"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiX,
  FiMinus,
  FiPlus,
  FiArrowLeft,
  FiCheckCircle,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } =
    useCart();
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    division: "",
    fullAddress: "",
    paymentMethod: "cash",
  });

  const subtotal = getCartTotal();
  const discount = Math.round(subtotal * 0.1);
  const deliveryCharge = 0;
  const grandTotal = subtotal - discount + deliveryCharge;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleIncrease = (productId, currentQuantity) => {
    updateQuantity(productId, currentQuantity + 1);
  };

  const handleDecrease = (productId, currentQuantity) => {
    if (currentQuantity > 1) {
      updateQuantity(productId, currentQuantity - 1);
    }
  };

  const handleConfirmOrder = () => {
    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.division ||
      !formData.fullAddress
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const orderNum = `#${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderNumber(orderNum);
    setIsOrderPlaced(true);

    toast.success("Order placed successfully!", {
      duration: 4000,
    });

    clearCart();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isOrderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle className="text-green-500 text-5xl" />
          </div>

          <h2 className="text-sm text-gray-600 mb-2">THANK YOU</h2>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            YOUR ORDER IS PLACED
          </h1>
          <p className="text-gray-600 mb-2">
            We received your order and will begin processing it soon. Your order
            information appears below.
          </p>
          <p className="text-gray-900 font-medium mb-8">
            Your order Number {orderNumber}
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            View Order
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Delivery Address
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name*"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter Your Phone Number*"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />

                <select
                  name="division"
                  value={formData.division}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-500"
                  required
                >
                  <option value="">Select Division</option>
                  <option value="dhaka">Dhaka</option>
                  <option value="chittagong">Chittagong</option>
                  <option value="rajshahi">Rajshahi</option>
                  <option value="khulna">Khulna</option>
                  <option value="barishal">Barishal</option>
                  <option value="sylhet">Sylhet</option>
                  <option value="rangpur">Rangpur</option>
                  <option value="mymensingh">Mymensingh</option>
                </select>
              </div>

              <div className="mt-4">
                <textarea
                  name="fullAddress"
                  placeholder="Full Address*"
                  value={formData.fullAddress}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  required
                />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Select a Payment Option
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, paymentMethod: "cash" }))
                  }
                  className={`relative p-6 border-2 rounded-lg transition-all ${
                    formData.paymentMethod === "cash"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {formData.paymentMethod === "cash" && (
                    <div className="absolute top-2 left-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                  <div className="text-center">
                    <div className="text-4xl mb-2">💵</div>
                    <p className="text-sm font-medium text-gray-900">
                      Cash on Delivery
                    </p>
                  </div>
                </button>

                <button
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, paymentMethod: "bkash" }))
                  }
                  className={`relative p-6 border-2 rounded-lg transition-all ${
                    formData.paymentMethod === "bkash"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {formData.paymentMethod === "bkash" && (
                    <div className="absolute top-2 left-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                  <div className="text-center">
                    <div className="text-4xl mb-2 text-pink-500 font-bold">
                      bKash
                    </div>
                    <p className="text-sm font-medium text-gray-900">Bkash</p>
                  </div>
                </button>

                <button
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, paymentMethod: "nagad" }))
                  }
                  className={`relative p-6 border-2 rounded-lg transition-all ${
                    formData.paymentMethod === "nagad"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {formData.paymentMethod === "nagad" && (
                    <div className="absolute top-2 left-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                  <div className="text-center">
                    <div className="text-4xl mb-2 text-orange-500 font-bold">
                      নগদ
                    </div>
                    <p className="text-sm font-medium text-gray-900">Nagad</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Order Items ({cart.length} Items)
              </h2>

              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {cart.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    Your cart is empty
                  </p>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item._id}
                      className="flex gap-3 pb-4 border-b border-gray-200"
                    >
                      <div className="relative w-16 h-16 bg-gray-100 rounded shrink-0">
                        <Image
                          src={item.imageURLs?.[0] || "/placeholder.jpg"}
                          alt={item.name}
                          fill
                          className="object-contain p-1"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-1 mb-1">
                          {item.name}
                        </h3>

                        {item.selectedVariant && (
                          <p className="text-xs text-gray-500 mb-2">
                            Variant: {JSON.stringify(item.selectedVariant)}
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                handleDecrease(item._id, item.quantity)
                              }
                              className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                            >
                              <FiMinus size={12} />
                            </button>
                            <span className="text-sm font-medium w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleIncrease(item._id, item.quantity)
                              }
                              className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                            >
                              <FiPlus size={12} />
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-900">
                              ৳
                              {(
                                item.salePrice * item.quantity
                              ).toLocaleString()}
                            </span>
                            <button
                              onClick={() => removeFromCart(item._id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FiX size={18} />
                            </button>
                          </div>
                        </div>

                        {item.productPrice > item.salePrice && (
                          <p className="text-xs text-gray-400 line-through mt-1">
                            ৳{item.productPrice?.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <>
                  <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Sub Total:</span>
                      <span className="font-medium">
                        ৳{subtotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Discount:</span>
                      <span className="font-medium text-green-600">
                        -৳{discount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Delivery Charge:</span>
                      <span className="font-medium">৳{deliveryCharge}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-bold text-gray-900">
                      GrandTotal:
                    </span>
                    <span className="text-2xl font-bold text-orange-500">
                      ৳{grandTotal.toLocaleString()}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                    Do have any coupon code?
                  </p>

                  <div className="space-y-3">
                    <Link
                      href="/cart"
                      className="flex items-center justify-center gap-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-medium transition-colors"
                    >
                      <FiArrowLeft size={18} />
                      Back to Cart
                    </Link>

                    <button
                      onClick={handleConfirmOrder}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Confirm Order
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
