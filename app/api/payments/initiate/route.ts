// app/api/payments/initiate/route.ts
import { NextRequest } from 'next/server';
import { db } from '@/lib/database';
import { payments } from '@/lib/database/schema';
import { eq } from 'drizzle-orm';

const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY!;
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET!;
const SHORTCODE = process.env.MPESA_SHORTCODE!;
const PASSKEY = process.env.MPESA_PASSKEY!;
const CALLBACK_URL = `${process.env.NEXT_PUBLIC_URL}/api/payments/callback`;

export async function POST(req: NextRequest) {
  const { paymentId, phone, amount, bookingId, fullName } = await req.json();

  try {
    // Get OAuth token
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
    const tokenRes = await fetch('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      headers: { Authorization: `Basic ${auth}` },
    });
    const { access_token } = await tokenRes.json();

    // Generate password
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString('base64');

    // STK Push
    const stkRes = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        BusinessShortCode: SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phone,
        PartyB: SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: CALLBACK_URL,
        AccountReference: `BOOK${bookingId}`,
        TransactionDesc: `Payment for Room ${bookingId}`,
      }),
    });

    const stkData = await stkRes.json();

    if (stkData.ResponseCode === '0') {
      // Save CheckoutRequestID
      await db.update(payments)
        .set({ checkout_request_id: stkData.CheckoutRequestID })
        .where(eq(payments.id, paymentId));

      return Response.json({ success: true });
    } else {
      return Response.json({ success: false, error: stkData.errorMessage });
    }
  } catch (error) {
    console.error('STK Push failed:', error);
    return Response.json({ success: false, error: 'Payment initiation failed' });
  }
}