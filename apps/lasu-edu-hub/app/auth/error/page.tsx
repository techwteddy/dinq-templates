'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error_description') || 'An authentication error occurred';

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center px-4">
      {/* Animated background elements */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-destructive/5 rounded-full blur-3xl animate-float-x opacity-30" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-glow opacity-20" />

      <div className="w-full max-w-md relative z-10">
        <div className="p-8 sm:p-10 rounded-2xl backdrop-blur-sm border-2 bg-white/95 shadow-2xl text-center space-y-6 animate-fade-in-up">
          {/* Error Icon */}
          <div className="inline-block p-6 rounded-full bg-destructive/10 border-2 border-destructive">
            <svg className="w-12 h-12 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          {/* Error Message */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-primary">Authentication Error</h1>
            <p className="text-foreground/70">{error}</p>
          </div>

          {/* Recovery Options */}
          <div className="space-y-3 pt-4">
            <Link
              href="/auth/login"
              className="block w-full py-3 rounded-lg font-bold bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              Back to Login
            </Link>
            <Link
              href="/auth/sign-up"
              className="block w-full py-3 rounded-lg font-bold border-2 border-primary text-primary hover:bg-primary/10 transition-all duration-300"
            >
              Create New Account
            </Link>
          </div>

          {/* Help Text */}
          <p className="text-sm text-foreground/60 pt-4">
            Having trouble? Try clearing your browser cache or contact support.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
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
    }>
      <AuthErrorContent />
    </Suspense>
  );
}
