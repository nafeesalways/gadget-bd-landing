'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FiSearch, FiShoppingCart, FiUser } from 'react-icons/fi';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);

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

  return (
    <nav className="w-full bg-black">
      {/* Top section with logo, search, and user actions */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/images/logo.webp"
              alt="Gadget BD Logo"
              width={180}
              height={60}
              className="h-12 w-auto"
            />
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
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
          <div className="flex items-center gap-6">
            {/* Cart */}
            <Link href="/cart" className="flex items-center gap-2 text-white hover:text-orange-500 transition">
              <div className="relative">
                <FiShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">Cart({cartCount})</span>
                <span className="text-xs text-gray-400">Add items</span>
              </div>
            </Link>

            {/* Account */}
            <Link href="/account" className="flex items-center gap-2 text-white hover:text-orange-500 transition">
              <FiUser size={24} />
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">Account</span>
                <span className="text-xs text-gray-400">Register or Login</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom section with category menu */}
      <div className="bg-gray-900 border-t border-gray-800">
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
    </nav>
  );
}
