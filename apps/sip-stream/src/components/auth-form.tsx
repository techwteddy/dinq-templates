'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Message } from 'primereact/message';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';

const authSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type AuthFormData = z.infer<typeof authSchema>;

export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { supabase } = useAuth();
  const router = useRouter();
  const toast = useRef<Toast>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });

  async function onSubmit(data: AuthFormData) {
    console.log('AuthForm: onSubmit called with data:', {
      email: data.email,
      passwordLength: data.password.length,
    });

    if (!supabase) {
      console.error('AuthForm: Supabase client is null');
      setError('Authentication service not available. Please refresh the page.');
      toast.current?.show({
        severity: 'error',
        summary: 'Connection Error',
        detail: 'Authentication service not available. Please refresh the page.',
        life: 5000,
      });
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('AuthForm: Attempting', isSignUp ? 'signup' : 'signin');

      if (isSignUp) {
        const { data: authData, error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
        });

        console.log('AuthForm: Signup response:', { authData, error });

        if (error) {
          console.error('AuthForm: Signup error:', error);
          throw error;
        }

        if (authData.user && !authData.session) {
          // Email confirmation required
          toast.current?.show({
            severity: 'info',
            summary: 'Check Your Email',
            detail:
              'Please check your email for a confirmation link to complete your registration.',
            life: 8000,
          });
          return;
        }
      } else {
        const { data: authData, error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        console.log('AuthForm: Signin response:', { authData, error });

        if (error) {
          console.error('AuthForm: Signin error:', error);
          throw error;
        }
      }

      // Success
      console.log('AuthForm: Authentication successful, redirecting to /create');
      toast.current?.show({
        severity: 'success',
        summary: 'Success!',
        detail: isSignUp ? 'Account created successfully!' : 'Signed in successfully!',
        life: 3000,
      });

      // Small delay to show success toast before redirect
      setTimeout(() => {
        router.push('/create');
      }, 1000);
    } catch (err) {
      console.error('AuthForm: Authentication error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);

      toast.current?.show({
        severity: 'error',
        summary: 'Authentication Failed',
        detail: errorMessage,
        life: 5000,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Toast ref={toast} />
      <div className="w-full max-w-md glossy-card p-6 space-y-4 slide-up">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          {isSignUp ? 'Create Account' : 'Sign In'}
        </h2>

        {error && <Message severity="error" text={error} className="w-full" />}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-2 font-medium text-white">
              Email
            </label>
            <InputText
              id="email"
              type="email"
              {...register('email')}
              className={errors.email ? 'p-invalid' : ''}
              placeholder="Enter your email"
            />
            {errors.email && <small className="p-error">{errors.email.message}</small>}
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="mb-2 font-medium text-white">
              Password
            </label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Password
                  id="password"
                  value={field.value}
                  onChange={field.onChange}
                  className={errors.password ? 'p-invalid' : ''}
                  placeholder="Enter your password"
                  feedback={false}
                  toggleMask
                />
              )}
            />
            {errors.password && <small className="p-error">{errors.password.message}</small>}
          </div>

          <Button
            type="submit"
            label={isSignUp ? 'Sign Up' : 'Sign In'}
            className="w-full p-button-lg"
            loading={loading}
          />
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-orange-200 hover:text-white underline transition-colors duration-300"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </>
  );
}
