// /lib/database/queries/room-images.ts
import { db } from '@/lib/database';
import { roomImages } from '@/lib/database/schema';
import { eq, and, inArray, sql } from 'drizzle-orm';
import type { RoomImage, RoomImageInsert, RoomImageUpdate } from '@/types/database';

/**
 * Get all images for a room ordered by sort_order (primary first)
 */
export async function getRoomImagesByRoomId(roomId: number): Promise<RoomImage[]> {
  const results = await db
    .select()
    .from(roomImages)
    .where(eq(roomImages.room_id, roomId))
    .orderBy(roomImages.sort_order);

  // Map database results to RoomImage type, ensuring no null values
  return results.map((image): RoomImage => ({
    id: image.id,
    room_id: image.room_id,
    image_url: image.image_url,
    alt_text: image.alt_text,
    sort_order: image.sort_order ?? 0, // Provide default if null
    is_primary: image.is_primary ?? false, // Provide default if null
    created_at: image.created_at,
  }));
}

/**
 * Get primary (featured) image for a room
 */
export async function getPrimaryRoomImage(roomId: number): Promise<RoomImage | null> {
  const result = await db
    .select()
    .from(roomImages)
    .where(
      and(
        eq(roomImages.room_id, roomId),
        eq(roomImages.is_primary, true)
      )
    )
    .limit(1);

  if (!result[0]) {
    return null;
  }

  const image = result[0];
  // Map database result to RoomImage type, ensuring no null values
  return {
    id: image.id,
    room_id: image.room_id,
    image_url: image.image_url,
    alt_text: image.alt_text,
    sort_order: image.sort_order ?? 0, // Provide default if null
    is_primary: image.is_primary ?? false, // Provide default if null
    created_at: image.created_at,
  };
}

/**
 * Get room image by ID
 */
export async function getRoomImageById(id: number): Promise<RoomImage | null> {
  const result = await db
    .select()
    .from(roomImages)
    .where(eq(roomImages.id, id))
    .limit(1);

  if (!result[0]) {
    return null;
  }

  const image = result[0];
  // Map database result to RoomImage type, ensuring no null values
  return {
    id: image.id,
    room_id: image.room_id,
    image_url: image.image_url,
    alt_text: image.alt_text,
    sort_order: image.sort_order ?? 0, // Provide default if null
    is_primary: image.is_primary ?? false, // Provide default if null
    created_at: image.created_at,
  };
}

/**
 * Create a new room image
 */
export async function createRoomImage(data: RoomImageInsert): Promise<RoomImage> {
  // If this is being set as primary, unset primary flag from other images for this room
  if (data.isPrimary) {
    await db
      .update(roomImages)
      .set({ is_primary: false })
      .where(eq(roomImages.room_id, data.roomId));
  }

  const result = await db
    .insert(roomImages)
    .values({
      room_id: data.roomId,
      image_url: data.imageUrl,
      alt_text: data.altText || null,
      sort_order: data.sortOrder ?? 0, // Use nullish coalescing to ensure non-null
      is_primary: data.isPrimary ?? false, // Use nullish coalescing to ensure non-null
    })
    .returning();

  const image = result[0];
  // Map database result to RoomImage type, ensuring no null values
  return {
    id: image.id,
    room_id: image.room_id,
    image_url: image.image_url,
    alt_text: image.alt_text,
    sort_order: image.sort_order ?? 0, // Provide default if null
    is_primary: image.is_primary ?? false, // Provide default if null
    created_at: image.created_at,
  };
}

/**
 * Create multiple room images in bulk
 */
export async function createRoomImagesBulk(images: RoomImageInsert[]): Promise<RoomImage[]> {
  if (images.length === 0) return [];

  // If any image is marked as primary, unset primary flag from existing images for those rooms
  const primaryImages = images.filter(img => img.isPrimary);
  const roomIdsWithNewPrimary = [...new Set(primaryImages.map(img => img.roomId))];
  
  for (const roomId of roomIdsWithNewPrimary) {
    await db
      .update(roomImages)
      .set({ is_primary: false })
      .where(eq(roomImages.room_id, roomId));
  }

  const result = await db
    .insert(roomImages)
    .values(
      images.map(image => ({
        room_id: image.roomId,
        image_url: image.imageUrl,
        alt_text: image.altText || null,
        sort_order: image.sortOrder ?? 0, // Use nullish coalescing to ensure non-null
        is_primary: image.isPrimary ?? false, // Use nullish coalescing to ensure non-null
      }))
    )
    .returning();

  // Map database results to RoomImage type, ensuring no null values
  return result.map((image): RoomImage => ({
    id: image.id,
    room_id: image.room_id,
    image_url: image.image_url,
    alt_text: image.alt_text,
    sort_order: image.sort_order ?? 0, // Provide default if null
    is_primary: image.is_primary ?? false, // Provide default if null
    created_at: image.created_at,
  }));
}

