// components/frontend/pages/category-grid.tsx
import Image from 'next/image';
import Link from 'next/link';
import { PublicRoomCategory } from '@/types/public/public-room-category';

interface CategoryGridProps {
  categories: PublicRoomCategory[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="py-16 container mx-auto px-4">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/accommodation/${cat.slug}`}
            className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 block"
          >
            <div className="relative h-64">
              <Image
                src={cat.imageUrl}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold">
                KSh {cat.basePrice.toLocaleString()}/night
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{cat.name}</h3>
              <p className="text-gray-600 text-sm line-clamp-2">{cat.description}</p>
              <div className="mt-4 text-pink-600 font-medium">View Available Rooms →</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}