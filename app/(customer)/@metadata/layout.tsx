// app/(customer)/@metadata/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hotel Booking - Customer Portal',
  description: 'Manage your hotel bookings and reservations',
};

// This component doesn't need to render anything.
// Its only purpose is to export metadata for the route group.
export default function MetadataLayout() {
  return null;
}