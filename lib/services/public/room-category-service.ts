// lib/services/public/room-category-service.ts

import { db } from '@/lib/database';
import { roomCategories } from '@/lib/database/schema';
import { PublicRoomCategory } from '@/types/public/public-room-category';
import { asc } from 'drizzle-orm';

export async function getPublicRoomCategories(): Promise<PublicRoomCategory[]> {
  const categories = await db
    .select({
      id: roomCategories.id,
      name: roomCategories.name,
      description: roomCategories.description,
      base_price: roomCategories.base_price,
      max_occupancy: roomCategories.max_occupancy,
      featured_image_url: roomCategories.featured_image_url,
    })
    .from(roomCategories)
    .orderBy(asc(roomCategories.name));

  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    description: cat.description ?? '',
    // Generate slug from name — safe, SEO-friendly, unique enough for now
    slug: cat.name
      .toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start
      .replace(/-+$/, ''),            // Trim - from end
    imageUrl: cat.featured_image_url ?? '/images/fallback-room.webp',
    basePrice: Number(cat.base_price) / 100, // cents → dollars
    capacity: cat.max_occupancy,
  }));
}