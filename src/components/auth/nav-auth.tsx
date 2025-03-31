'use client';

import { useAuth } from '@/lib/context/auth-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function NavAuth() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">Loading...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/sign-in">
          <Button variant="outline">Sign In</Button>
        </Link>
        <Link href="/sign-up">
          <Button>Sign Up</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link href="/dashboard">
        <Button variant="ghost">Dashboard</Button>
      </Link>
      <span className="text-sm text-gray-600">{user.email}</span>
      <Link href="/sign-out">
        <Button variant="outline">Sign Out</Button>
      </Link>
    </div>
  );
}
