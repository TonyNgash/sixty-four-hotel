import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth/utils';

export async function middleware(request: NextRequest) {

  const token = request.cookies.get('auth-token')?.value;
  console.log('=== MIDDLEWARE START ===');
  console.log('Path:', request.nextUrl.pathname);
  console.log('Token exists:', !!token);
  console.log('All cookies:', request.cookies.getAll().map(c => c.name));
  // Protect admin routes
  // if (request.nextUrl.pathname.startsWith('/admin')) {

    // Allow access to login page
    if (request.nextUrl.pathname === '/login') {
      console.log('Login route check');
      if (token) {
        try {
          console.log('Token found, verifying...');
          verifyToken(token);
          console.log('Token valid, redirecting to dashboard');
          // If valid token, redirect to dashboard
          return NextResponse.redirect(new URL('/dashboard', request.url));
        } catch{
          // Invalid token, allow access to login
          // console.log('Token invalid:', error.message);
          console.log('Token invalid:');
          return NextResponse.next();
        }
      }
      console.log('No token, allowing login');
      return NextResponse.next();
    }

    // Protect other admin routes
     if (request.nextUrl.pathname === '/dashboard') {
        console.log('Dashboard route check');
        if (!token) {
              console.log('No token, redirecting to login');
              return NextResponse.redirect(new URL('/login', request.url));
        }
        try {
          console.log('Token found, verifying for dashboard...');
          verifyToken(token);
          console.log('Dashboard access granted');
          return NextResponse.next();
        }catch (error) {
          console.log('Dashboard token invalid, redirecting to login');
          // Invalid token - redirect to login
          const response = NextResponse.redirect(new URL('/login', request.url));
          response.cookies.set('auth-token', '', { maxAge: 0 });
          return response;
        }
     }
    

  // }
     console.log('=== MIDDLEWARE END ===');
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/dashboard'
  ],
};