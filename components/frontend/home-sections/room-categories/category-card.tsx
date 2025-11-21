'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PublicRoomCategory } from '@/types/public/public-room-category';

interface CategoryCardProps {
  category: PublicRoomCategory;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <div className="group relative bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl">
      <div className="relative h-64 md:h-72 overflow-hidden">
        <Image
          src={category.imageUrl}
          alt={category.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
        />
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity"
          style={{
            background: 'radial-gradient(circle at center, rgba(255,249,199,0.4) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="p-6 space-y-3">
        <h3 className="text-2xl font-playfair font-semibold text-gray-900">
          {category.name}
        </h3>
        <p className="text-gray-600 font-montserrat text-sm leading-relaxed">
          {category.description}
        </p>

        <Link
          href={`/accommodation/${category.slug}`}
          className="inline-block mt-4 px-6 py-2 bg-[#EB1B69] text-white font-montserrat text-sm font-medium rounded-md hover:bg-[#d4165a] transition-colors"
        >
          View Available Rooms
        </Link>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
    </div>
  );
}