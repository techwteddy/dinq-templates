'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function PrivacyPage() {
  const { toast } = useToast();

  const handleAccept = () => {
    toast({
      title: 'Privacy Policy Accepted',
      description: 'You have accepted our Privacy Policy. This is a demo.',
    });
  };

  return (
    <div className="container max-w-4xl space-y-10 py-10">
      <section className="space-y-4">
        <h1 className="font-serif text-4xl font-bold tracking-tight lg:text-5xl">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground">Last updated: January 25, 2026</p>
      </section>

      <div className="prose dark:prose-invert max-w-none space-y-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">1. Information We Collect</h2>
          <p>
            We collect information that you provide directly to us when you
            create an account, enroll in a course, or communicate with us. This
            may include your name, email address, and payment information.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">2. How We Use Your Information</h2>
          <p>
            We use your information to provide and improve our services, process
            payments, send you updates about your courses, and communicate with
            you about new features and offers.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">3. Data Sharing</h2>
          <p>
            We do not sell your personal information to third parties. We may
            share your data with service providers who help us operate the
            platform (e.g., payment processors, email services).
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">4. Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal
            information. You can manage your data settings from your account
            profile or contact us for assistance.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">5. Cookies</h2>
          <p>
            We use cookies to enhance your experience on our platform and to
            analyze how our services are used. You can control cookie settings
            through your browser.
          </p>
        </section>
      </div>

      <div className="border-t pt-8">
        <Button onClick={handleAccept} size="lg">
          I Accept the Privacy Policy
        </Button>
      </div>
    </div>
  );
}
