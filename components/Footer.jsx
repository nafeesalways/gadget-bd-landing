"use client";

import Link from "next/link";
import Image from "next/image";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";
import { HiMail, HiPhone, HiLocationMarker } from "react-icons/hi";

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Column 1: Logo and Social Links */}
          <div className="flex flex-col items-center sm:items-start">
            {/* Logo */}
            <Link href="/" className="mb-6">
              <Image
                src="/images/logo.webp"
                alt="Gadget BD"
                width={150}
                height={50}
                className="h-10 w-auto"
              />
            </Link>

            {/* Tagline */}
            <p className="text-sm text-gray-600 mb-6 text-center sm:text-left">
              Trusted Tech Partner
            </p>

            {/* Social Media Icons */}
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-200 hover:bg-orange-500 text-gray-600 hover:text-white rounded-full flex items-center justify-center transition-all duration-300"
                aria-label="Facebook"
              >
                <FaFacebookF size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-200 hover:bg-orange-500 text-gray-600 hover:text-white rounded-full flex items-center justify-center transition-all duration-300"
                aria-label="Instagram"
              >
                <FaInstagram size={18} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-200 hover:bg-orange-500 text-gray-600 hover:text-white rounded-full flex items-center justify-center transition-all duration-300"
                aria-label="YouTube"
              >
                <FaYoutube size={18} />
              </a>
              <a
                href="https://wa.me/88010006666"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-200 hover:bg-orange-500 text-gray-600 hover:text-white rounded-full flex items-center justify-center transition-all duration-300"
                aria-label="WhatsApp"
              >
                <FaWhatsapp size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Contact Us */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 md:mb-6">
              Contact Us
            </h3>
            <ul className="space-y-3 md:space-y-4">
              <li>
                <a
                  href="mailto:mail@gmail.com"
                  className="flex items-center gap-3 text-gray-600 hover:text-orange-500 transition-colors"
                >
                  <HiMail className="text-orange-500 shrink-0" size={20} />
                  <span className="text-sm">mail@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+88010006666"
                  className="flex items-center gap-3 text-gray-600 hover:text-orange-500 transition-colors"
                >
                  <HiPhone className="text-orange-500 shrink-0" size={20} />
                  <span className="text-sm">+88010006666</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-gray-600">
                  <HiLocationMarker
                    className="text-orange-500 shrink-0 mt-0.5"
                    size={20}
                  />
                  <span className="text-sm">Mirpur 10, Dhaka, Bangladesh</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 md:mb-6">
              Quick Links
            </h3>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <Link
                  href="/return-refund-policy"
                  className="text-sm text-gray-600 hover:text-orange-500 transition-colors"
                >
                  Return & Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-sm text-gray-600 hover:text-orange-500 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-conditions"
                  className="text-sm text-gray-600 hover:text-orange-500 transition-colors"
                >
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/about-us"
                  className="text-sm text-gray-600 hover:text-orange-500 transition-colors"
                >
                  About us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Useful Links */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 md:mb-6">
              Useful Links
            </h3>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <Link
                  href="/why-shop-online"
                  className="text-sm text-gray-600 hover:text-orange-500 transition-colors"
                >
                  Why Shop Online with Us
                </Link>
              </li>
              <li>
                <Link
                  href="/payment-methods"
                  className="text-sm text-gray-600 hover:text-orange-500 transition-colors"
                >
                  Online Payment Methods
                </Link>
              </li>
              <li>
                <Link
                  href="/after-sales-support"
                  className="text-sm text-gray-600 hover:text-orange-500 transition-colors"
                >
                  After Sales Support
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-gray-600 hover:text-orange-500 transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Section */}
      <div className="bg-gray-200 border-t border-gray-300">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <p className="text-xs md:text-sm text-gray-600 text-center">
            © {new Date().getFullYear()} Gadget BD. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
