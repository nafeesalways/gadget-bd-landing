'use client';

import Image from 'next/image';
import Link from 'next/link';

import { FiTrash2, FiMinus, FiPlus, FiShoppingCart } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      toast.error('Quantity must be at least 1');
      return;
    }
    updateQuantity(productId, newQuantity);
  };

  const handleRemove = (productId, productName) => {
    removeFromCart(productId);
    toast.success(`${productName} removed from cart`);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <FiShoppingCart className="mx-auto text-gray-300 mb-4" size={80} />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some products to get started</p>
          <Link
            href="/"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-500 mt-1">{cart.length} items in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg p-4 md:p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex gap-4">
                  <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={item.imageURLs?.[0] || '/placeholder.jpg'}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link href={`/product-details/${item.path}`}>
                      <h3 className="font-medium text-gray-900 hover:text-orange-600 transition line-clamp-2 mb-1">
                        {item.name}
                      </h3>
                    </Link>

                    {item.selectedVariant && (
                      <p className="text-sm text-gray-500">
                        Variant: {JSON.stringify(item.selectedVariant)}
                      </p>
                    )}

                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100 transition"
                        >
                          <FiMinus size={16} />
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value) || 1)}
                          className="w-12 text-center border-x border-gray-300 py-1 focus:outline-none"
                          min="1"
                        />
                        <button
                          onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100 transition"
                        >
                          <FiPlus size={16} />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemove(item._id, item.name)}
                        className="text-red-500 hover:text-red-600 mt-2 transition flex items-center gap-1"
                      >
                        <FiTrash2 size={18} />
                        <span className="text-sm hidden sm:inline">Remove</span>
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg md:text-xl font-bold text-orange-600">
                      ৳{(item.salePrice * item.quantity).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      ৳{item.salePrice.toLocaleString()} each
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={() => {
                if (confirm('Are you sure you want to clear your cart?')) {
                  clearCart();
                  toast.success('Cart cleared');
                }
              }}
              className="text-red-500 hover:text-red-600 text-sm font-medium"
            >
              Clear Cart
            </button>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>৳{getCartTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-orange-600">৳{getCartTotal().toLocaleString()}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full bg-orange-500 hover:bg-orange-600 text-white text-center py-3 rounded-lg font-medium transition mb-3"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/"
                className="block w-full bg-white hover:bg-gray-50 text-orange-500 border border-orange-500 text-center py-3 rounded-lg font-medium transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
