// app/actions/customer/get-customer-bookings.ts
'use server';

import { db } from '@/lib/database';
import { bookings, rooms, roomCategories, viewTypes } from '@/lib/database/schema';
import { eq, desc } from 'drizzle-orm';

export async function getCustomerBookings(customerId: number) {
  try {
    const customerBookings = await db
      .select({
        id: bookings.id,
        checkInDate: bookings.check_in_date,
        checkOutDate: bookings.check_out_date,
        totalAmount: bookings.total_amount,
        status: bookings.status,
        paymentStatus: bookings.payment_status,
        specialRequests: bookings.special_requests,
        createdAt: bookings.created_at,
        updatedAt: bookings.updated_at,
        // Archived room details (in case room is deleted)
        archivedRoomNumber: bookings.archived_room_number,
        archivedRoomCategory: bookings.archived_room_category,
        archivedRoomFloor: bookings.archived_room_floor,
        // Current room details (if room still exists)
        roomNumber: rooms.room_number,
        roomPrice: rooms.room_price,
        categoryName: roomCategories.name,
        viewName: viewTypes.name,
      })
      .from(bookings)
      .leftJoin(rooms, eq(bookings.room_id, rooms.id))
      .leftJoin(roomCategories, eq(rooms.category_id, roomCategories.id))
      .leftJoin(viewTypes, eq(rooms.view_type_id, viewTypes.id))
      .where(eq(bookings.customer_id, customerId))
      .orderBy(desc(bookings.created_at));

    return { success: true, bookings: customerBookings };
  } catch (error) {
    console.error('Failed to fetch customer bookings:', error);
    return { success: false, error: 'Failed to fetch bookings' };
  }
}