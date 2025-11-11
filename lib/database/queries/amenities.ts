import { db } from '@/lib/database';
import { amenities } from '@/lib/database/schema';
import { eq, and, desc, ne } from 'drizzle-orm';
import type { Amenity } from '@/types/database';

export interface AmenityInsert {
  name: string;
  description?: string;
  icon: string;
}

export interface AmenityUpdate {
  name?: string;
  description?: string;
  icon?: string;
}

/**
 * Get all amenities ordered by name
 */
export async function getAllAmenities(): Promise<Amenity[]> {
  return await db
    .select()
    .from(amenities)
    .orderBy(desc(amenities.created_at));
}

/**
 * Get amenity by ID
 */
export async function getAmenityById(id: number): Promise<Amenity | null> {
  const result = await db
    .select()
    .from(amenities)
    .where(eq(amenities.id, id))
    .limit(1);

  return result[0] || null;
}

/**
 * Get amenity by name
 */
export async function getAmenityByName(name: string): Promise<Amenity | null> {
  const result = await db
    .select()
    .from(amenities)
    .where(eq(amenities.name, name))
    .limit(1);

  return result[0] || null;
}

/**
 * Create a new amenity
 */
export async function createAmenity(data: AmenityInsert): Promise<Amenity> {
  const result = await db
    .insert(amenities)
    .values({
      name: data.name,
      description: data.description || null,
      icon: data.icon,
    })
    .returning();

  return result[0];
}

/**
 * Update an amenity
 */
export async function updateAmenity(id: number, data: AmenityUpdate): Promise<Amenity | null> {
  const result = await db
    .update(amenities)
    .set({
      name: data.name,
      description: data.description,
      icon: data.icon,
    })
    .where(eq(amenities.id, id))
    .returning();

  return result[0] || null;
}

/**
 * Delete an amenity
 */
export async function deleteAmenity(id: number): Promise<Amenity | null> {
  const result = await db
    .delete(amenities)
    .where(eq(amenities.id, id))
    .returning();

  return result[0] || null;
}

/**
 * Check if amenity exists by name (for unique validation)
 */
export async function amenityExistsByName(name: string, excludeId?: number): Promise<boolean> {
  if (excludeId) {
    // Check if name exists excluding a specific ID (for updates)
    const result = await db
      .select()
      .from(amenities)
      .where(
        and(
          eq(amenities.name, name),
          ne(amenities.id, excludeId)
        )
      )
      .limit(1);
    
    return result.length > 0;
  } else {
    // Check if name exists (for creates)
    const result = await db
      .select()
      .from(amenities)
      .where(eq(amenities.name, name))
      .limit(1);
    
    return result.length > 0;
  }
}