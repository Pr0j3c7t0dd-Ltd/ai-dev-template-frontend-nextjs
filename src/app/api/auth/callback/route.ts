import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const cookieStore = cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Check if environment variables are set
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables');
      return NextResponse.redirect(`${requestUrl.origin}/sign-in?error=server_configuration_error`);
    }

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(
          name: string,
          value: string,
          options: {
            path: string;
            maxAge: number;
            domain?: string;
            sameSite?: string;
            secure?: boolean;
          }
        ) {
          cookieStore.set({ name, value, ...options });
        },
        remove(
          name: string,
          options: { path: string; domain?: string; sameSite?: string; secure?: boolean }
        ) {
          cookieStore.set({ name, value: '', ...options, maxAge: 0 });
        },
      },
    });

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Error exchanging code for session:', error.message);
      return NextResponse.redirect(`${requestUrl.origin}/sign-in?error=auth_callback_error`);
    }
  }

  // Redirect to the home page after successful authentication
  return NextResponse.redirect(`${requestUrl.origin}/`);
}
