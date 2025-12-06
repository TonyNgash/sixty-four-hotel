// app/api/auth/customer/request-otp-phone/route.ts
import { NextRequest } from 'next/server';
import { db } from '@/lib/database';
import { users, phoneVerifications } from '@/lib/database/schema';
import { eq, and, gt } from 'drizzle-orm';

interface RequestOtpRequest {
  phone: string;
}

interface RequestOtpResponse {
  success: boolean;
  message?: string;
  error?: string;
  otp?: string; // Included for testing purposes
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body: RequestOtpRequest = await req.json();
    const { phone } = body;

    const preSafe = phone.replace("254","");
    const safePhone = '254' + preSafe;

    if (!safePhone || !safePhone.match(/^254[17]\d{8}$/)) {
      return Response.json({ 
        success: false, 
        error: `${safePhone} is invalid` 
      } as RequestOtpResponse);
    }

    // 1. Find user by phone
    const [user] = await db.select().from(users).where(eq(users.phone, safePhone));
    
    if (!user) {
      return Response.json({ 
        success: false, 
        error: 'No account found with this phone number. Please book a room first.' 
      } as RequestOtpResponse);
    }

    if (user.role !== 'customer') {
      return Response.json({ 
        success: false, 
        error: 'This phone number is not associated with a customer account' 
      } as RequestOtpResponse);
    }

    // 2. Check for recent OTP requests (prevent spam)
    const oneMinuteAgo = Math.floor(Date.now() / 1000) - 60;
    const recentAttempts = await db.select()
      .from(phoneVerifications)
      .where(
        and(
          eq(phoneVerifications.user_id, user.id),
          gt(phoneVerifications.created_at, oneMinuteAgo)
        )
      );

    if (recentAttempts.length > 0) {
      return Response.json({ 
        success: false, 
        error: 'Please wait a minute before requesting a new OTP' 
      } as RequestOtpResponse);
    }

    // 3. Generate 4-digit OTP
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = Math.floor(Date.now() / 1000) + (24 * 60 * 60); // 24 hours

    // 4. Store OTP in database
    await db.insert(phoneVerifications).values({
      user_id: user.id,
      code: otpCode,
      expires_at: expiresAt,
      attempts: 0,
    });

    // 5. In production, you would send SMS here. For now, log to console.
    console.log(`📱 OTP for ${user.email} (${user.phone}): ${otpCode}`);
    console.log(`⏰ OTP expires at: ${new Date(expiresAt * 1000).toLocaleString()}`);

    return Response.json({ 
      success: true, 
      message: 'OTP sent successfully. Check the console for the code.',
      otp: otpCode // Included for testing purposes
    } as RequestOtpResponse);

  } catch (error) {
    console.error('OTP request failed:', error);
    return Response.json({ 
      success: false, 
      error: 'Failed to send OTP. Please try again.' 
    } as RequestOtpResponse);
  }
}