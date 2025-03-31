'use client';

import { useAuth } from '@/lib/context/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CopyIcon, CheckIcon, ReloadIcon } from '@radix-ui/react-icons';

export default function DashboardPage() {
  const { user, userDetails, loading, apiStatus, checkApiConnection } = useAuth();
  const [jwtToken, setJwtToken] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);
  const [isTokenVisible, setIsTokenVisible] = useState(false);
  const [checkingApi, setCheckingApi] = useState(false);

  const fetchToken = async () => {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    if (data.session?.access_token) {
      setJwtToken(data.session.access_token);
      setIsTokenVisible(true);
    }
  };

  const copyToClipboard = async () => {
    if (jwtToken) {
      await navigator.clipboard.writeText(jwtToken);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const hideToken = () => {
    setIsTokenVisible(false);
    setJwtToken('');
  };

  const refreshApiStatus = async () => {
    try {
      setCheckingApi(true);
      await checkApiConnection();
    } catch (error) {
      console.error('Error checking API status:', error);
    } finally {
      setCheckingApi(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <Skeleton className="h-12 w-1/3 mb-6" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage
                  src={userDetails?.avatar_url}
                  alt={userDetails?.first_name || 'User'}
                />
                <AvatarFallback>
                  {userDetails?.first_name?.[0] || user?.email?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>
                  Welcome,{' '}
                  {userDetails?.first_name
                    ? `${userDetails.first_name} ${userDetails.last_name || ''}`
                    : user?.email}
                </CardTitle>
                <CardDescription>You have successfully signed in to your account</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              This is your protected dashboard page. Only authenticated users can access this page.
            </p>
            <Link href="/profile">
              <Button variant="outline">View Profile</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Info</CardTitle>
            <CardDescription>Your account details and information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">User ID</span>
                <span className="text-sm text-muted-foreground">{userDetails?.id || user?.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Email</span>
                <span className="text-sm text-muted-foreground">
                  {userDetails?.email || user?.email}
                </span>
              </div>
              {userDetails?.created_at && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Member Since</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(userDetails.created_at).toLocaleDateString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm font-medium">Last Sign In</span>
                <span className="text-sm text-muted-foreground">
                  {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm font-medium">API Status</span>
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${apiStatus.isUp ? 'bg-green-500' : 'bg-red-500'}`}
                  />
                  <span className="text-sm text-muted-foreground">
                    {apiStatus.isUp ? 'Connected' : 'Disconnected'}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={refreshApiStatus}
                    disabled={checkingApi}
                    className="h-6 w-6"
                  >
                    <ReloadIcon className={`h-3 w-3 ${checkingApi ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>
              {apiStatus.lastChecked && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Last API Check</span>
                  <span className="text-sm text-muted-foreground">
                    {apiStatus.lastChecked.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>JWT Token</CardTitle>
            <CardDescription>Your authentication token for API access</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isTokenVisible ? (
                <>
                  <div className="p-3 bg-muted rounded-md overflow-x-auto">
                    <p className="text-xs font-mono break-all">{jwtToken}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                      className="flex items-center space-x-2"
                      disabled={isCopied}
                    >
                      {isCopied ? (
                        <>
                          <CheckIcon className="h-4 w-4" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <CopyIcon className="h-4 w-4" />
                          <span>Copy Token</span>
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="sm" onClick={hideToken}>
                      Hide Token
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    Your JWT token is required for authenticated API requests. Click below to reveal
                    it.
                  </p>
                  <Button onClick={fetchToken}>Show JWT Token</Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
