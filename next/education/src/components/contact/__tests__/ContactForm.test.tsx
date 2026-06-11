import { expect, test, describe, mock, afterEach } from 'bun:test';
import {
  render,
  cleanup,
  within,
  fireEvent,
  act,
} from '@testing-library/react';
import * as React from 'react';
import { ContactForm } from '../ContactForm';

const toastMock = mock(() => {});

mock.module('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: toastMock,
  }),
}));

// Mock Toaster component
mock.module('@/components/ui/toaster', () => ({
  Toaster: () => null,
}));

// Mock DepartmentSelect to be a simple select for easier testing
mock.module('../DepartmentSelect', () => ({
  DepartmentSelect: ({ onValueChange, defaultValue }: any) => (
    <select
      aria-label="Department & Inquiry Type"
      defaultValue={defaultValue}
      onChange={(e) => onValueChange(e.target.value)}
      onBlur={(e) => onValueChange(e.target.value)}
    >
      <option value="">Select a department</option>
      <option value="admissions:Undergraduate">Undergraduate Admissions</option>
      <option value="it-help-desk:Canvas Support">
        IT Help Desk: Canvas Support
      </option>
    </select>
  ),
}));

describe('ContactForm', () => {
  afterEach(() => {
    cleanup();
    toastMock.mockClear();
  });

  test('renders all form fields', () => {
    render(<ContactForm />);
    const screen = within(document.body);

    expect(screen.getByLabelText(/department/i)).toBeTruthy();
    expect(screen.getByLabelText(/first name/i)).toBeTruthy();
    expect(screen.getByLabelText(/last name/i)).toBeTruthy();
    expect(screen.getByLabelText(/email/i)).toBeTruthy();
    expect(screen.getByLabelText(/phone/i)).toBeTruthy();
    expect(screen.getByLabelText(/urgency/i)).toBeTruthy();
    expect(screen.getByLabelText(/message/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /send message/i })).toBeTruthy();
  });

  test('shows validation errors for empty fields', async () => {
    render(<ContactForm />);
    const screen = within(document.body);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /send message/i }));
    });

    expect(await screen.findByText(/please select a department/i)).toBeTruthy();
    expect(
      await screen.findByText(/first name must be at least 2 characters/i)
    ).toBeTruthy();
    expect(
      await screen.findByText(/last name must be at least 2 characters/i)
    ).toBeTruthy();
    expect(
      await screen.findByText(/please enter a valid email address/i)
    ).toBeTruthy();
    expect(
      await screen.findByText(/message must be at least 20 characters/i)
    ).toBeTruthy();
  });

  test('shows validation error for invalid email', async () => {
    render(<ContactForm />);
    const screen = within(document.body);

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'invalid-email' },
      });
      fireEvent.blur(screen.getByLabelText(/email/i));
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /send message/i }));
    });

    expect(
      await screen.findByText(/please enter a valid email address/i)
    ).toBeTruthy();
  });

  test.skip('successfully submits contact form and shows toast', async () => {
    render(<ContactForm />);
    const screen = within(document.body);

    await act(async () => {
      // Use fireEvent for Select/DepartmentSelect
      const departmentSelect = screen.getByLabelText(/department/i);
      fireEvent.change(departmentSelect, {
        target: { value: 'admissions:Undergraduate' },
      });
      fireEvent.blur(departmentSelect);

      const firstNameInput = screen.getByLabelText(/first name/i);
      fireEvent.change(firstNameInput, {
        target: { value: 'Jane' },
      });
      fireEvent.blur(firstNameInput);

      const lastNameInput = screen.getByLabelText(/last name/i);
      fireEvent.change(lastNameInput, {
        target: { value: 'Smith' },
      });
      fireEvent.blur(lastNameInput);

      const emailInput = screen.getByLabelText(/email/i);
      fireEvent.change(emailInput, {
        target: { value: 'jane.smith@example.com' },
      });
      fireEvent.blur(emailInput);

      const messageInput = screen.getByLabelText(/message/i);
      fireEvent.change(messageInput, {
        target: {
          value:
            'This is a test message that is long enough to pass validation.',
        },
      });
      fireEvent.blur(messageInput);
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /send message/i }));
    });

    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Message sent!',
      })
    );
  });
});
