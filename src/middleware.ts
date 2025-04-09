import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import logger from '@/lib/logger';

export async function middleware(request: NextRequest) {
  const start = Date.now();
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value,
          ...options,
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({
          name,
          value,
          ...options,
        });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value: '',
          ...options,
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({
          name,
          value: '',
          ...options,
        });
      },
    },
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If user is signed in and the current path is /sign-in or /sign-up, redirect to /dashboard
  if (session && ['/sign-in', '/sign-up'].includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Define public routes that don't require authentication
  const publicRoutes = ['/', '/sign-in', '/sign-up', '/sign-out'];
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);

  // If user is not signed in and the current path is not a public route,
  // redirect to /sign-in
  if (!session && !isPublicRoute) {
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
