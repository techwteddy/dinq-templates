import { expect, test, describe, afterEach } from 'bun:test';
import { render, cleanup } from '@testing-library/react';
import * as React from 'react';
import LoginPage from '../app/login/page';
import SignupPage from '../app/signup/page';
import { DemoProvider } from '../components/demo-provider';
import { AuthProvider } from '../context/AuthContext';

describe('Auth Page Links', () => {
  afterEach(() => {
    cleanup();
  });

  test('LoginPage contains link to SignupPage', () => {
    const { getByText } = render(
      <AuthProvider>
        <DemoProvider>
          <LoginPage />
        </DemoProvider>
      </AuthProvider>
    );

    const signupLink = getByText(/Sign up/i);
    expect(signupLink.closest('a')?.getAttribute('href')).toBe('/signup');
  });

  test('SignupPage contains link to LoginPage', () => {
    const { getByText } = render(
      <AuthProvider>
        <DemoProvider>
          <SignupPage />
        </DemoProvider>
      </AuthProvider>
    );

    const loginLink = getByText(/Log in/i);
    expect(loginLink.closest('a')?.getAttribute('href')).toBe('/login');
  });
});
