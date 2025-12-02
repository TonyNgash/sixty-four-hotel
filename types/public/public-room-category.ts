// types/public/public-room-category.ts
export interface PublicRoomCategory {
  id: number;
  name: string;
  description: string;
  slug: string;
  imageUrl: string; // in dollars (e.g., 8500 cents → 85.00)
  capacity: number;     // max_occupancy
}