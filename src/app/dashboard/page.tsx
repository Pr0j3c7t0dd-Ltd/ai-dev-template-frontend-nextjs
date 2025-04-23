'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/context/auth-context';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in');
    }
  }, [user, loading, router]);

  // Show loading or content
  if (loading) {
    return <div className="container mx-auto py-10">Loading...</div>;
  }

  if (!user) {
    return null; // Will redirect via the useEffect
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Welcome to your dashboard." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Account Overview</CardTitle>
            <CardDescription>Your account information and status.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Your account is active and in good standing.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your recent activities and interactions.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>No recent activities to show.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Your alerts and notifications.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>You have no new notifications.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
