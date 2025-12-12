// app/api/payments/simulate-callback/route.ts
import { NextRequest } from 'next/server';
import { db } from '@/lib/database';
import { payments, bookings, users, phoneVerifications } from '@/lib/database/schema';
import { eq } from 'drizzle-orm';

interface SimulateCallbackRequest {
  bookingId: number;
  phone: string;
  email: string;
  fullName: string;
  amount: number;
}

export async function POST(req: NextRequest) {
  try {
    const body: SimulateCallbackRequest = await req.json();
    const { bookingId, phone, email, fullName } = body;

    // 1. Find the pending booking
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, bookingId));
    if (!booking) {
      return Response.json({ success: false, error: 'Booking not found' });
    }
    // 2. Find or create customer
    let [customer] = await db.select().from(users).where(eq(users.phone, phone));
    if (!customer) {
      // Create new user without password (password-less auth)
      
      const [newUser] = await db.insert(users).values({
        email: email,
        phone: phone,
        first_name: fullName.split(' ')[0] || 'Customer',
        last_name: fullName.split(' ').slice(1).join(' ') || '',
        role: 'customer',
        account_status: 'active',
        phone_verified_at: Math.floor(Date.now() / 1000),
        email_verified_at: Math.floor(Date.now() / 1000),
      }).returning();
      customer = newUser;
      console.error("Created new customer:", customer.id);
    }

    // 3. Generate a simulated M-Pesa receipt number
    const simulatedReceipt = `SIM${Date.now().toString().slice(-8)}`;

    // 4. Update payment record to completed
    await db.update(payments)
      .set({
        status: 'completed',
        mpesa_receipt_number: simulatedReceipt,
        transaction_date: Math.floor(Date.now() / 1000),
        result_code: '0',
        result_desc: 'Success',
      })
      .where(eq(payments.booking_id, bookingId));

    // 5. Update booking record
    await db.update(bookings)
      .set({
        customer_id: customer.id,
        status: 'confirmed',
        payment_status: 'paid',
      })
      .where(eq(bookings.id, bookingId));

    // 6. Generate OTP for future logins and store it
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
    const expiresAt = Math.floor(Date.now() / 1000) + (24 * 60 * 60); // 24 hours from now

    await db.insert(phoneVerifications).values({
      user_id: customer.id,
      code: otpCode,
      expires_at: expiresAt,
      attempts: 0,
    });

    console.log(`🔐 OTP for ${email}: ${otpCode} (Expires in 24 hours)`);

    return Response.json({ 
      success: true, 
      message: 'Payment simulation completed successfully',
      receipt: simulatedReceipt,
      customerId: customer.id
    });

  } catch (error) {
    console.error('Payment simulation failed route.ts:', error);
    return Response.json({ 
      success: false, 
      error: 'Payment simulation failed route.ts' 
    });
  }
}