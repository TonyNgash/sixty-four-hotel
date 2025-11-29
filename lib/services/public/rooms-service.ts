// lib/services/public/rooms-service.ts
import { db } from '@/lib/database';
import {
  roomCategories,
  rooms,
  roomImages,
  amenities,
  roomAmenities,
  viewTypes,
} from '@/lib/database/schema';
import { eq, and } from 'drizzle-orm';
import { PublicRoom } from '@/types/public/public-rooms';
import { PublicRoomDetail } from '@/types/public/public-room-detail';

const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

// ————————————————————————————————————————
// 1. LIST ROOMS BY CATEGORY SLUG (already working perfectly)
// ————————————————————————————————————————
export async function getRoomsByCategorySlug(slug: string): Promise<{
  category: { id: number; name: string; slug: string } | null;
  rooms: PublicRoom[];
}> {
  const categories = await db
    .select({
      id: roomCategories.id,
      name: roomCategories.name,
      base_price: roomCategories.base_price,
      max_occupancy: roomCategories.max_occupancy,
    })
    .from(roomCategories);

  const matchedCategory = categories.find((cat) => slugify(cat.name) === slug);

  if (!matchedCategory) {
    return { category: null, rooms: [] };
  }

  const categorySlug = slugify(matchedCategory.name);

  const roomsResult = await db
    .select({
      id: rooms.id,
      roomNumber: rooms.room_number,
      primaryImageUrl: roomImages.image_url,
    })
    .from(rooms)
    .leftJoin(
      roomImages,
      and(eq(roomImages.room_id, rooms.id), eq(roomImages.is_primary, true))
    )
    .where(eq(rooms.category_id, matchedCategory.id));

  const roomsList: PublicRoom[] = roomsResult.map((r) => ({
    id: r.id,
    roomNumber: r.roomNumber,
    categoryId: matchedCategory.id,
    categoryName: matchedCategory.name,
    categorySlug,
    basePrice: Number(matchedCategory.base_price) / 100,
    maxOccupancy: matchedCategory.max_occupancy,
    primaryImageUrl: r.primaryImageUrl ?? '/images/fallback-room.webp',
  }));

  return {
    category: {
      id: matchedCategory.id,
      name: matchedCategory.name,
      slug: categorySlug,
    },
    rooms: roomsList,
  };
}

// ————————————————————————————————————————
// 2. SINGLE ROOM DETAIL (final, null-safe version)
// ————————————————————————————————————————
export async function getRoomDetailById(roomId: number): Promise<PublicRoomDetail | null> {
  // 1. Get room + category + view
  const roomData = await db
    .select({
      roomId: rooms.id,
      roomNumber: rooms.room_number,
      categoryId: roomCategories.id,
      categoryName: roomCategories.name,
      categoryDescription: roomCategories.description,
      basePriceCents: roomCategories.base_price,
      maxOccupancy: roomCategories.max_occupancy,
      featuredImageUrl: roomCategories.featured_image_url,
      viewName: viewTypes.name,
    })
    .from(rooms)
    .leftJoin(roomCategories, eq(rooms.category_id, roomCategories.id))
    .leftJoin(viewTypes, eq(rooms.view_type_id, viewTypes.id))
    .where(eq(rooms.id, roomId))
    .limit(1);

  if (roomData.length === 0) return null;

  const data = roomData[0];

  // Critical guard: room must have category and occupancy
  if (!data.categoryName || !data.maxOccupancy) {
    return null;
  }

  const categorySlug = slugify(data.categoryName);

  // 2. Get images
  const images = await db
    .select({
      imageUrl: roomImages.image_url,
      isPrimary: roomImages.is_primary,
    })
    .from(roomImages)
    .where(eq(roomImages.room_id, roomId));

  // 3. Get amenities
  const amenityRows = await db
    .select({
      name: amenities.name,
      icon: amenities.icon,
      description: amenities.description,
    })
    .from(roomAmenities)
    .innerJoin(amenities, eq(roomAmenities.amenity_id, amenities.id))
    .where(eq(roomAmenities.room_id, roomId));

  const amenitiesList = amenityRows
    .filter((row) => row.name)
    .map((row) => ({
      name: row.name!,
      icon: row.icon ?? '',           // empty string = fallback to dot later
      description: row.description ?? '',
    }));

  // Primary image with fallback
  const primaryImage =
    images.find((img) => img.isPrimary)?.imageUrl ??
    data.featuredImageUrl ??
    '/images/fallback-room.webp';

  const gallery = [
    primaryImage,
    ...images
      .filter((img) => img.imageUrl && !img.isPrimary)
      .map((img) => img.imageUrl!),
  ];

  return {
    id: data.roomId,
    roomNumber: data.roomNumber,
    categoryName: data.categoryName,
    categorySlug,
    basePrice: Number(data.basePriceCents) / 100,
    maxOccupancy: data.maxOccupancy,
    description: data.categoryDescription ?? '',
    size: '45 m²',
    bedType: 'King Bed',
    view: data.viewName ?? 'Garden View',
    primaryImageUrl: primaryImage,
    gallery,
    amenities: amenitiesList,
  };
}