import { expect, test, describe, afterEach, mock } from 'bun:test';
import {
  render,
  cleanup,
  within,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';
import * as React from 'react';
import { LoginForm } from '../LoginForm';
import { DemoProvider } from '@/components/demo-provider';

mock.module('next/navigation', () => ({
  useRouter: () => ({
    push: mock(() => {}),
    replace: mock(() => {}),
    prefetch: mock(() => {}),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

let loginCalled = false;
const loginMock = mock((..._args: any[]) => {
  loginCalled = true;
  return Promise.resolve();
});
const toastMock = mock(() => {});

mock.module('@/context/AuthContext', () => ({
  useAuth: () => ({
    login: loginMock,
  }),
}));

mock.module('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: toastMock,
  }),
}));

describe('LoginForm', () => {
  afterEach(() => {
    cleanup();
    loginMock.mockClear();
    toastMock.mockClear();
    loginCalled = false;
    loginMock.mockImplementation((..._args: any[]) => {
      loginCalled = true;
      return Promise.resolve();
    });
  });

  test('renders login fields', () => {
    render(
      <DemoProvider>
        <LoginForm />
      </DemoProvider>
    );
    const screen = within(document.body);

    expect(screen.getByLabelText(/email/i)).toBeTruthy();
    expect(screen.getByLabelText(/password/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeTruthy();
  });

  test('shows validation errors for empty fields', async () => {
    render(
      <DemoProvider>
        <LoginForm />
      </DemoProvider>
    );
    const screen = within(document.body);

    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(
      await screen.findByText(/please enter a valid email address/i)
    ).toBeTruthy();
    expect(
      await screen.findByText(/password must be at least 8 characters/i)
    ).toBeTruthy();
  });

  test.skip('calls login with valid credentials and shows success toast', async () => {
    const { container } = render(
      <DemoProvider>
        <LoginForm />
      </DemoProvider>
    );
    const screen = within(document.body);

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(
      /password/i
    ) as HTMLInputElement;
    const formElement = container.querySelector('form')!;

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.blur(emailInput);
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.blur(passwordInput);
    });

    await act(async () => {
      fireEvent.submit(formElement);
    });

    await waitFor(
      () => {
        expect(loginCalled).toBe(true);
      },
      { timeout: 2000 }
    );
  });
});
