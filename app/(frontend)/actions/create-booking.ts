// app/(frontend)/actions/create-booking.ts
'use server';

import { db } from '@/lib/database';
import { revalidatePath } from 'next/cache';
import { payments, bookings, users, phoneVerifications } from '@/lib/database/schema';
import { eq, and, gt } from 'drizzle-orm';

interface CreateBookingData {
  roomId: number;
  archivedRoomNumber: string;
  archivedRoomCategory: string;
  archivedRoomFloor: string;
  checkIn: string;
  checkOut: string;
  fullName: string;
  phone: string;
  email: string;
  totalAmount: number;
}

interface CreateBookingResult {
  success: boolean;
  bookingId?: number;
  error?: string;
}

export async function doesPhoneExist(phone: string): Promise<boolean> {
    console.error(`Checking phone existence for: ${phone}`);
    const customer = await db.select().from(users).where(eq(users.phone, phone)); 
    console.error(`Customer's number found: ${customer}`);
    if (customer.length === 0) {
      return false;
    }
    return true;
}

export async function createBookingAction(data: CreateBookingData): Promise<CreateBookingResult> {
  try {
    // 1. Create pending booking
    console.error("1. Create pending booking");
    const [booking] = await db.insert(bookings).values({
      room_id: data.roomId,
      customer_id: null, // will be filled after payment
      archived_room_number: data.archivedRoomNumber,
      archived_room_category: data.archivedRoomCategory,
      archived_room_floor: data.archivedRoomFloor,
      check_in_date: data.checkIn,
      check_out_date: data.checkOut,
      total_amount: data.totalAmount * 100, // store in cents
      status: 'pending',
      payment_status: 'pending',
      special_requests: `Customer: ${data.fullName}, Email: ${data.email}`,
    }).returning();
    console.warn(`Total is: ${data.totalAmount}`);

    // 2. Create pending payment record
    console.error("2. Create pending payment record");
    const [payment] = await db.insert(payments).values({
      booking_id: booking.id,
      amount: data.totalAmount * 100,
      phone_number: data.phone,
      checkout_request_id: '', // will be filled by Daraja
      status: 'initiated',
    }).returning();

    // 3. Simulate payment callback (since we don't have real M-Pesa credentials)
    console.error("3. Simulate payment callback (since we don't have real M-Pesa credentials) create-booking.ts");
    const simulateResponse = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/payments/simulate-callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookingId: booking.id,
        phone: data.phone,
        email: data.email,
        fullName: data.fullName,
        amount: data.totalAmount,
      }),
    });

    const simulateResult = await simulateResponse.json();

    if (!simulateResult.success) {
      return { success: false, error: simulateResult.error || 'Failed to simulate payment' };
    }

    return { success: true, bookingId: booking.id };
  } catch (error) {
    console.error('Booking creation failed:', error);
    return { success: false, error: 'Something went wrong. Please try again. create-booking.ts:70' };
  }
}