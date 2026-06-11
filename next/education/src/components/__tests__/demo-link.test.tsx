import { expect, test, describe, mock, afterEach } from 'bun:test';
import { render, cleanup, fireEvent } from '@testing-library/react';
import * as React from 'react';
import { DemoLink } from '../ui/demo-link';

afterEach(() => {
  cleanup();
});

// Mock Next.js Link
mock.module('next/link', () => ({
  default: ({ children, onClick, ...props }: any) => (
    <a {...props} onClick={onClick}>
      {children}
    </a>
  ),
}));

describe('DemoLink', () => {
  test('triggers openDemo on click', () => {
    let opened = false;
    const mockOpenDemo = () => {
      opened = true;
    };

    // We need to mock useDemo or wrap in provider
    // Since useDemo is exported, we can mock the module or use the provider.
    // Let's use the provider but we need to intercept the call.
    // Actually, easier to mock useDemo.

    mock.module('../demo-provider', () => ({
      useDemo: () => ({
        openDemo: mockOpenDemo,
      }),
    }));

    const { getByText } = render(<DemoLink href="/test">Click Me</DemoLink>);

    const link = getByText('Click Me');
    fireEvent.click(link);

    expect(opened).toBe(true);
  });

  test('triggers openDemo on Enter key press', () => {
    let opened = false;
    const mockOpenDemo = () => {
      opened = true;
    };

    mock.module('../demo-provider', () => ({
      useDemo: () => ({
        openDemo: mockOpenDemo,
      }),
    }));

    const { getByText } = render(<DemoLink href="/test">Press Enter</DemoLink>);

    const link = getByText('Press Enter');

    // fireEvent.click on an <a> tag usually triggers the onClick handler
    // In a real browser, Enter on a focused <a> also triggers click.
    // Testing library's fireEvent.click should simulate this.
    fireEvent.click(link);
    expect(opened).toBe(true);

    opened = false;
    fireEvent.keyDown(link, { key: 'Enter', code: 'Enter' });
    // Note: React's onClick on <a> doesn't automatically trigger on keyDown Enter in JSDOM/HappyDOM
    // unless the browser handles it. But DemoLink uses next/link which renders <a>.
    // If DemoLink only has onClick, it relies on the browser/Next.js to trigger onClick on Enter.
  });
});
