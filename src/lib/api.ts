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

  if (!apiUrl) {
    throw new Error('Backend API URL is not configured. Please check your environment variables.');
  }

  if (!token) {
    throw new Error('Authentication required: No access token available');
  }

  // Create headers with the JWT token - only include necessary headers
  // Per the backend error log, only authorization and content-type are allowed
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  // Ensure method is preserved
  const method = options.method || 'GET';

  try {
    // Make the request with a timeout to avoid long waits on connection issues
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    // Ensure consistent URL format: convert localhost to 127.0.0.1 if needed
    const targetUrl = `${apiUrl}${endpoint}`.replace('localhost', '127.0.0.1');

    const fetchOptions: RequestInit = {
      method,
      headers,
      signal: controller.signal,
      // Set the credentials to include to send cookies if needed
      credentials: 'include',
    };

    const response = await fetch(targetUrl, fetchOptions);

    clearTimeout(timeoutId);

    if (!response.ok) {
      // Handle specific error cases
      if (response.status === 401 || response.status === 403) {
        throw new Error('Authentication failed: Invalid or expired token');
      }

      const error = await response
        .json()
        .catch(() => ({ message: `Error ${response.status}: ${response.statusText}` }));
      throw new Error(error.message || 'An error occurred while fetching data');
    }

    return response.json();
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Connection timed out. Please check if the backend server is running.');
    }

    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Could not connect to the backend server. Please ensure it is running.');
      }
      throw error;
    }

    throw new Error('Failed to connect to the backend API');
  }
};

// Get current user details from the backend
export const getUserDetails = (): Promise<UserDetails> => {
  return apiRequest('/api/v1/users/me');
};

// Check if the API is up and running
export const checkApiStatus = async (): Promise<boolean> => {
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  if (!apiUrl) {
    return false;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    // Use a simple health check endpoint or the root to check if API is up
    // This doesn't need authentication
    const response = await fetch(`${apiUrl}/api/v1/health`, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    return false;
  }
};
