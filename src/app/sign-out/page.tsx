'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';

export default function SignOutPage() {
  const { signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        await signOut();
        router.push('/sign-in');
      } catch (error) {
        console.error('Error during sign out:', error);
        // If there's an error, still redirect to sign-in page
        router.push('/sign-in');
      }
    };

    logout();
  }, [signOut, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Signing out...</h1>
        <p className="text-gray-600">Please wait while we sign you out.</p>
      </div>
    </div>
  );
}
