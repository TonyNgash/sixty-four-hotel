// File: app/(frontend)/home-config/sections-config.ts
// Purpose: This file defines the configuration array for all home page sections. 
// It starts with the hero section as the first entry, marked as non-lazy for critical loading. 
// Future sections (e.g., room-categories) can be added here as objects in the array. 
// Each section object includes metadata for rendering, such as ID, title for accessibility, the component path for dynamic import (not used for hero since it's static), a lazy flag, and static props specific to the section (e.g., hero text and button details). This makes the home page extensible without changing page.tsx. 
// Types are defined inline with a discriminated union for type safety based on section ID.

interface HeroProps {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonColor: string;
}

interface BaseSectionConfig {
  id: string;
  title: string;
  componentPath: string;
  lazy: boolean;
}

// ── Hero Section ──
interface HeroSectionConfig extends BaseSectionConfig {
  id: 'hero';
  props: HeroProps;
}


// ── Room Categories Section ──
interface RoomCategoriesSectionConfig extends BaseSectionConfig {
  id: 'room-categories';
  subtitle: string;
  props: Record<string, never>; // No props needed — data from service
}

// ── NIGHT CLUB SECTION ──
interface NightClubSectionConfig extends BaseSectionConfig {
  id: 'night-club';
  props: Record<string, never>; // Data from service
}

// ── RESTAURANT SECTION ──
interface RestaurantSectionConfig extends BaseSectionConfig {
  id: 'restaurant';
  props: Record<string, never>;
}

// ── LOCATION SECTION ──
interface LocationSectionConfig extends BaseSectionConfig {
  id: 'location';
  props: Record<string, never>;
}


// Union for all section types (extend this union for future sections, e.g., | RoomCategoriesConfig)
// ── UNION ──
export type HomeSectionConfig =
  | HeroSectionConfig
  | RoomCategoriesSectionConfig
  | NightClubSectionConfig
  | RestaurantSectionConfig
  | LocationSectionConfig;


export const sections: HomeSectionConfig[] = [
  {
    id: 'hero',
    title: 'Welcome to SixtyFour Hotel',
    componentPath: '@/components/frontend/home-sections/hero/hero-section',
    lazy: false,
    props: {
      title: 'SixtyFour',
      subtitle: 'Hotel & Apartments',
      description: 'We have \"Air Bnbs\" as well. Located in the heart of Limuru Town.',
      buttonText: 'BOOK A ROOM TODAY',
      buttonColor: '#EB1B69',
    },
  },

  // ── ROOM CATEGORIES (NEW) ──
  {
    id: 'room-categories',
    title: 'Our Room Categories',
    subtitle: 'From intimate single rooms to luxurious furnished apartments and Air BnBs — find your perfect stay.',
    componentPath: '@/components/frontend/home-sections/room-categories/room-categories-section',
    lazy: true,
    props: {}, // No props — data comes from service
  },

  // ── NIGHT CLUB ──
  {
    id: 'night-club',
    title: 'SixtyFour Night Club',
    componentPath: '@/components/frontend/home-sections/night-club/nightclub-section',
    lazy: true,
    props: {},
  },

  // ── RESTAURANT ──
  {
    id: 'restaurant',
    title: 'Fine Dining at SixtyFour',
    componentPath: '@/components/frontend/home-sections/restaurant/restaurant-section',
    lazy: true,
    props: {},
  },
  {
    id: 'location',
    title: 'Find Us in Limuru',
    componentPath: '@/components/frontend/home-sections/location/location-section',
    lazy: true,
    props: {},
  },

  // Add future sections here, e.g.:
  // {
  //   id: 'room-categories',
  //   title: 'Our Room Categories',
  //   componentPath: '@/components/frontend/home-sections/room-categories/room-categories-section',
  //   lazy: true,
  //   props: { /* type-safe props for that section */ },
  // },
];