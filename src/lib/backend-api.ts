import { User } from '@/types/auth';

// Types for API responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Auth-related types
export interface SignInResponse {
  user: User;
  session: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  };
}

export interface SignUpResponse {
  success: boolean;
  message: string;
}

export interface PasswordResetResponse {
  success: boolean;
  message: string;
}

// Token-related response types
export interface RefreshTokenResponse {
  success: boolean;
  session?: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  };
  error?: string;
}

export interface VerifyTokenResponse {
  success: boolean;
  user?: Record<string, unknown>;
  error?: string;
}

// Base URL from environment
const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

// Helper method to make API requests
const fetchApi = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  if (!API_URL) {
    throw new Error('Backend API URL is not configured');
  }

  try {
    const url = `${API_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      credentials: 'include', // This ensures cookies are sent with the request
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.detail || data.error || 'An error occurred',
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('API request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error occurred',
    };
  }
};

// Auth API methods
export const authApi = {
  // Sign in with email and password
  signIn: async (email: string, password: string): Promise<ApiResponse<SignInResponse>> => {
    return fetchApi<SignInResponse>('/api/v1/auth/sign-in', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Sign up with email and password
  signUp: async (email: string, password: string): Promise<ApiResponse<SignUpResponse>> => {
    return fetchApi<SignUpResponse>('/api/v1/auth/sign-up', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Sign out current user
  signOut: async (): Promise<ApiResponse<void>> => {
    return fetchApi('/api/v1/auth/sign-out', {
      method: 'POST',
    });
  },

  // Request password reset
  resetPassword: async (email: string): Promise<ApiResponse<PasswordResetResponse>> => {
    return fetchApi<PasswordResetResponse>('/api/v1/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Change password with reset token
  changePassword: async (token: string, password: string): Promise<ApiResponse<void>> => {
    return fetchApi('/api/v1/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  },

  // Verify email with token
  verifyEmail: async (token: string): Promise<ApiResponse<void>> => {
    return fetchApi(`/api/v1/auth/verify-email/${token}`, {
      method: 'GET',
    });
  },

  // Refresh authentication tokens
  refreshToken: async (): Promise<ApiResponse<RefreshTokenResponse>> => {
    return fetchApi<RefreshTokenResponse>('/api/v1/auth/refresh', {
      method: 'POST',
    });
  },

  // Verify token from OAuth callback
  verifyToken: async (token: string): Promise<ApiResponse<VerifyTokenResponse>> => {
    return fetchApi<VerifyTokenResponse>('/api/v1/auth/verify-token', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },
};

// User API methods
export const userApi = {
  // Get current user profile
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    return fetchApi<User>('/api/v1/users/me');
  },

  // Get user settings
  getUserSettings: async (): Promise<ApiResponse<UserSettings>> => {
    return fetchApi<UserSettings>('/api/v1/users/me/settings');
  },

  // Update user settings
  updateUserSettings: async (settings: UserSettingsBase): Promise<ApiResponse<UserSettings>> => {
    return fetchApi<UserSettings>('/api/v1/users/me/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },
};

// Types for user settings
export interface UserSettingsBase {
  theme?: string | null;
  language?: string | null;
  timezone?: string | null;
}

export interface UserSettings extends UserSettingsBase {
  id: string;
}

// Health check for the API
export const checkApiStatus = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/api/v1/health`, {
      method: 'GET',
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};
