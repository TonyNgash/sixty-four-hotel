// Define all tables (users, rooms, bookings, etc.)
// Use Drizzle's SQLite-specific types
// lib/database/schema.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import {real} from "drizzle-orm/sqlite-core/columns/real"

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  password_hash: text('password_hash'),
  role: text('role').notNull().default('customer'),
  first_name: text('first_name'),
  last_name: text('last_name'),
  phone: text('phone').notNull(),
  email_verified_at: integer('email_verified_at'),
  phone_verified_at: integer('phone_verified_at'),
  verification_token: text('verification_token'),
  reset_token: text('reset_token'),
  reset_token_expires: integer('reset_token_expires'),
  account_status: text('account_status', { 
    enum: ['pending_verification', 'active', 'suspended'] 
  }).notNull(),
  failed_attempts: integer('failed_attempts').default(0),
  locked_until: integer('locked_until'),
  last_login_attempt: integer('last_login_attempt'),
  created_at: integer('created_at').default(sql`(strftime('%s','now'))`),
  updated_at: integer('updated_at').default(sql`(strftime('%s','now'))`),
});

// Add to your existing schema.ts file
export const emailVerifications = sqliteTable('email_verifications', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  user_id: integer('user_id').references(() => users.id),
  token: text('token').notNull(),
  expires_at: integer('expires_at').notNull(),
  created_at: integer('created_at').default(sql`(strftime('%s','now'))`),
});

// Add to your existing schema.ts file
export const phoneVerifications = sqliteTable('phone_verifications', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  user_id: integer('user_id').references(() => users.id),
  code: text('code').notNull(), // 6-digit SMS code as text
  expires_at: integer('expires_at').notNull(),
  attempts: integer('attempts').default(0), // Failed verification attempts
  created_at: integer('created_at').default(sql`(strftime('%s','now'))`),
});

// Add to your existing schema.ts file
export const roomCategories = sqliteTable('room_categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(), // "Single Bed", "Double Bed", etc.
  description: text('description'),
  base_price: integer('base_price').notNull(), // Price in cents to avoid floating point issues
  max_occupancy: integer('max_occupancy').notNull(),
  featured_image_url: text('featured_image_url'),
  created_at: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s','now'))`),
});

// Add to your existing schema.ts file
export const rooms = sqliteTable('rooms', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  room_number: text('room_number').notNull().unique(),
  category_id: integer('category_id').references(() => roomCategories.id),
  status: text('status', { enum: ['available', 'occupied', 'maintenance'] }).notNull().default('available'),
  floor: integer('floor').notNull(),
  view_type_id: integer('view_type_id').references(() => viewTypes.id), // NEW - foreign key "garden", "pool", "city"
  created_at: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s','now'))`),
});

export const amenities = sqliteTable('amenities', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description'), 
  icon: text('icon'), 
  created_at: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s','now'))`),
});

export const viewTypes = sqliteTable('view_types', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(), // "Garden View", "Pool View", "City View"
  description: text('description'),
  created_at: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s','now'))`),
});

export const roomAmenities = sqliteTable('room_amenities', {
  room_id: integer('room_id').references(() => rooms.id),
  amenity_id: integer('amenity_id').references(() => amenities.id),
  created_at: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s','now'))`),
});

export const roomImages = sqliteTable('room_images', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  room_id: integer('room_id').references(() => rooms.id),
  image_url: text('image_url').notNull(),
  alt_text: text('alt_text'),
  sort_order: integer('sort_order').default(0),
  is_primary: integer('is_primary', { mode: 'boolean' }).default(false),
  created_at: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s','now'))`),
});

export const bookings = sqliteTable('bookings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  customer_id: integer('customer_id').references(() => users.id),
  room_id: integer('room_id').references(() => rooms.id),
  check_in_date: text('check_in_date').notNull(),
  check_out_date: text('check_out_date').notNull(),
  total_amount: integer('total_amount').notNull(),
  status: text('status', { enum: ['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'] }).notNull().default('pending'),
  payment_status: text('payment_status', { enum: ['pending', 'paid', 'refunded', 'failed'] }).notNull().default('pending'),
  special_requests: text('special_requests'),
  created_at: integer('created_at').default(sql`(strftime('%s','now'))`),
  updated_at: integer('updated_at').default(sql`(strftime('%s','now'))`),
});

// ──────────────────────────────────────────────────────────────
// PAYMENTS TABLE — M-PESA READY
// ──────────────────────────────────────────────────────────────
export const payments = sqliteTable('payments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  booking_id: integer('booking_id')
    .notNull()
    .references(() => bookings.id, { onDelete: 'cascade' }),
  amount: integer('amount').notNull(), // in KES (whole numbers only — M-Pesa style)
  phone_number: text('phone_number').notNull(), // e.g. "2547xxxxxxxx"
  mpesa_receipt_number: text('mpesa_receipt_number'),
  transaction_date: integer('transaction_date'),
  checkout_request_id: text('checkout_request_id'), // Daraja's ID
  result_code: text('result_code'), // "0" = success
  result_desc: text('result_desc'),
  status: text('status', {
    enum: ['initiated', 'completed', 'failed', 'cancelled'],
  })
    .notNull()
    .default('initiated'),
  created_at: integer('created_at').default(sql`(strftime('%s','now'))`),
  updated_at: integer('updated_at').default(sql`(strftime('%s','now'))`),
});

export const pricingRules = sqliteTable('pricing_rules', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  room_category_id: integer('room_category_id').references(() => roomCategories.id),
  start_date: integer('start_date', { mode: 'timestamp' }).notNull(),
  end_date: integer('end_date', { mode: 'timestamp' }).notNull(),
  price_modifier: real('price_modifier').notNull(), // Using real for decimal values like 1.2, 0.8
  description: text('description').notNull(),
  created_at: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s','now'))`),
});

export const cancellationPolicies = sqliteTable('cancellation_policies', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  days_before_checkin: integer('days_before_checkin').notNull(),
  refund_percentage: integer('refund_percentage').notNull(),
  is_active: integer('is_active', { mode: 'boolean' }).default(true),
  created_at: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s','now'))`),
});

// Add to lib/database/schema.ts
// Just create the table without indexes for now
export const loginAttempts = sqliteTable('login_attempts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  user_id: integer('user_id').references(() => users.id),
  email: text('email').notNull(),
  ip_address: text('ip_address').notNull(),
  user_agent: text('user_agent'),
  attempt_type: text('attempt_type', { enum: ['login', 'password_reset'] }).notNull(),
  successful: integer('successful', { mode: 'boolean' }).notNull(),
  failure_reason: text('failure_reason'),
  attempted_at: integer('attempted_at', { mode: 'timestamp' }).default(sql`(strftime('%s','now'))`),
});

// We can add indexes later via separate migrations if needed

// Add to lib/database/schema.ts
export const auditLogs = sqliteTable('audit_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  user_id: integer('user_id').references(() => users.id), // Null for system events
  action: text('action').notNull(), // "login", "logout", "password_change", "account_lock"
  resource: text('resource'), // "user", "booking", "room"
  resource_id: integer('resource_id'), // ID of the affected resource
  ip_address: text('ip_address'),
  user_agent: text('user_agent'),
  details: text('details'), // JSON string with additional info
  created_at: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s','now'))`),
});

