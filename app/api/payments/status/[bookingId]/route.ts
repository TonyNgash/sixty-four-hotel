import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { bookings } from '@/lib/database/schema';
import { eq } from 'drizzle-orm';

// 1. Update the type of `params` to be a Promise
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    // 2. Await the params object before destructuring
    const { bookingId: bookingIdString } = await params;
    const bookingId = parseInt(bookingIdString, 10);

    if (isNaN(bookingId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid booking ID format' },
        { status: 400 }
      );
    }

    // Query the database for the booking status
    const [booking] = await db
      .select({
        status: bookings.status,
        payment_status: bookings.payment_status,
      })
      .from(bookings)
      .where(eq(bookings.id, bookingId));

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Return the current status
    return NextResponse.json({
      success: true,
      status: booking.status,
      payment_status: booking.payment_status,
    });

  } catch (error) {
    console.error('Error fetching booking status:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}