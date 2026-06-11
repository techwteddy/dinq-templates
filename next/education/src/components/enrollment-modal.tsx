'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Course } from '@/types';

const formSchema = z.object({
  name: z.string().trim().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().trim().email({
    message: 'Please enter a valid email address.',
  }),
});

interface EnrollmentModalProps {
  course: Course;
  trigger?: React.ReactNode;
}

export function EnrollmentModal({ course, trigger }: EnrollmentModalProps) {
  const [step, setStep] = React.useState<1 | 2 | 3>(1);
  const [isOpen, setIsOpen] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  function onSubmit(_values: z.infer<typeof formSchema>) {
    setStep(2);
    // Simulate payment process
    setTimeout(() => {
      setStep(3);
    }, 2000);
  }

  const resetModal = () => {
    setIsOpen(false);
    setTimeout(() => {
      setStep(1);
      form.reset();
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || <Button size="lg">Enroll Now</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {step === 1 && (
          <>
            <DialogHeader>
              <DialogTitle>Enroll in {course.title}</DialogTitle>
              <DialogDescription>
                Please provide your details to start the enrollment process.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="pt-4">
                  <div className="mb-4 flex justify-between text-sm font-medium">
                    <span>Total to pay:</span>
                    <span>${course.price}</span>
                  </div>
                  <Button type="submit" className="w-full">
                    Proceed to Payment
                  </Button>
                </div>
              </form>
            </Form>
          </>
        )}

        {step === 2 && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Icons.spinner className="mb-4 h-10 w-10 animate-spin text-primary" />
            <DialogTitle className="mb-2">Processing Payment</DialogTitle>
            <DialogDescription>
              We are processing your secure payment. Please do not close this
              window.
            </DialogDescription>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
              <Icons.check className="h-6 w-6" />
            </div>
            <DialogTitle className="mb-2">Enrollment Successful!</DialogTitle>
            <DialogDescription className="mb-6">
              Welcome to <strong>{course.title}</strong>! You now have full
              access to the course materials. A confirmation email has been sent
              to {form.getValues('email')}.
            </DialogDescription>
            <Button onClick={resetModal} className="w-full">
              Go to Course
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
