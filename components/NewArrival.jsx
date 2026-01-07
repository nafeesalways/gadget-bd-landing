'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

import ProductModal from './ProductModal';
import { useCart } from '@/app/context/CartContext';

export default function NewArrival() {
  const router = useRouter();
  const { addToCart } = useCart();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
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
        const allProducts = result?.data?.data || [];
        
        const newProducts = allProducts
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 6);
        
        setProducts(newProducts);
      } catch (error) {
        console.error('Error fetching new arrival products:', error);
        toast.error('Failed to load new arrivals');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const handleBuyNow = (product) => {
    if (product.variantType && product.variant && product.variant.length > 0) {
      setSelectedProduct(product);
      setIsModalOpen(true);
    } else {
      addToCart(product);
      toast.success('Product added to cart!');
      router.push('/cart');
    }
  };

  const handleAddToCart = (product) => {
    if (product.variantType && product.variant && product.variant.length > 0) {
      setSelectedProduct(product);
      setIsModalOpen(true);
    } else {
      addToCart(product);
      toast.success('Product added to cart!');
    }
  };

  const handleAddToCartFromModal = (productWithVariant) => {
    addToCart(productWithVariant);
    toast.success('Product added to cart!');
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">New Arrival</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="h-32 sm:h-40 md:h-48 bg-gray-200 animate-pulse"></div>
              <div className="p-2 md:p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                <div className="flex gap-2">
                  <div className="h-8 bg-gray-200 rounded flex-1 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded flex-1 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <>
      <section className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">New Arrival</h2>
          <p className="text-gray-500 mt-2">Check out our latest products</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {products.map((product) => {
            const isNew = new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            
            return (
              <div
                key={product._id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <Link href={`/product-details/${product.path}`}>
                  <div className="relative h-32 sm:h-40 md:h-48 bg-gray-50 flex items-center justify-center p-2 md:p-4">
                    {isNew && (
                      <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
                        NEW
                      </span>
                    )}
                    <Image
                      src={product.imageURLs?.[0] || '/placeholder.jpg'}
                      alt={product.name}
                      width={150}
                      height={150}
                      className="object-contain w-full h-full hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>

                <div className="p-2 md:p-4">
                  <Link href={`/product-details/${product.path}`}>
                    <h3 className="text-xs md:text-sm font-medium text-gray-800 mb-2 md:mb-3 h-8 md:h-10 line-clamp-2 hover:text-orange-500 transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-1 md:gap-2 mb-2 md:mb-4">
                    <span className="text-sm md:text-base font-bold text-gray-900">
                      ৳{product.salePrice?.toLocaleString()}
                    </span>
                    {product.productPrice > product.salePrice && (
                      <span className="text-[10px] md:text-xs text-gray-500 line-through">
                        ৳{product.productPrice?.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-1 md:gap-2">
                    <button
                      onClick={() => handleBuyNow(product)}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-[10px] md:text-xs font-medium py-1.5 md:py-2 px-1 md:px-2 rounded transition-colors duration-300"
                    >
                      Buy Now
                    </button>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 bg-white hover:bg-gray-50 text-orange-500 border border-orange-500 text-[10px] md:text-xs font-medium py-1.5 md:py-2 px-1 md:px-2 rounded transition-colors duration-300"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={closeModal}
          onAddToCart={handleAddToCartFromModal}
        />
      )}
    </>
  );
}
