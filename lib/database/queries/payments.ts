// lib/database/queries/payments.ts
import { db } from '@/lib/database';
import { payments, bookings } from '@/lib/database/schema';
import { eq } from 'drizzle-orm';

export interface PaymentCreateData {
  booking_id: number;
  amount: number;
  phone_number: string;
  checkout_request_id?: string;
}

export interface PaymentUpdateData {
  status?: 'initiated' | 'completed' | 'failed' | 'cancelled';
  mpesa_receipt_number?: string;
  transaction_date?: Date;
  result_code?: string;
  result_desc?: string;
}

/**
 * Create a payment record
 */
export async function createPayment(paymentData: PaymentCreateData) {
  const [payment] = await db.insert(payments).values({
    booking_id: paymentData.booking_id,
    amount: paymentData.amount,
    phone_number: paymentData.phone_number,
    checkout_request_id: paymentData.checkout_request_id || '',
    status: 'initiated',
  }).returning();

  return payment;
}

/**
 * Update payment record
 */
export async function updatePayment(paymentId: number, updateData: PaymentUpdateData) {
  const updateValues: any = {
    ...updateData,
    updated_at: Math.floor(Date.now() / 1000),
  };

  // Convert Date to timestamp if provided
  if (updateData.transaction_date) {
    updateValues.transaction_date = Math.floor(updateData.transaction_date.getTime() / 1000);
  }

  const [payment] = await db.update(payments)
    .set(updateValues)
    .where(eq(payments.id, paymentId))
    .returning();

  return payment || null;
}

/**
 * Find payment by checkout request ID
 */
export async function findPaymentByCheckoutRequest(checkoutRequestId: string) {
  const [payment] = await db.select().from(payments).where(eq(payments.checkout_request_id, checkoutRequestId));
  return payment || null;
}

/**
 * Find payment by booking ID
 */
export async function findPaymentByBookingId(bookingId: number) {
  const [payment] = await db.select().from(payments).where(eq(payments.booking_id, bookingId));
  return payment || null;
}

/**
 * Update payment to completed status with M-Pesa details
 */
export async function completePayment(
  paymentId: number, 
  mpesaReceiptNumber: string, 
  transactionDate?: Date
) {
  const [payment] = await db.update(payments)
    .set({
      status: 'completed',
      mpesa_receipt_number: mpesaReceiptNumber,
      transaction_date: transactionDate ? Math.floor(transactionDate.getTime() / 1000) : Math.floor(Date.now() / 1000),
      result_code: '0',
      result_desc: 'Success',
      updated_at: Math.floor(Date.now() / 1000),
    })
    .where(eq(payments.id, paymentId))
    .returning();

  return payment || null;
}

/**
 * Update payment to failed status
 */
export async function failPayment(paymentId: number, errorMessage: string) {
  const [payment] = await db.update(payments)
    .set({
      status: 'failed',
      result_desc: errorMessage,
      updated_at: Math.floor(Date.now() / 1000),
    })
    .where(eq(payments.id, paymentId))
    .returning();

  return payment || null;
}