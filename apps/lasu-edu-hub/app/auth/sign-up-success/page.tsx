'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingFlow } from '@/components/onboarding-flow';

export default function SignUpSuccessPage() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if onboarding was already shown
    const onboardingShown = localStorage.getItem('onboarding_shown') === 'true';
    if (onboardingShown) {
      setShowOnboarding(false);
    }
    setLoading(false);
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboarding_shown', 'true');
    setShowOnboarding(false);
    setTimeout(() => {
      router.push('/');
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-block p-6 rounded-full bg-accent/20 animate-pulse">
            <svg className="w-12 h-12 text-accent animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <p className="text-foreground/60">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {!showOnboarding && (
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="w-full max-w-md text-center space-y-8 animate-fade-in-up">
            {/* Success Icon */}
            <div className="inline-block p-6 rounded-full bg-green-100/50 border-2 border-green-400 animate-pulse-glow">
              <svg className="w-16 h-16 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>

            {/* Message */}
            <div className="space-y-3">
              <h1 className="text-4xl font-bold text-primary">Welcome!</h1>
              <p className="text-lg text-foreground/70">
                Your account has been created successfully. Check your email for a confirmation link to verify your account.
              </p>
            </div>

            {/* Info Box */}
            <div className="p-6 rounded-xl bg-accent/10 border-2 border-accent/30 text-left space-y-3">
              <h3 className="font-bold text-primary">Next steps:</h3>
              <ul className="space-y-2 text-foreground/70 text-sm">
                <li className="flex items-start gap-3">
                  <span className="text-accent font-bold">1.</span>
                  <span>Check your email for a confirmation link</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent font-bold">2.</span>
                  <span>Click the link to verify your email address</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent font-bold">3.</span>
                  <span>Log in with your credentials</span>
                </li>
              </ul>
            </div>

            {/* Redirect Info */}
            <p className="text-foreground/60 text-sm">
              You will be redirected in a moment...
            </p>
          </div>
        </div>
      )}

      {showOnboarding && (
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      )}
    </div>
  );
}
