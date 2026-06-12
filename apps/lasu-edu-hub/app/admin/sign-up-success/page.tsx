'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function AdminSignUpSuccessPage() {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (countdown > 1) {
        setCountdown(countdown - 1);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center px-4 py-8">
      {/* Animated background elements */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-float-x opacity-30" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-glow opacity-20" />

      <div className="w-full max-w-md relative z-10">
        <div className="p-8 sm:p-10 rounded-2xl backdrop-blur-sm border-2 bg-white/95 shadow-2xl text-center space-y-6 animate-fade-in-up">
          {/* Success Icon */}
          <div className="inline-block p-6 rounded-full bg-accent/20 border-2 border-accent animate-bounce">
            <svg className="w-16 h-16 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          {/* Success Message */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-primary">Welcome to LASU Admin Portal!</h1>
            <p className="text-foreground/70">Your account has been created successfully. Please check your email to confirm your registration.</p>
          </div>

          {/* Email Confirmation Note */}
          <div className="p-4 rounded-lg bg-accent/10 border border-accent/30 space-y-2">
            <p className="text-sm font-semibold text-primary">📧 Verify Your Email</p>
            <p className="text-xs text-foreground/60">We've sent a confirmation link to your email. Click it to activate your admin account.</p>
          </div>

          {/* Next Steps */}
          <div className="space-y-3 pt-4">
            <Link
              href="/admin/login"
              className="block w-full py-3 rounded-lg font-bold bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              Go to Admin Login
            </Link>
            <Link
              href="/"
              className="block w-full py-3 rounded-lg font-bold border-2 border-primary text-primary hover:bg-primary/10 transition-all duration-300"
            >
              Back to Home
            </Link>
          </div>

          {/* Redirect Info */}
          <p className="text-sm text-foreground/60 pt-4">
            Redirecting to login in {countdown}s...
          </p>
        </div>
      </div>
    </div>
  );
}
