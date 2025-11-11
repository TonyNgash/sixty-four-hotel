import { db } from '@/lib/database';
import { viewTypes } from '@/lib/database/schema';
import { eq, and, desc, ne } from 'drizzle-orm';
import type { ViewType } from '@/types/database';

export interface ViewTypeInsert {
  name: string;
  description?: string;
}

export interface ViewTypeUpdate {
  name?: string;
  description?: string;
}

/**
 * Get all view types ordered by creation date (newest first)
 */
export async function getAllViewTypes(): Promise<ViewType[]> {
  return await db
    .select()
    .from(viewTypes)
    .orderBy(desc(viewTypes.created_at));
}

/**
 * Get view type by ID
 */
export async function getViewTypeById(id: number): Promise<ViewType | null> {
  const result = await db
    .select()
    .from(viewTypes)
    .where(eq(viewTypes.id, id))
    .limit(1);

  return result[0] || null;
}

/**
 * Get view type by name
 */
export async function getViewTypeByName(name: string): Promise<ViewType | null> {
  const result = await db
    .select()
    .from(viewTypes)
    .where(eq(viewTypes.name, name))
    .limit(1);

  return result[0] || null;
}

/**
 * Create a new view type
 */
export async function createViewType(data: ViewTypeInsert): Promise<ViewType> {
  const result = await db
    .insert(viewTypes)
    .values({
      name: data.name,
      description: data.description || null,
    })
    .returning();

  return result[0];
}

/**
 * Update a view type
 */
export async function updateViewType(id: number, data: ViewTypeUpdate): Promise<ViewType | null> {
  const result = await db
    .update(viewTypes)
    .set({
      name: data.name,
      description: data.description,
    })
    .where(eq(viewTypes.id, id))
    .returning();

  return result[0] || null;
}

/**
 * Delete a view type
 */
export async function deleteViewType(id: number): Promise<ViewType | null> {
  const result = await db
    .delete(viewTypes)
    .where(eq(viewTypes.id, id))
    .returning();

  return result[0] || null;
}

/**
 * Check if view type exists by name (for unique validation)
 */
export async function viewTypeExistsByName(name: string, excludeId?: number): Promise<boolean> {
  if (excludeId) {
    // Check if name exists excluding a specific ID (for updates)
    const result = await db
      .select()
      .from(viewTypes)
      .where(
        and(
          eq(viewTypes.name, name),
          ne(viewTypes.id, excludeId)
        )
      )
      .limit(1);
    
    return result.length > 0;
  } else {
    // Check if name exists (for creates)
    const result = await db
      .select()
      .from(viewTypes)
      .where(eq(viewTypes.name, name))
      .limit(1);
    
    return result.length > 0;
  }
}