import { db } from '@/lib/database';
import { rooms, roomAmenities, roomCategories, viewTypes, amenities, roomImages } from '@/lib/database/schema';
import { eq, and, desc, inArray, sql } from 'drizzle-orm';
import type { Room, RoomWithRelations, RoomInsert, RoomUpdate, RoomImage, Amenity, RoomCategory, ViewType } from '@/types/database';
import { RoomImageInsert } from '@/types/database';
export interface RoomAmenityInsert {
  roomId: number;
  amenityId: number;
}

// First, define the room image functions that we'll use internally
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

async function createRoomImagesBulk(images: Array<{
  roomId: number;
  imageUrl: string;
  altText?: string;
  sortOrder?: number;
  isPrimary?: boolean;
}>): Promise<RoomImage[]> {
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
 * Get all rooms with their relationships including images
 */
export async function getAllRooms(): Promise<RoomWithRelations[]> {
  const roomResults = await db
    .select()
    .from(rooms)
    .orderBy(desc(rooms.created_at));

  // Fetch relationships for all rooms
  const roomsWithRelations = await Promise.all(
    roomResults.map(async (room) => {
      const [category, viewType, roomAmenitiesList, roomImagesList] = await Promise.all([
        room.category_id ? getRoomCategoryById(room.category_id) : Promise.resolve(null),
        room.view_type_id ? getViewTypeById(room.view_type_id) : Promise.resolve(null),
        getRoomAmenities(room.id),
        getRoomImagesByRoomId(room.id),
      ]);

      const featuredImage = roomImagesList.find(img => img.is_primary) || roomImagesList[0] || undefined;

      return {
        ...room,
        category: category || undefined,
        viewType: viewType || undefined,
        amenities: roomAmenitiesList,
        images: roomImagesList,
        featuredImage: featuredImage,
      };
    })
  );

  return roomsWithRelations;
}

/**
 * Get room by ID with all relationships including images
 */
export async function getRoomById(id: number): Promise<RoomWithRelations | null> {
  const result = await db
    .select()
    .from(rooms)
    .where(eq(rooms.id, id))
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  const room = result[0];
  const [category, viewType, roomAmenitiesList, roomImagesList] = await Promise.all([
    room.category_id ? getRoomCategoryById(room.category_id) : Promise.resolve(null),
    room.view_type_id ? getViewTypeById(room.view_type_id) : Promise.resolve(null),
    getRoomAmenities(room.id),
    getRoomImagesByRoomId(room.id),
  ]);

  const featuredImage = roomImagesList.find(img => img.is_primary) || roomImagesList[0] || undefined;

  return {
    ...room,
    category: category || undefined,
    viewType: viewType || undefined,
    amenities: roomAmenitiesList,
    images: roomImagesList,
    featuredImage: featuredImage,
  };
}

/**
 * Get room by room number with relationships
 */
export async function getRoomByNumber(roomNumber: string) {
  return await db
    .select()
    .from(rooms)
    .where(eq(rooms.room_number, roomNumber))
    .then(rows => rows[0] ?? null);
}

/**
 * Create a new room with amenities and images
 */
export async function createRoomWithRelations(
  roomData: RoomInsert, 
  amenityIds: number[] = [], 
  images: { imageUrl: string; altText?: string; isPrimary?: boolean }[] = []
): Promise<RoomWithRelations> {
  // Create the room first
  const room = await createRoom(roomData);

  // Add amenities if provided
  if (amenityIds.length > 0) {
    await addRoomAmenities(room.id, amenityIds);
  }

  // Add images if provided
  if (images.length > 0) {
    const imageInserts = images.map((image, index) => ({
      roomId: room.id,
      imageUrl: image.imageUrl,
      altText: image.altText,
      sortOrder: index,
      isPrimary: image.isPrimary || index === 0, // First image is primary by default
    }));
    await createRoomImagesBulk(imageInserts);
  }

  // Return the complete room with relationships
  const completeRoom = await getRoomById(room.id);
  if (!completeRoom) {
    throw new Error('Failed to retrieve created room with relationships');
  }
  return completeRoom;
}

/**
 * Update a room with amenities and images
 */
export async function updateRoomWithRelations(
  id: number, 
  roomData: RoomUpdate, 
  amenityIds: number[] = []
): Promise<RoomWithRelations | null> {
  // Update the room
  const room = await updateRoom(id, roomData);
  if (!room) {
    return null;
  }

  // Update amenities if provided
  if (amenityIds.length >= 0) { // Empty array means remove all amenities
    await updateRoomAmenities(id, amenityIds);
  }

  // Return the complete room with relationships
  return getRoomById(id);
}

/**
 * Create a new room (basic - without relationships)
 */
export async function createRoom(data: RoomInsert) {
  return await db.insert(rooms).values({
    room_number: data.roomNumber,
    category_id: data.categoryId,
    status: data.status,
    floor: data.floor,
    view_type_id: data.viewTypeId,
  }).returning().then(rows => rows[0]);
}

/**
 * Update a room (basic - without relationships)
 */
export async function updateRoom(id: number, data: RoomUpdate): Promise<Room | null> {
  const updateData: {
    room_number?: string;
    category_id?: number | null;
    status?: 'available' | 'occupied' | 'maintenance';
    floor?: number;
    view_type_id?: number | null;
  } = {};

  if (data.roomNumber !== undefined) updateData.room_number = data.roomNumber;
  if (data.categoryId !== undefined) updateData.category_id = data.categoryId;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.floor !== undefined) updateData.floor = data.floor;
  if (data.viewTypeId !== undefined) updateData.view_type_id = data.viewTypeId;

  // Only update if there are fields to update
  if (Object.keys(updateData).length === 0) {
    return getRoomById(id);
  }

  const result = await db
    .update(rooms)
    .set(updateData)
    .where(eq(rooms.id, id))
    .returning();

  return result[0] || null;
}

