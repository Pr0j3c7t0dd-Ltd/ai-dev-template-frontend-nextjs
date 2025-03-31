'use client';

import { useAuth } from '@/lib/context/auth-context';
import { Button } from '@/components/ui/button';

export function NavAuth() {
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-600">{user.email}</span>
      <Button variant="outline" onClick={() => signOut()}>
        Sign Out
      </Button>
    </div>
  );
}
