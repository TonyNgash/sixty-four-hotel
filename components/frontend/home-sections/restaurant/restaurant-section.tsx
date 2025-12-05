// components/frontend/home-sections/restaurant/new-menu-section.tsx
'use client';

import { useState } from 'react';
import { categories } from '@/lib/home-data/restaurant-data';
import MenuModal from './menu-modal';
import Image from 'next/image';


export default function NewMenuSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const openModal = (catKey: string) => {
    setActiveCategory(catKey);
    setIsModalOpen(true);
  };

  return (
    <>
      <section className="py-24 md:py-32 overflow-hidden bg-gradient-to-br from-amber-50 via-white to-pink-50">
        <div className="container mx-auto px-6 md:px-12">
          {/* Hero Title */}
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 font-playfair leading-tight">
              Culinary Excellence
            </h2>
            <p className="mt-6 text-xl md:text-2xl text-gray-700 font-light italic">
              Crafted with passion. Served with pride.
            </p>
            {/* Subtle CTA */}
            <div className="text-center mt-20">
                <p className="text-gray-600 text-lg italic font-light">
                Tap any category to explore our full menu
                </p>
            </div>
          </div>

          {/* Asymmetric Luxury Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
            {/* Breakfast — Tall */}
            <div
              onClick={() => openModal('breakfast')}
              className="group relative col-span-2 row-span-2 cursor-pointer overflow-hidden rounded-3xl shadow-2xl transition-all duration-700 hover:shadow-3xl hover:-translate-y-2"
            >
              <Image
                src={categories[0].image}
                alt={categories[0].label}
                width={800}
                height={800}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 p-10 text-white">
                <h3 className="text-4xl md:text-5xl font-bold font-playfair mb-2">Breakfast</h3>
                <p className="text-lg opacity-90">Rise & Dine in Style</p>
              </div>
            </div>

            {/* Hot Beverages */}
            <div
              onClick={() => openModal('hot-beverages')}
              className="group relative overflow-hidden rounded-3xl shadow-xl cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
            >
              <Image 
                src={categories[1].image} 
                alt={categories[1].label}
                width={800}
                height={800}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <h4 className="text-2xl font-bold font-playfair">Hot Beverages</h4>
              </div>
            </div>

            {/* Snacks */}
            
            <div
              onClick={() => openModal('snacks')}
              className="group relative overflow-hidden rounded-3xl shadow-xl cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
            >
              <Image 
              src={categories[2].image} 
              alt={categories[2].label}
              width={800}
              height={800}
              className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <h4 className="text-2xl font-bold font-playfair">Snacks</h4>
              </div>
            </div>

            {/* Quick Bites — Wide */}
            <div
              onClick={() => openModal('quick-bites')}
              className="group relative col-span-2 overflow-hidden rounded-3xl shadow-2xl cursor-pointer transition-all duration-700 hover:shadow-3xl hover:-translate-y-2"
            >
              <Image 
                src={categories[3].image} 
                alt={categories[3].label}
                width={800}
                height={800}
                className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 left-0 p-10 text-white">
                <h3 className="text-4xl font-bold font-playfair">Quick Bites</h3>
                <p className="text-lg opacity-90">Bold Flavors, Fast</p>
              </div>
            </div>

            {/* Soups */}
            <div
              onClick={() => openModal('soups')}
              className="group relative overflow-hidden rounded-3xl shadow-xl cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
            >
              <Image 
                src={categories[4].image} 
                alt={categories[4].label}
                width={800}
                height={800}
                className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <h4 className="text-2xl font-bold font-playfair">Soups</h4>
              </div>
            </div>

            {/* Main Dishes — Hero Wide */}
            <div
              onClick={() => openModal('main-dishes')}
              className="group relative col-span-2 md:col-span-3 overflow-hidden rounded-3xl shadow-2xl cursor-pointer transition-all duration-700 hover:shadow-4xl hover:-translate-y-4"
            >
              <Image 
                src={categories[5].image} 
                alt={categories[5].label}
                width={800}
                height={800}
              className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-1200" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-12 text-white">
                <h3 className="text-5xl md:text-6xl font-bold font-playfair mb-3">Main Dishes</h3>
                <p className="text-xl md:text-2xl opacity-95">Signature Plates • Unforgettable Taste</p>
              </div>
            </div>

            {/* Accompaniments */}
            <div
              onClick={() => openModal('accompaniments')}
              className="group relative overflow-hidden rounded-3xl shadow-xl cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
            >
              <Image 
                src={categories[6].image} 
                alt={categories[6].label}
                width={800}
                height={800} 
                className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <h4 className="text-2xl font-bold font-playfair">Accompaniments</h4>
              </div>
            </div>
          </div>

          
        </div>
      </section>

      <MenuModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialCategoryKey={activeCategory}
      />
    </>
  );
}