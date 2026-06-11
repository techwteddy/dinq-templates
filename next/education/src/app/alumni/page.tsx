import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/Icons';

export const metadata: Metadata = {
  title: 'Alumni Network | EduPlatform',
  description: 'Connect with graduates and expand your professional network.',
};

export default function AlumniPage() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center gap-4 text-center">
      <div className="rounded-full bg-muted p-4">
        <Icons.users className="h-12 w-12 text-muted-foreground" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight">Alumni Network</h1>
      <p className="max-w-[600px] text-muted-foreground">
        Our exclusive alumni network portal is currently under construction.
        Soon you will be able to connect with thousands of graduates worldwide.
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/contact">Contact Support</Link>
        </Button>
      </div>
    </div>
  );
}
