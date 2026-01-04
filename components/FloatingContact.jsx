'use client';

import { useState } from 'react';
import { FiMessageCircle, FiX, FiPhone } from 'react-icons/fi';
import { FaWhatsapp, FaFacebookMessenger } from 'react-icons/fa';
import { IoLogoInstagram } from 'react-icons/io5';

export default function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle menu open/close
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Contact options with links
  const contactOptions = [
    {
      name: 'Phone',
      icon: <FiPhone size={24} />,
      href: 'tel:+88010006666',
      bgColor: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
    },
    {
      name: 'WhatsApp',
      icon: <FaWhatsapp size={24} />,
      href: 'https://wa.me/88010006666',
      bgColor: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
    },
    {
      name: 'Instagram',
      icon: <IoLogoInstagram size={24} />,
      href: 'https://instagram.com',
      bgColor: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500',
      hoverColor: 'hover:opacity-90',
    },
    {
      name: 'Messenger',
      icon: <FaFacebookMessenger size={24} />,
      href: 'https://m.me/yourpage',
      bgColor: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
    },
  ];

  return (
    <div className="fixed bottom-6 right-4 md:right-6 z-50">
      {/* Contact Options - Show when menu is open */}
      <div
        className={`flex flex-col gap-3 mb-3 transition-all duration-300 ${
          isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        {contactOptions.map((option, index) => (
          <a
            key={option.name}
            href={option.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${option.bgColor} ${option.hoverColor} text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-110`}
            style={{
              transitionDelay: isOpen ? `${index * 50}ms` : '0ms',
            }}
            aria-label={option.name}
          >
            {option.icon}
          </a>
        ))}
      </div>

      {/* Main Toggle Button */}
      <button
        onClick={toggleMenu}
        className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-110 ${
          isOpen
            ? 'bg-orange-500 hover:bg-orange-600 rotate-90'
            : 'bg-orange-500 hover:bg-orange-600'
        }`}
        aria-label="Toggle contact menu"
      >
        {isOpen ? (
          <FiX className="text-white" size={28} />
        ) : (
          <FiMessageCircle className="text-white" size={28} />
        )}
      </button>

      {/* Animated pulse ring */}
      {!isOpen && (
        <div className="absolute top-0 left-0 w-14 h-14 md:w-16 md:h-16 rounded-full bg-orange-500 animate-ping opacity-20 pointer-events-none" />
      )}
    </div>
  );
}
