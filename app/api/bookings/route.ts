// app/api/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAllBookings } from '@/app/actions/admin/get-all-bookings';
import { db } from '@/lib/database';
import { bookings } from '@/lib/database/schema';
import { eq, inArray } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const result = await getAllBookings();
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { bookingIds, action } = await request.json();
    
    if (!bookingIds || !Array.isArray(bookingIds) || bookingIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid booking IDs' },
        { status: 400 }
      );
    }

    if (action === 'cancel') {
      // Update the status of the bookings to 'cancelled'
      await db
        .update(bookings)
        .set({ status: 'cancelled' })
        .where(inArray(bookings.id, bookingIds));

      return NextResponse.json({ success: true, message: 'Bookings cancelled successfully' });
    } else if (action === 'delete') {
      // Completely delete the bookings from the database
      await db
        .delete(bookings)
        .where(inArray(bookings.id, bookingIds));

      return NextResponse.json({ success: true, message: 'Bookings deleted permanently' });
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid action' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error updating bookings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update bookings' },
      { status: 500 }
    );
  }
}