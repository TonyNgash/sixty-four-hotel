// ──────────────────────────────────────────────────────────────
// app/(frontend)/page.tsx
// ──────────────────────────────────────────────────────────────

import { sections } from './home-config/sections-config';
import HeroSection from '@/components/frontend/home-sections/hero/hero-section';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      {sections.map((section) => {
        // ── HERO: Static render ──
        if (section.id === 'hero') {
          return <HeroSection key={section.id} {...section.props} />;
        }

        // ── ROOM CATEGORIES: Lazy load with props ──
        if (section.id === 'room-categories') {
          const LazyRoomCategories = dynamic(
            () => import('@/components/frontend/home-sections/room-categories/room-categories-section'),
            {
              ssr: true,
              loading: () => (
                <div className="py-24 text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-[#EB1B69]" />
                </div>
              ),
            }
          );

          return (
            <Suspense key={section.id} fallback={null}>
              <LazyRoomCategories
                title={section.title}
                subtitle={section.subtitle as string}
              />
            </Suspense>
          );
        }


        // ── NIGHT CLUB: Lazy load ──
        if (section.id === 'night-club') {
          const LazyNightClub = dynamic(
            () => import('@/components/frontend/home-sections/night-club/night-club-section'),
            {
              ssr: true,
              loading: () => (
                <div className="h-96 flex items-center justify-center bg-gradient-to-r from-purple-900 to-black">
                  <div className="animate-pulse text-white text-2xl">Loading Club...</div>
                </div>
              ),
            }
          );

          return (
            <Suspense key={section.id} fallback={null}>
              <LazyNightClub />
            </Suspense>
          );
        }
        // ── RESTAURANT: Lazy load ──
        if (section.id === 'restaurant') {
          const LazyRestaurant = dynamic(
            () => import('@/components/frontend/home-sections/restaurant/restaurant-section'),
            {
              ssr: true,
              loading: () => (
                <div className="py-24 text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-[#EB1B69]" />
                </div>
              ),
            }
          );

          return (
            <Suspense key={section.id} fallback={null}>
              <LazyRestaurant />
            </Suspense>
          );
        }

        // ── LOCATION: Lazy load ──
        if (section.id === 'location') {
          const LazyLocation = dynamic(
            () => import('@/components/frontend/home-sections/location/location-section'),
            {
              ssr: true,
              loading: () => (
                <div className="py-32 text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-[#EB1B69]" />
                </div>
              ),
            }
          );

          return (
            <Suspense key={section.id} fallback={null}>
              <LazyLocation />
            </Suspense>
          );
        }

        return null;
      })}
    </main>
  );
}