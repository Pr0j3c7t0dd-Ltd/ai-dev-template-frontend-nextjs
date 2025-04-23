'use client';

import type { AuthProvider } from '@/types/auth';
import { useAuth } from '@/lib/context/auth-context';
import { Button } from '@/components/ui/button';
import { FaGithub, FaGoogle, FaFacebook } from 'react-icons/fa';

interface SocialLoginButtonsProps {
  className?: string;
}

export function SocialLoginButtons({ className }: SocialLoginButtonsProps) {
  const { signInWithSocial } = useAuth();

  const handleSocialLogin = async (provider: AuthProvider) => {
    try {
      await signInWithSocial(provider);
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error);
    }
  };

  return (
    <div className={`grid grid-cols-3 gap-2 ${className}`}>
      <Button
        variant="outline"
        onClick={() => handleSocialLogin('github')}
        className="w-full flex items-center justify-center"
      >
        <FaGithub className="mr-2 h-4 w-4" />
        <span className="sr-only">GitHub</span>
      </Button>

      <Button
        variant="outline"
        onClick={() => handleSocialLogin('google')}
        className="w-full flex items-center justify-center"
      >
        <FaGoogle className="mr-2 h-4 w-4" />
        <span className="sr-only">Google</span>
      </Button>

      <Button
        variant="outline"
        onClick={() => handleSocialLogin('facebook')}
        className="w-full flex items-center justify-center"
      >
        <FaFacebook className="mr-2 h-4 w-4" />
        <span className="sr-only">Facebook</span>
      </Button>
    </div>
  );
}
