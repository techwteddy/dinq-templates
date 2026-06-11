'use client';

import { useEffect } from 'react';
import { useModal } from '@/context/ModalContext';
import { isExternalLink } from '@/lib/link-utils';

/**
 * ExternalLinkHandler component
 *
 * Intercepts all clicks on anchor tags and shows the DemoModal
 * if the link is external.
 */
export function ExternalLinkHandler() {
  const { showModal } = useModal();

  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      // Find the nearest anchor element
      const target = event.target as HTMLElement;
      const anchor = target.closest('a');

      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Check if it's an external link
      if (isExternalLink(href)) {
        // Check user preference
        const skip = sessionStorage.getItem('skip-external-modal') === 'true';
        if (skip) return;

        // Prevent default navigation
        event.preventDefault();

        // Show the demo modal
        showModal({
          triggerType: 'external',
          url: href,
        });
      }
    };

    // Attach listener to the document
    document.addEventListener('click', handleGlobalClick, true);

    return () => {
      // Cleanup
      document.removeEventListener('click', handleGlobalClick, true);
    };
  }, [showModal]);

  // This component doesn't render anything
  return null;
}
