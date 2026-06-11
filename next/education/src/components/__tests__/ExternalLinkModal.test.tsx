import { expect, test, describe, afterEach, mock } from 'bun:test';
import { render, cleanup, fireEvent, within } from '@testing-library/react';
import * as React from 'react';
import { ExternalLinkHandler } from '../external-link-handler';
import { DemoProvider } from '../demo-provider';

mock.module('@/lib/link-utils', () => ({
  isExternalLink: (url: string) => url.startsWith('https://'),
}));

const EXTERNAL_URL = 'https://example.com';
const EXTERNAL_LINK_TEXT = 'External Link';

afterEach(() => {
  cleanup();
  sessionStorage.clear();
});

describe('ExternalLinkHandler', () => {
  test('intercepts external links and shows modal', async () => {
    render(
      <DemoProvider>
        <ExternalLinkHandler />
      </DemoProvider>
    );

    const screen = within(document.body);
    const anchor = document.createElement('a');
    anchor.href = EXTERNAL_URL;
    anchor.textContent = EXTERNAL_LINK_TEXT;
    document.body.appendChild(anchor);

    fireEvent.click(anchor);

    // Check if modal appears
    expect(await screen.findByText(/External Link Intercepted/i)).toBeTruthy();

    document.body.removeChild(anchor);
  });

  test('does not intercept internal links', () => {
    render(
      <DemoProvider>
        <ExternalLinkHandler />
      </DemoProvider>
    );

    const screen = within(document.body);
    const anchor = document.createElement('a');
    anchor.href = '/internal-page';
    anchor.textContent = 'Internal Link';
    document.body.appendChild(anchor);

    fireEvent.click(anchor);

    // Modal should NOT appear
    expect(screen.queryByText(/External Link Intercepted/i)).toBeNull();

    document.body.removeChild(anchor);
  });

  test('skips modal if user preference is set', () => {
    sessionStorage.setItem('skip-external-modal', 'true');

    render(
      <DemoProvider>
        <ExternalLinkHandler />
      </DemoProvider>
    );

    const screen = within(document.body);
    const anchor = document.createElement('a');
    anchor.href = EXTERNAL_URL;
    document.body.appendChild(anchor);

    fireEvent.click(anchor);

    // Modal should NOT appear
    expect(screen.queryByText(/External Link Intercepted/i)).toBeNull();

    document.body.removeChild(anchor);
  });

  test('proceed anyway button opens the link', async () => {
    const windowOpenSpy = mock(() => {});
    global.window.open = windowOpenSpy as any;

    render(
      <DemoProvider>
        <ExternalLinkHandler />
      </DemoProvider>
    );

    const screen = within(document.body);
    const anchor = document.createElement('a');
    anchor.href = EXTERNAL_URL;
    anchor.textContent = EXTERNAL_LINK_TEXT;
    document.body.appendChild(anchor);

    fireEvent.click(anchor);

    const proceedButton = await screen.findByRole('button', {
      name: /proceed anyway/i,
    });
    fireEvent.click(proceedButton);

    expect(windowOpenSpy).toHaveBeenCalledWith(
      EXTERNAL_URL,
      '_blank',
      'noopener,noreferrer'
    );

    document.body.removeChild(anchor);
  });

  test('cancel button closes the modal without opening the link', async () => {
    const windowOpenSpy = mock(() => {});
    global.window.open = windowOpenSpy as any;

    render(
      <DemoProvider>
        <ExternalLinkHandler />
      </DemoProvider>
    );

    const screen = within(document.body);
    const anchor = document.createElement('a');
    anchor.href = EXTERNAL_URL;
    anchor.textContent = EXTERNAL_LINK_TEXT;
    document.body.appendChild(anchor);

    fireEvent.click(anchor);

    const cancelButton = await screen.findByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    // Modal should disappear (or at least the button should be gone)
    expect(screen.queryByText(/External Link Intercepted/i)).toBeNull();
    expect(windowOpenSpy).not.toHaveBeenCalled();

    document.body.removeChild(anchor);
  });
});
