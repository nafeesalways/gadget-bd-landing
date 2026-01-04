"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function Banner() {
  // State for carousel
  const [currentSlide, setCurrentSlide] = useState(0);

  // Main carousel images (left side - 3 images)
  const carouselImages = [
    {
      src: "/images/banner-1.webp",
      alt: "iPhone 16 Series - Apple Intelligence",
    },
    {
      src: "/images/banner-2.webp",
      alt: "CMF Watch Pro 2 - Experience the Future",
    },
    {
      src: "/images/banner-3.webp",
      alt: "Galaxy S25 Ultra - Galaxy AI",
    },
  ];

  // Side banners (right side - 2 images)
  const sideBanners = [
    {
      src: "/images/banner-4.webp",
      alt: "Soundcore Liberty 4 Pro - Unleash Pure Sound",
    },
    {
      src: "/images/banner-5.webp",
      alt: "Mac mini - Looks small. Lives large.",
    },
  ];

  // Auto-slide effect - changes slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  // Handle previous slide
  const handlePrevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? carouselImages.length - 1 : prev - 1
    );
  };

  // Handle next slide
  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-125">
        {/* Left Side - Main Carousel (2/3 width) */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-lg bg-gray-900 group">
          {/* Carousel Images */}
          <div
            className="flex transition-transform duration-500 ease-in-out h-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {carouselImages.map((image, index) => (
              <div key={index} className="min-w-full h-full relative">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>

          {/* Previous Button */}
          <button
            onClick={handlePrevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Previous slide"
          >
            <FiChevronLeft size={24} />
          </button>

          {/* Next Button */}
          <button
            onClick={handleNextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Next slide"
          >
            <FiChevronRight size={24} />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {carouselImages.map((_, index) => (
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
        </div>

        {/* Right Side - Static Banners (1/3 width) */}
        <div className="flex flex-col gap-4 h-full">
          {/* Top Banner */}
          <div className="relative h-1/2 overflow-hidden rounded-lg bg-gray-900 group cursor-pointer">
            <Image
              src={sideBanners[0].src}
              alt={sideBanners[0].alt}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Bottom Banner */}
          <div className="relative h-1/2 overflow-hidden rounded-lg bg-gray-900 group cursor-pointer">
            <Image
              src={sideBanners[1].src}
              alt={sideBanners[1].alt}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
