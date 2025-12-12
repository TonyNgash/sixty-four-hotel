import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { payments, bookings, users, phoneVerifications } from '@/lib/database/schema';
import { eq } from 'drizzle-orm';
import { MpesaCallbackRequest } from '@/types/public/mpesa-types'; // Import the types

export async function POST(req: NextRequest) {
  try {
    const body: MpesaCallbackRequest = await req.json(); // Type the request body
    const { stkCallback } = body.Body;

    // Check if the callback is for a successful transaction
    if (stkCallback.ResultCode === 0) {
      const { CheckoutRequestID } = stkCallback;

      // Use Array.find() for a more robust way to extract metadata
      const metadata = stkCallback.CallbackMetadata.Item;
      const amountItem = metadata.find(item => item.Name === 'Amount');
      const mpesaReceiptItem = metadata.find(item => item.Name === 'MpesaReceiptNumber');
      const transactionDateItem = metadata.find(item => item.Name === 'TransactionDate');
      const phoneNumberItem = metadata.find(item => item.Name === 'PhoneNumber');

      // Safely get the values, ensuring they exist and are of the correct type
      const amount = amountItem?.Value as number;
      const mpesaReceiptNumber = mpesaReceiptItem?.Value as string;
      const transactionDate = transactionDateItem?.Value as number;
      const phoneNumber = phoneNumberItem?.Value as string;

      // Find the payment record using the CheckoutRequestID
      const [paymentRecord] = await db.select().from(payments).where(eq(payments.checkout_request_id, CheckoutRequestID));

      if (!paymentRecord) {
        console.error('Payment record not found for CheckoutRequestID:', CheckoutRequestID);
        return NextResponse.json({ success: false, error: 'Payment record not found' }, { status: 404 });
      }

      // Find the booking record
      const bookingId = paymentRecord.booking_id;
      const [booking] = await db.select().from(bookings).where(eq(bookings.id, bookingId));

      if (!booking) {
        console.error('Booking not found for payment record:', paymentRecord.id);
        return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
      }

      // Find or create customer
      let [customer] = await db.select().from(users).where(eq(users.phone, paymentRecord.phone_number));
      if (!customer) {
        // Extract customer details from the booking's special_requests
        const specialRequests = booking.special_requests || '';
        const emailMatch = specialRequests.match(/Email: ([^\s,]+)/);
        const fullNameMatch = specialRequests.match(/Customer: ([^,]+)/);

        const email = emailMatch ? emailMatch[1] : '';
        const fullName = fullNameMatch ? fullNameMatch[1] : 'Customer';

        const [newUser] = await db.insert(users).values({
          email: email,
          phone: paymentRecord.phone_number,
          first_name: fullName.split(' ')[0] || 'Customer',
          last_name: fullName.split(' ').slice(1).join(' ') || '',
          role: 'customer',
          account_status: 'active',
          phone_verified_at: Math.floor(Date.now() / 1000),
          email_verified_at: Math.floor(Date.now() / 1000),
        }).returning();
        customer = newUser;
      }

      // Update payment record to completed
      await db.update(payments)
        .set({
          status: 'completed',
          mpesa_receipt_number: mpesaReceiptNumber,
          transaction_date: transactionDate, // Use the date from M-Pesa
          result_code: stkCallback.ResultCode.toString(),
          result_desc: stkCallback.ResultDesc,
        })
        .where(eq(payments.id, paymentRecord.id));

      // Update booking record
      await db.update(bookings)
        .set({
          customer_id: customer.id,
          status: 'confirmed',
          payment_status: 'paid',
        })
        .where(eq(bookings.id, bookingId));

      // Generate OTP for future logins
      const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
      const expiresAt = Math.floor(Date.now() / 1000) + (24 * 60 * 60); // 24 hours

      await db.insert(phoneVerifications).values({
        user_id: customer.id,
        code: otpCode,
        expires_at: expiresAt,
      });

      console.log(`✅ Payment Successful! Booking ID: ${bookingId}, Receipt: ${mpesaReceiptNumber}`);
      console.log(`🔐 OTP for ${customer.email}: ${otpCode} (Expires in 24 hours)`);

    } else {
      // Handle failed payment
      const { CheckoutRequestID, ResultDesc } = stkCallback;
      console.error(`❌ Payment Failed for CheckoutRequestID: ${CheckoutRequestID}, Reason: ${ResultDesc}`);

      // Find and update the payment record to 'failed'
      const [paymentRecord] = await db.select().from(payments).where(eq(payments.checkout_request_id, CheckoutRequestID));
      if (paymentRecord) {
        await db.update(payments)
          .set({
            status: 'failed',
            result_code: stkCallback.ResultCode.toString(),
            result_desc: ResultDesc,
          })
          .where(eq(payments.id, paymentRecord.id));

        // Update booking status to 'payment_failed'
        await db.update(bookings)
          .set({
            payment_status: 'failed',
          })
          .where(eq(bookings.id, paymentRecord.booking_id));
      }
    }

    // Safaricom requires a specific response to acknowledge the callback
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Success' });

  } catch (error) {
    console.error('Error in M-Pesa callback:', error);
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Server error' }, { status: 500 });
  }
}