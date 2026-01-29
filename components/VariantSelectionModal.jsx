'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FiX, FiMinus, FiPlus, FiShoppingCart, FiCheck } from 'react-icons/fi';

export default function VariantSelectionModal({ 
  product, 
  isOpen, 
  onClose, 
  onAddToCart,
  actionType = 'addToCart'
}) {
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0); 

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen && product) {
      // Auto-select first available variant
      const productVariants = product?.variant || product?.variants || [];
      if (productVariants && productVariants.length > 0) {
        const firstVariant = productVariants.find(v => v.quantity > 0);
        
        if (firstVariant) {
          // eslint-disable-next-line react-hooks/immutability
          const normalizedAttrs = normalizeAttributes(firstVariant);
          const initialAttributes = {};
          
          normalizedAttrs.forEach((attr) => {
            if (attr.type && attr.value) {
              initialAttributes[attr.type] = attr.value;
            }
          });
          
          setSelectedAttributes(initialAttributes);
        }
      }
      
      setQuantity(1);
      setSelectedImage(0);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  // Helper: Normalize attributes
  const normalizeAttributes = (variant) => {
    const attrs = variant?.attributes || variant?.attribute;
    
    if (Array.isArray(attrs)) {
      return attrs.map(attr => ({
        type: attr?.type || attr?.name || attr?.key || '',
        value: attr?.value || attr?.option || ''
      }));
    }
    
    if (attrs && typeof attrs === 'object') {
      return Object.entries(attrs).map(([key, value]) => ({
        type: key,
        value: String(value)
      }));
    }
    
    return [];
  };

  const getVariants = () => {
    return product?.variant || product?.variants || [];
  };

  // 🔧 NEW: Get thumbnails (same as ProductDetailsPage)
  const getThumbnails = () => {
    const thumbnails = [];
    const seen = new Set();
    
    if (product?.imageURLs) {
      const mainImages = Array.isArray(product.imageURLs) ? product.imageURLs : [product.imageURLs];
      mainImages.forEach((img) => {
        if (!seen.has(img)) {
          thumbnails.push(img);
          seen.add(img);
        }
      });
    }

    const variants = getVariants();
    variants.forEach((variant) => {
      if (variant.image) {
        const variantImg = Array.isArray(variant.image) ? variant.image[0] : variant.image;
        if (!seen.has(variantImg)) {
          thumbnails.push(variantImg);
          seen.add(variantImg);
        }
      }
    });

    return thumbnails;
  };

  const groupAttributes = (variants) => {
    if (!variants || variants.length === 0) {
      return [];
    }

    const groups = {};
    
    variants.forEach((variant) => {
      const normalizedAttrs = normalizeAttributes(variant);
      
      normalizedAttrs.forEach((attr) => {
        const { type, value } = attr;
        
        if (type && value) {
          if (!groups[type]) groups[type] = [];
          if (!groups[type].includes(value)) {
            groups[type].push(value);
          }
        }
      });
    });

    return Object.entries(groups).map(([type, options]) => ({
      type,
      options: options.sort(),
    }));
  };

  const findMatchingVariant = () => {
    const variants = getVariants();
    if (!variants || variants.length === 0) return null;

    const selectedKeys = Object.keys(selectedAttributes);
    if (selectedKeys.length === 0) return null;

    const match = variants.find((variant) => {
      const normalizedAttrs = normalizeAttributes(variant);
      
      return selectedKeys.every((selectedType) => {
        const selectedValue = selectedAttributes[selectedType];
        
        return normalizedAttrs.some((attr) => 
          attr.type === selectedType && attr.value === selectedValue
        );
      });
    });

    return match;
  };

  // 🔧 UPDATED: Handle attribute selection + image update
  const handleAttributeSelect = (type, value) => {
    const newSelectedAttributes = {
      ...selectedAttributes,
      [type]: value,
    };
    
    setSelectedAttributes(newSelectedAttributes);
    setQuantity(1);

    // Find matching variant and update image
    const variants = getVariants();
    const matchedVariant = variants.find((variant) => {
      const normalizedAttrs = normalizeAttributes(variant);
      
      return Object.entries(newSelectedAttributes).every(([attrType, attrValue]) => {
        return normalizedAttrs.some((attr) => 
          attr.type === attrType && attr.value === attrValue
        );
      });
    });

    if (matchedVariant && matchedVariant.image) {
      const variantImage = Array.isArray(matchedVariant.image) 
        ? matchedVariant.image[0] 
        : matchedVariant.image;
      
      const thumbnails = getThumbnails();
      const imageIndex = thumbnails.indexOf(variantImage);
      
      if (imageIndex !== -1) {
        setSelectedImage(imageIndex);
      }
    }
  };

  // 🔧 NEW: Handle thumbnail click
  const handleThumbnailClick = (index) => {
    setSelectedImage(index);
    
    const thumbnails = getThumbnails();
    const clickedImageUrl = thumbnails[index];
    
    const variants = getVariants();
    const matchingVariant = variants.find((variant) => {
      if (!variant.image) return false;
      
      const variantImg = Array.isArray(variant.image) 
        ? variant.image[0] 
        : variant.image;
      
      return variantImg === clickedImageUrl;
    });
    
    if (matchingVariant) {
      const normalizedAttrs = normalizeAttributes(matchingVariant);
      const newSelectedAttributes = {};
      
      normalizedAttrs.forEach((attr) => {
        if (attr.type && attr.value) {
          newSelectedAttributes[attr.type] = attr.value;
        }
      });
      
      setSelectedAttributes(newSelectedAttributes);
      setQuantity(1);
    }
  };

  const variants = getVariants();
  const hasVariants = variants && variants.length > 0;
  const attributeGroups = hasVariants ? groupAttributes(variants) : [];
  const currentVariant = findMatchingVariant();
  const thumbnails = getThumbnails();

  const currentPrice = currentVariant?.salePrice || product?.salePrice || 0;
  const currentProductPrice = currentVariant?.productPrice || product?.productPrice || 0;
  const currentStock = currentVariant?.quantity || product?.quantity || 100;
  const currentDiscount = currentVariant?.discount || product?.discount || 0;

  //UPDATED: Get current display image
  const getCurrentDisplayImage = () => {
    if (currentVariant && currentVariant.image) {
      const variantImg = Array.isArray(currentVariant.image) 
        ? currentVariant.image[0] 
        : currentVariant.image;
      return variantImg;
    }
    
    if (thumbnails.length > 0) {
      return thumbnails[selectedImage] || thumbnails[0];
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

  const handleConfirm = () => {
    if (hasVariants && attributeGroups.length > 0) {
      const allSelected = attributeGroups.every(group => 
        selectedAttributes[group.type]
      );
      
      if (!allSelected) {
        alert('Please select all variant options');
        return;
      }

      if (!currentVariant) {
        alert('Selected variant is not available');
        return;
      }
    }

    const productToAdd = {
      id: product._id,
      name: product.name,
      salePrice: currentPrice,
      productPrice: currentProductPrice,
      discount: currentDiscount,
      imageURLs: getCurrentDisplayImage(),
      selectedVariant: currentVariant ? {
        _id: currentVariant._id,
        image: currentVariant.image,
        salePrice: currentVariant.salePrice,
        productPrice: currentVariant.productPrice,
        quantity: currentVariant.quantity,
        discount: currentVariant.discount,
        attributes: normalizeAttributes(currentVariant),
      } : null,
      variantName: currentVariant ? 
        normalizeAttributes(currentVariant).map(a => a.value).join(' - ') : 
        null,
    };

    onAddToCart(productToAdd, quantity, actionType);
    onClose();
  };

  const isConfirmDisabled = () => {
    if (currentStock === 0) return true;
    
    if (hasVariants && attributeGroups.length > 0) {
      const allSelected = attributeGroups.every(group => 
        selectedAttributes[group.type]
      );
      return !allSelected || !currentVariant;
    }
    
    return false;
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto pointer-events-auto"
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

          <div className="p-6">
            {/* 🔧 NEW: Image Gallery Section */}
            <div className="mb-6">
              {/* Main Image */}
              <div className="relative w-full h-64 bg-gray-50 rounded-lg mb-3 overflow-hidden">
                <Image
                  src={getCurrentDisplayImage()}
                  alt={product.name}
                  fill
                  className="object-contain p-4"
                />
                {currentDiscount > 0 && (
                  <span className="absolute top-3 right-3 bg-red-500 text-white text-sm font-bold px-2.5 py-1 rounded">
                    {currentDiscount}% OFF
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {thumbnails.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {thumbnails.map((thumb, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleThumbnailClick(idx)}
                      className={`relative w-16 h-16 shrink-0 bg-gray-50 rounded-lg border-2 overflow-hidden transition-all ${
                        selectedImage === idx
                          ? "border-orange-500 ring-2 ring-orange-200"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Image
                        src={thumb}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        className="object-contain p-1"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="mb-6 pb-6 border-b">
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                {product.name}
              </h3>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-2xl font-bold text-orange-600">
                  TK {currentPrice.toLocaleString()}
                </span>
                {currentProductPrice > currentPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    TK {currentProductPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">
                Stock: <span className={`font-medium ${currentStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {currentStock > 0 ? `${currentStock} available` : 'Out of stock'}
                </span>
              </p>
            </div>

            {/* Attribute Selection */}
            {hasVariants && attributeGroups.length > 0 && (
              <div className="mb-6 space-y-5">
                {attributeGroups.map((group) => (
                  <div key={group.type}>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      {group.type} <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {group.options.map((option) => {
                        const isSelected = selectedAttributes[group.type] === option;
                        
                        const tempAttrs = { ...selectedAttributes, [group.type]: option };
                        const variant = variants.find((v) => {
                          const normalizedAttrs = normalizeAttributes(v);
                          return Object.entries(tempAttrs).every(([type, value]) =>
                            normalizedAttrs.some((attr) => 
                              attr.type === type && attr.value === value
                            )
                          );
                        });
                        const isAvailable = variant && variant.quantity > 0;

                        return (
                          <button
                            key={option}
                            onClick={() => isAvailable && handleAttributeSelect(group.type, option)}
                            disabled={!isAvailable}
                            className={`px-4 py-2.5 rounded-md border-2 font-medium text-sm transition-all ${
                              isSelected
                                ? "border-orange-500 bg-orange-50 text-orange-700 ring-2 ring-orange-200"
                                : isAvailable
                                ? "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                                : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed line-through"
                            }`}
                          >
                            {option}
                            {isSelected && (
                              <FiCheck size={14} className="inline ml-1.5" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
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
            <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700">Price per item:</span>
                <span className="font-semibold text-gray-900">
                  TK {currentPrice.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700">Quantity:</span>
                <span className="font-semibold text-gray-900">× {quantity}</span>
              </div>
              <div className="border-t border-gray-300 pt-2 mt-2 flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-orange-600">
                  TK {(currentPrice * quantity).toLocaleString()}
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
                disabled={isConfirmDisabled()}
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
