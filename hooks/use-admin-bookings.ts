// hooks/use-admin-bookings.ts
'use client';

import { useState, useEffect, useCallback } from 'react';

// Define the type for booking data from the API
export type AdminBooking = {
  id: number;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  specialRequests: string | null;
  createdAt: number;
  updatedAt: number;
  archivedRoomNumber: string;
  archivedRoomCategory: string;
  archivedRoomFloor: string;
  customerId: number | null;
  customerName: string | null;
  customerLastName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  roomId: number | null;
  roomNumber: string | null;
  roomPrice: number | null;
  categoryName: string | null;
  viewName: string | null;
};

export function useAdminBookings() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/bookings');
      const data = await response.json();
      
      if (data.success) {
        // Ensure the returned data matches our AdminBooking interface
        const formattedBookings = (data.bookings || []).map((booking: AdminBooking) => ({
          ...booking,
          // Ensure these are numbers as expected by our interface
          createdAt: Number(booking.createdAt),
          updatedAt: Number(booking.updatedAt)
        }));
        setBookings(formattedBookings);
      } else {
        setError(data.error || 'Failed to fetch bookings');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error fetching bookings:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const refetch = () => {
    fetchBookings();
  };

  return {
    bookings,
    isLoading,
    error,
    refetch,
  };
}