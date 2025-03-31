'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Provider } from '@supabase/supabase-js';
import { createClient } from '../supabase/client';
import { UserDetails, getUserDetails } from '../api';

type AuthContextType = {
  user: User | null;
  userDetails: UserDetails | null;
  loading: boolean;
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
  const supabase = createClient();

  // Fetch user details from backend when authenticated
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user) {
        try {
          setLoading(true);
          const details = await getUserDetails();
          setUserDetails(details);
        } catch (error) {
          console.error('Error fetching user details:', error);
          // Don't clear userDetails on error to maintain existing data if it's a temporary issue

          // Handle authentication errors specifically
          if (
            error instanceof Error &&
            (error.message.includes('Authentication failed') ||
              error.message.includes('Authentication required'))
          ) {
            // If it's specifically an auth error, we might want to trigger a sign out
            // or refresh the token, depending on your auth strategy
            console.warn('Authentication issue detected when fetching user details');
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

  return (
    <AuthContext.Provider
      value={{ user, userDetails, loading, signIn, signUp, signOut, signInWithSocial }}
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
