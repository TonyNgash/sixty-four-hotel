// Database type definitions that match your Drizzle schema
// These types represent the structure of your database tables

export interface User {
  id: number;
  email: string;
  password_hash: string | null;
  role: 'customer' | 'staff' | 'admin';
  first_name: string | null;
  last_name: string | null;
  phone: string;
  email_verified_at: Date | null;
  phone_verified_at: Date | null;
  verification_token: string | null;
  reset_token: string | null;
  reset_token_expires: Date | null;
  account_status: 'pending_verification' | 'active' | 'suspended';
  failed_attempts: number;
  locked_until: Date | null;
  last_login_attempt: Date | null;
  created_at: Date | null;
  updated_at: Date | null;
}

export interface RoomCategory {
  id: number;
  name: string;
  description: string | null;
  // base_price: number;
  max_occupancy: number;
  featured_image_url: string | null;
  created_at: Date | null;
}

export interface RoomCategoryInsert {
  name: string;
  description?: string;
  // basePrice: number;
  maxOccupancy: number;
  featuredImageUrl?: string;
}

export interface RoomCategoryUpdate {
  name?: string;
  description?: string | null;
  // basePrice?: number;
  maxOccupancy?: number;
  featuredImageUrl?: string | null;
}

export interface Room {
  id: number;
  room_number: string;
  room_price: number;
  category_id: number | null;
  status: 'available' | 'occupied' | 'maintenance';
  floor: number;
  view_type_id: number | null;
  created_at: Date | null;
}

export interface RoomInsert {
  roomNumber: string;
  roomPrice: number;
  categoryId?: number;
  status: 'available' | 'occupied' | 'maintenance';
  floor: number;
  viewTypeId?: number;
}

export interface RoomUpdate {
  roomNumber?: string;
  roomPrice?: number;
  categoryId?: number | null;
  status?: 'available' | 'occupied' | 'maintenance';
  floor?: number;
  viewTypeId?: number | null;
  imagesToKeep?:number[];
  images?:File[];
}

// Extended room with relationships for frontend display
export interface RoomWithRelations extends Room {
  category?: RoomCategory;
  viewType?: ViewType;
  amenities?: Amenity[];
  images?: RoomImage[];
  featuredImage?: RoomImage;
}

export interface Amenity {
  id: number;
  name: string;
  description: string | null; // NEW: Added description field
  icon: string | null; // CHANGED: Renamed from icon_url to icon
  created_at: Date | null;
}

export interface AmenityInsert {
  name: string;
  description?: string;
  icon: string;
}

export interface AmenityUpdate {
  name?: string;
  description?: string | null;
  icon?: string;
}

export interface RoomAmenity {
  room_id: number;
  amenity_id: number;
  created_at: Date | null;
}

export interface ViewType {
  id: number;
  name: string;
  description: string | null;
  created_at: Date | null;
}

// Add to existing /types/database.ts file (if not already present):

export interface ViewTypeInsert {
  name: string;
  description?: string;
}

export interface ViewTypeUpdate {
  name?: string;
  description?: string | null;
}

export interface Booking {
  id: number;
  customer_id: number | null;
  room_id: number | null;
  check_in_date: Date;
  check_out_date: Date;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'refunded' | 'failed';
  special_requests: string | null;
  created_at: Date | null;
  updated_at: Date | null;
}

// Additional types for related entities
export interface EmailVerification {
  id: number;
  user_id: number | null;
  token: string;
  expires_at: Date;
  created_at: Date | null;
}

export interface PhoneVerification {
  id: number;
  user_id: number | null;
  code: string;
  expires_at: Date;
  attempts: number;
  created_at: Date | null;
}

export interface RoomImage {
  id: number;
  room_id: number | null;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
  created_at: Date | null;
}

// Room Image Insert and Update types for database operations
export interface RoomImageInsert {
  roomId: number;
  imageUrl: string;
  altText?: string;
  sortOrder?: number;
  isPrimary?: boolean;
}

export interface RoomImageUpdate {
  imageUrl?: string;
  altText?: string | null;
  sortOrder?: number;
  isPrimary?: boolean;
}

export interface PricingRule {
  id: number;
  room_category_id: number | null;
  start_date: Date;
  end_date: Date;
  price_modifier: number;
  description: string;
  created_at: Date | null;
}

export interface CancellationPolicy {
  id: number;
  name: string;
  days_before_checkin: number;
  refund_percentage: number;
  is_active: boolean;
  created_at: Date | null;
}

export interface LoginAttempt {
  id: number;
  user_id: number | null;
  email: string;
  ip_address: string;
  user_agent: string | null;
  attempt_type: 'login' | 'password_reset';
  successful: boolean;
  failure_reason: string | null;
  attempted_at: Date | null;
}

export interface AuditLog {
  id: number;
  user_id: number | null;
  action: string;
  resource: string | null;
  resource_id: number | null;
  ip_address: string | null;
  user_agent: string | null;
  details: string | null;
  created_at: Date | null;
}