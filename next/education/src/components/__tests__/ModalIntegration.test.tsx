import { expect, test, describe } from 'bun:test';
import { render, fireEvent, within } from '@testing-library/react';
import * as React from 'react';
import { DemoProvider } from '../demo-provider';
import { useDemoModal } from '@/hooks/useDemoModal';

const SOCIAL_LINK_TEXT = 'Social Link';
const DEMO_SIMULATION_TEXT = 'Demo Simulation';

const TestComponent = () => {
  const { interceptLink } = useDemoModal();
  return (
    <a
      href="/test"
      onClick={(e) => interceptLink(e as unknown as React.MouseEvent, 'social')}
    >
      {SOCIAL_LINK_TEXT}
    </a>
  );
};

describe('Modal Integration', () => {
  test('opens demo modal when interceptLink is called', async () => {
    render(
      <DemoProvider>
        <TestComponent />
      </DemoProvider>
    );

    const screen = within(document.body);
    const link = screen.getByText(SOCIAL_LINK_TEXT);

    fireEvent.click(link);

    // Modal should be open. Check for title and description.
    expect(await screen.findByText(DEMO_SIMULATION_TEXT)).toBeTruthy();
    expect(
      await screen.findByText(
        /In the production version, this would redirect you/i
      )
    ).toBeTruthy();
  });

  test('closes modal when close button is clicked', async () => {
    render(
      <DemoProvider>
        <TestComponent />
      </DemoProvider>
    );

    const screen = within(document.body);
    const link = screen.getByText(SOCIAL_LINK_TEXT);

    fireEvent.click(link);

    // Wait for modal to appear
    const modalTitle = await screen.findByText(DEMO_SIMULATION_TEXT);
    expect(modalTitle).toBeTruthy();

    // Find and click the "Got it" button
    const closeButton = screen.getByRole('button', { name: /got it/i });
    fireEvent.click(closeButton);

    // The modal should be removed from DOM (Radix behavior for closed dialog)
    // We use queryByText to verify it's gone.
    // Sometimes there's a small delay due to animations, but happy-dom/bun-test
    // usually handles it or we might need a small wait if it fails.
    expect(screen.queryByText(DEMO_SIMULATION_TEXT)).toBeNull();
  });
});
