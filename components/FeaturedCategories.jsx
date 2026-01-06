'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function FeaturedCategories({ categories = [] }) {
  const categoriesArray = Array.isArray(categories) ? categories : [];

  if (categoriesArray.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            FEATURED CATEGORIES
          </h2>
          <p className="text-gray-600 text-sm">
            Get your desired product from featured category
          </p>
        </div>
        <div className="bg-white rounded-lg p-8 text-center">
          <p className="text-gray-500">Loading categories...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          FEATURED CATEGORIES
        </h2>
        <p className="text-gray-600 text-sm">
          Get your desired product from featured category
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {categoriesArray.map((category) => (
          <Link
            key={category._id}
            href={`/categories/${category.path}`}
            className="group"
          >
            <div className="flex flex-col items-center justify-center bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-orange-500 transition-all duration-300 cursor-pointer h-full min-h-[160px]">
              <div className="relative w-16 h-16 mb-3 group-hover:scale-110 transition-transform duration-300">
                <Image
                  src={category.imageURLs}
                  alt={category.parentCategory}
                  fill
                  sizes="64px"
                  className="object-contain"
                />
              </div>

              <h3 className="text-sm font-medium text-gray-800 text-center group-hover:text-orange-500 transition-colors duration-300">
                {category.parentCategory}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
