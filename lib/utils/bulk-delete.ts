import { db } from '@/lib/database';
import { inArray } from 'drizzle-orm';
import { amenities, roomCategories, rooms, viewTypes } from '@/lib/database/schema';
import { roomAmenities, roomImages } from '@/lib/database/schema';
import type { SQLiteTable } from 'drizzle-orm/sqlite-core';

// Define the tables that support bulk delete
export type BulkDeleteTable = 
  | typeof amenities
  | typeof roomCategories
  | typeof rooms
  | typeof viewTypes;

export type BulkDeleteTableName = 
  | 'amenities'
  | 'room-categories' 
  | 'rooms'
  | 'view-types';

export interface BulkDeleteResult {
  success: boolean;
  deletedCount: number;
  error?: string;
}

export interface BulkDeleteValidationResult {
  isValid: boolean;
  error?: string;
}

// Table registry - maps string names to actual table objects
const tableRegistry: Record<BulkDeleteTableName, BulkDeleteTable> = {
  'amenities': amenities,
  'room-categories': roomCategories,
  'rooms': rooms,
  'view-types': viewTypes,
};

/**
 * Get table by name with proper typing
 */
export function getTableByName(tableName: BulkDeleteTableName): BulkDeleteTable {
  const table = tableRegistry[tableName];
  if (!table) {
    throw new Error(`Unknown table for bulk delete: ${tableName}. Available tables: ${Object.keys(tableRegistry).join(', ')}`);
  }
  return table;
}

/**
 * Validate bulk delete request
 */
function validateBulkDeleteRequest(
  tableName: BulkDeleteTableName,
  ids: number[]
): BulkDeleteValidationResult {
  // Validate table exists
  if (!tableRegistry[tableName]) {
    return {
      isValid: false,
      error: `Table '${tableName}' is not configured for bulk delete`
    };
  }

  // Validate IDs array
  if (!Array.isArray(ids)) {
    return {
      isValid: false,
      error: 'IDs must be provided as an array'
    };
  }

  if (ids.length === 0) {
    return {
      isValid: false,
      error: 'No IDs provided for deletion'
    };
  }

  // Validate individual IDs
  const invalidIds = ids.filter(id => typeof id !== 'number' || id <= 0);
  if (invalidIds.length > 0) {
    return {
      isValid: false,
      error: `Invalid IDs provided: ${invalidIds.join(', ')}`
    };
  }

  return { isValid: true };
}

/**
 * Perform bulk deletion for supported tables
 */
export async function performBulkDelete(
  tableName: BulkDeleteTableName,
  ids: number[]
): Promise<BulkDeleteResult> {
  // Validate input
  const validation = validateBulkDeleteRequest(tableName, ids);
  if (!validation.isValid) {
    return {
      success: false,
      deletedCount: 0,
      error: validation.error
    };
  }

  const table = getTableByName(tableName);

  try {
    // SPECIAL CASE: rooms require child deletion first
    if (tableName === 'rooms') {
      return await deleteRoomsWithRelations(ids);
    }

    // For all other tables (amenities, categories, view-types)
    const result = await db
      .delete(table)
      .where(inArray(table.id, ids))
      .returning();

    const deletedCount = result.length;
    console.log(`Bulk delete: Deleted ${deletedCount} records from ${tableName}`);

    return { success: true, deletedCount };
  } catch (error) {
    console.error(`Error performing bulk delete for ${tableName}:`, error);
    return {
      success: false,
      deletedCount: 0,
      error: error instanceof Error ? error.message : `Failed to delete records`
    };
  }
}


/**
 * Safely delete rooms and all their relations
 */
async function deleteRoomsWithRelations(ids: number[]): Promise<BulkDeleteResult> {
  return await db.transaction(async (tx) => {
    try {
      // 1. Delete room images
      await tx
        .delete(roomImages)
        .where(inArray(roomImages.room_id, ids));

      // 2. Delete room amenities
      await tx
        .delete(roomAmenities)
        .where(inArray(roomAmenities.room_id, ids));

      // 3. Finally delete rooms
      const result = await tx
        .delete(rooms)
        .where(inArray(rooms.id, ids))
        .returning();

      const deletedCount = result.length;
      console.log(`Bulk delete rooms: Deleted ${deletedCount} rooms and their relations`);

      return { success: true, deletedCount };
    } catch (error) {
      tx.rollback();
      console.error('Error in room bulk delete transaction:', error);
      return {
        success: false,
        deletedCount: 0,
        error: 'Failed to delete rooms with relations. A booking may still exist.'
      };
    }
  });
}


/**
 * Check if entities exist before deletion (optional pre-validation)
 */
export async function validateEntitiesExist(
  tableName: BulkDeleteTableName,
  ids: number[]
): Promise<{ exist: number[]; notExist: number[] }> {
  try {
    const table = getTableByName(tableName);
    
    const existingEntities = await db
      .select({ id: table.id })
      .from(table)
      .where(inArray(table.id, ids));

    const existingIds = existingEntities.map(entity => entity.id);
    const notExistingIds = ids.filter(id => !existingIds.includes(id));

    return {
      exist: existingIds,
      notExist: notExistingIds
    };
  } catch (error) {
    console.error(`Error validating entity existence for ${tableName}:`, error);
    // If validation fails, assume all IDs exist and let the delete operation handle it
    return {
      exist: ids,
      notExist: []
    };
  }
}

/**
 * Get all available tables for bulk delete
 */
export function getAvailableTables(): BulkDeleteTableName[] {
  return Object.keys(tableRegistry) as BulkDeleteTableName[];
}