// /types/api.ts
import type { RoomCategory, Amenity, RoomWithRelations } from './database';
import type { ViewType } from './database';

// Base API response type
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Room Categories API Types
export type RoomCategoriesListResponse = ApiResponse<RoomCategory[]>;
export type RoomCategoryResponse = ApiResponse<RoomCategory>;
export type RoomCategoryDeleteResponse = ApiResponse;

export interface RoomCategoryCreateRequest {
  name: string;
  description?: string;
  maxOccupancy: number;
  featuredImageUrl?: string;
}

export interface RoomCategoryUpdateRequest {
  name?: string;
  description?: string;
  // /////////////////////////////////////////////////////////////////////////////// gats to  go
  basePrice?: number;
  // /////////////////////////////////////////////////////////////////////////////// gats to  go
  maxOccupancy?: number;
  featuredImageUrl?: string;
}

// Extended types for FormData file uploads
export interface RoomCategoryCreateFormData extends Omit<RoomCategoryCreateRequest, 'featuredImageUrl'> {
  featuredImage?: File;
}

export interface RoomCategoryUpdateFormData extends Omit<RoomCategoryUpdateRequest, 'featuredImageUrl'> {
  featuredImage?: File;
}

// Amenities API Types
export type AmenitiesListResponse = ApiResponse<Amenity[]>;
export type AmenityResponse = ApiResponse<Amenity>;
export type AmenityDeleteResponse = ApiResponse;

export interface AmenityCreateRequest {
  name: string;
  description?: string;
  icon: string;
}

export interface AmenityUpdateRequest {
  name?: string;
  description?: string;
  icon?: string;
}

export interface AmenityCreateData {
  name: string;
  description?: string;
  icon: string;
}

export interface AmenityUpdateData {
  name?: string;
  description?: string;
  icon?: string;
}

// Add to existing /types/api.ts file:

// View Types API Types
export type ViewTypesListResponse = ApiResponse<ViewType[]>;
export type ViewTypeResponse = ApiResponse<ViewType>;
export type ViewTypeDeleteResponse = ApiResponse;

export interface ViewTypeCreateRequest {
  name: string;
  description?: string;
}

export interface ViewTypeUpdateRequest {
  name?: string;
  description?: string;
}

export interface ViewTypeCreateData {
  name: string;
  description?: string;
}

export interface ViewTypeUpdateData {
  name?: string;
  description?: string;
}


// Bulk Delete API Types
export interface BulkDeleteRequest {
  tableName: string;
  ids: number[];
}

export interface BulkDeleteResponseData {
  deletedCount: number;
  tableName: string;
}

export type BulkDeleteResponse = ApiResponse<BulkDeleteResponseData>;

// Add to existing /types/api.ts file:

// Rooms API Types
export type RoomsListResponse = ApiResponse<RoomWithRelations[]>;
export type RoomResponse = ApiResponse<RoomWithRelations>;
export type RoomDeleteResponse = ApiResponse;

export interface RoomCreateRequest {
  roomNumber: string;
  categoryId?: number;
  status: 'available' | 'occupied' | 'maintenance';
  floor: number;
  viewTypeId?: number;
  amenityIds?: number[];
}

export interface RoomUpdateRequest {
  roomNumber?: string;
  categoryId?: number | null;
  status?: 'available' | 'occupied' | 'maintenance';
  floor?: number;
  viewTypeId?: number | null;
  amenityIds?: number[];
}

export interface RoomCreateData {
  roomNumber: string;
  roomPrice: string;
  categoryId?: number;
  status: 'available' | 'occupied' | 'maintenance';
  floor: number;
  viewTypeId?: number;
  amenityIds?: number[];
}

export interface RoomUpdateData {
  roomNumber?: string;
  roomPrice: string;
  categoryId?: number | null;
  status?: 'available' | 'occupied' | 'maintenance';
  floor?: number;
  viewTypeId?: number | null;
  amenityIds?: number[];
  imagesToKeep:number[];
}

// Extended types for FormData file uploads for rooms
export interface RoomCreateFormData extends Omit<RoomCreateRequest, 'featuredImageUrl'> {
  images?: File[];
}

export interface RoomUpdateFormData extends Omit<RoomUpdateRequest, 'featuredImageUrl'> {
  images?: File[];
}