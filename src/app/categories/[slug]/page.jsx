import Image from 'next/image';
import Link from 'next/link';

async function getProducts() {
  try {
    const response = await fetch(
      "https://ecommerce-saas-server-wine.vercel.app/api/v1/product/website",
      {
        next: { revalidate: 10, tags: ["product"] },
        headers: {
          "Content-Type": "application/json",
          "store-id": "0000125",
        },
      }
    );

    if (!response.ok) throw new Error('Failed to fetch products');
    const result = await response.json();
    
    const products = result?.data?.data || [];
    console.log('Extracted products count:', products.length);
    console.log('First product category:', products[0]?.category);
    
    return Array.isArray(products) ? products : [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

async function getCategories() {
  try {
    const response = await fetch(
      "https://ecommerce-saas-server-wine.vercel.app/api/v1/category/website/0000125",
      {
        next: { revalidate: 10, tags: ["category"] },
      }
    );

    if (!response.ok) throw new Error('Failed to fetch categories');
    const result = await response.json();
    
    return Array.isArray(result?.data) ? result.data : [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  
  console.log('Current slug:', slug);
  
  const categories = await getCategories();
  const currentCategory = categories.find(cat => cat.path === slug);
  
  console.log('Current category:', currentCategory);
  
  const allProducts = await getProducts();
  
  console.log('All products count:', allProducts.length);
  
  // FIX: product.category is an ARRAY, not string
  const categoryProducts = allProducts.filter(product => {
    // Handle both array and string category
    if (Array.isArray(product.category)) {
      return product.category.some(cat => 
        cat?.toLowerCase() === currentCategory?.parentCategory?.toLowerCase()
      );
    }
    // Fallback for string category
    return product.category?.toLowerCase() === currentCategory?.parentCategory?.toLowerCase();
  });
  
  console.log('Filtered category products:', categoryProducts.length);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Category</h3>
                <Link href="/" className="text-sm text-orange-500 hover:underline">
                  Reset Filters
                </Link>
              </div>
              <div className="space-y-2">
                {categories.map((category) => {
                  // Count products for each category
                  const categoryProductCount = allProducts.filter(p => {
                    if (Array.isArray(p.category)) {
                      return p.category.some(cat => 
                        cat?.toLowerCase() === category.parentCategory?.toLowerCase()
                      );
                    }
                    return p.category?.toLowerCase() === category.parentCategory?.toLowerCase();
                  }).length;
                  
                  return (
                    <Link
                      key={category._id}
                      href={`/categories/${category.path}`}
                      className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition ${
                        slug === category.path ? 'bg-orange-50 border border-orange-200' : 'border border-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-6 h-6">
                          <Image
                            src={category.imageURLs}
                            alt={category.parentCategory}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <span className={`text-sm font-medium ${
                          slug === category.path ? 'text-orange-600' : 'text-gray-700'
                        }`}>
                          {category.parentCategory}
                        </span>
                      </div>
                      <span className="bg-black text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                        {categoryProductCount}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {currentCategory?.parentCategory || 'Products'}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {categoryProducts.length} products found
                </p>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
                <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                  <option>Sort by:</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest First</option>
                  <option>Popular</option>
                </select>
              </div>
            </div>

            {categoryProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryProducts.map((product) => (
                  <div 
                    key={product._id} 
                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group"
                  >
                    <div className="relative h-56 bg-gray-100 overflow-hidden">
                      <Image
                        src={product.imageURLs?.[0] || '/placeholder.jpg'}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 h-12">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl font-bold text-orange-600">
                          ৳{product.salePrice}
                        </span>
                        {product.productPrice > product.salePrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ৳{product.productPrice}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <button className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition text-sm font-medium">
                          Buy Now
                        </button>
                        <button className="px-4 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-lg">
                <svg className="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
                <p className="text-gray-500 mb-6">No products available in this category yet</p>
                <Link href="/" className="inline-block bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition">
                  Back to Home
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
