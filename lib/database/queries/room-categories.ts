import { db } from '@/lib/database';
import { roomCategories } from '@/lib/database/schema';
import { eq, and, desc, ne, inArray } from 'drizzle-orm';

export interface RoomCategoryInsert {
  name: string;
  description?: string;
  basePrice: number;
  maxOccupancy: number;
  featuredImageUrl?: string;
}

export interface RoomCategoryUpdate {
  name?: string;
  description?: string;
  basePrice?: number;
  maxOccupancy?: number;
  featuredImageUrl?: string;
}

/**
 * Get all room categories ordered by name
 */
export async function getAllRoomCategories() {
  return await db
    .select()
    .from(roomCategories)
    .orderBy(desc(roomCategories.created_at));
}

/**
 * Get room category by ID
 */
export async function getRoomCategoryById(id: number) {
  const result = await db
    .select()
    .from(roomCategories)
    .where(eq(roomCategories.id, id))
    .limit(1);

  return result[0] || null;
}

/**
 * Get room category by name
 */
export async function getRoomCategoryByName(name: string) {
  const result = await db
    .select()
    .from(roomCategories)
    .where(eq(roomCategories.name, name))
    .limit(1);

  return result[0] || null;
}

/**
 * Create a new room category
 */
export async function createRoomCategory(data: RoomCategoryInsert) {
  const result = await db
    .insert(roomCategories)
    .values({
      name: data.name,
      description: data.description || null,
      base_price: data.basePrice,
      max_occupancy: data.maxOccupancy,
      featured_image_url: data.featuredImageUrl || null,
    })
    .returning();

  return result[0];
}

/**
 * Update a room category
 */
export async function updateRoomCategory(id: number, data: RoomCategoryUpdate) {
  const result = await db
    .update(roomCategories)
    .set({
      name: data.name,
      description: data.description,
      base_price: data.basePrice,
      max_occupancy: data.maxOccupancy,
      featured_image_url: data.featuredImageUrl,
    })
    .where(eq(roomCategories.id, id))
    .returning();

  return result[0] || null;
}

/**
 * Delete a room category
 */
export async function deleteRoomCategory(id: number) {
  const result = await db
    .delete(roomCategories)
    .where(eq(roomCategories.id, id))
    .returning();

  return result[0] || null;
}

/**
 * Check if room category exists by name (for unique validation)
 */
export async function roomCategoryExistsByName(name: string, excludeId?: number) {
  if (excludeId) {
    // Check if name exists excluding a specific ID (for updates)
    const result = await db
      .select()
      .from(roomCategories)
      .where(
        and(
          eq(roomCategories.name, name),
          ne(roomCategories.id, excludeId)
        )
      )
      .limit(1);
    
    return result.length > 0;
  } else {
    // Check if name exists (for creates)
    const result = await db
      .select()
      .from(roomCategories)
      .where(eq(roomCategories.name, name))
      .limit(1);
    
    return result.length > 0;
  }
}

/**
 * Bulk delete room categories by IDs
 */
export async function deleteRoomCategories(ids: number[]): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate that we have IDs to delete
    if (!ids || ids.length === 0) {
      return {
        success: false,
        error: 'No category IDs provided for deletion',
      };
    }

    // Perform the bulk deletion
    const result = await db
      .delete(roomCategories)
      .where(inArray(roomCategories.id, ids))
      .returning();

    console.log(`Successfully deleted ${result.length} room categories`);
    
    return { success: true };
  } catch (error) {
    console.error('Error bulk deleting room categories:', error);
    
    // Handle foreign key constraint errors
    if (error instanceof Error && error.message.includes('FOREIGN KEY constraint failed')) {
      return {
        success: false,
        error: 'Cannot delete categories that are associated with existing rooms. Please remove room associations first.',
      };
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Database error during bulk deletion',
    };
  }
}