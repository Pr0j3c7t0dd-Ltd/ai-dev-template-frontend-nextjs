'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Completing authentication...');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Authentication failed: No token provided.');
      return;
    }

    const completeAuth = async () => {
      try {
        // Verify the token with the backend
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/verify-token`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
            credentials: 'include',
          }
        );

        if (response.ok) {
          setStatus('success');
          setMessage('Authentication successful! Redirecting...');

          // Redirect after a short delay
          setTimeout(() => {
            router.push('/dashboard');
          }, 1500);
        } else {
          const data = await response.json();
          setStatus('error');
          setMessage(`Authentication failed: ${data.detail || data.error || 'Unknown error'}`);
        }
      } catch (error) {
        setStatus('error');
        setMessage(
          `Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    };

    completeAuth();
  }, [router, searchParams]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center">
          <div className="mb-4">
            {status === 'loading' && (
              <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            )}
            {status === 'success' && <div className="text-green-500 text-3xl">✓</div>}
            {status === 'error' && <div className="text-red-500 text-3xl">✗</div>}
          </div>

          <p className="text-lg mb-4">{message}</p>

          {status === 'error' && (
            <Button onClick={() => router.push('/sign-in')} className="mt-2">
              Return to Sign In
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Wrap with Suspense boundary as required by Next.js
export default function AuthCallback() {
  return (
    <Suspense
      fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
