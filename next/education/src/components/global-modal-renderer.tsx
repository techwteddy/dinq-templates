'use client';

import * as React from 'react';
import { useModal } from '@/context/ModalContext';
import { DemoModal } from '@/components/DemoModal';

/**
 * GlobalModalRenderer component
 *
 * Renders the global DemoModal based on the state in ModalContext.
 * This should be placed at the root of the application (e.g., in layout.tsx).
 */
export function GlobalModalRenderer() {
  const {
    isOpen,
    hideModal,
    triggerType,
    url,
    title,
    description,
    currentModalContent,
  } = useModal();

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={hideModal}
      triggerType={triggerType}
      url={url}
      title={title}
      description={description}
      customContent={currentModalContent}
    />
  );
}
