// app/(frontend)/(pages)/accommodation/[slug]/page.tsx
import { notFound } from 'next/navigation';

import { getRoomsByCategorySlug } from '@/lib/services/public/rooms-service';
import RoomGrid from '@/components/frontend/pages/rooms-grid';
import CategoryHero from '@/components/frontend/pages/category-hero';
import PagesCta from '@/components/frontend/pages/pages-cta';

export const revalidate = 3600;

interface Params {
  slug: string;
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const { category } = await getRoomsByCategorySlug(slug);
  if (!category) return { title: 'Category Not Found' };

  return {
    title: `${category.name} - SixtyFour Hotel`,
    description: `Browse all available ${category.name} rooms at SixtyFour Hotel & Apartments`,
  };
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { slug } = await params;
  const { category, rooms } = await getRoomsByCategorySlug(slug);

  if (!category) {
    notFound();
  }

  return (
    <>
      <CategoryHero
        title={category.name}
        subtitle="Rooms in this category"
        backgroundImage="/images/frontend/air_bnb.jpeg"
      />

      <RoomGrid rooms={rooms} categoryName={category.name} />

      <PagesCta />
    </>
  );
}