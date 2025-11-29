// app/api/auth/customer/me/route.ts
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/utils';
import { db } from '@/lib/database';
import { users } from '@/lib/database/schema';
import { eq } from 'drizzle-orm';

interface MeResponse {
  success: boolean;
  user?: {
    id: number;
    email: string;
    role: 'customer';
    first_name: string | null;
    last_name: string | null;
    phone: string;
  };
  error?: string;
}

export async function GET(req: NextRequest): Promise<Response> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('customer-token')?.value;

    if (!token) {
      return Response.json({ 
        success: false, 
        error: 'Not authenticated' 
      } as MeResponse);
    }

    // Verify the token
    const payload = await verifyToken(token);
    
    if (payload.role !== 'customer') {
      return Response.json({ 
        success: false, 
        error: 'Invalid token' 
      } as MeResponse);
    }

    // Get user data from database
    const [user] = await db.select().from(users).where(eq(users.id, payload.userId));
    
    if (!user) {
      return Response.json({ 
        success: false, 
        error: 'User not found' 
      } as MeResponse);
    }

    // Return user data (without sensitive info)
    const userResponse = {
      id: user.id,
      email: user.email,
      role: user.role as 'customer',
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
    };

    return Response.json({ 
      success: true, 
      user: userResponse 
    } as MeResponse);

  } catch (error) {
    console.error('Auth check failed:', error);
    
    // Clear invalid token
    const cookieStore = await cookies();
    cookieStore.delete('customer-token');
    
    return Response.json({ 
      success: false, 
      error: 'Authentication failed' 
    } as MeResponse);
  }
}