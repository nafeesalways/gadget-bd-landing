'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useRef, useState } from 'react';

import toast from 'react-hot-toast';

import { useCart } from '../context/CartContext';
import ProductModal from './ProductModal';

export default function FlashSale() {
  const scrollContainerRef = useRef(null);
  const router = useRouter();
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Product data for flash sale
  const products = [
    {
      id: 1,
      name: 'Ugreen 20W Fast Chagers',
      image: '/images/img9.webp',
      currentPrice: 1150,
      originalPrice: 1500,
      slug: 'ugreen-20w-fast-charger',
      color: 'Black',
      variants: [
        { color: 'Black', available: true },
        { color: 'White', available: true },
      ],
    },
    {
      id: 2,
      name: 'Huawei Band 9',
      image: '/images/img10.webp',
      currentPrice: 4400,
      originalPrice: 8000,
      slug: 'huawei-band-9',
      color: 'Black',
      variants: [
        { color: 'Black', available: true },
        { color: 'Yellow', available: true },
        { color: 'Pink', available: true },
      ],
    },
    {
      id: 3,
      name: 'Apple 20W USB-C Power Adapter',
      image: '/images/img11.webp',
      currentPrice: 2200,
      originalPrice: 2500,
      slug: 'apple-20w-usb-c-power-adapter',
      color: 'White',
      variants: [
        { color: 'White', available: true },
      ],
    },
    {
      id: 4,
      name: 'Apple Watch Series 9',
      image: '/images/img12.webp',
      currentPrice: 46790,
      originalPrice: 51150,
      slug: 'apple-watch-series-9',
      color: 'Black',
      variants: [
        { color: 'Black', available: true },
        { color: 'Silver', available: true },
        { color: 'Gold', available: true },
      ],
    },
    {
      id: 5,
      name: 'AirPods Max',
      image: '/images/img13.webp',
      currentPrice: 49500,
      originalPrice: 68000,
      slug: 'airpods-max',
      color: 'Space Gray',
      variants: [
        { color: 'Space Gray', available: true },
        { color: 'Silver', available: true },
      ],
    },
    {
      id: 6,
      name: 'Apple 20W USB-C Power Adapter',
      image: '/images/img14.webp',
      currentPrice: 2490,
      originalPrice: 2700,
      slug: 'apple-20w-usb-c-power-adapter-2',
      color: 'White',
      variants: [
        { color: 'White', available: true },
      ],
    },
  ];

  // Handle Buy Now - Show modal first
  const handleBuyNow = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Handle Add to Cart from modal
  const handleAddToCartFromModal = (productWithVariant) => {
    addToCart(productWithVariant);
    toast.success('Product added to cart!', {
      icon: '🛒',
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

  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.offsetWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.offsetWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      <section className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Section Header */}
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Flash Sale</h2>
        </div>

        {/* Products Container with Navigation */}
        <div className="relative group">
          {/* Navigation Buttons */}
          <button
            onClick={scrollLeft}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white shadow-lg hover:bg-gray-50 text-gray-800 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Scroll left"
          >
            <FiChevronLeft size={24} />
          </button>

          <button
            onClick={scrollRight}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white shadow-lg hover:bg-gray-50 text-gray-800 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Scroll right"
          >
            <FiChevronRight size={24} />
          </button>

          {/* Scrollable Products Grid */}
          <div
            ref={scrollContainerRef}
            className="grid grid-flow-col auto-cols-[85%] sm:auto-cols-[45%] md:auto-cols-[calc(33.333%-12px)] lg:auto-cols-[calc(25%-12px)] xl:auto-cols-[calc(20%-13px)] gap-3 md:gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 snap-x snap-mandatory"
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="snap-start bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* Product Image */}
                <Link href={`/product/${product.slug}`}>
                  <div className="relative h-48 sm:h-52 md:h-56 lg:h-64 bg-gray-50 flex items-center justify-center p-3 md:p-4">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={200}
                      height={200}
                      className="object-contain w-full h-full hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>

                {/* Product Details */}
                <div className="p-3 md:p-4">
                  {/* Product Name */}
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="text-xs md:text-sm font-medium text-gray-800 mb-2 md:mb-3 h-8 md:h-10 line-clamp-2 hover:text-orange-500 transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Price Section */}
                  <div className="flex items-center gap-1 md:gap-2 mb-3 md:mb-4">
                    <span className="text-sm md:text-lg font-bold text-gray-900">
                      ৳ {product.currentPrice.toLocaleString()}
                    </span>
                    <span className="text-xs md:text-sm text-gray-500 line-through">
                      ৳ {product.originalPrice.toLocaleString()}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-1.5 md:gap-2">
                    <button
                      onClick={() => handleBuyNow(product)}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-[10px] md:text-sm font-medium py-1.5 md:py-2 px-2 md:px-4 rounded transition-colors duration-300"
                    >
                      Buy Now
                    </button>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 bg-white hover:bg-gray-50 text-orange-500 border border-orange-500 text-[10px] md:text-sm font-medium py-1.5 md:py-2 px-2 md:px-4 rounded transition-colors duration-300"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CSS for hiding scrollbar */}
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
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
