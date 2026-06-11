import { expect, test, describe, afterEach } from 'bun:test';
import { render, cleanup, within, fireEvent } from '@testing-library/react';
import * as React from 'react';
import { PasswordResetForm } from '../PasswordResetForm';

afterEach(() => {
  cleanup();
});

describe('PasswordResetForm', () => {
  test('renders email field', () => {
    render(<PasswordResetForm />);
    const screen = within(document.body);

    expect(screen.getByLabelText(/email address/i)).toBeTruthy();
    expect(
      screen.getByRole('button', { name: /send reset link/i })
    ).toBeTruthy();
  });

  test('shows validation error for invalid email', async () => {
    render(<PasswordResetForm />);
    const screen = within(document.body);

    const emailInput = screen.getByLabelText(/email address/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    fireEvent.click(screen.getByRole('button', { name: /send reset link/i }));

    expect(
      await screen.findByText(/please enter a valid email address/i)
    ).toBeTruthy();
  });
});
