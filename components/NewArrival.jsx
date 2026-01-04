'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function NewArrival() {
  // Product data for new arrivals
  const products = [
    {
      id: 1,
      name: 'Huawei Band 9',
      image: '/images/img21.webp',
      currentPrice: 4400,
      originalPrice: 8000,
      slug: 'huawei-band-9',
    },
    {
      id: 2,
      name: 'iPhone 16 Plus 128GB',
      image: '/images/img22.webp',
      currentPrice: 139500,
      originalPrice: 150000,
      slug: 'iphone-16-plus-128gb',
    },
    {
      id: 3,
      name: 'Apple Watch Series 9',
      image: '/images/img23.webp',
      currentPrice: 46790,
      originalPrice: 51150,
      slug: 'apple-watch-series-9',
    },
    {
      id: 4,
      name: 'iPhone 16 Plus 128GB',
      image: '/images/img24.webp',
      currentPrice: 167999,
      originalPrice: 184999,
      slug: 'iphone-16-plus-128gb-pink',
    },
    {
      id: 5,
      name: 'Samsung Watches',
      image: '/images/img25.webp',
      currentPrice: 35000,
      originalPrice: 50000,
      slug: 'samsung-watches',
    },
    {
      id: 6,
      name: 'iphone 16 pro Max 256GB',
      image: '/images/img26.webp',
      currentPrice: 170000,
      originalPrice: 180000,
      slug: 'iphone-16-pro-max-256gb',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      {/* Section Header */}
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">New Arraival</h2>
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
                <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-[10px] md:text-xs font-medium py-1.5 md:py-2 px-1 md:px-2 rounded transition-colors duration-300">
                  Buy Now
                </button>
                <button className="flex-1 bg-white hover:bg-gray-50 text-orange-500 border border-orange-500 text-[10px] md:text-xs font-medium py-1.5 md:py-2 px-1 md:px-2 rounded transition-colors duration-300">
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
