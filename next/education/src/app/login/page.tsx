import * as React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

import { LoginForm } from '@/components/auth/LoginForm';
import { SocialButtons } from '@/components/auth/SocialButtons';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Login - EduPlatform',
  description:
    'Log in to your EduPlatform account to access your courses and learning dashboard.',
};

export default function LoginPage() {
  return (
    <div className="container relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-primary/10 p-3">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Sign in</CardTitle>
            <CardDescription>
              Choose your preferred sign in method
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <SocialButtons />
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>
            <React.Suspense
              fallback={
                <div className="h-[350px] w-full animate-pulse bg-muted" />
              }
            >
              <LoginForm />
            </React.Suspense>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-center gap-1 text-sm text-muted-foreground">
              <span>Don&apos;t have an account?</span>
              <Link
                href="/signup"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Sign up
              </Link>
            </div>
            <div className="rounded-md border border-yellow-200 bg-yellow-50 p-3 text-xs text-yellow-800 dark:border-yellow-900/50 dark:bg-yellow-900/20 dark:text-yellow-500">
              <p className="font-semibold">Demo Login Disclaimer</p>
              <p>
                This is a mock authentication system for demonstration purposes.
                Use any email and password to log in, or create a mock account
                on the signup page.
              </p>
            </div>
          </CardFooter>
        </Card>

        <p className="px-8 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{' '}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
