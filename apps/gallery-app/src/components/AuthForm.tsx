'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import LoadingSpinner from './LoadingSpinner';

interface AuthFormProps {
  onSuccess?: () => void;
  onBack?: () => void;
}

export default function AuthForm({ onSuccess, onBack }: AuthFormProps) {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        // Redirect to dashboard on successful login
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/dashboard');
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        
        // Show confirmation message for signup
        setShowConfirmation(true);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-gray-900/80 backdrop-blur-sm p-8 rounded-lg shadow-xl border border-gray-800/50 w-full max-w-md">
        {onBack && (
          <div className="mb-4">
            <button
              onClick={onBack}
              className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Gallery</span>
            </button>
          </div>
        )}
        
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          {showConfirmation ? 'Check Your Email' : (isLogin ? 'Sign In' : 'Sign Up')}
        </h2>
        
        {error && (
          <div className="bg-red-900/20 border border-red-800/50 text-red-200 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {showConfirmation ? (
          <div className="text-center space-y-4">
            <div className="bg-green-900/20 border border-green-800/50 text-green-200 p-4 rounded-md">
              <div className="flex items-center justify-center mb-3">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Confirmation Email Sent!</h3>
              <p className="text-sm">
                We've sent a confirmation email to <strong>{email}</strong>. 
                Please check your inbox and click the confirmation link to activate your account.
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowConfirmation(false);
                  setIsLogin(true);
                  setEmail('');
                  setPassword('');
                }}
                className="w-full bg-white hover:bg-gray-100 text-black font-medium py-2 px-4 rounded-md transition-colors"
              >
                Back to Sign In
              </button>
              
              {onBack && (
                <button
                  onClick={onBack}
                  className="w-full text-gray-400 hover:text-white transition-colors"
                >
                  Back to Gallery
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white hover:bg-gray-100 text-black font-medium py-2 px-4 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <LoadingSpinner size="sm" color="gray" />
                ) : (
                  isLogin ? 'Sign In' : 'Sign Up'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
