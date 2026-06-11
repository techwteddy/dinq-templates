import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/ui/Icons';

export default function NotFound() {
  return (
    <div className="container flex min-h-[600px] flex-col items-center justify-center gap-4 py-20 text-center animate-in fade-in">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <Icons.logo className="h-10 w-10 text-primary" />
      </div>
      <div className="space-y-2">
        <h1 className="font-serif text-4xl font-bold tracking-tighter sm:text-6xl">
          404 - Page Not Found
        </h1>
        <p className="max-w-[600px] text-muted-foreground sm:text-xl">
          The academic resources you are looking for are not here. Let&apos;s
          get you back to class.
        </p>
      </div>
      <div className="flex gap-4">
        <Link href="/" className={cn(buttonVariants({ size: 'lg' }))}>
          Back to Home
        </Link>
        <Link
          href="/courses"
          className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
        >
          Browse Courses
        </Link>
      </div>
    </div>
  );
}
