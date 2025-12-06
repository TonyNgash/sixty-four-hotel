// components/layout/header.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      {/* Top Bar with Logo and Navigation */}
      <div className="bg-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            {/* Replace the logo div with this: */}
            <Link href="/" className="flex items-center space-x-3">
              <Image 
                src="/images/frontend/sixty_four_logo-_no_bg_cropped.png" 
                alt="SixtyFour Hotel" 
                className="h-10 w-auto"
                width={160}
                height={40}
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-pink-600 font-medium transition-colors duration-300 relative group"
              >
                HOME
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                href="/accommodation" 
                className="text-gray-700 hover:text-pink-600 font-medium transition-colors duration-300 relative group"
              >
                ACCOMMODATION
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                href="/about" 
                className="text-gray-700 hover:text-pink-600 font-medium transition-colors duration-300 relative group"
              >
                ABOUT
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                href="/contact" 
                className="text-gray-700 hover:text-pink-600 font-medium transition-colors duration-300 relative group"
              >
                CONTACTS
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </nav>

            {/* Login Button & Mobile Menu */}
            <div className="flex items-center space-x-4">
              {/* Login Button */}
              <Link 
                href="/login"
                className="hidden md:flex items-center space-x-2 bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300 shadow-md hover:shadow-lg">
                  <span>LOGIN</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
              </Link>
                

              {/* Mobile Menu Button */}
              <button 
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
              <nav className="flex flex-col space-y-4">
                <Link 
                  href="/" 
                  className="text-gray-700 hover:text-pink-600 font-medium py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  HOME
                </Link>
                <Link 
                  href="/accommodation" 
                  className="text-gray-700 hover:text-pink-600 font-medium py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ACCOMMODATION
                </Link>
                <Link 
                  href="/about" 
                  className="text-gray-700 hover:text-pink-600 font-medium py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ABOUT
                </Link>
                <Link 
                  href="/contact" 
                  className="text-gray-700 hover:text-pink-600 font-medium py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  CONTACTS
                </Link>
                <button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 mt-2">
                  LOGIN
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}