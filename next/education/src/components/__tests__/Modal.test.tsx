import { expect, test, describe, mock, afterEach } from 'bun:test';
import { render, cleanup } from '@testing-library/react';
import * as React from 'react';
import { Modal } from '../ui/Modal';

// Mock the Dialog components
mock.module('../ui/dialog', () => ({
  Dialog: ({ children, open }: any) => (open ? <div>{children}</div> : null),
  DialogContent: ({ children }: any) => <div>{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <h1>{children}</h1>,
  DialogDescription: ({ children }: any) => <p>{children}</p>,
}));

afterEach(() => {
  cleanup();
});

describe('Modal', () => {
  test('renders modal with title and description when open', () => {
    const { getByText } = render(
      <Modal
        title="Test Title"
        description="Test Description"
        isOpen={true}
        onClose={() => {}}
      >
        <div>Modal Content</div>
      </Modal>
    );

    expect(getByText('Test Title')).toBeDefined();
    expect(getByText('Test Description')).toBeDefined();
    expect(getByText('Modal Content')).toBeDefined();
  });

  test('does not render when closed', () => {
    const { container } = render(
      <Modal
        title="Test Title"
        description="Test Description"
        isOpen={false}
        onClose={() => {}}
      >
        <div>Modal Content</div>
      </Modal>
    );

    expect(container.innerHTML).toBe('');
  });
});
