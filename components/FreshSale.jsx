'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useRef, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

import ProductModal from './ProductModal';
import { useCart } from '@/app/context/CartContext';

export default function FlashSale() {
  const scrollContainerRef = useRef(null);
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
        
        const flashProducts = allProducts
          .filter(product => product.discount > 0)
          .sort((a, b) => b.discount - a.discount)
          .slice(0, 12);
        
        setProducts(flashProducts);
      } catch (error) {
        console.error('Error fetching flash sale products:', error);
        toast.error('Failed to load flash sale products');
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

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.offsetWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.offsetWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Flash Sale</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="h-48 md:h-56 bg-gray-200 animate-pulse"></div>
              <div className="p-3 md:p-4 space-y-2">
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
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Flash Sale</h2>
          <p className="text-gray-500 mt-2">Limited time offers on selected products</p>
        </div>

        <div className="relative group">
          <button
            onClick={scrollLeft}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white shadow-lg hover:bg-gray-50 text-gray-800 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Scroll left"
          >
            <FiChevronLeft size={24} />
          </button>

          <button
            onClick={scrollRight}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white shadow-lg hover:bg-gray-50 text-gray-800 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Scroll right"
          >
            <FiChevronRight size={24} />
          </button>

          <div
            ref={scrollContainerRef}
            className="grid grid-flow-col auto-cols-[85%] sm:auto-cols-[45%] md:auto-cols-[calc(33.333%-12px)] lg:auto-cols-[calc(25%-12px)] xl:auto-cols-[calc(20%-13px)] gap-3 md:gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 snap-x snap-mandatory"
          >
            {products.map((product) => {
              const discountPercent = product.discount || 0;
              
              return (
                <div
                  key={product._id}
                  className="snap-start bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <Link href={`/product-details/${product.path}`}>
                    <div className="relative h-48 sm:h-52 md:h-56 lg:h-64 bg-gray-50 flex items-center justify-center p-3 md:p-4">
                      {discountPercent > 0 && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
                          -{discountPercent}%
                        </span>
                      )}
                      <Image
                        src={product.imageURLs?.[0] || '/placeholder.jpg'}
                        alt={product.name}
                        width={200}
                        height={200}
                        className="object-contain w-full h-full hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>

                  <div className="p-3 md:p-4">
                    <Link href={`/product-details/${product.path}`}>
                      <h3 className="text-xs md:text-sm font-medium text-gray-800 mb-2 md:mb-3 h-8 md:h-10 line-clamp-2 hover:text-orange-500 transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-1 md:gap-2 mb-3 md:mb-4">
                      <span className="text-sm md:text-lg font-bold text-gray-900">
                        ৳{product.salePrice?.toLocaleString()}
                      </span>
                      {product.productPrice > product.salePrice && (
                        <span className="text-xs md:text-sm text-gray-500 line-through">
                          ৳{product.productPrice?.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-1.5 md:gap-2">
                      <button
                        onClick={() => handleBuyNow(product)}
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-[10px] md:text-sm font-medium py-1.5 md:py-2 px-2 md:px-4 rounded transition-colors duration-300"
                      >
                        Buy Now
                      </button>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 bg-white hover:bg-gray-50 text-orange-500 border border-orange-500 text-[10px] md:text-sm font-medium py-1.5 md:py-2 px-2 md:px-4 rounded transition-colors duration-300"
                      >
                        Add to cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
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
