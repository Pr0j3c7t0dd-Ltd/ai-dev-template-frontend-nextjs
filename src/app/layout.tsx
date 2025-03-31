import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/context/auth-context';
import { NavAuth } from '@/components/auth/nav-auth';
import Link from 'next/link';
import { Terminal } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Next.js App with Supabase Auth',
  description: 'A Next.js application with Supabase authentication',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background antialiased`}>
        <AuthProvider>
          <div className="relative flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-14 items-center">
                <nav className="flex flex-1 items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Link href="/" className="flex items-center gap-2">
                      <Terminal className="h-6 w-6" />
                      <span className="font-bold inline-block">AI Dev Template</span>
                    </Link>
                  </div>
                  <NavAuth />
                </nav>
              </div>
            </header>
            <main className="flex-1 container py-6">{children}</main>
            <footer className="border-t py-6 md:py-0">
              <div className="container flex h-14 items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Built with Next.js, Tailwind CSS, and shadcn/ui
                </p>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
