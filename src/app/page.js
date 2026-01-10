import Image from "next/image";

import FeaturedCategories from "../../components/FeaturedCategories";
import FreshSale from "../../components/FreshSale";
import PopularProducts from "../../components/PopularProducts";
import NewArrival from "../../components/NewArrival";
import HeroSection from "../../components/HeroSection";


// ✅ Homepage Metadata
export const metadata = {
  title: "Best Online Gadget Store in Bangladesh",
  description: "Shop latest phones, watches, earbuds, power banks, and gaming accessories at best prices. Free delivery, genuine products, and 100% authentic guarantee.",
  openGraph: {
    title: "Gadget BD - Your Trusted Online Gadget Store",
    description: "Discover amazing deals on smartphones, smartwatches, and electronics.",
    url: "https://gadgetbd.com",
    images: [
      {
        url: "/hero-banner.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
};

async function getBanners() {
  try {

    const response = await fetch(
      "https://ecommerce-saas-server-wine.vercel.app/api/v1/banner/website",
      {
        cache: 'no-store',
        headers: {
          "Content-Type": "application/json",
          "store-id": "0000125",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching banners:', error.message);
    return null;
  }
}
async function getCategories() {
  try {
    console.log('Fetching categories...');
    
    const response = await fetch(
      "https://ecommerce-saas-server-wine.vercel.app/api/v1/category/website/0000125",
      {
        next: { revalidate: 10, tags: ["category"] },
      }
    );

    console.log('Category API Response status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Category API Response:', result);
    
    return result;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return null;
  }
}
export default async function Home() {
  // Fetch banners from API
  const apiResponse = await getBanners();
    const categoryResponse = await getCategories();
      const categories = categoryResponse?.data || [];
  
  // Extract banners array
  let banners = [];
  if (apiResponse) {
    if (apiResponse.data?.data && Array.isArray(apiResponse.data.data)) {
      banners = apiResponse.data.data;
    } else {
      console.log('FAILED: Could not find banners array');
      console.log('Available structure:', {
        hasData: !!apiResponse.data,
        dataKeys: apiResponse.data ? Object.keys(apiResponse.data) : [],
        dataType: typeof apiResponse.data,
        isDataArray: Array.isArray(apiResponse.data),
      });
    }
  }
  


  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero section will be added here in next steps */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Banner Section */}
        <HeroSection banners={banners}></HeroSection>
        {/* Featured Categories Section */}
        <FeaturedCategories categories={categories}></FeaturedCategories>
        {/* Flash Sale Section */}
        <FreshSale></FreshSale>
        {/* Popular Products Section */}
        <PopularProducts></PopularProducts>
        {/* New Arrival Section */}
        <NewArrival></NewArrival>
      </div>
    </div>
  );
}
