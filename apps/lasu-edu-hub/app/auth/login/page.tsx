'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
      } else if (data.user) {
        // Store remember me preference
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('rememberMeExpiry', (Date.now() + 30 * 24 * 60 * 60 * 1000).toString());
        }
        setSuccess(true);
        setTimeout(() => {
          router.push('/');
        }, 1500);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (authError) {
        setError(authError.message);
      }
    } catch (err) {
      setError('An unexpected error occurred with Google sign-in');
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
        <div className={`p-8 sm:p-10 rounded-2xl backdrop-blur-sm border-2 bg-black shadow-2xl transition-all duration-500 transform ${
          success ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}>
          {/* Header */}
          <div className="mb-8 text-center animate-fade-in-up">
            <div className="mb-4 text-5xl">🎓</div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-300">Sign in to access your courses and resources</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <label className="block text-sm font-semibold text-white mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-600 bg-gray-900 text-white placeholder-gray-400 transition-all duration-300 focus:border-accent focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-accent/30 hover:border-gray-500"
              />
            </div>

            {/* Password Input */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <label className="block text-sm font-semibold text-white mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-600 bg-gray-900 text-white placeholder-gray-400 transition-all duration-300 focus:border-accent focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-accent/30 hover:border-gray-500"
              />
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 accent-accent rounded cursor-pointer"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-300 cursor-pointer">
                Remember me for 30 days
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-lg bg-destructive/20 border border-destructive text-red-300 text-sm animate-fade-in-up">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-bold bg-accent text-white hover:bg-accent/90 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 animate-fade-in-up"
              style={{ animationDelay: '0.3s' }}
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3 rounded-lg font-bold bg-white text-gray-900 hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 animate-fade-in-up"
              style={{ animationDelay: '0.35s' }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gray-700" />
            <span className="text-xs text-gray-400 font-semibold">OR</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gray-700" />
          </div>

          {/* Sign Up Link */}
          <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <p className="text-gray-300">
              Don't have an account?{' '}
              <Link
                href="/auth/sign-up"
                className="font-bold text-accent hover:text-accent/80 transition-colors duration-300 underline decoration-accent/30 hover:decoration-accent"
              >
                Create one
              </Link>
            </p>
          </div>

          {/* Admin Login Link */}
          <div className="text-center mt-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <p className="text-gray-300">
              Admin?{' '}
              <Link
                href="/admin/login"
                className="font-bold text-white hover:text-gray-200 transition-colors duration-300 underline decoration-white/30 hover:decoration-white"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="text-center animate-fade-in-up">
            <div className="inline-block p-6 rounded-full bg-green-100/50 border-2 border-green-400 mb-4 animate-pulse-glow">
              <svg className="w-12 h-12 text-green-600 animate-spin" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-lg font-bold text-primary">Sign in successful!</p>
            <p className="text-foreground/60 text-sm">Redirecting...</p>
          </div>
        )}
      </div>
    </div>
  );
}
