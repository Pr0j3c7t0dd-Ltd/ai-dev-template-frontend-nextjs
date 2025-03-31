import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Modern Next.js App",
  description: "A modern Next.js application with Tailwind CSS and shadcn/ui",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background antialiased`}>
        <div className="relative flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
              <nav className="flex flex-1 items-center justify-between">
                <div className="flex items-center space-x-2">
                  {/* Logo will go here */}
                </div>
                <div className="flex items-center space-x-4">
                  {/* Navigation items will go here */}
                </div>
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
      </body>
    </html>
  );
}
