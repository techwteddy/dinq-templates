'use client';

import * as React from 'react';
import { useDemoModal } from '@/hooks/useDemoModal';
import { Icons } from '@/components/ui/Icons';
import { Button } from '@/components/ui/button';

/**
 * SocialLinksExample component
 *
 * Demonstrates how to intercept social media links using the demo modal system.
 */
export const SocialLinksExample: React.FC = () => {
  const { interceptLink } = useDemoModal();

  return (
    <div className="flex flex-wrap gap-4 rounded-lg border bg-card p-4">
      <h3 className="w-full text-lg font-semibold">
        Social Media Interception
      </h3>
      <p className="w-full text-sm text-muted-foreground">
        These links are intercepted by the demo modal system to show a preview
        instead of navigating away.
      </p>

      <Button
        variant="outline"
        size="icon"
        asChild
        onClick={(e) =>
          interceptLink(e as unknown as React.MouseEvent, 'social')
        }
      >
        <a
          href="https://twitter.com/eduplatform"
          target="_blank"
          rel="noopener noreferrer"
          data-demo-trigger="social"
        >
          <Icons.twitter className="h-5 w-5" />
          <span className="sr-only">Twitter</span>
        </a>
      </Button>

      <Button
        variant="outline"
        size="icon"
        asChild
        onClick={(e) =>
          interceptLink(e as unknown as React.MouseEvent, 'social')
        }
      >
        <a
          href="https://github.com/eduplatform"
          target="_blank"
          rel="noopener noreferrer"
          data-demo-trigger="social"
        >
          <Icons.gitHub className="h-5 w-5" />
          <span className="sr-only">GitHub</span>
        </a>
      </Button>

      <Button
        variant="outline"
        size="icon"
        asChild
        onClick={(e) =>
          interceptLink(e as unknown as React.MouseEvent, 'social')
        }
      >
        <a
          href="https://linkedin.com/company/eduplatform"
          target="_blank"
          rel="noopener noreferrer"
          data-demo-trigger="social"
        >
          <Icons.linkedin className="h-5 w-5" />
          <span className="sr-only">LinkedIn</span>
        </a>
      </Button>
    </div>
  );
};
