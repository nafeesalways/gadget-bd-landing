'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiTrash2, FiShoppingCart, FiHeart } from 'react-icons/fi';
import { useWishlist } from '@/app/context/WishlistContext';
import { useCart } from '@/app/context/CartContext';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  // ✅ Client-side metadata update
  if (typeof document !== 'undefined') {
    // eslint-disable-next-line react-hooks/immutability
    document.title = `My Wishlist (${wishlist.length}) - Gadget BD`;
  }

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success('Added to cart!');
  };

  const handleRemove = (productId) => {
    removeFromWishlist(productId);
    toast.success('Removed from wishlist!');
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>
          
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="max-w-md mx-auto">
              <FiHeart size={80} className="mx-auto text-gray-300 mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Your wishlist is empty
              </h2>
              <p className="text-gray-600 mb-6">
                Save your favorite items to your wishlist and never lose track of them!
              </p>
              <Link
                href="/"
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-lg transition"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            My Wishlist ({wishlist.length})
          </h1>
          <Link
            href="/"
            className="text-orange-600 hover:text-orange-700 font-medium text-sm md:text-base"
          >
            ← Continue Shopping
          </Link>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 relative group"
            >
              {/* Remove Button */}
              <button
                onClick={() => handleRemove(product._id)}
                className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:bg-red-50 hover:text-red-600 transition z-10 opacity-0 group-hover:opacity-100"
                title="Remove from wishlist"
              >
                <FiTrash2 size={18} />
              </button>

              {/* Discount Badge */}
              {product.discount > 0 && (
                <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
                  -{product.discount}% OFF
                </span>
              )}

              {/* Product Image */}
              <Link href={`/product-details/${product.path}`}>
                <div className="relative h-48 bg-gray-50 rounded-lg mb-4 overflow-hidden">
                  <Image
                    src={product.imageURLs?.[0] || '/placeholder.jpg'}
                    alt={product.name}
                    fill
                    className="object-contain p-2 hover:scale-105 transition"
                  />
                </div>
              </Link>

              {/* Product Info */}
              <Link href={`/product-details/${product.path}`}>
                <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-orange-600 transition">
                  {product.name}
                </h3>
              </Link>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-xs text-gray-500 ml-1">
                  ({product.reviews?.length || 0})
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg font-bold text-orange-600">
                  ৳{product.salePrice?.toLocaleString()}
                </span>
                {product.productPrice > product.salePrice && (
                  <span className="text-sm text-gray-400 line-through">
                    ৳{product.productPrice?.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => handleAddToCart(product)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition"
              >
                <FiShoppingCart size={18} />
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
