import { NextResponse, type NextRequest } from 'next/server';
import logger from '@/lib/logger';

export async function middleware(request: NextRequest) {
  const start = Date.now();
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Check authentication state by verifying the auth cookie
  const authCookie = request.cookies.get('auth_session');
  const isAuthenticated = !!authCookie?.value;

  // If user is signed in and the current path is /sign-in or /sign-up, redirect to /dashboard
  if (isAuthenticated && ['/sign-in', '/sign-up'].includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Define public routes that don't require authentication
  const publicRoutes = ['/', '/sign-in', '/sign-up', '/sign-out', '/auth/callback'];

  // Allow all auth API routes to be accessible without authentication
  const isAuthApiRoute = request.nextUrl.pathname.startsWith('/api/auth/');
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);

  // If user is not signed in and the current path is not a public route or auth API route,
  // redirect to /sign-in
  if (!isAuthenticated && !isPublicRoute && !isAuthApiRoute) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Log the request after it completes
  const duration = Date.now() - start;
  const url = request.nextUrl.pathname;
  const method = request.method;
  logger.http(`[Request] ${method} ${url} - ${duration}ms`);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/ or public/ (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|images/|public/).*)',
  ],
};
