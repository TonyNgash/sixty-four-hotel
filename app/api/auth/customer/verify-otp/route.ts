// app/api/auth/customer/verify-otp/route.ts
import { NextRequest } from 'next/server';
import { db } from '@/lib/database';
import { users, phoneVerifications } from '@/lib/database/schema';
import { eq, and, gt } from 'drizzle-orm';
import { generateToken } from '@/lib/auth/utils';
import { cookies } from 'next/headers';

interface VerifyOtpRequest {
  email: string;
  code: string;
}

interface VerifyOtpResponse {
  success: boolean;
  user?: {
    id: number;
    email: string;
    role: 'customer';
    first_name: string | null;
    last_name: string | null;
  };
  error?: string;
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body: VerifyOtpRequest = await req.json();
    const { email, code } = body;

    if (!email || !code) {
      return Response.json({ 
        success: false, 
        error: 'Email and OTP code are required' 
      } as VerifyOtpResponse);
    }

    if (!code.match(/^\d{4}$/)) {
      return Response.json({ 
        success: false, 
        error: 'OTP must be a 4-digit number' 
      } as VerifyOtpResponse);
    }

    // 1. Find user by email
    const [user] = await db.select().from(users).where(eq(users.email, email));
    
    if (!user || user.role !== 'customer') {
      return Response.json({ 
        success: false, 
        error: 'Invalid email or account not found' 
      } as VerifyOtpResponse);
    }

    // 2. Find valid OTP (not expired, not exceeded attempts)
    const now = Math.floor(Date.now() / 1000);
    const [otpRecord] = await db.select()
      .from(phoneVerifications)
      .where(
        and(
          eq(phoneVerifications.user_id, user.id),
          eq(phoneVerifications.code, code),
          gt(phoneVerifications.expires_at, now),
          eq(phoneVerifications.attempts, 0) // Only unattempted OTPs
        )
      )
      .orderBy(phoneVerifications.created_at)
      .limit(1);

    if (!otpRecord) {
      // Mark any OTPs as attempted if code is wrong
      const recentOtps = await db.select()
        .from(phoneVerifications)
        .where(
          and(
            eq(phoneVerifications.user_id, user.id),
            gt(phoneVerifications.expires_at, now)
          )
        );

      for (const otp of recentOtps) {
        await db.update(phoneVerifications)
          .set({ attempts: otp.attempts + 1 })
          .where(eq(phoneVerifications.id, otp.id));
      }

      return Response.json({ 
        success: false, 
        error: 'Invalid or expired OTP code' 
      } as VerifyOtpResponse);
    }

    // 3. OTP is valid - generate JWT token
    const token = await generateToken(user);

    // 4. Set customer-token cookie (24 hours)
    const cookieStore = await cookies();
    cookieStore.set('customer-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    });

    // 5. Mark OTP as used
    await db.update(phoneVerifications)
      .set({ attempts: otpRecord.attempts + 1 })
      .where(eq(phoneVerifications.id, otpRecord.id));

    // 6. Return user data (without sensitive info)
    const userResponse = {
      id: user.id,
      email: user.email,
      role: user.role as 'customer',
      first_name: user.first_name,
      last_name: user.last_name,
    };

    return Response.json({ 
      success: true, 
      user: userResponse 
    } as VerifyOtpResponse);

  } catch (error) {
    console.error('OTP verification failed:', error);
    return Response.json({ 
      success: false, 
      error: 'Failed to verify OTP. Please try again.' 
    } as VerifyOtpResponse);
  }
}