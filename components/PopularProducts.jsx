'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function PopularProducts() {
  // Product data for popular products
  const products = [
    {
      id: 1,
      name: 'Huawei Band 9',
      image: '/images/img15.webp',
      currentPrice: 4400,
      originalPrice: 8000,
      slug: 'huawei-band-9',
    },
    {
      id: 2,
      name: 'iphone 16 pro Max 256GB',
      image: '/images/img16.webp',
      currentPrice: 149000,
      originalPrice: 170000,
      slug: 'iphone-16-pro-max-256gb',
    },
    {
      id: 3,
      name: 'iPhone 16 Plus 128GB',
      image: '/images/img17.webp',
      currentPrice: 139500,
      originalPrice: 150000,
      slug: 'iphone-16-plus-128gb',
    },
    {
      id: 4,
      name: 'iphone 16 pro Max 256GB',
      image:'/images/img18.webp',
      currentPrice: 170000,
      originalPrice: 180000,
      slug: 'iphone-16-pro-max-256gb-gold',
    },
    {
      id: 5,
      name: 'Apple AirPods 4',
      image:'/images/img19.webp',
      currentPrice: 20499,
      originalPrice: 21499,
      slug: 'apple-airpods-4',
    },
    {
      id: 6,
      name: 'Xbox Wireless Controller 1914',
      image:'/images/img20.webp',
      currentPrice: 7900,
      originalPrice: 9050,
      slug: 'xbox-wireless-controller-1914',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Popular products</h2>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            {/* Product Image */}
            <Link href={`/product/${product.slug}`}>
              <div className="relative h-48 bg-gray-50 flex items-center justify-center p-4">
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
            <div className="p-4">
              {/* Product Name */}
              <Link href={`/product/${product.slug}`}>
                <h3 className="text-sm font-medium text-gray-800 mb-3 h-10 line-clamp-2 hover:text-orange-500 transition-colors">
                  {product.name}
                </h3>
              </Link>

              {/* Price Section */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-base font-bold text-gray-900">
                  ৳ {product.currentPrice.toLocaleString()}
                </span>
                <span className="text-xs text-gray-500 line-through">
                  ৳ {product.originalPrice.toLocaleString()}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium py-2 px-2 rounded transition-colors duration-300">
                  Buy Now
                </button>
                <button className="flex-1 bg-white hover:bg-gray-50 text-orange-500 border border-orange-500 text-xs font-medium py-2 px-2 rounded transition-colors duration-300">
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
