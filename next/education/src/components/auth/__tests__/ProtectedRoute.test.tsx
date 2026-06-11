import { describe, it, expect, mock, beforeEach } from 'bun:test';
import * as React from 'react';
import { render } from '@testing-library/react';
import { ProtectedRoute } from '../ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

// Mock useAuth
mock.module('@/context/AuthContext', () => ({
  useAuth: mock(),
}));

// Mock next/navigation
mock.module('next/navigation', () => ({
  useRouter: mock(() => ({
    push: mock(),
    replace: mock(),
    prefetch: mock(),
    back: mock(),
  })),
  usePathname: mock(() => '/'),
}));

describe('ProtectedRoute', () => {
  const pushMock = mock();

  beforeEach(() => {
    pushMock.mockClear();
    // Reset the useAuth mock to default state
    (useAuth as any).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });

    // Setup router push mock
    (useRouter as any).mockReturnValue({
      push: pushMock,
    });
  });

  it('shows loading spinner when isLoading is true', () => {
    (useAuth as any).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: true,
    });

    const { queryByTestId } = render(
      <ProtectedRoute>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>
    );

    expect(queryByTestId('protected-content')).toBeNull();
  });

  it('redirects to login when not authenticated', () => {
    (useAuth as any).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });

    render(
      <ProtectedRoute>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>
    );

    // usePathname is mocked to '/' in the mock above
    expect(pushMock).toHaveBeenCalledWith('/login?returnUrl=%2F');
  });

  it('renders children when authenticated and no roles required', () => {
    (useAuth as any).mockReturnValue({
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'student',
      },
      isAuthenticated: true,
      isLoading: false,
    });

    const { getByTestId } = render(
      <ProtectedRoute>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>
    );

    expect(getByTestId('protected-content')).toBeTruthy();
  });

  it('renders children when user has required role', () => {
    (useAuth as any).mockReturnValue({
      user: {
        id: '1',
        name: 'Test Instructor',
        email: 'inst@example.com',
        role: 'instructor',
      },
      isAuthenticated: true,
      isLoading: false,
    });

    const { getByTestId } = render(
      <ProtectedRoute allowedRoles={['instructor']}>
        <div data-testid="instructor-content">Instructor Only Content</div>
      </ProtectedRoute>
    );

    expect(getByTestId('instructor-content')).toBeTruthy();
  });

  it('redirects to home when user does not have required role', () => {
    (useAuth as any).mockReturnValue({
      user: {
        id: '1',
        name: 'Test Student',
        email: 'student@example.com',
        role: 'student',
      },
      isAuthenticated: true,
      isLoading: false,
    });

    const { queryByTestId } = render(
      <ProtectedRoute allowedRoles={['instructor']}>
        <div data-testid="instructor-content">Instructor Only Content</div>
      </ProtectedRoute>
    );

    expect(pushMock).toHaveBeenCalledWith('/');
    expect(queryByTestId('instructor-content')).toBeNull();
  });
});
