import { expect, test, describe, beforeEach, afterEach } from 'bun:test';
import { renderHook, act } from '@testing-library/react';
import * as React from 'react';
import { AuthProvider, useAuth } from '../AuthContext';
import { authService } from '@/lib/auth-service';
import { MOCK_USERS } from '@/lib/mock-auth-data';

describe('AuthContext', () => {
  beforeEach(() => {
    authService.clearStorage();
  });

  afterEach(() => {
    authService.clearStorage();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  test('should initialize with null user and isLoading: false after mount', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    // Wait for useEffect to finish
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  test('should login successfully', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const user = MOCK_USERS[0];

    await act(async () => {
      await result.current.login(user.email, 'password');
    });

    expect(result.current.user?.id).toBe(user.id);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  test('should fail login with invalid email', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    try {
      await act(async () => {
        await result.current.login('invalid@example.com', 'password');
      });
    } catch (error) {
      expect(error).toBeDefined();
    }

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  test('should logout successfully', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const user = MOCK_USERS[0];

    await act(async () => {
      await result.current.login(user.email, 'password');
    });

    expect(result.current.isAuthenticated).toBe(true);

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  test('should signup successfully', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const signupData = {
      name: 'New User',
      email: 'new@example.com',
      role: 'student' as const,
    };

    await act(async () => {
      await result.current.signup(signupData);
    });

    expect(result.current.user?.name).toBe(signupData.name);
    expect(result.current.user?.email).toBe(signupData.email);
    expect(result.current.isAuthenticated).toBe(true);
  });

  test('should update profile successfully', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const user = MOCK_USERS[0];
    await act(async () => {
      await result.current.login(user.email, 'password');
    });

    const updatedName = 'Updated Name';
    await act(async () => {
      await result.current.updateProfile({ name: updatedName });
    });

    expect(result.current.user?.name).toBe(updatedName);
    expect(result.current.user?.id).toBe(user.id);
  });

  test('should retrieve user from storage on initialization', async () => {
    const user = MOCK_USERS[0];
    localStorage.setItem('eduplatform_auth_user', JSON.stringify(user));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.user?.id).toBe(user.id);
    expect(result.current.isAuthenticated).toBe(true);
  });
});
