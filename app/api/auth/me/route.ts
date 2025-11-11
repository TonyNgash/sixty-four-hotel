import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/utils';
import { db } from '@/lib/database';
import { users } from '@/lib/database/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const decoded = await verifyToken(token);

    console.log('Decoded token:', decoded); //

     // Check if userId exists and is valid
    if (!decoded.userId) {
      console.error('No userId in decoded token');
      return NextResponse.json({ user: null });
    }
    
    const user = await db
      .select({
        id: users.id,
        email: users.email,
        role: users.role,
        first_name: users.first_name,
        last_name: users.last_name,
      })
      .from(users)
      .where(eq(users.id, decoded.userId))
      .get();

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ user: null });
  }
}