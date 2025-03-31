import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Check if environment variables are set
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables');
      return NextResponse.redirect(`${requestUrl.origin}/sign-in?error=server_configuration_error`);
    }

    // Create a response to manipulate cookies on
    const response = NextResponse.redirect(`${requestUrl.origin}/`);

    // Create Supabase client using request/response cookies
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          response.cookies.set({ name, value: '', ...options, maxAge: 0 });
        },
      },
    });

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Error exchanging code for session:', error.message);
      return NextResponse.redirect(`${requestUrl.origin}/sign-in?error=auth_callback_error`);
    }

    // Return the response with cookies set
    return response;
  }

  // Redirect to the home page after successful authentication if no code
  return NextResponse.redirect(`${requestUrl.origin}/`);
}
