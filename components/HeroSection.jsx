"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function HeroSection({ banners = [] }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const bannersArray = Array.isArray(banners) ? banners : [];

  // Sort banners by position (highest position number first)
  const sortedBanners = [...bannersArray].sort((a, b) => {
    const posA = parseInt(a.position) || 0;
    const posB = parseInt(b.position) || 0;
    return posB - posA; // Descending order
  });

  const mainBanners = sortedBanners.slice(0, 3);
  const rightBanners = sortedBanners.slice(3, 5);

  // Auto-slide
  useEffect(() => {
    if (mainBanners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % mainBanners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [mainBanners.length]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? mainBanners.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % mainBanners.length);
  };

  // Loading state
  if (bannersArray.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-75 md:h-100 lg:h-125">
          <div className="lg:col-span-2 bg-gray-200 rounded-lg animate-pulse" />
          <div className="flex flex-col gap-4 h-full">
            <div className="h-1/2 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-1/2 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-75 md:h-100 lg:h-125">
        {/* Left Side - Main Carousel (First 3 banners) */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-lg bg-gray-900 group">
          {/* Carousel Images */}
          <div
            className="flex transition-transform duration-500 ease-in-out h-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {mainBanners.map((banner, index) => (
              <div
                key={banner._id || index}
                className="min-w-full h-full relative"
              >
                <Image
                  src={banner.image}
                  alt={banner.title || `Banner ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>

          {/* Previous Button */}
          {mainBanners.length > 1 && (
            <button
              onClick={handlePrevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
              aria-label="Previous slide"
            >
              <FiChevronLeft size={24} />
            </button>
          )}

          {/* Next Button */}
          {mainBanners.length > 1 && (
            <button
              onClick={handleNextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
              aria-label="Next slide"
            >
              <FiChevronRight size={24} />
            </button>
          )}

          {/* Slide Indicators */}
          {mainBanners.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {mainBanners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentSlide === index
                      ? "bg-orange-500 w-8"
                      : "bg-white/50 hover:bg-white/80"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Side - Static Banners (Next 2 banners) */}
        <div className="flex flex-col gap-4 h-full">
          {rightBanners.length > 0 ? (
            rightBanners.map((banner, index) => (
              <a
                key={banner._id || index}
                href={banner.url || "#"}
                className="relative h-1/2 overflow-hidden rounded-lg bg-gray-900 group cursor-pointer"
              >
                <Image
                  src={banner.image}
                  alt={banner.title || `Side Banner ${index + 1}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 400px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </a>
            ))
          ) : (
            <>
              <div className="h-1/2 bg-gray-200 rounded-lg" />
              {rightBanners.length < 2 && (
                <div className="h-1/2 bg-gray-200 rounded-lg" />
              )}
            </>
          )}

          {/* Fill remaining slot if only 1 side banner */}
          {rightBanners.length === 1 && (
            <div className="h-1/2 bg-gray-200 rounded-lg" />
          )}
        </div>
      </div>
    </section>
  );
}
