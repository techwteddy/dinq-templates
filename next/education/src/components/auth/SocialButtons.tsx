'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/Icons';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SocialButtonsProps {
  isLoading?: boolean;
}

export const SocialButtons: React.FC<SocialButtonsProps> = ({ isLoading }) => {
  const { loginWithSocial } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isSocialLoading, setIsSocialLoading] = React.useState<
    'google' | 'apple' | null
  >(null);

  const handleSocialClick = async (
    e: React.MouseEvent<HTMLButtonElement>,
    provider: 'google' | 'apple'
  ) => {
    e.preventDefault();
    setIsSocialLoading(provider);

    try {
      await loginWithSocial(provider);
      toast({
        title: `Signed in with ${provider === 'google' ? 'Google' : 'Apple'}`,
        description: 'Welcome back!',
      });
      router.push('/profile');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Login failed',
        description: 'Could not authenticate with social provider.',
      });
    } finally {
      setIsSocialLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <Button
        variant="outline"
        type="button"
        disabled={isLoading || !!isSocialLoading}
        onClick={(e) => handleSocialClick(e, 'google')}
        className="w-full"
      >
        {isSocialLoading === 'google' ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}
        Google
      </Button>
      <Button
        variant="outline"
        type="button"
        disabled={isLoading || !!isSocialLoading}
        onClick={(e) => handleSocialClick(e, 'apple')}
        className="w-full"
      >
        {isSocialLoading === 'apple' ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.apple className="mr-2 h-4 w-4" />
        )}
        Apple
      </Button>
    </div>
  );
};
