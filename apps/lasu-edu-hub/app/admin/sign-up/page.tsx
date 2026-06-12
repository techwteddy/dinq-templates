'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function AdminSignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const validateEmail = (email: string): boolean => {
    return email.endsWith('@lasu.edu.ng') || email === 'stessaedu@gmail.com';
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      setError('Please use a @lasu.edu.ng email or stessaedu@gmail.com');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!fullName.trim()) {
      setError('Please enter your full name');
      return;
    }

    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            user_type: 'admin',
          },
          emailRedirectTo: `${window.location.origin}/admin/dashboard`,
        },
      });

      if (authError) {
        setError(authError.message);
      } else if (data.user) {
        setSuccess(true);
        localStorage.setItem('admin_onboarding_shown', 'false');
        setTimeout(() => {
          router.push('/admin/sign-up-success');
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
        <div className={`p-8 sm:p-10 rounded-2xl backdrop-blur-sm border-2 bg-black shadow-2xl transition-all duration-500 transform ${
          success ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}>
          {/* Header */}
          <div className="mb-8 text-center animate-fade-in-up">
            <div className="mb-4 text-5xl">📝</div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Sign Up</h1>
            <p className="text-gray-300">LASU Faculty & Staff Registration</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignUp} className="space-y-5">
            {/* Full Name Input */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <label className="block text-sm font-semibold text-white mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr. John Doe"
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-600 bg-gray-900 text-white placeholder-gray-400 transition-all duration-300 focus:border-accent focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-accent/30 hover:border-gray-500"
              />
            </div>

            {/* Email Input */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
              <label className="block text-sm font-semibold text-white mb-2">
                LASU Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@lasu.edu.ng"
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-600 bg-gray-900 text-white placeholder-gray-400 transition-all duration-300 focus:border-accent focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-accent/30 hover:border-gray-500"
              />
              <p className="text-xs text-gray-400 mt-2">Use your @lasu.edu.ng email or stessaedu@gmail.com</p>
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
              <p className="text-xs text-gray-400 mt-2">Minimum 8 characters</p>
            </div>

            {/* Confirm Password Input */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
              <label className="block text-sm font-semibold text-white mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-600 bg-gray-900 text-white placeholder-gray-400 transition-all duration-300 focus:border-accent focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-accent/30 hover:border-gray-500"
              />
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
                  Creating account...
                </>
              ) : (
                'Create Admin Account'
              )}
            </button>

            {/* Success Message */}
            {success && (
              <div className="p-4 rounded-lg bg-accent/20 border border-accent text-accent text-sm text-center font-semibold animate-fade-in-up">
                ✓ Account created! Redirecting...
              </div>
            )}
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center pt-6 border-t border-gray-700">
            <p className="text-sm text-gray-300">
              Already have an account?{' '}
              <Link href="/admin/login" className="font-semibold text-accent hover:text-accent/80 transition-colors">
                Sign in
              </Link>
            </p>
          </div>

          {/* Student Login Link */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-300">
              Student?{' '}
              <Link href="/auth/login" className="font-semibold text-accent hover:text-accent/80 transition-colors">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
