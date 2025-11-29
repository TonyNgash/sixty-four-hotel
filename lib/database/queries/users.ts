// lib/database/queries/users.ts
import { db } from '@/lib/database';
import { users } from '@/lib/database/schema';
import { eq } from 'drizzle-orm';

export interface UserCreateData {
  email: string;
  phone: string;
  first_name?: string;
  last_name?: string;
  role?: 'admin' | 'staff' | 'customer';
}

export interface UserUpdateData {
  first_name?: string;
  last_name?: string;
  phone?: string;
  account_status?: 'pending_verification' | 'active' | 'suspended';
}

/**
 * Find user by email
 */
export async function findUserByEmail(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user || null;
}

/**
 * Find user by phone number
 */
export async function findUserByPhone(phone: string) {
  const [user] = await db.select().from(users).where(eq(users.phone, phone));
  return user || null;
}

/**
 * Find user by ID
 */
export async function findUserById(id: number) {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user || null;
}

/**
 * Create a new user (password-less for customers)
 */
export async function createUser(userData: UserCreateData) {
  const [user] = await db.insert(users).values({
    email: userData.email,
    phone: userData.phone,
    first_name: userData.first_name || null,
    last_name: userData.last_name || null,
    role: userData.role || 'customer',
    account_status: 'active',
    phone_verified_at: Math.floor(Date.now() / 1000),
    email_verified_at: Math.floor(Date.now() / 1000),
  }).returning();

  return user;
}

/**
 * Update user information
 */
export async function updateUser(userId: number, updateData: UserUpdateData) {
  const [user] = await db.update(users)
    .set({
      ...updateData,
      updated_at: Math.floor(Date.now() / 1000),
    })
    .where(eq(users.id, userId))
    .returning();

  return user || null;
}

/**
 * Find or create user by phone and email
 * Useful for booking flow where user might exist or need creation
 */
export async function findOrCreateUser(userData: UserCreateData) {
  // Try to find by email first
  let user = await findUserByEmail(userData.email);
  
  if (!user) {
    // Try to find by phone
    user = await findUserByPhone(userData.phone);
  }
  
  if (!user) {
    // Create new user
    user = await createUser(userData);
  }
  
  return user;
}