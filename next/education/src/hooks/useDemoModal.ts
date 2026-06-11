'use client';

import * as React from 'react';
import { useModal } from '@/context/ModalContext';
import { DemoTriggerType } from '@/components/DemoModal';
import { DEMO_MODAL_CONTENT } from '@/config/demo-modal-content';

/**
 * Hook to intercept links and actions for demo purposes.
 *
 * Provides a way to prevent default behavior and show a demo modal instead.
 *
 * @example
 * const { interceptLink } = useDemoModal();
 *
 * <a href="/login" onClick={(e) => interceptLink(e, 'navigation')}>Login</a>
 */
export const useDemoModal = () => {
  const { showModal } = useModal();

  /**
   * Returns demo content based on the trigger type.
   * Pulls from the central configuration file.
   */
  const getDemoContent = React.useCallback((type: DemoTriggerType) => {
    // eslint-disable-next-line security/detect-object-injection
    return DEMO_MODAL_CONTENT[type] || DEMO_MODAL_CONTENT.feature;
  }, []);

  /**
   * Intercepts a click or keyboard event to show a demo modal.
   *
   * @param e - The event to intercept
   * @param type - The type of demo trigger (defaults to 'feature')
   */
  const interceptLink = React.useCallback(
    (
      e: React.MouseEvent | React.KeyboardEvent,
      type: DemoTriggerType = 'feature'
    ) => {
      e.preventDefault();
      const content = getDemoContent(type);
      showModal({
        triggerType: type,
        ...content,
      });
    },
    [showModal, getDemoContent]
  );

  return {
    interceptLink,
    getDemoContent,
    showModal, // Also expose showModal for direct usage
  };
};
