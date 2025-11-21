// components/frontend/home-sections/room-categories/room-categories-section.tsx
import { getPublicRoomCategories } from '@/lib/services/public/room-category-service';
import CategoryCard from './category-card';
import { Playfair_Display } from 'next/font/google';
import { PublicRoomCategory } from '@/types/public/public-room-category';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

interface RoomCategoriesSectionProps {
  title: string;
  subtitle: string;
}

export default async function RoomCategoriesSection({
  title,
  subtitle,
}: RoomCategoriesSectionProps) {
  const categories: PublicRoomCategory[] = await getPublicRoomCategories();

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 text-center">
        <h2
          id="room-categories-section"
          className={`${playfair.className} text-5xl md:text-6xl font-bold text-gray-900 mb-4`}
        >
          {title}
        </h2>

        <p className="text-lg md:text-xl text-gray-600 font-montserrat max-w-2xl mx-auto mb-12">
          {subtitle}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {categories.length === 0 ? (
            <p className="col-span-full text-gray-500">No room categories available.</p>
          ) : (
            categories.map((cat) => <CategoryCard key={cat.id} category={cat} />)
          )}
        </div>
      </div>
    </section>
  );
}