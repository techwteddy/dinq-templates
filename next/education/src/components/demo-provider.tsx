'use client';

import React, { createContext, useContext, useCallback } from 'react';
import { ModalProvider, useModal } from '@/context/ModalContext';
import { GlobalModalRenderer } from '@/components/global-modal-renderer';

interface DemoContextType {
  /** Opens the global demo modal with default 'feature' type */
  openDemo: () => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

/**
 * Internal content component to access useModal
 */
function DemoProviderContent({ children }: { children: React.ReactNode }) {
  const { showModal } = useModal();

  const openDemo = useCallback(() => {
    showModal({
      triggerType: 'feature',
      title: 'Demo Feature',
      description:
        'This feature is currently in development or part of a demo simulation.',
    });
  }, [showModal]);

  return (
    <DemoContext.Provider value={{ openDemo }}>
      {children}
      <GlobalModalRenderer />
    </DemoContext.Provider>
  );
}

/**
 * DemoProvider component
 *
 * Provides both the legacy DemoContext and the new ModalContext.
 * Includes the GlobalModalRenderer to ensure the modal is always available.
 */
export function DemoProvider({ children }: { children: React.ReactNode }) {
  return (
    <ModalProvider>
      <DemoProviderContent>{children}</DemoProviderContent>
    </ModalProvider>
  );
}

/**
 * Hook to access the legacy demo context
 */
export function useDemo() {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
}
