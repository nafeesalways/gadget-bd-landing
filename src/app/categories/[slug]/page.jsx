'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiShoppingCart, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useCart } from '@/app/context/CartContext';

export default function CategoryPage({ params }) {
  const router = useRouter();
  const { addToCart } = useCart();
  
  const [slug, setSlug] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('default');
  
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Get slug from params
  useEffect(() => {
    params.then(p => {
      const decodedSlug = decodeURIComponent(p.slug);
      setSlug(decodedSlug);
    });
  }, [params]);

  // Fetch all products
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "https://ecommerce-saas-server-wine.vercel.app/api/v1/product/website",
          {
            headers: {
              "Content-Type": "application/json",
              "store-id": "0000125",
            },
          }
        );

        if (!response.ok) throw new Error('Failed to fetch products');
        
        const result = await response.json();
        const products = result?.data?.data || [];
        
        setAllProducts(products);
        
        // Get unique categories
        const uniqueCategories = [...new Set(
          products.flatMap(p => Array.isArray(p.category) ? p.category : [])
        )].filter(Boolean);
        
        setCategories(uniqueCategories);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load products');
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Filter products when slug or products change
  useEffect(() => {
    if (!slug || allProducts.length === 0) return;

    let filtered = allProducts.filter(product => {
      if (!Array.isArray(product.category)) return false;
      return product.category.some(cat => 
        cat.toLowerCase() === slug.toLowerCase()
      );
    });

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.salePrice || 0) - (b.salePrice || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.salePrice || 0) - (a.salePrice || 0));
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }

    setCategoryProducts(filtered);
    setCurrentPage(1);
  }, [slug, allProducts, sortBy]);

  const handleBuyNow = (product) => {
    addToCart(product);
    toast.success('Product added to cart!');
    router.push('/cart');
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success('Product added to cart!');
  };

  const createSlug = (categoryName) => {
    return encodeURIComponent(categoryName);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = categoryProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(categoryProducts.length / productsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // Only show loading when data is being fetched
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Skeleton */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-24 mb-6"></div>
                <div className="space-y-3">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-100 rounded"></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content Skeleton */}
            <div className="lg:col-span-3">
              <div className="flex justify-between items-center mb-6">
                <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
                    <div className="bg-gray-200 h-48 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Category</h2>

              <div className="space-y-2">
                {categories.map((category) => {
                  const count = allProducts.filter(p => 
                    Array.isArray(p.category) && p.category.some(cat => 
                      cat.toLowerCase() === category.toLowerCase()
                    )
                  ).length;

                  const isActive = category.toLowerCase() === slug?.toLowerCase();

                  return (
                    <Link
                      key={category}
                      href={`/categories/${createSlug(category)}`}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition ${
                        isActive
                          ? 'bg-orange-50 text-orange-600 border-2 border-orange-200'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded flex items-center justify-center text-sm font-bold ${
                          isActive ? 'bg-orange-500 text-white' : 'bg-gray-300 text-gray-600'
                        }`}>
                          {category.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-sm">
                          {category}
                        </span>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        isActive ? 'bg-orange-600 text-white' : 'bg-gray-900 text-white'
                      }`}>
                        {count}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {slug || 'Loading...'}
                </h1>
                <p className="text-gray-500 mt-1">
                  {categoryProducts.length} product{categoryProducts.length !== 1 ? 's' : ''} found
                </p>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-sm"
              >
                <option value="default">Sort by</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            {/* Products Grid or Empty State */}
            {categoryProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-16 text-center">
                <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found in this category</h3>
                <p className="text-gray-500">Try browsing other categories</p>
              </div>
            ) : (
              <>
                {/* Products Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {currentProducts.map((product) => (
                    <div
                      key={product._id}
                      className="bg-white rounded-lg shadow overflow-hidden hover:shadow-xl transition-shadow duration-300"
                    >
                      <Link href={`/product-details/${product.path}`}>
                        <div className="relative h-48 md:h-64 bg-gray-50 p-4">
                          {product.discount > 0 && (
                            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
                              -{product.discount}%
                            </span>
                          )}
                          <Image
                            src={product.imageURLs?.[0] || '/placeholder.jpg'}
                            alt={product.name}
                            fill
                            className="object-contain hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </Link>

                      <div className="p-3 md:p-4">
                        <Link href={`/product-details/${product.path}`}>
                          <h3 className="text-sm md:text-base font-medium text-gray-900 line-clamp-2 h-10 md:h-12 mb-3 hover:text-orange-600 transition-colors">
                            {product.name}
                          </h3>
                        </Link>

                        <div className="flex items-baseline gap-2 mb-4">
                          <span className="text-lg md:text-xl font-bold text-orange-600">
                            ৳{product.salePrice?.toLocaleString()}
                          </span>
                          {product.productPrice > product.salePrice && (
                            <span className="text-xs md:text-sm text-gray-400 line-through">
                              ৳{product.productPrice?.toLocaleString()}
                            </span>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleBuyNow(product)}
                            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-xs md:text-sm font-medium py-2.5 px-3 rounded transition-colors"
                          >
                            Buy Now
                          </button>
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="bg-white hover:bg-orange-50 text-orange-500 border-2 border-orange-500 p-2.5 rounded transition-colors"
                            title="Add to cart"
                          >
                            <FiShoppingCart size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-10 space-y-6">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2.5 rounded-lg border-2 border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        aria-label="Previous page"
                      >
                        <FiChevronLeft size={20} />
                      </button>

                      {getPageNumbers().map((page, index) => (
                        <button
                          key={index}
                          onClick={() => typeof page === 'number' && paginate(page)}
                          disabled={page === '...'}
                          className={`min-w-10 h-10 rounded-lg font-semibold transition ${
                            page === currentPage
                              ? 'bg-orange-500 text-white shadow-md'
                              : page === '...'
                              ? 'cursor-default text-gray-400'
                              : 'border-2 border-gray-300 hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2.5 rounded-lg border-2 border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        aria-label="Next page"
                      >
                        <FiChevronRight size={20} />
                      </button>
                    </div>

                    <p className="text-center text-sm text-gray-500">
                      Showing <span className="font-semibold text-gray-700">{indexOfFirstProduct + 1}</span> - <span className="font-semibold text-gray-700">{Math.min(indexOfLastProduct, categoryProducts.length)}</span> of <span className="font-semibold text-gray-700">{categoryProducts.length}</span> products
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
