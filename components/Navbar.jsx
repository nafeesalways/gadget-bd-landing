'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { useCart } from '../context/CartContext';


export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Get cart count from CartContext
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  // Navigation menu items
  const menuItems = [
    { name: 'Phones', href: '/phones' },
    { name: 'Watches', href: '/watches' },
    { name: 'Power Bank', href: '/power-bank' },
    { name: 'Speaker & Headphone', href: '/speaker-headphone' },
    { name: 'Charger & Adapter', href: '/charger-adapter' },
    { name: 'Earbuds', href: '/earbuds' },
    { name: 'Gaming', href: '/gaming' },
    { name: 'Camera', href: '/camera' },
  ];

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="w-full bg-black sticky top-0 z-50">
      {/* Top section with logo, search, and user actions */}
      <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between gap-2 md:gap-6">
          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden text-white p-2 hover:text-orange-500 transition"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>

          {/* Logo */}
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

          {/* Search Bar - Hidden on mobile, shown on tablet and up */}
          <div className="hidden md:flex flex-1 max-w-2xl">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search product"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 rounded-full bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500 hover:text-orange-600">
                <FiSearch size={22} />
              </button>
            </div>
          </div>

          {/* Cart and Account */}
          <div className="flex items-center gap-3 md:gap-6">
            {/* Search Icon for Mobile */}
            <button className="md:hidden text-white hover:text-orange-500 transition">
              <FiSearch size={22} />
            </button>

            {/* Cart - Compact on mobile - Updated with dynamic cart count */}
            <Link 
              href="/checkout" 
              className="flex items-center gap-2 text-white hover:text-orange-500 transition"
            >
              <div className="relative">
                <FiShoppingCart size={20} className="md:hidden" />
                <FiShoppingCart size={24} className="hidden md:block" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 md:h-5 md:w-5 flex items-center justify-center font-medium">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden lg:flex flex-col items-start">
                <span className="text-sm font-medium">Cart({cartCount})</span>
                <span className="text-xs text-gray-400">Add items</span>
              </div>
            </Link>

            {/* Account - Icon only on mobile */}
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

        {/* Mobile Search Bar */}
        <div className="md:hidden mt-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search product"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-full bg-white text-gray-800 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500 hover:text-orange-600">
              <FiSearch size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Category Menu */}
      <div className="hidden lg:block bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center justify-center gap-8 py-3">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="text-white text-sm font-medium hover:text-orange-500 transition"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Slide Menu */}
      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-gray-900 z-50 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-white font-bold text-lg">Menu</h2>
          <button
            onClick={closeMobileMenu}
            className="text-white hover:text-orange-500 transition"
            aria-label="Close menu"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Mobile Menu Items */}
        <ul className="py-4">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                onClick={closeMobileMenu}
                className="block px-6 py-3 text-white hover:bg-gray-800 hover:text-orange-500 transition"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
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
