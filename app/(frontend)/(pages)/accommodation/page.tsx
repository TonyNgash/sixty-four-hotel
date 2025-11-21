// app/(frontend)/(pages)/accommodation/page.tsx
import { getPublicRoomCategories } from '@/lib/services/public/room-category-service';
import CategoryGrid from '@/components/frontend/pages/category-grid';
import PagesHero from '@/components/frontend/pages/pages-hero';
import PagesCta from '@/components/frontend/pages/pages-cta';

export const revalidate = 3600; // Cache for 1 hour

export default async function AccommodationPage() {
  const categories = await getPublicRoomCategories();

  return (
    <>
      <PagesHero
        title="Our Room Types"
        subtitle="Choose the type of stay you're looking for below."
        backgroundImage="/images/frontend/bg_01.jpeg"
      />

      <CategoryGrid categories={categories} />

      <PagesCta
        title="Ready to Book Your Stay?"
        subtitle="Contact our reservations team to check availability and make your booking"
        bgColor="bg-pink-600"
      />
    </>
  );
}