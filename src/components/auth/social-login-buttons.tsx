'use client';

import { useState } from 'react';
import { Provider } from '@supabase/supabase-js';
import { useAuth } from '@/lib/context/auth-context';
import { Button } from '@/components/ui/button';

// Import icons from lucide-react
// removed unused imports as they're defined as custom components below

// Google logo as a custom component (colorful)
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

// Facebook logo as a custom component (colorful)
const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      fill="#1877F2"
      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
    />
  </svg>
);

// Apple logo as a custom component (black)
const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      fill="#000000"
      d="M14.94 5.19A4.38 4.38 0 0 0 16 2.5a4.38 4.38 0 0 0-2.91 1.5 4.13 4.13 0 0 0-1 2.66 3.63 3.63 0 0 0 2.85-1.47ZM17.39 12c0-2.32 1.9-3.43 1.93-3.48-1-1.57-2.68-1.77-3.27-1.8-1.37-.14-2.72.82-3.42.82s-1.84-.8-3-.78A4.48 4.48 0 0 0 6.06 9.5c-1.61 2.79-.41 6.9 1.16 9.16.79 1.11 1.71 2.34 2.92 2.3 1.17-.05 1.62-.75 3.06-.75s1.79.75 3 .72 2-1.11 2.77-2.22a9.08 9.08 0 0 0 1.26-2.56c0-.2-.18-1.16-1.84-2.15Z"
    />
  </svg>
);

// Microsoft logo as a custom component (colorful)
const MicrosoftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
    <path fill="#F25022" d="M0 0h11v11H0V0z" />
    <path fill="#00A4EF" d="M12 0h11v11H12V0z" />
    <path fill="#7FBA00" d="M0 12h11v11H0V12z" />
    <path fill="#FFB900" d="M12 12h11v11H12V12z" />
  </svg>
);

// Twitter/X logo as a custom component
const TwitterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      fill="#000000"
      d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
    />
  </svg>
);

// Discord logo as a custom component (colorful)
const DiscordIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      fill="#5865F2"
      d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"
    />
  </svg>
);

// Twitch logo as a custom component (colorful)
const TwitchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      fill="#9146FF"
      d="M11.64 5.93h1.43v4.28h-1.43m3.93-4.28H17v4.28h-1.43M7 2L3.43 5.57v12.86h4.28V22l3.58-3.57h2.85L20.57 12V2m-1.43 9.29l-2.85 2.85h-2.86l-2.5 2.5v-2.5H7.71V3.43h11.43z"
    />
  </svg>
);

type SocialLoginButtonProps = {
  provider: Provider;
  label: string;
  icon: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
};

const SocialLoginButton = ({
  provider,
  label,
  icon,
  className = '',
  fullWidth = false,
}: SocialLoginButtonProps) => {
  const { signInWithSocial } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithSocial(provider);
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className={`flex items-center justify-center gap-2 h-10 ${fullWidth ? 'w-full' : ''} ${className}`}
      onClick={handleSignIn}
      disabled={isLoading}
    >
      {icon}
      {isLoading ? 'Loading...' : label}
    </Button>
  );
};

export function SocialLoginButtons() {
  return (
    <div className="space-y-3 w-full">
      <div className="grid grid-cols-2 gap-3">
        <SocialLoginButton provider="google" label="Google" icon={<GoogleIcon />} />
        <SocialLoginButton provider="facebook" label="Facebook" icon={<FacebookIcon />} />
        <SocialLoginButton provider="apple" label="Apple" icon={<AppleIcon />} />
        <SocialLoginButton provider="azure" label="Microsoft" icon={<MicrosoftIcon />} />
        <SocialLoginButton provider="twitter" label="Twitter" icon={<TwitterIcon />} />
        <SocialLoginButton provider="discord" label="Discord" icon={<DiscordIcon />} />
      </div>
      <SocialLoginButton provider="twitch" label="Twitch" icon={<TwitchIcon />} fullWidth />
    </div>
  );
}
