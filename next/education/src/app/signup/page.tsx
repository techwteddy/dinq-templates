import * as React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

import { SignupForm } from '@/components/auth/SignupForm';
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
  title: 'Sign Up - EduPlatform',
  description:
    'Create an account on EduPlatform to start your learning journey.',
};

export default function SignupPage() {
  return (
    <div className="container relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-8 lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-primary/10 p-3">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your details below to create your account
          </p>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Sign up</CardTitle>
            <CardDescription>
              Choose your preferred sign up method
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
            <SignupForm />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-center gap-1 text-sm text-muted-foreground">
              <span>Already have an account?</span>
              <Link
                href="/login"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Log in
              </Link>
            </div>
            <div className="rounded-md border border-yellow-200 bg-yellow-50 p-3 text-xs text-yellow-800 dark:border-yellow-900/50 dark:bg-yellow-900/20 dark:text-yellow-500">
              <p className="font-semibold">Demo Account Disclaimer</p>
              <p>
                This is a mock authentication system. No real account will be
                created, and your data is stored only in your browser&apos;s
                local storage for this demonstration.
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
