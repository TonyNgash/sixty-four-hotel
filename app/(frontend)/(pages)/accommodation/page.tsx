// app/(frontend)/(pages)/accommodation/page.tsx
import { getPublicRoomCategories } from '@/lib/services/public/room-category-service';
import CategoryGrid from '@/components/frontend/pages/category-grid';
import AccommodationHero from '@/components/frontend/pages/accommodation-hero';
import PagesCta from '@/components/frontend/pages/pages-cta';

export const revalidate = 3600; // Cache for 1 hour

export default async function AccommodationPage() {
  const categories = await getPublicRoomCategories();

  return (
    <>
      <AccommodationHero
        title="Our Room Types"
        subtitle="Choose the type of stay you're looking for below."
        backgroundImage="/images/frontend/bg_04.jpg"
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