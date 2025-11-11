// ──────────────────────────────────────────────────────────────
// components/frontend/home-sections/room-categories/room-categories-section.tsx
// ──────────────────────────────────────────────────────────────

import { getRoomCategories } from '@/lib/home-data/room-categories-data';
import CategoryCard from './category-card';
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export default async function RoomCategoriesSection() {
  const categories = await getRoomCategories();

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 text-center">
        {/* Title */}
        <h2
          className={`${playfair.className} text-5xl md:text-6xl font-bold text-gray-900 mb-4`}
        >
          Explore Our Rooms
        </h2>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-600 font-montserrat max-w-2xl mx-auto mb-12">
          From intimate single rooms to luxurious furnished apartments — find your perfect stay.
        </p>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}