/**
 * Update a room image
 */
export async function updateRoomImage(id: number, data: RoomImageUpdate): Promise<RoomImage | null> {
  // If this is being set as primary, unset primary flag from other images for the same room
  if (data.isPrimary) {
    const existingImage = await getRoomImageById(id);
    if (existingImage && existingImage.room_id !== null) {
      await db
        .update(roomImages)
        .set({ is_primary: false })
        .where(
          and(
            eq(roomImages.room_id, existingImage.room_id),
            sql`${roomImages.id} != ${id}`
          )
        );
    }
  }

  const updateData: {
    image_url?: string;
    alt_text?: string | null;
    sort_order?: number;
    is_primary?: boolean;
  } = {};

  if (data.imageUrl !== undefined) updateData.image_url = data.imageUrl;
  if (data.altText !== undefined) updateData.alt_text = data.altText;
  if (data.sortOrder !== undefined) updateData.sort_order = data.sortOrder;
  if (data.isPrimary !== undefined) updateData.is_primary = data.isPrimary;

  // Only update if there are fields to update
  if (Object.keys(updateData).length === 0) {
    return getRoomImageById(id);
  }

  const result = await db
    .update(roomImages)
    .set(updateData)
    .where(eq(roomImages.id, id))
    .returning();

  if (!result[0]) {
    return null;
  }

  const image = result[0];
  // Map database result to RoomImage type, ensuring no null values
  return {
    id: image.id,
    room_id: image.room_id,
    image_url: image.image_url,
    alt_text: image.alt_text,
    sort_order: image.sort_order ?? 0, // Provide default if null
    is_primary: image.is_primary ?? false, // Provide default if null
    created_at: image.created_at,
  };
}

/**
 * Set an image as primary for a room
 */
export async function setRoomImageAsPrimary(imageId: number): Promise<RoomImage | null> {
  const image = await getRoomImageById(imageId);
  if (!image || image.room_id === null) {
    return null;
  }

  // Unset primary flag from other images for this room
  await db
    .update(roomImages)
    .set({ is_primary: false })
    .where(
      and(
        eq(roomImages.room_id, image.room_id),
        sql`${roomImages.id} != ${imageId}`
      )
    );

  // Set this image as primary
  const result = await db
    .update(roomImages)
    .set({ is_primary: true })
    .where(eq(roomImages.id, imageId))
    .returning();

  if (!result[0]) {
    return null;
  }

  const updatedImage = result[0];
  // Map database result to RoomImage type, ensuring no null values
  return {
    id: updatedImage.id,
    room_id: updatedImage.room_id,
    image_url: updatedImage.image_url,
    alt_text: updatedImage.alt_text,
    sort_order: updatedImage.sort_order ?? 0, // Provide default if null
    is_primary: updatedImage.is_primary ?? false, // Provide default if null
    created_at: updatedImage.created_at,
  };
}

/**
 * Delete a room image
 */
export async function deleteRoomImage(id: number): Promise<RoomImage | null> {
  const result = await db
    .delete(roomImages)
    .where(eq(roomImages.id, id))
    .returning();

  if (!result[0]) {
    return null;
  }

  const image = result[0];
  // Map database result to RoomImage type, ensuring no null values
  return {
    id: image.id,
    room_id: image.room_id,
    image_url: image.image_url,
    alt_text: image.alt_text,
    sort_order: image.sort_order ?? 0, // Provide default if null
    is_primary: image.is_primary ?? false, // Provide default if null
    created_at: image.created_at,
  };
}

/**
 * Delete all images for a room
 */
export async function deleteRoomImagesByRoomId(roomId: number): Promise<{ success: boolean; deletedCount: number }> {
  const result = await db
    .delete(roomImages)
    .where(eq(roomImages.room_id, roomId))
    .returning();

  return {
    success: true,
    deletedCount: result.length
  };
}

/**
 * Reorder room images
 */
export async function reorderRoomImages(roomId: number, imageOrder: { id: number; sortOrder: number }[]): Promise<boolean> {
  try {
    for (const { id, sortOrder } of imageOrder) {
      await db
        .update(roomImages)
        .set({ sort_order: sortOrder })
        .where(
          and(
            eq(roomImages.id, id),
            eq(roomImages.room_id, roomId)
          )
        );
    }
    return true;
  } catch (error) {
    console.error('Error reordering room images:', error);
    return false;
  }
}

/**
 * Check if room has any images
 */
export async function roomHasImages(roomId: number): Promise<boolean> {
  const result = await db
    .select({ id: roomImages.id })
    .from(roomImages)
    .where(eq(roomImages.room_id, roomId))
    .limit(1);

  return result.length > 0;
}

/**
 * Get image count for a room
 */
export async function getRoomImageCount(roomId: number): Promise<number> {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(roomImages)
    .where(eq(roomImages.room_id, roomId));

  return result[0]?.count || 0;
}