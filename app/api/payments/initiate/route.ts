import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { payments } from '@/lib/database/schema';
import { eq } from 'drizzle-orm';

// Helper function to get M-Pesa OAuth Access Token
async function getMpesaAccessToken() {
  const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64');
  
  try{
    const response = await fetch('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    const data = await response.json();

    // console.log('--- M-Pesa Token Request Details ---');
    // console.log('Response Status:', response.status);
    // console.log('Response Headers:', response.headers);
    // console.log('Response Body (Data):', data);
    // console.log('------------------------------------');

    if (!response.ok) {
      console.error('Failed to get M-Pesa access token. Safaricom Response:', data);
      throw new Error(`Failed to get M-Pesa access token: ${data.error_description || data.errorMessage}`);
    }
    return data.access_token;
  }catch(error){
    console.error('Error fetching M-Pesa access token:', error);
    throw error;
  }
  
}

// Helper function to format the phone number
function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  let formattedPhone = phone.replace(/\D/g, '');

  // If the number starts with 0, replace it with 254
  if (formattedPhone.startsWith('0')) {
    formattedPhone = '254' + formattedPhone.substring(1);
  }
  // If the number doesn't start with 254, prepend it
  else if (!formattedPhone.startsWith('254')) {
    formattedPhone = '254' + formattedPhone;
  }

  return formattedPhone;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookingId, phone, amount, fullName } = body;

    if (!bookingId || !phone || !amount) {
      return NextResponse.json({ success: false, error: 'Missing required fields: bookingId, phone, amount' }, { status: 400 });
    }

    // 1. Get M-Pesa Access Token
    const accessToken = await getMpesaAccessToken();
    // console.log('Received Access Token:', accessToken);
    if(!accessToken){
      console.error('Access token is undefined or empty. Halting STK push');
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to obtain M-Pesa access token' 
      }, { status: 500 });
    }

    // 2. Format the phone number
    const formattedPhone = formatPhoneNumber(phone);

    // 3. Prepare the STK Push request
    const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, -3);
    const password = Buffer.from(`${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`).toString('base64');

    const stkPushRequest = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(amount), // M-Pesa requires an integer
      PartyA: formattedPhone,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: `${fullName} Room Booking: ${bookingId}`,
      TransactionDesc: `Payment for room booking: ${bookingId}`,
    };

    //  console.log('Sending STK Push Request:', JSON.stringify(stkPushRequest, null, 2));
    // 4. Make the API call to Safaricom
    const response = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(stkPushRequest),
    });

    const data = await response.json();

    // console.log('STK Push Response Status:', response.status);
    // console.log('STK Push Response Body:', JSON.stringify(data, null, 2));

    if (!response.ok || data.ResponseCode !== '0') {
      console.error('M-Pesa STK Push Error:', data);
      // Update payment record to failed
      await db.update(payments).set({ status: 'failed' }).where(eq(payments.booking_id, bookingId));
      return NextResponse.json({ success: false, error: data.errorMessage || 'Failed to initiate M-Pesa payment' }, { status: 500 });
    }

    // 5. Update the payment record with the CheckoutRequestID
    await db.update(payments)
      .set({
        checkout_request_id: data.CheckoutRequestID,
        status: 'sent_to_phone',
      })
      .where(eq(payments.booking_id, bookingId));

    // 6. Return success response
    return NextResponse.json({
      success: true,
      message: 'STK Push sent successfully. Please check your phone.',
      checkoutRequestId: data.CheckoutRequestID,
    });

  } catch (error) {
    console.error('Error in /api/payments/initiate:', error);
    return NextResponse.json({ success: false, error: 'An internal server error occurred' }, { status: 500 });
  }
}