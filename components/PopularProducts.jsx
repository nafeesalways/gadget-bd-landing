'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import ProductModal from './ProductModal';


export default function PopularProducts() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Product data for popular products
  const products = [
    {
      id: 7,
      name: 'Baseus 65W GaN5 Pro Fast Charger',
      image: '/images/img15.webp',
      currentPrice: 3650,
      originalPrice: 4500,
      slug: 'baseus-65w-gan5-pro-charger',
      color: 'Black',
      variants: [
        { color: 'Black', available: true },
        { color: 'White', available: true },
      ],
    },
    {
      id: 8,
      name: 'Samsung Galaxy Buds FE',
      image: '/images/img16.webp',
      currentPrice: 8999,
      originalPrice: 12000,
      slug: 'samsung-galaxy-buds-fe',
      color: 'Graphite',
      variants: [
        { color: 'Graphite', available: true },
        { color: 'White', available: true },
      ],
    },
    {
      id: 9,
      name: 'Anker PowerCore 10000mAh',
      image: '/images/img17.webp',
      currentPrice: 2850,
      originalPrice: 3500,
      slug: 'anker-powercore-10000mah',
      color: 'Black',
      variants: [
        { color: 'Black', available: true },
        { color: 'Blue', available: true },
        { color: 'Red', available: true },
      ],
    },
    {
      id: 10,
      name: 'JBL Tune 760NC Headphones',
      image: '/images/img18.webp',
      currentPrice: 8500,
      originalPrice: 11000,
      slug: 'jbl-tune-760nc-headphones',
      color: 'Black',
      variants: [
        { color: 'Black', available: true },
        { color: 'Blue', available: true },
        { color: 'White', available: true },
      ],
    },
    {
      id: 11,
      name: 'Xiaomi Mi Band 8',
      image: '/images/img19.webp',
      currentPrice: 3999,
      originalPrice: 5500,
      slug: 'xiaomi-mi-band-8',
      color: 'Black',
      variants: [
        { color: 'Black', available: true },
        { color: 'Orange', available: true },
        { color: 'Pink', available: true },
      ],
    },
    {
      id: 12,
      name: 'Logitech MX Master 3S',
      image: '/images/img20.webp',
      currentPrice: 9500,
      originalPrice: 12500,
      slug: 'logitech-mx-master-3s',
      color: 'Graphite',
      variants: [
        { color: 'Graphite', available: true },
        { color: 'Pale Gray', available: true },
      ],
    },
  ];

  // Handle Buy Now - Show modal first, then redirect to checkout
  const handleBuyNow = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Handle Add to Cart from modal
  const handleAddToCartFromModal = (productWithVariant) => {
    addToCart(productWithVariant);
    toast.success('Product added to cart!', {
      icon: '🛒',
      style: {
        background: '#10b981',
        color: '#fff',
      },
    });
    router.push('/checkout');
  };

  // Handle Add to Cart - Show modal
  const handleAddToCart = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <section className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Section Header */}
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Popular Products</h2>
        </div>

        {/* Products Grid - Responsive */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Product Image */}
              <Link href={`/product/${product.slug}`}>
                <div className="relative h-32 sm:h-40 md:h-48 bg-gray-50 flex items-center justify-center p-2 md:p-4">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={150}
                    height={150}
                    className="object-contain w-full h-full hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>

              {/* Product Details */}
              <div className="p-2 md:p-4">
                {/* Product Name */}
                <Link href={`/product/${product.slug}`}>
                  <h3 className="text-xs md:text-sm font-medium text-gray-800 mb-2 md:mb-3 h-8 md:h-10 line-clamp-2 hover:text-orange-500 transition-colors">
                    {product.name}
                  </h3>
                </Link>

                {/* Price Section */}
                <div className="flex items-center gap-1 md:gap-2 mb-2 md:mb-4">
                  <span className="text-sm md:text-base font-bold text-gray-900">
                    ৳ {product.currentPrice.toLocaleString()}
                  </span>
                  <span className="text-[10px] md:text-xs text-gray-500 line-through">
                    ৳ {product.originalPrice.toLocaleString()}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-1 md:gap-2">
                  <button
                    onClick={() => handleBuyNow(product)}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-[10px] md:text-xs font-medium py-1.5 md:py-2 px-1 md:px-2 rounded transition-colors duration-300"
                  >
                    Buy Now
                  </button>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 bg-white hover:bg-gray-50 text-orange-500 border border-orange-500 text-[10px] md:text-xs font-medium py-1.5 md:py-2 px-1 md:px-2 rounded transition-colors duration-300"
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Product Variant Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={closeModal}
          onAddToCart={handleAddToCartFromModal}
        />
      )}
    </>
  );
}
