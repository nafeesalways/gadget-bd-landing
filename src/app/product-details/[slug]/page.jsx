"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiHeart, FiShoppingCart, FiMinus, FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";
import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";

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
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

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
            products.flatMap((p) =>
              Array.isArray(p.category) ? p.category : []
            )
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
      
      // ✅ Update document head dynamically (client-side SEO)
      if (typeof document !== 'undefined') {
        document.title = `${currentProduct.name} - Best Price in BD | Gadget BD`;
        
        // Update meta description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
          metaDescription = document.createElement('meta');
          metaDescription.name = 'description';
          document.head.appendChild(metaDescription);
        }
        metaDescription.setAttribute('content', 
          `Buy ${currentProduct.name} at ৳${currentProduct.salePrice}. ${currentProduct.discount}% discount. Free delivery across Bangladesh.`
        );
        
        // Update OG tags
        let ogTitle = document.querySelector('meta[property="og:title"]');
        if (!ogTitle) {
          ogTitle = document.createElement('meta');
          ogTitle.setAttribute('property', 'og:title');
          document.head.appendChild(ogTitle);
        }
        ogTitle.setAttribute('content', `${currentProduct.name} - Best Price in BD`);
        
        let ogDescription = document.querySelector('meta[property="og:description"]');
        if (!ogDescription) {
          ogDescription = document.createElement('meta');
          ogDescription.setAttribute('property', 'og:description');
          document.head.appendChild(ogDescription);
        }
        ogDescription.setAttribute('content', `Only ৳${currentProduct.salePrice} - ${currentProduct.discount}% OFF`);
      }
    }
  }, [slug, allProducts]);

  // ✅ Get current selected variant
  const getCurrentVariant = () => {
    if (product?.variant && product.variant.length > 0) {
      return product.variant[selectedVariantIndex];
    }
    return null;
  };

  const currentVariant = getCurrentVariant();
  const hasVariants = product?.variant && product.variant.length > 0;

  // ✅ Get variant-specific data
  const currentPrice = currentVariant?.salePrice || product?.salePrice || 0;
  const currentProductPrice =
    currentVariant?.productPrice || product?.productPrice || 0;
  const currentStock = currentVariant?.quantity || product?.quantity || 100;
  const currentDiscount = currentVariant?.discount || product?.discount || 0;

  // ✅ Get variant-specific images
  let currentImages = [];
  if (currentVariant && currentVariant.image) {
    if (Array.isArray(currentVariant.image)) {
      currentImages = currentVariant.image;
    } else if (typeof currentVariant.image === "string") {
      currentImages = [currentVariant.image];
    }
  }

  // Fallback to main product images
  if (currentImages.length === 0 && product?.imageURLs) {
    if (Array.isArray(product.imageURLs)) {
      currentImages = product.imageURLs;
    } else {
      currentImages = [product.imageURLs];
    }
  }

  // ✅ Get variant-specific single image for cart
  const getCleanImageUrl = () => {
    // Priority 1: Current variant image
    if (currentVariant && currentVariant.image) {
      if (
        Array.isArray(currentVariant.image) &&
        currentVariant.image.length > 0
      ) {
        return currentVariant.image[0];
      }
      if (typeof currentVariant.image === "string") {
        return currentVariant.image;
      }
    }

    // Priority 2: Main product images
    if (product?.imageURLs) {
      if (Array.isArray(product.imageURLs) && product.imageURLs.length > 0) {
        return product.imageURLs[0];
      }
      if (typeof product.imageURLs === "string") {
        return product.imageURLs;
      }
    }

    return "/placeholder.jpg";
  };

  // ✅ Get all thumbnails (main + variants)
  const getAllThumbnails = () => {
    const thumbnails = [];

    // Main product images
    if (product?.imageURLs) {
      if (Array.isArray(product.imageURLs)) {
        product.imageURLs.forEach((img) => {
          thumbnails.push({
            image: img,
            type: "main",
            label: "Main",
          });
        });
      } else {
        thumbnails.push({
          image: product.imageURLs,
          type: "main",
          label: "Main",
        });
      }
    }

    // Variant images
    if (product?.variant && product.variant.length > 0) {
      product.variant.forEach((variant, idx) => {
        const variantName =
          variant.attribute?.[0]?.name || `Variant ${idx + 1}`;

        if (variant.image) {
          if (Array.isArray(variant.image) && variant.image.length > 0) {
            thumbnails.push({
              image: variant.image[0],
              type: "variant",
              variantIndex: idx,
              label: variantName,
              isOutOfStock: !variant.quantity || variant.quantity === 0,
            });
          } else if (typeof variant.image === "string") {
            thumbnails.push({
              image: variant.image,
              type: "variant",
              variantIndex: idx,
              label: variantName,
              isOutOfStock: !variant.quantity || variant.quantity === 0,
            });
          }
        }
      });
    }

    return thumbnails;
  };

  const allThumbnails = getAllThumbnails();

  // ✅ Get CURRENT display image (main image shows variant-specific)
  const getCurrentDisplayImage = () => {
    // If variant is selected and selectedImage is pointing to variant thumbnail
    if (allThumbnails.length > 0 && allThumbnails[selectedImage]) {
      return allThumbnails[selectedImage].image;
    }

    // Fallback to current variant image
    if (currentImages.length > 0) {
      return currentImages[0];
    }

    return "/placeholder.jpg";
  };

  const handleThumbnailClick = (thumbnail, index) => {
    if (thumbnail.type === "variant") {
      if (!thumbnail.isOutOfStock) {
        setSelectedVariantIndex(thumbnail.variantIndex);
        setSelectedImage(index);
        setQuantity(1);
        toast.success(`Selected: ${thumbnail.label}`);
      }
    } else {
      setSelectedImage(index);
    }
  };

  const handleQuantityIncrease = () => {
    if (quantity < currentStock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleQuantityDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleVariantSelect = (index) => {
    setSelectedVariantIndex(index);

    // ✅ Find the thumbnail index for this variant
    const variantThumbIndex = allThumbnails.findIndex(
      (t) => t.type === "variant" && t.variantIndex === index
    );

    if (variantThumbIndex !== -1) {
      setSelectedImage(variantThumbIndex);
    }

    setQuantity(1);

    const variant = product.variant[index];
    const variantName = variant.attribute?.[0]?.name || "Variant";
    toast.success(`Selected: ${variantName}`);
  };

  // ✅ Add to cart
  const handleAddToCart = () => {
    if (currentStock === 0) {
      toast.error("Out of stock!");
      return;
    }

    const productToAdd = {
      id: product._id,
      name: product.name,
      salePrice: currentPrice,
      productPrice: currentProductPrice,
      discount: currentDiscount,
      imageURLs: getCleanImageUrl(),
      selectedVariant: currentVariant
        ? {
            _id: currentVariant._id,
            image: currentVariant.image,
            salePrice: currentVariant.salePrice,
            productPrice: currentVariant.productPrice,
            quantity: currentVariant.quantity,
            discount: currentVariant.discount,
            attribute: currentVariant.attribute,
          }
        : null,
      variantName: currentVariant?.attribute?.[0]?.name || null,
    };

    for (let i = 0; i < quantity; i++) {
      addToCart(productToAdd);
    }

    toast.success(`Added ${quantity} item(s) to cart!`, {
      icon: "🛒",
    });
  };

  const handleBuyNow = () => {
    if (currentStock === 0) {
      toast.error("Out of stock!");
      return;
    }

    const productToAdd = {
      id: product._id,
      name: product.name,
      salePrice: currentPrice,
      productPrice: currentProductPrice,
      discount: currentDiscount,
      imageURLs: getCleanImageUrl(),
      selectedVariant: currentVariant
        ? {
            _id: currentVariant._id,
            image: currentVariant.image,
            salePrice: currentVariant.salePrice,
            productPrice: currentVariant.productPrice,
            quantity: currentVariant.quantity,
            discount: currentVariant.discount,
            attribute: currentVariant.attribute,
          }
        : null,
      variantName: currentVariant?.attribute?.[0]?.name || null,
    };

    for (let i = 0; i < quantity; i++) {
      addToCart(productToAdd);
    }

    toast.success("Proceeding to checkout!");
    router.push("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Product not found
          </h2>
          <Link href="/" className="text-orange-600 hover:underline">
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  const inWishlist = isInWishlist(product._id);

  // ✅ Product Schema for SEO
  const productSchema = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        image: getCleanImageUrl(),
        description: product.description
          ? product.description.replace(/<[^>]*>/g, "").substring(0, 160)
          : `Buy ${product.name} online at best price in Bangladesh`,
        brand: {
          "@type": "Brand",
          name: "Gadget BD",
        },
        offers: {
          "@type": "Offer",
          url: `https://gadgetbd.com/product-details/${slug}`,
          priceCurrency: "BDT",
          price: currentPrice,
          priceValidUntil: "2026-12-31",
          availability:
            currentStock > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          seller: {
            "@type": "Organization",
            name: "Gadget BD",
          },
        },
        aggregateRating: product.rating
          ? {
              "@type": "AggregateRating",
              ratingValue: product.rating,
              reviewCount: product.review?.length || 0,
            }
          : undefined,
      }
    : null;

  return (
    <>
      {/* ✅ Structured Data for SEO */}
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                  {/* Image Gallery */}
                  <div>
                    {currentDiscount > 0 && (
                      <div className="mb-4">
                        <span className="inline-block bg-green-500 text-white text-sm font-bold px-3 py-1 rounded">
                          -{currentDiscount}% OFF
                        </span>
                      </div>
                    )}

                    {/* Main Image */}
                    <div
                      className="relative bg-gray-50 rounded-lg mb-4 p-8"
                      style={{ height: "400px" }}
                    >
                      <Image
                        src={getCurrentDisplayImage()}
                        alt={product.name}
                        fill
                        className="object-contain"
                      />

                      <button
                        onClick={() => toggleWishlist(product)}
                        className={`absolute top-4 right-4 p-2 rounded-full shadow-md transition ${
                          inWishlist
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <FiHeart
                          size={20}
                          fill={inWishlist ? "currentColor" : "none"}
                        />
                      </button>
                    </div>

                    {/* Thumbnails */}
                    {allThumbnails.length > 0 && (
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {allThumbnails.map((thumb, idx) => {
                          const isSelected = selectedImage === idx;
                          const isVariant = thumb.type === "variant";
                          const isOutOfStock = thumb.isOutOfStock;

                          return (
                            <button
                              key={idx}
                              onClick={() => handleThumbnailClick(thumb, idx)}
                              disabled={isOutOfStock}
                              className={`relative w-20 h-20 shrink-0 bg-gray-50 rounded-lg border-2 overflow-hidden transition ${
                                isSelected
                                  ? "border-orange-500 ring-2 ring-orange-200"
                                  : "border-gray-200 hover:border-gray-300"
                              } ${
                                isOutOfStock
                                  ? "opacity-50 cursor-not-allowed"
                                  : "cursor-pointer"
                              }`}
                            >
                              <Image
                                src={thumb.image}
                                alt={thumb.label}
                                fill
                                className="object-contain p-1"
                              />

                              {isOutOfStock && (
                                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">
                                    Out
                                  </span>
                                </div>
                              )}

                              {isVariant && !isOutOfStock && (
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-[9px] font-semibold text-center py-0.5 truncate px-1">
                                  {thumb.label}
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-col">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                      {product.name}
                    </h1>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-5 h-5 ${
                              i < (product.rating || 4)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        ({product.review?.length || 0} reviews)
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-3 mb-6">
                      <span className="text-3xl font-bold text-orange-600">
                        ৳ {currentPrice.toLocaleString()}
                      </span>
                      {currentProductPrice > currentPrice && (
                        <span className="text-xl text-gray-400 line-through">
                          ৳ {currentProductPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Variants */}
                    {hasVariants && (
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-sm text-gray-700 font-medium">
                            Color:
                          </span>
                          {currentVariant &&
                            currentVariant.attribute &&
                            currentVariant.attribute.length > 0 && (
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full border border-gray-300 bg-gray-800"></div>
                                <span className="text-sm font-medium text-gray-900">
                                  {currentVariant.attribute
                                    .map((a) => a.name)
                                    .join(", ")}
                                </span>
                              </div>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {product.variant.map((variant, idx) => {
                            const variantName =
                              variant.attribute?.[0]?.name || `Option ${idx + 1}`;
                            const isSelected = selectedVariantIndex === idx;
                            const isOutOfStock =
                              !variant.quantity || variant.quantity === 0;

                            return (
                              <button
                                key={idx}
                                onClick={() =>
                                  !isOutOfStock && handleVariantSelect(idx)
                                }
                                disabled={isOutOfStock}
                                className={`
                                  flex items-center gap-2 px-4 py-2.5 border-2 rounded-md transition text-sm font-medium
                                  ${
                                    isSelected
                                      ? "border-orange-500 bg-orange-50 text-orange-700"
                                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                                  }
                                  ${
                                    isOutOfStock
                                      ? "opacity-50 cursor-not-allowed"
                                      : "cursor-pointer"
                                  }
                                `}
                              >
                                <div className="w-4 h-4 rounded-full border border-gray-400 bg-gray-800"></div>
                                {variantName}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Quantity */}
                    <div className="mb-6">
                      <div className="flex items-center gap-4 mb-6">
                        <button
                          onClick={handleQuantityDecrease}
                          disabled={quantity <= 1 || currentStock === 0}
                          className="w-10 h-10 border-2 border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FiMinus size={16} />
                        </button>

                        <input
                          type="text"
                          value={quantity}
                          readOnly
                          className="w-16 h-10 text-center border-2 border-gray-300 rounded font-semibold text-lg"
                        />

                        <button
                          onClick={handleQuantityIncrease}
                          disabled={
                            quantity >= currentStock || currentStock === 0
                          }
                          className="w-10 h-10 border-2 border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FiPlus size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 mb-6">
                      <button
                        onClick={handleAddToCart}
                        disabled={currentStock === 0}
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiShoppingCart size={20} />
                        Add to cart
                      </button>
                      <button
                        onClick={handleBuyNow}
                        disabled={currentStock === 0}
                        className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Buy Now
                      </button>
                    </div>

                    {/* Category & Tags */}
                    <div className="space-y-2 text-sm border-t pt-4">
                      <p className="text-gray-600">
                        Category:{" "}
                        <Link
                          href={`/categories/${encodeURIComponent(
                            product.category?.[0] || ""
                          )}`}
                          className="text-orange-600 hover:underline font-medium"
                        >
                          {product.category?.[0] || "N/A"}
                        </Link>
                      </p>
                      {product.tags && product.tags.length > 0 && (
                        <p className="text-gray-600">
                          Tags:{" "}
                          <span className="text-orange-600">
                            {product.tags.join(", ")}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-t">
                  <div className="flex gap-6 px-6 border-b">
                    <button
                      onClick={() => setActiveTab("description")}
                      className={`py-4 font-medium transition relative ${
                        activeTab === "description"
                          ? "text-orange-600"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Description
                      {activeTab === "description" && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600"></div>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab("reviews")}
                      className={`py-4 font-medium transition relative ${
                        activeTab === "reviews"
                          ? "text-orange-600"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Reviews({product.review?.length || 0})
                      {activeTab === "reviews" && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600"></div>
                      )}
                    </button>
                  </div>

                  <div className="p-6">
                    {activeTab === "description" && (
                      <div>
                        {product.description ? (
                          <div
                            className="prose max-w-none text-gray-700"
                            dangerouslySetInnerHTML={{
                              __html: product.description,
                            }}
                          ></div>
                        ) : (
                          <p className="text-gray-500 italic">
                            No product description available.
                          </p>
                        )}
                      </div>
                    )}

                    {activeTab === "reviews" && (
                      <div>
                        {product.review && product.review.length > 0 ? (
                          <div className="space-y-4">
                            {product.review.map((rev, idx) => (
                              <div
                                key={idx}
                                className="border-b pb-4 last:border-b-0"
                              >
                                <p className="text-gray-700">
                                  {rev.comment || rev}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-600">
                            No reviews yet. Be the first to review this product!
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Category
                </h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat}
                      href={`/categories/${encodeURIComponent(cat)}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition group"
                    >
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 group-hover:bg-orange-100 group-hover:text-orange-600 transition">
                        <span className="text-sm font-bold uppercase">
                          {cat.charAt(0)}
                        </span>
                      </div>
                      <span className="flex-1 text-sm font-medium text-gray-700 group-hover:text-orange-600 transition">
                        {cat}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
