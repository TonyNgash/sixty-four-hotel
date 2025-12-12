// app/(frontend)/actions/create-booking.ts
'use server';

import { db } from '@/lib/database';
import { payments, bookings, users } from '@/lib/database/schema';
import { eq } from 'drizzle-orm';

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
  message?: string; // Added for more user feedback
  error?: string;
}

export async function doesPhoneExist(phone: string): Promise<boolean> {
    
    const customer = await db.select().from(users).where(eq(users.phone, phone)); 
    
    if (customer.length === 0) {
      return false;
    }
    return true;
}

export async function createBookingAction(data: CreateBookingData): Promise<CreateBookingResult> {
  try {
    // 1. Create pending booking
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

    // 2. Create pending payment record
    const [payment] = await db.insert(payments).values({
      booking_id: booking.id,
      amount: data.totalAmount * 100,
      phone_number: data.phone,
      checkout_request_id: '', // will be filled by Daraja
      status: 'initiated',
    }).returning();

    // 3. Call the initiate-payment API to send the STK Push
    console.log(`Initiating M-Pesa payment for booking ${booking.id}`);
    const initiateResponse = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/payments/initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookingId: booking.id,
        phone: data.phone,
        amount: data.totalAmount, // Send the actual amount, not cents
        fullName: data.fullName,
      }),
    });

    const initiateResult = await initiateResponse.json();

    if (!initiateResult.success) {
      return { success: false, error: initiateResult.error || 'Failed to initiate M-Pesa payment' };
    }

    return { 
      success: true, 
      bookingId: booking.id,
      message: initiateResult.message || 'Payment initiated. Please check your phone.'
    };
  } catch (error) {
    console.error('Booking creation failed:', error);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}