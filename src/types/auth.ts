export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  email_verified: boolean;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export type AuthProvider = 'google' | 'github' | 'facebook';