/**
 * Delete a room and all its relationships
 */
export async function deleteRoom(id: number): Promise<Room | null> {
  // First delete room amenities relationships
  await deleteRoomAmenities(id);
  
  // Delete room images
  await deleteRoomImagesByRoomId(id);
  
  const result = await db
    .delete(rooms)
    .where(eq(rooms.id, id))
    .returning();

  return result[0] || null;
}

/**
 * Room-Amenity Relationship Management
 */

/**
 * Get amenities for a specific room
 */
export async function getRoomAmenities(roomId: number): Promise<Amenity[]> {
  const result = await db
    .select({
      id: amenities.id,
      name: amenities.name,
      description: amenities.description,
      icon: amenities.icon,
      created_at: amenities.created_at,
    })
    .from(roomAmenities)
    .innerJoin(amenities, eq(roomAmenities.amenity_id, amenities.id))
    .where(eq(roomAmenities.room_id, roomId));

  return result;
}

/**
 * Add amenities to a room
 */
export async function addRoomAmenities(roomId: number, amenityIds: number[]): Promise<void> {
  if (amenityIds.length === 0) return;

  const amenityInserts = amenityIds.map(amenityId => ({
    room_id: roomId,
    amenity_id: amenityId,
  }));

  await db
    .insert(roomAmenities)
    .values(amenityInserts)
    .onConflictDoNothing();
}

/**
 * Update room amenities (replace existing)
 */
export async function updateRoomAmenities(roomId: number, amenityIds: number[]): Promise<void> {
  // Delete existing amenities
  await deleteRoomAmenities(roomId);
  
  // Add new amenities
  await addRoomAmenities(roomId, amenityIds);
}

/**
 * Delete all amenities for a room
 */
export async function deleteRoomAmenities(roomId: number): Promise<void> {
  await db
    .delete(roomAmenities)
    .where(eq(roomAmenities.room_id, roomId));
}

/**
 * Room Image Management
 */

/**
 * Add images to a room
 */
export async function addRoomImages(roomId: number, images: { imageUrl: string; altText?: string; isPrimary?: boolean }[]): Promise<RoomImage[]> {
  if (images.length === 0) return [];

  const imageInserts = images.map((image, index) => ({
    roomId: roomId,
    imageUrl: image.imageUrl,
    altText: image.altText,
    sortOrder: index,
    isPrimary: image.isPrimary || index === 0,
  }));

  return await createRoomImagesBulk(imageInserts);
}

/**
 * Update room images (replace existing)
 */
export async function updateRoomImages(roomId: number, images: { imageUrl: string; altText?: string; isPrimary?: boolean }[]): Promise<RoomImage[]> {
  // Delete existing images
  await deleteRoomImagesByRoomId(roomId);
  
  // Add new images
  return await addRoomImages(roomId, images);
}

/**
 * Room Validation Queries
 */

/**
 * Check if room number already exists
 */
export async function roomExistsByNumber(roomNumber: string, excludeId?: number): Promise<boolean> {
  if (excludeId) {
    const result = await db
      .select()
      .from(rooms)
      .where(
        and(
          eq(rooms.room_number, roomNumber),
          sql`${rooms.id} != ${excludeId}`
        )
      )
      .limit(1);
    
    return result.length > 0;
  } else {
    const result = await db
      .select()
      .from(rooms)
      .where(eq(rooms.room_number, roomNumber))
      .limit(1);
    
    return result.length > 0;
  }
}

/**
 * Check if category exists
 */
export async function categoryExists(categoryId: number): Promise<boolean> {
  const result = await db
    .select()
    .from(roomCategories)
    .where(eq(roomCategories.id, categoryId))
    .limit(1);
  
  return result.length > 0;
}

/**
 * Check if view type exists
 */
export async function viewTypeExists(viewTypeId: number): Promise<boolean> {
  const result = await db
    .select()
    .from(viewTypes)
    .where(eq(viewTypes.id, viewTypeId))
    .limit(1);
  
  return result.length > 0;
}

/**
 * Check if amenities exist
 */
export async function amenitiesExist(amenityIds: number[]): Promise<boolean> {
  if (amenityIds.length === 0) return true;

  const result = await db
    .select()
    .from(amenities)
    .where(inArray(amenities.id, amenityIds));

  return result.length === amenityIds.length;
}

// Helper functions for internal use
async function getRoomCategoryById(id: number): Promise<RoomCategory | null> {
  const result = await db
    .select()
    .from(roomCategories)
    .where(eq(roomCategories.id, id))
    .limit(1);
  
  return result[0] || null;
}

async function getViewTypeById(id: number): Promise<ViewType | null> {
  const result = await db
    .select()
    .from(viewTypes)
    .where(eq(viewTypes.id, id))
    .limit(1);
  
  return result[0] || null;
}

export async function insertRoomImage(data: RoomImageInsert) {
  return await db.insert(roomImages).values({
    room_id: data.roomId,
    image_url: data.imageUrl,
    alt_text: data.altText ?? null,
    sort_order: data.sortOrder ?? 0,
    is_primary: data.isPrimary ?? false,
  }).returning();
}

