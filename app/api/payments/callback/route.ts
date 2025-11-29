// // app/api/payments/callback/route.ts
// import { NextRequest } from 'next/server';
// import { db } from '@/lib/database';
// import { payments, bookings, users } from '@/lib/database/schema';
// import { eq } from 'drizzle-orm';

// export async function POST(req: NextRequest) {
//   const body = await req.json();
//   const { Body } = body;
//   const { stkCallback } = Body;
//   const { CheckoutRequestID, ResultCode, CallbackMetadata } = stkCallback;

//   if (ResultCode !== 0) {
//     // Payment failed
//     await db.update(payments)
//       .set({ status: 'failed', result_desc: stkCallback.ResultDesc })
//       .where(eq(payments.checkout_request_id, CheckoutRequestID));
//     return Response.json({ success: false });
//   }

//   const items = CallbackMetadata.Items;
//   const receipt = items.find((i: any) => i.Name === 'MpesaReceiptNumber')?.Value;
//   const phone = items.find((i: any) => i.Name === 'PhoneNumber')?.Value;

//   // Find payment
//   const [payment] = await db.select().from(payments).where(eq(payments.checkout_request_id, CheckoutRequestID));
//   if (!payment) return Response.json({ success: false });

//   // Find booking
//   const [booking] = await db.select().from(bookings).where(eq(bookings.id, payment.booking_id));
//   if (!booking) return Response.json({ success: false });

//   // Find or create customer
//   let [customer] = await db.select().from(users).where(eq(users.phone, phone));
//   if (!customer) {
//     const [newUser] = await db.insert(users).values({
//       phone,
//       first_name: booking.special_requests?.split(' ')[0] || 'Customer',
//       last_name: booking.special_requests?.split(' ').slice(1).join(' ') || '',
//       role: 'customer',
//       account_status: 'active',
//       phone_verified_at: Math.floor(Date.now() / 1000),
//     }).returning();
//     customer = newUser;
//   }

//   // Finalize
//   await db.update(payments).set({
//     status: 'completed',
//     mpesa_receipt_number: receipt,
//     transaction_date: Math.floor(Date.now() / 1000),
//   }).where(eq(payments.id, payment.id));

//   await db.update(bookings).set({
//     customer_id: customer.id,
//     status: 'confirmed',
//     payment_status: 'paid',
//   }).where(eq(bookings.id, booking.id));

//   return Response.json({ success: true });
// }