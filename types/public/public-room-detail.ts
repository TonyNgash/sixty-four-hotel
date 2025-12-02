// types/public/public-room-detail.ts
export interface PublicRoomDetail {
  id: number;
  roomNumber: string;
  categoryName: string;
  categorySlug: string;
  // basePrice: number; // in dollars
  maxOccupancy: number;
  description: string;
  size?: string;
  bedType?: string;
  view?: string;
  primaryImageUrl: string;
  gallery: string[]; // all images (including primary)
  amenities: {
    name: string;
    icon: string;
    description: string;
  }[];
}