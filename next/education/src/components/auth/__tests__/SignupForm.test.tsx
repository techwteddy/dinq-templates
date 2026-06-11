import { expect, test, describe, afterEach, mock } from 'bun:test';
import { render, cleanup, fireEvent, act } from '@testing-library/react';
import * as React from 'react';
import { SignupForm } from '../SignupForm';
import { DemoProvider } from '@/components/demo-provider';

const signupMock = mock(() => Promise.resolve());
const toastMock = mock(() => {});

mock.module('@/context/AuthContext', () => ({
  useAuth: () => ({
    signup: signupMock,
    login: mock(() => Promise.resolve()),
  }),
}));

mock.module('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: toastMock,
  }),
}));

describe('SignupForm', () => {
  const MOCK_NAME = 'John';
  const MOCK_LAST_NAME = 'Doe';
  const MOCK_EMAIL = 'john.doe@example.com';
  const MOCK_PASSWORD = 'Password123!';

  afterEach(() => {
    cleanup();
    signupMock.mockClear();
    toastMock.mockClear();
    signupMock.mockImplementation(() => Promise.resolve());
  });

  test('renders all signup fields', () => {
    const { getByLabelText, getByRole } = render(
      <DemoProvider>
        <SignupForm />
      </DemoProvider>
    );

    expect(getByLabelText(/first name/i)).toBeTruthy();
    expect(getByLabelText(/last name/i)).toBeTruthy();
    expect(getByLabelText(/email/i)).toBeTruthy();
    expect(getByLabelText(/i am a/i)).toBeTruthy();
    expect(getByLabelText(/^password$/i)).toBeTruthy();
    expect(getByLabelText(/confirm password/i)).toBeTruthy();
    expect(getByLabelText(/i agree to the terms of service/i)).toBeTruthy();
    expect(getByRole('button', { name: /create account/i })).toBeTruthy();
  });

  test('shows validation errors for empty fields on submit', async () => {
    const { getByRole, findByText } = render(
      <DemoProvider>
        <SignupForm />
      </DemoProvider>
    );

    await act(async () => {
      fireEvent.click(getByRole('button', { name: /create account/i }));
    });

    expect(
      await findByText(/first name must be at least 2 characters/i)
    ).toBeTruthy();
    expect(
      await findByText(/last name must be at least 2 characters/i)
    ).toBeTruthy();
    expect(
      await findByText(/please enter a valid email address/i)
    ).toBeTruthy();
    expect(
      await findByText(/password must be at least 8 characters/i)
    ).toBeTruthy();
    expect(
      await findByText(/you must accept the terms and conditions/i)
    ).toBeTruthy();
  });

  test.skip('calls signup with valid credentials and shows success toast', async () => {
    const { getByLabelText, getByRole } = render(
      <DemoProvider>
        <SignupForm />
      </DemoProvider>
    );

    await act(async () => {
      const firstNameInput = getByLabelText(/first name/i);
      fireEvent.change(firstNameInput, {
        target: { value: MOCK_NAME },
      });
      fireEvent.blur(firstNameInput);

      const lastNameInput = getByLabelText(/last name/i);
      fireEvent.change(lastNameInput, {
        target: { value: MOCK_LAST_NAME },
      });
      fireEvent.blur(lastNameInput);

      const emailInput = getByLabelText(/email/i);
      fireEvent.change(emailInput, {
        target: { value: MOCK_EMAIL },
      });
      fireEvent.blur(emailInput);

      const passwordInput = getByLabelText(/^password$/i);
      fireEvent.change(passwordInput, {
        target: { value: MOCK_PASSWORD },
      });
      fireEvent.blur(passwordInput);

      const confirmPasswordInput = getByLabelText(/confirm password/i);
      fireEvent.change(confirmPasswordInput, {
        target: { value: MOCK_PASSWORD },
      });
      fireEvent.blur(confirmPasswordInput);

      const termsCheckbox = getByLabelText(/i agree to the terms of service/i);
      fireEvent.click(termsCheckbox);
      fireEvent.blur(termsCheckbox);
    });

    await act(async () => {
      fireEvent.click(getByRole('button', { name: /create account/i }));
    });

    expect(signupMock).toHaveBeenCalled();
  });

  test.skip('shows error toast on signup failure', async () => {
    signupMock.mockImplementation(() =>
      Promise.reject(new Error('Email already exists'))
    );

    const { getByLabelText, getByRole } = render(
      <DemoProvider>
        <SignupForm />
      </DemoProvider>
    );

    await act(async () => {
      fireEvent.change(getByLabelText(/first name/i), {
        target: { value: MOCK_NAME },
      });
      fireEvent.change(getByLabelText(/last name/i), {
        target: { value: MOCK_LAST_NAME },
      });
      fireEvent.change(getByLabelText(/email/i), {
        target: { value: 'existing@example.com' },
      });
      fireEvent.change(getByLabelText(/^password$/i), {
        target: { value: MOCK_PASSWORD },
      });
      fireEvent.change(getByLabelText(/confirm password/i), {
        target: { value: MOCK_PASSWORD },
      });
      fireEvent.click(getByLabelText(/i agree to the terms of service/i));
    });

    await act(async () => {
      fireEvent.click(getByRole('button', { name: /create account/i }));
    });

    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        variant: 'destructive',
        description: 'Email already exists',
      })
    );
  });

  test.skip('prevents multiple submissions while loading', async () => {
    let resolveSignup: (value: void | PromiseLike<void>) => void;
    const signupPromise = new Promise<void>((resolve) => {
      resolveSignup = resolve;
    });
    signupMock.mockImplementation(() => signupPromise);

    const { getByLabelText, getByRole } = render(
      <DemoProvider>
        <SignupForm />
      </DemoProvider>
    );

    await act(async () => {
      const firstNameInput = getByLabelText(/first name/i);
      fireEvent.change(firstNameInput, {
        target: { value: MOCK_NAME },
      });
      fireEvent.blur(firstNameInput);

      const lastNameInput = getByLabelText(/last name/i);
      fireEvent.change(lastNameInput, {
        target: { value: MOCK_LAST_NAME },
      });
      fireEvent.blur(lastNameInput);

      const emailInput = getByLabelText(/email/i);
      fireEvent.change(emailInput, {
        target: { value: MOCK_EMAIL },
      });
      fireEvent.blur(emailInput);

      const passwordInput = getByLabelText(/^password$/i);
      fireEvent.change(passwordInput, {
        target: { value: MOCK_PASSWORD },
      });
      fireEvent.blur(passwordInput);

      const confirmPasswordInput = getByLabelText(/confirm password/i);
      fireEvent.change(confirmPasswordInput, {
        target: { value: MOCK_PASSWORD },
      });
      fireEvent.blur(confirmPasswordInput);

      const termsCheckbox = getByLabelText(/i agree to the terms of service/i);
      fireEvent.click(termsCheckbox);
      fireEvent.blur(termsCheckbox);
    });

    await act(async () => {
      fireEvent.click(getByRole('button', { name: /create account/i }));
    });

    const submitButton = getByRole('button', { name: /create account/i });
    expect(submitButton.hasAttribute('disabled')).toBe(true);

    // Try clicking again
    fireEvent.click(submitButton);
    expect(signupMock).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolveSignup!();
    });
  });
});
