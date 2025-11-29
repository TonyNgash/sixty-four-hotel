// app/api/auth/customer/logout/route.ts
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

interface LogoutResponse {
  success: boolean;
  message?: string;
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const cookieStore = await cookies();
    
    // Clear the customer-token cookie
    cookieStore.delete('customer-token');
    
    return Response.json({ 
      success: true, 
      message: 'Logged out successfully' 
    } as LogoutResponse);
    
  } catch (error) {
    console.error('Logout failed:', error);
    return Response.json({ 
      success: false, 
      message: 'Logout failed' 
    } as LogoutResponse);
  }
}