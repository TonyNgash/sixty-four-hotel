// ──────────────────────────────────────────────────────────────
// components/frontend/home-sections/restaurant/restaurant-section.tsx
// ──────────────────────────────────────────────────────────────

import { getMenuHighlights } from '@/lib/home-data/restaurant-data';
import MenuCard from './menu-card';
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export default async function RestaurantSection() {
  const menu = await getMenuHighlights();

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 text-center">
        {/* Title */}
        <h2
          className={`${playfair.className} text-5xl md:text-7xl font-bold text-gray-900 mb-4`}
        >
          Order From Our Fine Restaurant
        </h2>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mt-16">
          {menu.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}