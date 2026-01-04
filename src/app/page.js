import Image from "next/image";
import Banner from "../../components/Banner";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero section will be added here in next steps */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Banner></Banner>
      </div>
    </div>
  );
}
