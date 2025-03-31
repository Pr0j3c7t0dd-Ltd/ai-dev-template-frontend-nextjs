import { createClient } from './supabase/client';

// Types for the user details
export interface UserDetails {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

// Get auth token from Supabase for authorization
const getAuthToken = async (): Promise<string | undefined> => {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();

  // Make sure we have a token
  if (!data.session?.access_token) {
    console.error('No access token available for API request');
  }

  return data.session?.access_token;
};

// Base API utility for making authenticated requests
export const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const token = await getAuthToken();
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  if (!token) {
    throw new Error('Authentication required: No access token available');
  }

  // Create headers with the JWT token
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  // Make the request
  const response = await fetch(`${apiUrl}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Handle specific error cases
    if (response.status === 401) {
      throw new Error('Authentication failed: Invalid or expired token');
    }

    const error = await response
      .json()
      .catch(() => ({ message: `Error ${response.status}: ${response.statusText}` }));
    throw new Error(error.message || 'An error occurred while fetching data');
  }

  return response.json();
};

// Get current user details from the backend
export const getUserDetails = (): Promise<UserDetails> => {
  return apiRequest('/api/v1/users/me');
};
