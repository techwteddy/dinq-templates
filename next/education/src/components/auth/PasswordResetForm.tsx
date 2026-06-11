'use client';

import * as React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/ui/Icons';

const resetSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
});

type ResetFormValues = z.infer<typeof resetSchema>;

export const PasswordResetForm = () => {
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (_data: ResetFormValues) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-green-100 p-3 text-green-600 dark:bg-green-900/30 dark:text-green-400">
            <Icons.check className="h-8 w-8" />
          </div>
        </div>
        <h3 className="text-xl font-bold">Check your email</h3>
        <p className="mt-2 text-muted-foreground">
          We&apos;ve sent a password reset link to your email address.
        </p>
        <Button asChild className="mt-6 w-full">
          <Link href="/login">Return to Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Send Reset Link
        </Button>
        <div className="mt-4 flex items-center justify-center text-sm">
          <Icons.award className="mr-2 h-4 w-4 text-primary" />
          <span className="text-muted-foreground">
            Demo: No email will actually be sent.
          </span>
        </div>
      </form>
    </Form>
  );
};
