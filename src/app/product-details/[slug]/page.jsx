"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiHeart, FiMinus, FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";
import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";
import VariantSelectionModal from "../../../../components/VariantSelectionModal";

export default function ProductDetailsPage({ params }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [slug, setSlug] = useState(null);
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedAttributes, setSelectedAttributes] = useState({});

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalActionType, setModalActionType] = useState("addToCart");

  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

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

        if (!response.ok) throw new Error("Failed to fetch products");

        const result = await response.json();
        const products = result?.data?.data || [];

        setAllProducts(products);

        const uniqueCategories = [
          ...new Set(
            products.flatMap((p) => (Array.isArray(p.category) ? p.category : []))
          ),
        ].filter(Boolean);

        setCategories(uniqueCategories);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load product");
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    if (!slug || allProducts.length === 0) return;

    const currentProduct = allProducts.find((p) => p.path === slug);

    if (currentProduct) {
      setProduct(currentProduct);

      if (typeof document !== "undefined") {
        document.title = `${currentProduct.name} - Best Price in BD | Gadget BD`;
      }
    }
  }, [slug, allProducts]);

  // Helper functions
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

    const productVariants = getVariants();
    if (productVariants && productVariants.length > 0) {
      productVariants.forEach((variant) => {
        if (variant.image) {
          const variantImg = Array.isArray(variant.image) ? variant.image[0] : variant.image;
          if (!seen.has(variantImg)) {
            thumbnails.push(variantImg);
            seen.add(variantImg);
          }
        }
      });
    }

    return thumbnails;
  };

  // 🔧 AUTO-SELECT FIRST VARIANT ON PAGE LOAD (with fallback for out-of-stock)
  useEffect(() => {
    if (!product) return;
    
    const productVariants = product?.variant || product?.variants || [];
    if (!productVariants || productVariants.length === 0) return;
    
    // Only auto-select if nothing is selected yet
    if (Object.keys(selectedAttributes).length === 0) {
      // Try to find first available variant with stock, otherwise fallback to first variant
      const firstAvailableVariant = 
        productVariants.find(v => v.quantity > 0) || productVariants[0];
      
      if (firstAvailableVariant) {
        const normalizedAttrs = normalizeAttributes(firstAvailableVariant);
        const initialAttributes = {};
        
        normalizedAttrs.forEach((attr) => {
          if (attr.type && attr.value) {
            initialAttributes[attr.type] = attr.value;
          }
        });
        
        setSelectedAttributes(initialAttributes);
        
        // Set the correct thumbnail index
        if (firstAvailableVariant.image) {
          const variantImage = Array.isArray(firstAvailableVariant.image) 
            ? firstAvailableVariant.image[0] 
            : firstAvailableVariant.image;
          
          // Build thumbnails inline to avoid dependency issues
          const allThumbnails = [];
          const seen = new Set();
          
          if (product?.imageURLs) {
            const mainImages = Array.isArray(product.imageURLs) ? product.imageURLs : [product.imageURLs];
            mainImages.forEach((img) => {
              if (!seen.has(img)) {
                allThumbnails.push(img);
                seen.add(img);
              }
            });
          }

          productVariants.forEach((variant) => {
            if (variant.image) {
              const variantImg = Array.isArray(variant.image) ? variant.image[0] : variant.image;
              if (!seen.has(variantImg)) {
                allThumbnails.push(variantImg);
                seen.add(variantImg);
              }
            }
          });
          
          const imageIndex = allThumbnails.indexOf(variantImage);
          
          if (imageIndex !== -1) {
            setSelectedImage(imageIndex);
          }
        }
      }
    }
  }, [product, selectedAttributes]); // Only run when product changes

  const handleAttributeSelect = (type, value) => {
    const newSelectedAttributes = {
      ...selectedAttributes,
      [type]: value,
    };
    
    setSelectedAttributes(newSelectedAttributes);
    setQuantity(1);
    
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

  const currentPrice = currentVariant?.salePrice || product?.salePrice || 0;
  const currentProductPrice = currentVariant?.productPrice || product?.productPrice || 0;
  const currentStock = currentVariant?.quantity || product?.quantity || 100;
  const currentDiscount = currentVariant?.discount || product?.discount || 0;

  let currentImages = [];
  if (currentVariant && currentVariant.image) {
    if (Array.isArray(currentVariant.image)) currentImages = currentVariant.image;
    else if (typeof currentVariant.image === "string") currentImages = [currentVariant.image];
  }

  if (currentImages.length === 0 && product?.imageURLs) {
    if (Array.isArray(product.imageURLs)) currentImages = product.imageURLs;
    else currentImages = [product.imageURLs];
  }

  const getCurrentDisplayImage = () => {
    if (currentImages.length > 0) return currentImages[selectedImage] || currentImages[0];
    return "/placeholder.jpg";
  };

  const thumbnails = getThumbnails();

  const handleQuantityIncrease = () => {
    if (quantity < currentStock) setQuantity((prev) => prev + 1);
  };

  const handleQuantityDecrease = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAddToCartClick = () => {
    if (currentStock <= 0) return toast.error("Out of stock!");

    if (hasVariants) {
      setModalActionType("addToCart");
      setIsModalOpen(true);
    } else {
      const productToAdd = {
        id: product._id,
        name: product.name,
        salePrice: currentPrice,
        productPrice: currentProductPrice,
        discount: currentDiscount,
        imageURLs: getCurrentDisplayImage(),
      };

      for (let i = 0; i < quantity; i++) addToCart(productToAdd);
      toast.success(`${quantity} product added to cart`);
    }
  };

  const handleBuyNowClick = () => {
    if (currentStock <= 0) return toast.error("Out of stock!");

    if (hasVariants) {
      setModalActionType("buyNow");
      setIsModalOpen(true);
    } else {
      const productToAdd = {
        id: product._id,
        name: product.name,
        salePrice: currentPrice,
        productPrice: currentProductPrice,
        discount: currentDiscount,
        imageURLs: getCurrentDisplayImage(),
      };

      for (let i = 0; i < quantity; i++) addToCart(productToAdd);
      toast.success("Checking Checkout...");
      router.push("/cart");
    }
  };

  const handleModalAddToCart = (productToAdd, qty, actionType) => {
    for (let i = 0; i < qty; i++) {
      addToCart(productToAdd);
    }

    if (actionType === "buyNow") {
      toast.success("Checking Checkout...");
      router.push("/cart");
    } else {
      toast.success(`${qty} product added to cart`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <Link href="/" className="text-purple-600 hover:underline">
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  const inWishlist = isInWishlist(product._id);

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
       
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          

          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image Gallery */}
                <div>
                  <div className="relative bg-gray-50 rounded-lg mb-4 overflow-hidden group" style={{ height: "450px" }}>
                    <Image
                      src={getCurrentDisplayImage()}
                      alt={product.name}
                      fill
                      className="object-contain p-4 transition-transform duration-500 ease-in-out group-hover:scale-110"
                    />
                    
                    <button
                      onClick={() => toggleWishlist(product)}
                      className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition-all duration-300 z-10 ${
                        inWishlist 
                          ? "bg-red-500 text-white hover:bg-red-600 scale-110" 
                          : "bg-white text-gray-700 hover:bg-red-50 hover:text-red-500 hover:scale-110"
                      }`}
                      title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                      <FiHeart size={22} fill={inWishlist ? "currentColor" : "none"} strokeWidth={2.5} />
                    </button>
                  </div>

                  {thumbnails.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {thumbnails.map((thumb, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleThumbnailClick(idx)}
                          className={`relative w-20 h-20 shrink-0 bg-gray-50 rounded-lg border-2 overflow-hidden transition-all duration-200 ${
                            selectedImage === idx
                              ? "border-purple-600 ring-2 ring-purple-200 scale-105"
                              : "border-gray-200 hover:border-gray-300 hover:scale-105"
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

                {/* Product Details */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-4 mb-2">
                    <p className="text-sm">
                      <span className="text-gray-500">Category:</span>{" "}
                      <Link
                        href={`/categories/${encodeURIComponent(product.category?.[0] || "")}`}
                        className="text-purple-600 hover:underline font-medium"
                      >
                        {product.category?.[0] || "N/A"}
                      </Link>
                    </p>
                    {product.brand && (
                      <p className="text-sm">
                        <span className="text-gray-500">Brand:</span>{" "}
                        <span className="text-gray-900 font-medium">{product.brand}</span>
                      </p>
                    )}
                  </div>

                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    {product.name}
                  </h1>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-5 h-5 text-yellow-400 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-green-600 font-semibold">In Stock</span>
                  </div>

                  <div className="flex items-center gap-3 mb-6">
                    {currentProductPrice > currentPrice && (
                      <span className="text-lg text-gray-400 line-through">
                        TK {Number(currentProductPrice).toLocaleString()}
                      </span>
                    )}
                    <span className="text-3xl font-bold text-orange-600">
                      TK {Number(currentPrice).toLocaleString()}
                    </span>
                    {currentDiscount > 0 && (
                      <span className="bg-red-500 text-white text-sm font-bold px-2.5 py-1 rounded">
                        {currentDiscount}% OFF
                      </span>
                    )}
                  </div>

                  {hasVariants && attributeGroups.length > 0 && (
                    <div className="space-y-4 mb-6">
                      {attributeGroups.map((group) => (
                        <div key={group.type}>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            {group.type}
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
                                  className={`px-4 py-2 rounded-md border-2 font-medium text-sm transition ${
                                    isSelected
                                      ? "border-red-500 bg-red-50 text-red-700"
                                      : isAvailable
                                      ? "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                                      : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed line-through"
                                  }`}
                                >
                                  {option}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mb-6">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleQuantityDecrease}
                        disabled={quantity <= 1}
                        className="w-10 h-10 border-2 border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 transition disabled:opacity-50"
                      >
                        <FiMinus size={16} />
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        readOnly
                        className="w-16 h-10 text-center border-2 border-gray-300 rounded font-semibold"
                      />
                      <button
                        onClick={handleQuantityIncrease}
                        disabled={quantity >= currentStock}
                        className="w-10 h-10 border-2 border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 transition disabled:opacity-50"
                      >
                        <FiPlus size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleAddToCartClick}
                      disabled={currentStock <= 0}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={handleBuyNowClick}
                      disabled={currentStock <= 0}
                      className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs section */}
            <div className="bg-white rounded-lg shadow-sm mt-6">
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab("description")}
                  className={`px-6 py-4 font-semibold transition ${
                    activeTab === "description"
                      ? "text-purple-600 border-b-2 border-purple-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`px-6 py-4 font-semibold transition ${
                    activeTab === "reviews"
                      ? "text-purple-600 border-b-2 border-purple-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Review ({product.review?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab("video")}
                  className={`px-6 py-4 font-semibold transition ${
                    activeTab === "video"
                      ? "text-purple-600 border-b-2 border-purple-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Video
                </button>
              </div>

              <div className="p-6">
                {activeTab === "description" && (
                  <div>
                    {product.description ? (
                      <div
                        className="prose max-w-none text-gray-700"
                        dangerouslySetInnerHTML={{ __html: product.description }}
                      />
                    ) : (
                      <p className="text-gray-500 italic">No description available.</p>
                    )}
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div>
                    {product.review && product.review.length > 0 ? (
                      <div className="space-y-4">
                        {product.review.map((rev, idx) => (
                          <div key={idx} className="border-b pb-4 last:border-b-0">
                            <p className="text-gray-700">{rev.comment || rev}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">No reviews yet.</p>
                    )}
                  </div>
                )}

                {activeTab === "video" && (
                  <div>
                    <p className="text-gray-600">No video available for this product.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Category Sidebar) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-purple-500 pb-2 inline-block">
                Category
              </h3>
              <div className="space-y-2 mt-6">
                {categories.map((cat) => (
                  <Link
                    key={cat}
                    href={`/categories/${encodeURIComponent(cat)}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition group"
                  >
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 group-hover:bg-purple-100 group-hover:text-purple-600 transition">
                      <span className="text-sm font-bold uppercase">
                        {cat.charAt(0)}
                      </span>
                    </div>
                    <span className="flex-1 text-sm font-medium text-gray-700 group-hover:text-purple-600 transition">
                      {cat}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      <VariantSelectionModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleModalAddToCart}
        actionType={modalActionType}
      />
    </div>
  );
}
