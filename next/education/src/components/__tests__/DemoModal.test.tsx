import { expect, test, describe, mock, afterEach } from 'bun:test';
import { render, cleanup } from '@testing-library/react';
import * as React from 'react';
import { DemoModal } from '../DemoModal';

// Mock the dependencies
mock.module('../ui/Modal', () => ({
  Modal: ({ children, title, description, isOpen }: any) =>
    isOpen ? (
      <div data-testid="modal">
        <h1>{title}</h1>
        <p>{description}</p>
        {children}
      </div>
    ) : null,
}));

mock.module('../ui/badge', () => ({
  Badge: ({ children, className }: any) => (
    <span className={className}>{children}</span>
  ),
}));

mock.module('../ui/button', () => ({
  Button: ({ children, onClick }: any) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

afterEach(() => {
  cleanup();
});

describe('DemoModal', () => {
  test('renders demo modal with trigger type', () => {
    const { getByText, getAllByText } = render(
      <DemoModal isOpen={true} onClose={() => {}} triggerType="social" />
    );

    expect(getByText('Demo Simulation')).toBeDefined();
    expect(getAllByText('social').length).toBeGreaterThan(0);
    expect(getByText(/You clicked a/)).toBeDefined();
  });

  test('renders custom content when provided', () => {
    const { getByText } = render(
      <DemoModal
        isOpen={true}
        onClose={() => {}}
        triggerType="navigation"
        customContent={<div>Custom Content</div>}
      />
    );

    expect(getByText('Custom Content')).toBeDefined();
  });

  test('renders children as content when customContent is missing', () => {
    const { getByText } = render(
      <DemoModal isOpen={true} onClose={() => {}} triggerType="form">
        <div>Child Content</div>
      </DemoModal>
    );

    expect(getByText('Child Content')).toBeDefined();
  });

  test('calls onClose when button is clicked', () => {
    let closed = false;
    const { getByText } = render(
      <DemoModal
        isOpen={true}
        onClose={() => {
          closed = true;
        }}
        triggerType="feature"
      />
    );

    const button = getByText('Got it');
    button.click();
    expect(closed).toBe(true);
  });
});
