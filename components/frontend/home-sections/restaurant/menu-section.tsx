// components/frontend/home-sections/restaurant/new-menu-section.tsx
'use client';

import { useState, useEffect } from 'react';
import { categories } from '@/lib/home-data/restaurant-data';
import MenuModal from './menu-modal';

export default function NewMenuSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const openModal = (catKey: string) => {
    setActiveCategory(catKey);
    setIsModalOpen(true);
  };

  return (
    <>
      <section className="py-20 md:py-28 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="pt-10 pb-16 text-5xl md:text-7xl font-bold text-gray-900 font-playfair">
            Order From Our Fine Restaurant
          </h2>

          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => openModal(cat.key)}
                className="px-8 py-4 bg-white border-2 border-gray-200 rounded-full text-lg font-medium text-gray-800 hover:bg-[#EB1B69] hover:text-white hover:border-[#EB1B69] transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1"
              >
                {cat.label}
              </button>
            ))}
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