import Image from "next/image";

import FeaturedCategories from "../../components/FeaturedCategories";
import FreshSale from "../../components/FreshSale";
import PopularProducts from "../../components/PopularProducts";
import NewArrival from "../../components/NewArrival";
import HeroSection from "../../components/HeroSection";

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

export default async function Home() {
  // Fetch banners from API
  const apiResponse = await getBanners();
  
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
  
  console.log('=== Final Result ===');
  console.log('Total banners to pass:', banners.length);
  console.log('====================');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero section will be added here in next steps */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Banner Section */}
        <HeroSection banners={banners}></HeroSection>
        {/* Featured Categories Section */}
        <FeaturedCategories></FeaturedCategories>
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
