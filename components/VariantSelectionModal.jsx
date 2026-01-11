'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FiX, FiMinus, FiPlus, FiShoppingCart, FiCheck } from 'react-icons/fi';

export default function VariantSelectionModal({ 
  product, 
  isOpen, 
  onClose, 
  onAddToCart,
  actionType = 'addToCart' // 'addToCart' or 'buyNow'
}) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const hasVariants = product?.variant && product.variant.length > 0;
  const currentVariant = hasVariants ? product.variant[selectedVariantIndex] : null;
  
  // Get current prices and stock
  const currentPrice = currentVariant?.salePrice || product?.salePrice || 0;
  const currentProductPrice = currentVariant?.productPrice || product?.productPrice || 0;
  const currentStock = currentVariant?.quantity || product?.quantity || 100;
  const currentDiscount = currentVariant?.discount || product?.discount || 0;

  // Get variant image
  const getVariantImage = () => {
    if (currentVariant && currentVariant.image) {
      if (Array.isArray(currentVariant.image)) {
        return currentVariant.image[0];
      }
      return currentVariant.image;
    }
    
    if (product?.imageURLs) {
      if (Array.isArray(product.imageURLs)) {
        return product.imageURLs[0];
      }
      return product.imageURLs;
    }
    
    return '/placeholder.jpg';
  };

  const handleQuantityIncrease = () => {
    if (quantity < currentStock) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleQuantityDecrease = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleVariantSelect = (index) => {
    const variant = product.variant[index];
    if (!variant.quantity || variant.quantity === 0) return;
    
    setSelectedVariantIndex(index);
    setQuantity(1);
  };

  const handleConfirm = () => {
    const productToAdd = {
      id: product._id,
      name: product.name,
      salePrice: currentPrice,
      productPrice: currentProductPrice,
      discount: currentDiscount,
      imageURLs: getVariantImage(),
      selectedVariant: currentVariant ? {
        _id: currentVariant._id,
        image: currentVariant.image,
        salePrice: currentVariant.salePrice,
        productPrice: currentVariant.productPrice,
        quantity: currentVariant.quantity,
        discount: currentVariant.discount,
        attribute: currentVariant.attribute,
      } : null,
      variantName: currentVariant?.attribute?.[0]?.name || null,
    };

    onAddToCart(productToAdd, quantity, actionType);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-xl font-bold text-gray-900">
              {actionType === 'buyNow' ? 'Buy Now' : 'Add to Cart'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition"
              aria-label="Close"
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Product Info */}
            <div className="flex gap-4 mb-6 pb-6 border-b">
              <div className="relative w-24 h-24 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                <Image
                  src={getVariantImage()}
                  alt={product.name}
                  fill
                  className="object-contain p-2"
                />
                {currentDiscount > 0 && (
                  <span className="absolute top-1 right-1 bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                    -{currentDiscount}%
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-orange-600">
                    ৳ {currentPrice.toLocaleString()}
                  </span>
                  {currentProductPrice > currentPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      ৳ {currentProductPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Stock: <span className="font-medium text-green-600">{currentStock} available</span>
                </p>
              </div>
            </div>

            {/* Variants Selection */}
            {hasVariants && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-900">
                    Select Variant <span className="text-red-500">*</span>
                  </h4>
                  {currentVariant && (
                    <span className="text-sm text-gray-600">
                      Selected: <span className="font-medium text-orange-600">
                        {currentVariant.attribute?.map(a => a.name).join(', ')}
                      </span>
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {product.variant.map((variant, idx) => {
                    const variantName = variant.attribute?.[0]?.name || `Option ${idx + 1}`;
                    const isSelected = selectedVariantIndex === idx;
                    const isOutOfStock = !variant.quantity || variant.quantity === 0;
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => handleVariantSelect(idx)}
                        disabled={isOutOfStock}
                        className={`
                          relative p-4 border-2 rounded-lg transition-all
                          ${isSelected 
                            ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200' 
                            : 'border-gray-300 bg-white hover:border-gray-400'
                          }
                          ${isOutOfStock 
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'cursor-pointer'
                          }
                        `}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                            <FiCheck size={12} className="text-white" />
                          </div>
                        )}

                        {variant.image && (
                          <div className="relative w-full h-16 mb-2 bg-gray-50 rounded">
                            <Image
                              src={Array.isArray(variant.image) ? variant.image[0] : variant.image}
                              alt={variantName}
                              fill
                              className="object-contain p-1"
                            />
                          </div>
                        )}

                        <p className={`text-sm font-medium text-center truncate ${
                          isSelected ? 'text-orange-700' : 'text-gray-900'
                        }`}>
                          {variantName}
                        </p>

                        <p className="text-xs text-center mt-1">
                          <span className={`font-bold ${
                            isSelected ? 'text-orange-600' : 'text-gray-700'
                          }`}>
                            ৳ {variant.salePrice?.toLocaleString()}
                          </span>
                        </p>

                        {isOutOfStock && (
                          <div className="absolute inset-0 bg-black bg-opacity-60 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xs font-bold">Out of Stock</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                Quantity
              </h4>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleQuantityDecrease}
                  disabled={quantity <= 1}
                  className="w-10 h-10 border-2 border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiMinus size={16} />
                </button>

                <div className="flex-1 max-w-25">
                  <input
                    type="number"
                    min="1"
                    max={currentStock}
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      if (val >= 1 && val <= currentStock) {
                        setQuantity(val);
                      }
                    }}
                    className="w-full h-10 text-center border-2 border-gray-300 rounded-lg font-semibold text-lg focus:outline-none focus:border-orange-500"
                  />
                </div>

                <button
                  onClick={handleQuantityIncrease}
                  disabled={quantity >= currentStock}
                  className="w-10 h-10 border-2 border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiPlus size={16} />
                </button>

                <span className="text-sm text-gray-600 ml-2">
                  / {currentStock} available
                </span>
              </div>
            </div>

            {/* Total Price */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700">Price per item:</span>
                <span className="font-semibold text-gray-900">
                  ৳ {currentPrice.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700">Quantity:</span>
                <span className="font-semibold text-gray-900">× {quantity}</span>
              </div>
              <div className="border-t pt-2 flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-orange-600">
                  ৳ {(currentPrice * quantity).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={currentStock === 0}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionType === 'buyNow' ? (
                  <>Buy Now</>
                ) : (
                  <>
                    <FiShoppingCart size={20} />
                    Add to Cart
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
