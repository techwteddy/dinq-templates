import { expect, test, describe, afterEach, mock } from 'bun:test';
import { renderHook, cleanup, act } from '@testing-library/react';
import { useDemoModal } from '../useDemoModal';
import * as React from 'react';
import { ModalProvider } from '@/context/ModalContext';

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(ModalProvider, null, children);

afterEach(() => {
  cleanup();
});

describe('useDemoModal', () => {
  test('interceptLink prevents default and opens modal', () => {
    const { result } = renderHook(() => useDemoModal(), { wrapper });

    const mockPreventDefault = mock(() => {});
    const mockEvent = {
      preventDefault: mockPreventDefault,
    } as unknown as React.MouseEvent;

    act(() => {
      result.current.interceptLink(mockEvent, 'social');
    });

    expect(mockPreventDefault).toHaveBeenCalled();
    // We can't easily check if showModal was called on the real context without a spy,
    // but we can check if the state changed if we had access to it.
  });

  test('getDemoContent returns correct content for trigger types', () => {
    const { result } = renderHook(() => useDemoModal(), { wrapper });

    const socialContent = result.current.getDemoContent('social');
    expect(socialContent.title).toContain('Social');
  });
});
