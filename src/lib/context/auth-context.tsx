'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session, AuthProvider } from '@/types/auth';
import { authApi, userApi, checkApiStatus } from '../backend-api';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  apiStatus: { isUp: boolean; lastChecked: Date | null };
  checkApiConnection: () => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signInWithSocial: (provider: AuthProvider) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState<{ isUp: boolean; lastChecked: Date | null }>({
    isUp: true,
    lastChecked: null,
  });

  // Load user from session cookie on initial load
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true);
        const response = await userApi.getCurrentUser();

        if (response.success && response.data) {
          setUser(response.data);
          setApiStatus({ isUp: true, lastChecked: new Date() });
        } else {
          setUser(null);
          // Only mark API as down if there's a network error, not for auth errors
          if (
            response.error &&
            (response.error.includes('Network error') || response.error.includes('Failed to fetch'))
          ) {
            setApiStatus({ isUp: false, lastChecked: new Date() });
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await authApi.signIn(email, password);

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Could not sign in. Please try again later.');
      }

      setUser(response.data.user);
      setSession(response.data.session);
      setApiStatus({ isUp: true, lastChecked: new Date() });
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string): Promise<void> => {
    try {
      const response = await authApi.signUp(email, password);

      if (!response.success) {
        throw new Error(response.error || 'Could not create account. Please try again later.');
      }

      // Don't return data, to match the Promise<void> return type
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const response = await authApi.signOut();

      if (!response.success) {
        throw new Error(response.error || 'Could not sign out. Please try again later.');
      }

      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const response = await authApi.resetPassword(email);

      if (!response.success) {
        throw new Error(
          response.error || 'Could not request password reset. Please try again later.'
        );
      }
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  const signInWithSocial = async (provider: AuthProvider) => {
    // Redirect to the OAuth provider URL from the backend
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/oauth/${provider}`;
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
        session,
        loading,
        apiStatus,
        checkApiConnection,
        signIn,
        signUp,
        signOut,
        resetPassword,
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
