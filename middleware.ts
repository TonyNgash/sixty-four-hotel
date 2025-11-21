import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ROUTES } from '@/lib/constants/routes';

const ADMIN_PATHS = [
  ROUTES.admin.dashboard,
  ROUTES.admin.rooms,
  ROUTES.admin.bookings,
  ROUTES.admin.staff,
  ROUTES.admin.settings,
  ROUTES.admin.revenue,
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const { pathname } = request.nextUrl;

  // Protect all admin routes
  const isAdminRoute = ADMIN_PATHS.some(path => pathname.startsWith(path));

  if (isAdminRoute && !token) {
    const loginUrl = new URL(ROUTES.admin.login, request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect old /login → /admin-login
  // if (pathname === '/login') {
  //   return NextResponse.redirect(new URL(ROUTES.admin.login, request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/protected/admin-:path*'],
};