"use client";

import Image from "next/image";
import { FiX } from "react-icons/fi";
import { useState } from "react";

export default function ProductModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) {
  const [selectedColor, setSelectedColor] = useState(
    product.variants?.[0]?.color || product.color
  );

  if (!isOpen) return null;

  // Product variants (you can make this dynamic later)
  const variants = product.variants || [
    { color: "Black", available: true },
    { color: "Yellow", available: true },
    { color: "Pink", available: true },
  ];

  const handleAddToCart = () => {
    onAddToCart({ ...product, color: selectedColor });
    onClose();
  };

  // Calculate discount percentage
  const discountPercent = Math.round(
    ((product.originalPrice - product.currentPrice) / product.originalPrice) *
      100
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-white rounded-lg max-w-md w-full p-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          >
            <FiX size={24} />
          </button>

          {/* Product Info */}
          <div className="flex gap-4 mb-6">
            {/* Product Image */}
            <div className="relative w-20 h-20 bg-gray-100 rounded shrink-0">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain p-2"
              />
            </div>

            {/* Product Details */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {product.name}
              </h3>

              {/* Price */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl font-bold text-orange-500">
                  ৳ {product.currentPrice.toLocaleString()}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ৳ {product.originalPrice.toLocaleString()}
                </span>
                <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded">
                  ৳ {discountPercent}% Off
                </span>
              </div>
            </div>
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Color:
            </label>
            <div className="flex gap-3">
              {variants.map((variant) => (
                <button
                  key={variant.color}
                  onClick={() => setSelectedColor(variant.color)}
                  disabled={!variant.available}
                  className={`flex-1 px-4 py-3 border-2 rounded-lg transition-all ${
                    selectedColor === variant.color
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-300 hover:border-gray-400"
                  } ${
                    !variant.available ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {selectedColor === variant.color && (
                      <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
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
                    <span className="text-sm font-medium text-gray-900">
                      {variant.color}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
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
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Add to cart
          </button>
        </div>
      </div>
    </>
  );
}
