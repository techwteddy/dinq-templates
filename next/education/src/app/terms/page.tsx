'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function TermsPage() {
  const { toast } = useToast();

  const handleAccept = () => {
    toast({
      title: 'Terms Accepted',
      description: 'You have accepted our Terms of Service. This is a demo.',
    });
  };

  return (
    <div className="container max-w-4xl space-y-10 py-10">
      <section className="space-y-4">
        <h1 className="font-serif text-4xl font-bold tracking-tight lg:text-5xl">
          Terms of Service
        </h1>
        <p className="text-muted-foreground">Last updated: January 25, 2026</p>
      </section>

      <div className="prose dark:prose-invert max-w-none space-y-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">1. Acceptance of Terms</h2>
          <p>
            By accessing and using EduPlatform, you agree to be bound by these
            Terms of Service. If you do not agree to these terms, please do not
            use our services.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">2. User Accounts</h2>
          <p>
            To access certain features of the platform, you must create an
            account. You are responsible for maintaining the confidentiality of
            your account information and for all activities that occur under
            your account.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">3. Course Content</h2>
          <p>
            All course content provided on EduPlatform is for educational
            purposes only. You may not redistribute, resell, or share access to
            courses with others without explicit permission.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">4. Prohibited Conduct</h2>
          <p>
            You agree not to use the platform for any unlawful purpose or in any
            way that could damage, disable, or impair the platform&apos;s
            functionality.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">5. Limitation of Liability</h2>
          <p>
            EduPlatform shall not be liable for any direct, indirect,
            incidental, or consequential damages resulting from your use of the
            platform or any content provided therein.
          </p>
        </section>
      </div>

      <div className="border-t pt-8">
        <Button onClick={handleAccept} size="lg">
          I Accept the Terms of Service
        </Button>
      </div>
    </div>
  );
}
