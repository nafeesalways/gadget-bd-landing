'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { useCart } from '@/app/context/CartContext';


export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch(
          "https://ecommerce-saas-server-wine.vercel.app/api/v1/category/website/0000125"
        );
        const result = await response.json();
        setCategories(result?.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <nav className="w-full bg-black sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between gap-2 md:gap-6">
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden text-white p-2 hover:text-orange-500 transition"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>

          <Link href="/" className="shrink-0">
            <Image
              src="/images/logo.webp"
              alt="Gadget BD Logo"
              width={140}
              height={50}
              className="h-8 md:h-12 w-auto"
              priority
            />
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search product"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 rounded-full bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button 
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500 hover:text-orange-600"
              >
                <FiSearch size={22} />
              </button>
            </div>
          </form>

          <div className="flex items-center gap-3 md:gap-6">
            <button 
              onClick={() => setSearchQuery('')}
              className="md:hidden text-white hover:text-orange-500 transition"
            >
              <FiSearch size={22} />
            </button>

            <Link 
              href="/cart" 
              className="flex items-center gap-2 text-white hover:text-orange-500 transition relative"
            >
              <div className="relative">
                <FiShoppingCart size={20} className="md:hidden" />
                <FiShoppingCart size={24} className="hidden md:block" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </div>
              <div className="hidden lg:flex flex-col items-start">
                <span className="text-sm font-medium">Cart({cartCount})</span>
                <span className="text-xs text-gray-400">Add items</span>
              </div>
            </Link>

            <Link 
              href="/account" 
              className="flex items-center gap-2 text-white hover:text-orange-500 transition"
            >
              <FiUser size={20} className="md:hidden" />
              <FiUser size={24} className="hidden md:block" />
              <div className="hidden lg:flex flex-col items-start">
                <span className="text-sm font-medium">Account</span>
                <span className="text-xs text-gray-400">Register or Login</span>
              </div>
            </Link>
          </div>
        </div>

        <form onSubmit={handleSearch} className="md:hidden mt-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search product"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-full bg-white text-gray-800 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button 
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500 hover:text-orange-600"
            >
              <FiSearch size={20} />
            </button>
          </div>
        </form>
      </div>

      <div className="hidden lg:block bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center gap-8 py-3">
              <div className="h-4 w-20 bg-gray-800 rounded animate-pulse"></div>
              <div className="h-4 w-24 bg-gray-800 rounded animate-pulse"></div>
              <div className="h-4 w-28 bg-gray-800 rounded animate-pulse"></div>
              <div className="h-4 w-20 bg-gray-800 rounded animate-pulse"></div>
            </div>
          ) : (
            <ul className="flex items-center justify-center gap-8 py-3 overflow-x-auto scrollbar-hide">
              {categories.map((category) => (
                <li key={category._id} className="shrink-0">
                  <Link
                    href={`/categories/${category.path}`}
                    className="text-white text-sm font-medium hover:text-orange-500 transition whitespace-nowrap"
                  >
                    {category.parentCategory}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMobileMenu}
        />
      )}

      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-gray-900 z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800 sticky top-0 bg-gray-900">
          <h2 className="text-white font-bold text-lg">Menu</h2>
          <button
            onClick={closeMobileMenu}
            className="text-white hover:text-orange-500 transition"
            aria-label="Close menu"
          >
            <FiX size={24} />
          </button>
        </div>

        <ul className="py-4">
          {loading ? (
            <>
              {[...Array(6)].map((_, i) => (
                <li key={i} className="px-6 py-3">
                  <div className="h-4 bg-gray-800 rounded animate-pulse"></div>
                </li>
              ))}
            </>
          ) : (
            categories.map((category) => (
              <li key={category._id}>
                <Link
                  href={`/categories/${category.path}`}
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-6 py-3 text-white hover:bg-gray-800 hover:text-orange-500 transition"
                >
                  <div className="relative w-5 h-5">
                    <Image
                      src={category.imageURLs}
                      alt={category.parentCategory}
                      fill
                      className="object-contain"
                    />
                  </div>
                  {category.parentCategory}
                </Link>
              </li>
            ))
          )}
        </ul>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800 bg-gray-900">
          <Link
            href="/account"
            onClick={closeMobileMenu}
            className="block w-full bg-orange-500 hover:bg-orange-600 text-white text-center py-3 rounded-lg font-medium transition"
          >
            Login / Register
          </Link>
        </div>
      </div>
    </nav>
  );
}
