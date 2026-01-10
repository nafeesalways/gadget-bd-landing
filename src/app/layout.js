import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import FloatingContact from "../../components/FloatingContact";

import { Toaster } from "react-hot-toast";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Gadget BD - Best Online Gadget Store in Bangladesh",
    template: "%s | Gadget BD"
  },
  description: "Shop the latest phones, watches, power banks, earbuds, and gaming accessories in Bangladesh. Best prices, fast delivery, and genuine products guaranteed.",
  keywords: ["gadgets", "phones", "watches", "power bank", "earbuds", "gaming", "electronics", "Bangladesh", "online shopping"],
  authors: [{ name: "Gadget BD" }],
  creator: "Gadget BD",
  publisher: "Gadget BD",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gadgetbd.com",
    siteName: "Gadget BD",
    title: "Gadget BD - Best Online Gadget Store in Bangladesh",
    description: "Shop the latest phones, watches, power banks, earbuds, and gaming accessories in Bangladesh.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Gadget BD Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gadget BD - Best Online Gadget Store",
    description: "Shop the latest gadgets in Bangladesh with best prices and fast delivery.",
    images: ["/logo.png"],
  },
  verification: {
    google: "your-google-verification-code",
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          <WishlistProvider>
            <Navbar></Navbar>
            {children}
            <Footer></Footer>
            <FloatingContact></FloatingContact>
            <Toaster
              position="top-center"
              reverseOrder={false}
              toastOptions={{
                duration: 3000,
                style: {
                  background: "#363636",
                  color: "#fff",
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: "#10b981",
                    secondary: "#fff",
                  },
                },
              }}
            />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
