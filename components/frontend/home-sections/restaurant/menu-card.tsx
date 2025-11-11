// ──────────────────────────────────────────────────────────────
// components/frontend/home-sections/restaurant/menu-card.tsx
// ──────────────────────────────────────────────────────────────

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MenuItem } from '@/lib/home-data/restaurant-data';

interface MenuCardProps {
  item: MenuItem;
}

export default function MenuCard({ item }: MenuCardProps) {
  return (
    <div className="group relative bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl">
      {/* Image */}
      <div className="relative h-56 md:h-64 overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          loading="lazy"
        />
        {/* Warm glow overlay on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity"
          style={{
            background: 'radial-gradient(circle at center, rgba(255,249,199,0.4) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="p-5 space-y-2">
        <h3 className="text-xl font-playfair font-semibold text-gray-900">
          {item.name}
        </h3>
        <p className="text-gray-600 font-montserrat text-sm leading-relaxed">
          {item.description}
        </p>
        <p className="text-lg font-montserrat font-bold text-gray-800">
          {item.price}
        </p>

        {/* CTA Button */}
        <Link
          href={`/menu/${item.slug}`}
          className="inline-block mt-3 px-6 py-2 bg-[#EB1B69] text-white font-montserrat text-sm font-medium rounded-full hover:bg-[#d4165a] transition-colors"
        >
          Order Now
        </Link>
      </div>

      {/* Bottom fade + shadow */}
      {/* <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" /> */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
    </div>
  );
}