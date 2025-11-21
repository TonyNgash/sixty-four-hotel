// types/public/public-rooms.ts
export interface PublicRoom {
  id: number;
  roomNumber: string;
  categoryId: number;
  categoryName: string;
  categorySlug: string;
  basePrice: number;        // in dollars
  maxOccupancy: number;
  primaryImageUrl: string;  // ← never null — always has fallback
}