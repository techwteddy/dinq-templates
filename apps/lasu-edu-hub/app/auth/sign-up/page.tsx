'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image'; // Add this import for optimized image

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  const supabase = createClient();

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!email.includes('@')) {
      errors.email = 'Please enter a valid email address';
    }

    if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (fullName.trim().length < 2) {
      errors.fullName = 'Please enter your full name';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/sign-up-success`,
          data: {
            full_name: fullName,
            user_type: 'student',
          },
        },
      });

      if (authError) {
        setError(authError.message);
      } else if (data.user) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('onboarding_shown', 'false');
          localStorage.setItem('user_email', email);
        }
        setSuccess(true);
        setTimeout(() => {
          router.push('/auth/sign-up-success');
        }, 2000);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center px-4 py-8">
      {/* Animated background elements */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-float-x opacity-30" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-glow opacity-20" />

      <div className="w-full max-w-md relative z-10">
        {/* Card Container */}
        <div className={`p-8 sm:p-10 rounded-2xl backdrop-blur-sm border-2 bg-white/95 shadow-2xl transition-all duration-500 transform ${success ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
          }`}>
          {/* Header */}
          <div className="mb-8 text-center animate-fade-in-up">
            {/* LASU Logo instead of ✨ */}
            <div className="mb-6 mx-auto relative w-24 h-24 sm:w-28 sm:h-28">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/3/3e/Lagos_State_University_logo.png"
                alt="Lagos State University Logo"
                fill
                className="object-contain drop-shadow-md"
                priority
              />
            </div>
            <h1 className="text-3xl font-bold text-primary mb-2">Create Account</h1>
            <p className="text-foreground/60">Join LASU STESA and start your academic journey check spam for confirmation link </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignUp} className="space-y-5">
            {/* Full Name Input */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
              <label className="block text-sm font-semibold text-primary mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className={`w-full px-4 py-3 rounded-lg border-2 bg-white/50 text-foreground placeholder-foreground/40 transition-all duration-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 hover:border-primary/40 ${validationErrors.fullName
                  ? 'border-destructive focus:border-destructive'
                  : 'border-primary/20 focus:border-accent'
                  }`}
              />
              {validationErrors.fullName && (
                <p className="text-destructive text-xs mt-1">{validationErrors.fullName}</p>
              )}
            </div>

            {/* Email Input */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <label className="block text-sm font-semibold text-primary mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`w-full px-4 py-3 rounded-lg border-2 bg-white/50 text-foreground placeholder-foreground/40 transition-all duration-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 hover:border-primary/40 ${validationErrors.email
                  ? 'border-destructive focus:border-destructive'
                  : 'border-primary/20 focus:border-accent'
                  }`}
              />
              {validationErrors.email && (
                <p className="text-destructive text-xs mt-1">{validationErrors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
              <label className="block text-sm font-semibold text-primary mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full px-4 py-3 rounded-lg border-2 bg-white/50 text-foreground placeholder-foreground/40 transition-all duration-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 hover:border-primary/40 ${validationErrors.password
                  ? 'border-destructive focus:border-destructive'
                  : 'border-primary/20 focus:border-accent'
                  }`}
              />
              {validationErrors.password && (
                <p className="text-destructive text-xs mt-1">{validationErrors.password}</p>
              )}
              <p className="text-xs text-foreground/50 mt-1">At least 8 characters</p>
            </div>

            {/* Confirm Password Input */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <label className="block text-sm font-semibold text-primary mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full px-4 py-3 rounded-lg border-2 bg-white/50 text-foreground placeholder-foreground/40 transition-all duration-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 hover:border-primary/40 ${validationErrors.confirmPassword
                  ? 'border-destructive focus:border-destructive'
                  : 'border-primary/20 focus:border-accent'
                  }`}
              />
              {validationErrors.confirmPassword && (
                <p className="text-destructive text-xs mt-1">{validationErrors.confirmPassword}</p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive text-destructive text-sm animate-fade-in-up">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-bold text-black transition-all duration-300 transform hover:scale-105 active:scale-95 relative overflow-hidden group ${loading
                ? 'bg-accent/70 cursor-not-allowed'
                : 'bg-gradient-to-r from-primary to-secondary hover:shadow-lg'
                } animate-fade-in-up`}
              style={{ animationDelay: '0.25s' }}
            >
              {!loading && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 group-hover:translate-x-full transition-transform duration-500" />
              )}

              <span className="relative flex items-center justify-center gap-2">
                {loading && (
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                {loading ? 'Creating account...' : 'Sign Up'}
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-primary/20" />
            <span className="text-xs text-foreground/50 font-semibold">OR</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-primary/20" />
          </div>

          {/* Login Button - Now with black/dark background for better visibility */}
          <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
            <Link
              href="/auth/login"
              className="inline-block w-full py-3 px-6 rounded-lg font-bold text-white bg-black hover:bg-gray-900 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg border border-gray-700"
            >
              Sign In to Existing Account
            </Link>
            <p className="mt-3 text-sm text-foreground/60">
              Already have an account? Just click above to log in.
            </p>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="text-center animate-fade-in-up">
            <div className="inline-block p-6 rounded-full bg-green-100/50 border-2 border-green-400 mb-4 animate-pulse-glow">
              <svg className="w-12 h-12 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-lg font-bold text-primary">Account created!</p>
            <p className="text-foreground/60 text-sm">Redirecting to next step...</p>
          </div>
        )}
      </div>
    </div>
  );
}