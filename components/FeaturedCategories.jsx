'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function FeaturedCategories() {
  // Category data with icons and routes
  const categories = [
    {
      name: 'Phones',
      icon: '/images/img1.webp',
      href: '/phones',
    },
    {
      name: 'Watches',
      icon:'/images/img1.webp',
      href: '/watches',
    },
    {
      name: 'Power Bank',
      icon: '/images/img2.webp',
      href: '/power-bank',
    },
    {
      name: 'Speaker & Headphone',
      icon: '/images/img3.webp',
      href: '/speaker-headphone',
    },
    {
      name: 'Charger & Adapter',
      icon: '/images/img4.webp',
      href: '/charger-adapter',
    },
    {
      name: 'Earbuds',
      icon:'/images/img5.webp',
      href: '/earbuds',
    },
    {
      name: 'Gaming',
      icon:'/images/img6.webp',
      href: '/gaming',
    },
    {
      name: 'Camera',
      icon:'/images/img7.webp',
      href: '/camera',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      {/* Section Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          FEATURED CATEGORIES
        </h2>
        <p className="text-gray-600 text-sm">
          Get your desired product from featured category
        </p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={category.href}
            className="group"
          >
            {/* Category Card */}
            <div className="flex flex-col items-center justify-center bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-orange-500 transition-all duration-300 cursor-pointer h-full">
              {/* Icon Container */}
              <div className="relative w-16 h-16 mb-3 group-hover:scale-110 transition-transform duration-300">
                <Image
                  src={category.icon}
                  alt={category.name}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Category Name */}
              <h3 className="text-sm font-medium text-gray-800 text-center group-hover:text-orange-500 transition-colors duration-300">
                {category.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
