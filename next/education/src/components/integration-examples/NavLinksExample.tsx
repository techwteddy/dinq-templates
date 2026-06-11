'use client';

import * as React from 'react';
import { useDemoModal } from '@/hooks/useDemoModal';
import { Button } from '@/components/ui/button';

/**
 * NavLinksExample component
 *
 * Demonstrates how to intercept navigation links using the demo modal system.
 */
export const NavLinksExample: React.FC = () => {
  const { interceptLink } = useDemoModal();

  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-4">
      <h3 className="text-lg font-semibold">Navigation Interception</h3>
      <p className="text-sm text-muted-foreground">
        Examples of how different navigation links can be intercepted for demo
        purposes.
      </p>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          asChild
          onClick={(e) =>
            interceptLink(e as unknown as React.MouseEvent, 'navigation')
          }
        >
          <a href="/pricing" data-demo-trigger="navigation">
            Pricing (Demo)
          </a>
        </Button>

        <Button
          variant="secondary"
          asChild
          onClick={(e) =>
            interceptLink(e as unknown as React.MouseEvent, 'navigation')
          }
        >
          <a href="/enterprise" data-demo-trigger="navigation">
            Enterprise (Demo)
          </a>
        </Button>

        <Button
          variant="secondary"
          asChild
          onClick={(e) =>
            interceptLink(e as unknown as React.MouseEvent, 'feature')
          }
        >
          <a href="/analytics" data-demo-trigger="feature">
            Advanced Analytics (Preview)
          </a>
        </Button>
      </div>
    </div>
  );
};
