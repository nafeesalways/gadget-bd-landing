'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiUser, FiMail, FiPhone, FiLogOut, FiShoppingBag, FiHeart } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    toast.success('Logged out successfully!');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiUser size={40} className="text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Gadget BD</h1>
            <p className="text-gray-600 mb-8">
              Please login or create an account to access your profile and orders.
            </p>

            <div className="space-y-4">
              <Link
                href="/login"
                className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition"
              >
                Login to Your Account
              </Link>
              <Link
                href="/register"
                className="block w-full bg-white hover:bg-gray-50 text-orange-600 border-2 border-orange-500 font-semibold py-3 rounded-lg transition"
              >
                Create New Account
              </Link>
            </div>

            <Link href="/" className="inline-block mt-6 text-gray-500 hover:text-gray-700 text-sm">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Logged in - Show profile
  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <FiUser size={32} className="text-orange-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.data?.name || 'User'}</h1>
                <p className="text-gray-600">Welcome back!</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
            >
              <FiLogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Profile Information</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b">
              <FiUser className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="text-gray-900 font-medium">{user.data?.name || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 pb-4 border-b">
              <FiMail className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="text-gray-900 font-medium">{user.data?.email || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FiPhone className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="text-gray-900 font-medium">{user.data?.phoneNumber || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/wishlist"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition">
                <FiHeart size={24} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">My Wishlist</h3>
                <p className="text-gray-600 text-sm">View saved products</p>
              </div>
            </div>
          </Link>

          <Link
            href="/cart"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition">
                <FiShoppingBag size={24} className="text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">My Cart</h3>
                <p className="text-gray-600 text-sm">View cart items</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link href="/" className="text-orange-600 hover:text-orange-700 font-medium">
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
