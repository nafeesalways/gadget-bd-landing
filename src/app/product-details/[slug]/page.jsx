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
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");

  // Get slug from params
  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  // Fetch all products
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

        // Get unique categories
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

  // Find current product and related products
  useEffect(() => {
    if (!slug || allProducts.length === 0) return;

    const currentProduct = allProducts.find((p) => p.path === slug);

    if (currentProduct) {
      setProduct(currentProduct);

      // Get related products from same category
      const related = allProducts
        .filter(
          (p) =>
            p._id !== currentProduct._id &&
            Array.isArray(p.category) &&
            Array.isArray(currentProduct.category) &&
            p.category.some((cat) => currentProduct.category.includes(cat))
        )
        .slice(0, 3);

      setRelatedProducts(related);
    }
  }, [slug, allProducts]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success(`${quantity} item(s) added to cart!`);
  };

  const handleBuyNow = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success("Product added to cart!");
    router.push("/cart");
  };

  const createSlug = (categoryName) => {
    return encodeURIComponent(categoryName);
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

  // Check if current product is in wishlist
  const inWishlist = isInWishlist(product._id);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - Product Details (2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Main Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Images */}
                <div>
                  {/* Discount Badge */}
                  {product.discount > 0 && (
                    <span className="inline-block bg-green-500 text-white text-sm font-bold px-3 py-1 rounded mb-4">
                      -{product.discount}% OFF
                    </span>
                  )}

                  {/* Main Image with Wishlist Heart */}
                  <div className="relative h-80 bg-gray-50 rounded-lg mb-4 p-4">
                    <Image
                      src={
                        product.imageURLs?.[selectedImage] || "/placeholder.jpg"
                      }
                      alt={product.name}
                      fill
                      className="object-contain"
                    />
                    {/* Wishlist Heart Button */}
                    <button
                      onClick={() => toggleWishlist(product)}
                      className={`absolute top-4 right-4 p-2 rounded-full shadow transition-all ${
                        inWishlist
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                      title={
                        inWishlist ? "Remove from wishlist" : "Add to wishlist"
                      }
                    >
                      <FiHeart
                        size={20}
                        fill={inWishlist ? "currentColor" : "none"}
                      />
                    </button>
                  </div>

                  {/* Thumbnail Images */}
                  <div className="flex gap-2">
                    {product.imageURLs?.slice(0, 3).map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`relative w-20 h-20 bg-gray-50 rounded border-2 ${
                          selectedImage === idx
                            ? "border-orange-500"
                            : "border-gray-200"
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          fill
                          className="object-contain p-1"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Product Info */}
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    {product.name}
                  </h1>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${
                            i < 4 ? "text-yellow-400" : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      ({product.reviews?.length || 0} reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-3xl font-bold text-orange-600">
                      ৳ {product.salePrice?.toLocaleString()}
                    </span>
                    {product.productPrice > product.salePrice && (
                      <span className="text-xl text-gray-400 line-through">
                        ৳ {product.productPrice?.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Color Options (if available) */}
                  {product.variants && product.variants.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Color:
                      </p>
                      <div className="flex gap-2">
                        {product.variants.map((variant, idx) => (
                          <button
                            key={idx}
                            className="px-4 py-2 border-2 border-gray-300 rounded hover:border-orange-500 text-sm"
                          >
                            {variant.name || `Option ${idx + 1}`}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 border-2 border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
                      >
                        <FiMinus />
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(
                            Math.max(1, parseInt(e.target.value) || 1)
                          )
                        }
                        className="w-16 h-10 text-center border-2 border-gray-300 rounded"
                      />
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 border-2 border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
                      >
                        <FiPlus />
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mb-6">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded flex items-center justify-center gap-2 transition"
                    >
                      <FiShoppingCart size={20} />
                      Add to cart
                    </button>
                    <button
                      onClick={handleBuyNow}
                      className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded transition"
                    >
                      Buy Now
                    </button>
                  </div>

                  {/* Meta Info */}
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600">
                      Category:{" "}
                      <Link
                        href={`/categories/${createSlug(
                          product.category?.[0] || ""
                        )}`}
                        className="text-orange-600 hover:underline font-medium"
                      >
                        {product.category?.[0] || "N/A"}
                      </Link>
                    </p>
                    <p className="text-gray-600">
                      Brand:{" "}
                      <span className="text-gray-900 font-medium">
                        {product.brand || "N/A"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="bg-white rounded-lg shadow p-6">
              {/* Tab Buttons */}
              <div className="flex gap-4 border-b mb-6">
                <button
                  onClick={() => setActiveTab("description")}
                  className={`pb-3 px-1 font-medium transition ${
                    activeTab === "description"
                      ? "text-orange-600 border-b-2 border-orange-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab("additional")}
                  className={`pb-3 px-1 font-medium transition ${
                    activeTab === "additional"
                      ? "text-orange-600 border-b-2 border-orange-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Additional Info
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`pb-3 px-1 font-medium transition ${
                    activeTab === "reviews"
                      ? "text-orange-600 border-b-2 border-orange-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Reviews({product.reviews?.length || 0})
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === "description" && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Description
                  </h3>

                  {/* Product Description from API */}
                  {product.description && (
                    <div
                      className=" py-1 prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: product.description }}
                    ></div>
                  )}

                  {/* Specification Section */}
                  {product.specification && (
                    <>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 mt-6">
                        Specification
                      </h4>
                      <div className="space-y-4">
                        <div className="border-b pb-3">
                          <h5 className="font-semibold text-gray-900 mb-3">
                            Technical Details
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            {Object.entries(product.specification).map(
                              ([key, value]) => (
                                <div key={key} className="contents">
                                  <div className="text-gray-600 font-medium capitalize">
                                    {key.replace(/([A-Z])/g, " $1").trim()}
                                  </div>
                                  <div className="text-gray-900">
                                    {typeof value === "object"
                                      ? JSON.stringify(value)
                                      : value}
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* If no description or specification */}
                  {!product.description && !product.specification && (
                    <p className="text-gray-500 italic">
                      No product description available.
                    </p>
                  )}
                </div>
              )}

              {activeTab === "additional" && (
                <div>
                  {/* Additional Info from API */}
                  {product.additionalInfo ? (
                    <div className="space-y-3 text-sm">
                      {Object.entries(product.additionalInfo).map(
                        ([key, value]) => (
                          <div key={key} className="flex border-b pb-2">
                            <span className="font-medium text-gray-700 w-1/3 capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}:
                            </span>
                            <span className="text-gray-900 w-2/3">{value}</span>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-600">
                      No additional information available.
                    </p>
                  )}
                </div>
              )}

              {activeTab === "reviews" && (
                <div>
                  {/* Reviews from API */}
                  {product.reviews && product.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {product.reviews.map((review, idx) => (
                        <div key={idx} className="border-b pb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < (review.rating || 0)
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
                            <span className="text-sm font-medium text-gray-900">
                              {review.userName || "Anonymous"}
                            </span>
                            {review.date && (
                              <span className="text-xs text-gray-500">
                                {new Date(review.date).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-700 text-sm">
                            {review.comment}
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

          {/* Right Sidebar - Category List */}
          <div className="lg:col-span-1 space-y-6">
            {/* Category Sidebar */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Category</h3>
              <div className="space-y-2">
                {categories.map((category) => {
                  const count = allProducts.filter(
                    (p) =>
                      Array.isArray(p.category) && p.category.includes(category)
                  ).length;

                  return (
                    <Link
                      key={category}
                      href={`/categories/${createSlug(category)}`}
                      className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 transition group"
                    >
                      <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-600 group-hover:bg-orange-100 group-hover:text-orange-600">
                        <span className="text-sm font-bold">
                          {category.charAt(0)}
                        </span>
                      </div>
                      <span className="flex-1 text-sm font-medium text-gray-700 group-hover:text-orange-600">
                        {category}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
