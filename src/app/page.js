import Image from "next/image";
import Banner from "../../components/Banner";
import FeaturedCategories from "../../components/FeaturedCategories";
import FreshSale from "../../components/FreshSale";
import PopularProducts from "../../components/PopularProducts";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero section will be added here in next steps */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Banner Section */}
        <Banner></Banner>
        {/* Featured Categories Section */}
        <FeaturedCategories></FeaturedCategories>
        {/* Flash Sale Section */}
        <FreshSale></FreshSale>
        {/* Popular Products Section */}
        <PopularProducts></PopularProducts>
      </div>
    </div>
  );
}
