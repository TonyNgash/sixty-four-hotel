// ──────────────────────────────────────────────────────────────
// lib/home-data/room-categories-data.ts
// ──────────────────────────────────────────────────────────────

export interface RoomCategory {
  id: number;
  name: string;
  description: string;
  image: string; // path to WebP
  slug: string; // for routing: /accommodation/[category]
}

// ── STATIC DATA (replace with DB query later) ──
const staticData: RoomCategory[] = [
  {
    id: 1,
    name: 'Single Room',
    description: 'Cozy and modern retreat with city views and premium amenities.',
    image: '/images/home/room-categories/single-room.webp',
    slug: 'single',
  },
  {
    id: 2,
    name: 'Double Room',
    description: 'Spacious comfort for two, featuring a king bed and work desk.',
    image: '/images/home/room-categories/double-room.webp',
    slug: 'double',
  },
  {
    id: 3,
    name: 'Furnished Apartment',
    description: 'Fully equipped kitchen, living area, and balcony — home away from home.',
    image: '/images/home/room-categories/apartment.webp',
    slug: 'furnished-apartment',
  },
];

// ── EXPORT ASYNC FUNCTION (swap body later) ──
export const getRoomCategories = async (): Promise<RoomCategory[]> => {
  // NOW: return static
  return staticData;

  // LATER: replace with
  // return db.roomCategory.findMany({ select: { ... } })
};