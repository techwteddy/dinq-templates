'use client';

import * as React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

/**
 * Trigger types for the demo modal
 */
export type DemoTriggerType =
  | 'social'
  | 'navigation'
  | 'form'
  | 'feature'
  | 'external';

export interface DemoModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Function to call when the modal should close */
  onClose: () => void;
  /** The type of trigger that opened the modal */
  triggerType: DemoTriggerType;
  /** Optional override for the modal title */
  title?: string;
  /** Optional override for the modal description */
  description?: string;
  /** The URL for external link handling */
  url?: string;
  /** Custom content to display in the modal */
  customContent?: React.ReactNode;
  /** Children as an alternative to customContent */
  children?: React.ReactNode;
}

/**
 * DemoModal component
 *
 * A specialized modal for demonstrating features that are not yet implemented
 * or part of a mock simulation. Includes a demo indicator and supports
 * different trigger types.
 *
 * @example
 * <DemoModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   triggerType="social"
 * />
 */
export const DemoModal: React.FC<DemoModalProps> = ({
  isOpen,
  onClose,
  triggerType,
  title = 'Demo Feature',
  description = 'This feature is currently in development or part of a demo simulation.',
  url,
  customContent,
  children,
}) => {
  const [skipNextTime, setSkipNextTime] = React.useState(false);
  const content = customContent || children;

  const getTriggerDescription = () => {
    if (triggerType === 'external') {
      return (
        <>
          You are about to visit an{' '}
          <span className="font-medium text-destructive text-foreground">
            external link
          </span>
          : <span className="break-all font-mono text-[10px]">{url}</span>. In
          this demo, all external links are intercepted for safety.
        </>
      );
    }

    return (
      <>
        You clicked a{' '}
        <span className="font-medium text-foreground">{triggerType}</span>{' '}
        trigger. In the production environment, this would perform the actual
        action.
      </>
    );
  };

  const modalTitle =
    triggerType === 'external' ? 'External Link Intercepted' : title;
  const modalDescription =
    triggerType === 'external'
      ? 'The link you clicked leads to an external website.'
      : description;

  return (
    <Modal
      title={modalTitle}
      description={modalDescription}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex flex-col space-y-4">
        {/* Demo Indicator UI - Step 4: Implement demo indicator UI */}
        <div className="flex items-start space-x-3 rounded-lg border bg-muted/50 p-4 transition-all hover:bg-muted">
          <div className="mt-0.5 rounded-full bg-blue-100 p-1.5 dark:bg-blue-900/30">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold leading-none">
                Demo Simulation
              </p>
              <Badge
                variant="secondary"
                className="h-5 px-1.5 text-[10px] font-bold uppercase tracking-wider"
              >
                {triggerType}
              </Badge>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {getTriggerDescription()}
            </p>
          </div>
        </div>

        {/* Custom Content Area - Step 3: Add customContent prop for dynamic content */}
        {content && (
          <div className="mt-2 border-t pt-4 duration-300 animate-in fade-in slide-in-from-top-2 motion-reduce:animate-none">
            {content}
          </div>
        )}

        {/* Skip Preference */}
        {triggerType === 'external' && (
          <div className="flex items-center space-x-2 px-1 py-2">
            <Checkbox
              id="skip-external"
              checked={skipNextTime}
              onCheckedChange={(checked) => setSkipNextTime(!!checked)}
            />
            <Label
              htmlFor="skip-external"
              className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Don&apos;t show this again for this session
            </Label>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button
            onClick={onClose}
            variant="outline"
            size="sm"
            className="sm:px-6"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (triggerType === 'external' && url) {
                if (skipNextTime) {
                  sessionStorage.setItem('skip-external-modal', 'true');
                }
                window.open(url, '_blank', 'noopener,noreferrer');
              }
              onClose();
            }}
            variant="default"
            size="sm"
            className="sm:px-6"
          >
            {triggerType === 'external' ? 'Proceed Anyway' : 'Got it'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
