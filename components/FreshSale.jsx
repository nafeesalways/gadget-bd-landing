"use client";

import Image from "next/image";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useRef } from "react";

export default function FreshSale() {
  const scrollContainerRef = useRef(null);

  // Product data for flash sale
  const products = [
    {
      id: 1,
      name: "Ugreen 20W Fast Chagers",
      image: "/images/img9.webp",
      currentPrice: 1150,
      originalPrice: 1500,
      slug: "ugreen-20w-fast-charger",
    },
    {
      id: 2,
      name: "Huawei Band 9",
      image: "/images/img10.webp",
      currentPrice: 4400,
      originalPrice: 8000,
      slug: "huawei-band-9",
    },
    {
      id: 3,
      name: "Apple 20W USB-C Power Adapter",
      image: "/images/img11.webp",
      currentPrice: 2200,
      originalPrice: 2500,
      slug: "apple-20w-usb-c-power-adapter",
    },
    {
      id: 4,
      name: "Apple Watch Series 9",
      image: "/images/img12.webp",
      currentPrice: 46790,
      originalPrice: 51150,
      slug: "apple-watch-series-9",
    },
    {
      id: 5,
      name: "AirPods Max",
      image: "/images/img13.webp",
      currentPrice: 49500,
      originalPrice: 68000,
      slug: "airpods-max",
    },
    {
      id: 6,
      name: "Apple 20W USB-C Power Adapter",
      image: "/images/img14.webp",
      currentPrice: 2490,
      originalPrice: 2700,
      slug: "apple-20w-usb-c-power-adapter-2",
    },
  ];

  // Scroll left function
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  // Scroll right function
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Fresh Sale</h2>
      </div>

      {/* Products Container with Navigation */}
      <div className="relative group">
        {/* Left Navigation Button */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white shadow-lg hover:bg-gray-50 text-gray-800 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-label="Scroll left"
        >
          <FiChevronLeft size={24} />
        </button>

        {/* Right Navigation Button */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white shadow-lg hover:bg-gray-50 text-gray-800 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-label="Scroll right"
        >
          <FiChevronRight size={24} />
        </button>

        {/* Scrollable Products Grid */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="shrink-0 w-64 bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Product Image */}
              <Link href={`/product/${product.slug}`}>
                <div className="relative h-64 bg-gray-50 flex items-center justify-center p-4">
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
              <div className="p-4">
                {/* Product Name */}
                <Link href={`/product/${product.slug}`}>
                  <h3 className="text-sm font-medium text-gray-800 mb-3 h-10 line-clamp-2 hover:text-orange-500 transition-colors">
                    {product.name}
                  </h3>
                </Link>

                {/* Price Section */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg font-bold text-gray-900">
                    ৳ {product.currentPrice.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    ৳ {product.originalPrice.toLocaleString()}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-2 px-4 rounded transition-colors duration-300">
                    Buy Now
                  </button>
                  <button className="flex-1 bg-white hover:bg-gray-50 text-orange-500 border border-orange-500 text-sm font-medium py-2 px-4 rounded transition-colors duration-300">
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
  );
}
