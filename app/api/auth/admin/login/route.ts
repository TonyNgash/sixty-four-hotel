import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { users, loginAttempts } from '@/lib/database/schema';
import { eq } from 'drizzle-orm';
import { verifyPassword } from '@/lib/auth/utils';
import { generateToken } from '@/lib/auth/utils';
import { trackLoginAttempt } from '@/lib/auth/security';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    function getClientIP(request: NextRequest): string {
        // Try different headers where IP might be stored
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                    request.headers.get('x-real-ip') ||
                    request.headers.get('cf-connecting-ip') || // Cloudflare
                    'unknown';
        
        return ip;
    }

    // Check if account is locked
    const lockedUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .get();

    if (lockedUser && lockedUser.locked_until && lockedUser.locked_until > new Date()) {
      await trackLoginAttempt({
        email,
        successful: false,
        failureReason: 'account_locked',
        ip: getClientIP(request) || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      });

      return NextResponse.json(
        { error: 'Account temporarily locked. Please try again later.' },
        { status: 423 }
      );
    }

    

    // Find user and verify credentials
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .get();

    if (!user || user.role !== 'admin') {
      await trackLoginAttempt({
        email,
        successful: false,
        failureReason: 'invalid_credentials',
        ip: getClientIP(request) || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      });

      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password_hash!);

    if (!isPasswordValid) {
      await trackLoginAttempt({
        email,
        successful: false,
        failureReason: 'invalid_password',
        ip: getClientIP(request) || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        userId: user.id,
      });

      // Increment failed attempts
      await db
        .update(users)
        .set({ 
          failed_attempts: (user.failed_attempts || 0) + 1,
          last_login_attempt: new Date(),
          ...((user.failed_attempts || 0) + 1 >= 5 ? { 
            locked_until: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
          } : {})
        })
        .where(eq(users.id, user.id));

      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Successful login - reset failed attempts
    await db
      .update(users)
      .set({ 
        failed_attempts: 0,
        locked_until: null,
        last_login_attempt: new Date()
      })
      .where(eq(users.id, user.id));

    await trackLoginAttempt({
      email,
      successful: true,
      ip: getClientIP(request) || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      userId: user.id,
    });

    // Generate JWT token
    const token = await generateToken(user);

    console.log('Generated token for verification:', token);
    console.log('JWT Secret used:', process.env.JWT_SECRET?.substring(0, 10) + '...');

    // Create response with HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      }
    });

    // Set secure HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    console.log('Setting auth cookie for domain:', request.nextUrl.hostname);
    
    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}