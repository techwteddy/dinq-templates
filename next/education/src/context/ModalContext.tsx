'use client';

import * as React from 'react';
import { DemoTriggerType } from '@/components/DemoModal';

interface ModalContextType {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Function to call when the modal open state changes */
  onOpenChange: (open: boolean) => void;
  /** Current content to display in the modal */
  currentModalContent: React.ReactNode;
  /** Current trigger type for the demo modal */
  triggerType: DemoTriggerType;
  /** Current URL for external link handling */
  url?: string;
  /** Optional title override */
  title?: string;
  /** Optional description override */
  description?: string;
  /** Function to show the modal with specific configuration */
  showModal: (config: {
    triggerType: DemoTriggerType;
    url?: string;
    title?: string;
    description?: string;
    content?: React.ReactNode;
  }) => void;
  /** Function to hide the modal */
  hideModal: () => void;
}

const ModalContext = React.createContext<ModalContextType | undefined>(
  undefined
);

/**
 * ModalProvider component
 *
 * Provides state management for the global demo modal system.
 * Allows components to trigger modals with different types and content.
 */
export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [triggerType, setTriggerType] =
    React.useState<DemoTriggerType>('feature');
  const [url, setUrl] = React.useState<string | undefined>(undefined);
  const [title, setTitle] = React.useState<string | undefined>(undefined);
  const [description, setDescription] = React.useState<string | undefined>(
    undefined
  );
  const [currentModalContent, setCurrentModalContent] =
    React.useState<React.ReactNode>(null);

  const showModal = React.useCallback(
    ({
      triggerType: type,
      url: u,
      title: t,
      description: d,
      content: c,
    }: {
      triggerType: DemoTriggerType;
      url?: string;
      title?: string;
      description?: string;
      content?: React.ReactNode;
    }) => {
      setTriggerType(type);
      setUrl(u);
      setTitle(t);
      setDescription(d);
      setCurrentModalContent(c);
      setIsOpen(true);
    },
    []
  );

  const hideModal = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  const onOpenChange = React.useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        onOpenChange,
        currentModalContent,
        triggerType,
        url,
        title,
        description,
        showModal,
        hideModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

/**
 * Hook to access the modal context
 */
export const useModal = () => {
  const context = React.useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
