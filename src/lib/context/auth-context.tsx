'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Provider } from '@supabase/supabase-js';
import { createClient } from '../supabase/client';
import { UserDetails, getUserDetails, checkApiStatus } from '../api';

type AuthContextType = {
  user: User | null;
  userDetails: UserDetails | null;
  loading: boolean;
  apiStatus: { isUp: boolean; lastChecked: Date | null };
  checkApiConnection: () => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithSocial: (provider: Provider) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState<{ isUp: boolean; lastChecked: Date | null }>({
    isUp: true,
    lastChecked: null,
  });
  const supabase = createClient();

  // Fetch user details from backend when authenticated
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user) {
        try {
          setLoading(true);
          const details = await getUserDetails();
          setUserDetails(details);
          setApiStatus({ isUp: true, lastChecked: new Date() });
        } catch (error) {
          console.error(
            'Error fetching user details:',
            error instanceof Error ? error.message : String(error)
          );
          // Don't clear userDetails on error to maintain existing data if it's a temporary issue

          // Handle specific error types
          if (
            error instanceof Error &&
            (error.message.includes('Authentication failed') ||
              error.message.includes('Authentication required'))
          ) {
            console.warn('Authentication issue detected when fetching user details');
            setApiStatus({ isUp: false, lastChecked: new Date() });
          } else if (
            error instanceof Error &&
            (error.message.includes('Failed to fetch') ||
              error.message.includes('Could not connect') ||
              error.message.includes('Connection timed out') ||
              error.message.includes('Failed to connect to the backend API'))
          ) {
            console.warn(
              'Backend API connection issue. Please check if the backend server is running.'
            );
            setApiStatus({ isUp: false, lastChecked: new Date() });
          }
        } finally {
          setLoading(false);
        }
      } else {
        setUserDetails(null);
      }
    };

    fetchUserDetails();
  }, [user]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const signInWithSocial = async (provider: Provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
    if (error) throw error;
  };

  // Check if API is available
  const checkApiConnection = async (): Promise<boolean> => {
    try {
      const isUp = await checkApiStatus();
      setApiStatus({ isUp, lastChecked: new Date() });
      return isUp;
    } catch (error) {
      setApiStatus({ isUp: false, lastChecked: new Date() });
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userDetails,
        loading,
        apiStatus,
        checkApiConnection,
        signIn,
        signUp,
        signOut,
        signInWithSocial,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
