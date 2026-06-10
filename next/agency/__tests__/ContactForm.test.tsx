import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ContactForm, { ContactFormData } from "@/components/forms/contact-form";

describe("ContactForm", () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it("renders all form fields with labels and placeholders", () => {
    render(<ContactForm onSubmit={mockOnSubmit} />);

    // Check for labels
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/company/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();

    // Check for placeholders
    expect(screen.getByPlaceholderText(/your name/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/your.email@example.com/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/your company name/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/tell us about your project/i)
    ).toBeInTheDocument();
  });

  it("renders submit button", () => {
    render(<ContactForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole("button", { name: /send message/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).not.toBeDisabled();
  });

  it("marks name, email, and message as required through validation", () => {
    render(<ContactForm onSubmit={mockOnSubmit} />);

    const companyInput = screen.getByLabelText(/company/i);

    // Company field should still show as optional in the label
    expect(companyInput).not.toBeRequired();
  });

  it("marks company field as optional", () => {
    render(<ContactForm onSubmit={mockOnSubmit} />);

    const companyLabel = screen.getByText(/company/i);
    expect(companyLabel.textContent).toContain("optional");
  });

  it("updates form data when user types", () => {
    render(<ContactForm onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const companyInput = screen.getByLabelText(/company/i) as HTMLInputElement;
    const messageInput = screen.getByLabelText(/message/i) as HTMLTextAreaElement;

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(companyInput, { target: { value: "Acme Corp" } });
    fireEvent.change(messageInput, {
      target: { value: "I need help with my project" },
    });

    expect(nameInput.value).toBe("John Doe");
    expect(emailInput.value).toBe("john@example.com");
    expect(companyInput.value).toBe("Acme Corp");
    expect(messageInput.value).toBe("I need help with my project");
  });

  it("shows loading state when form is submitting", async () => {
    const slowSubmit = jest.fn(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );
    render(<ContactForm onSubmit={slowSubmit} />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/message/i);
    const submitButton = screen.getByRole("button", { name: /send message/i });

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(messageInput, { target: { value: "Test message" } });

    fireEvent.click(submitButton);

    // Check for loading state
    await waitFor(() => {
      expect(screen.getByText(/sending/i)).toBeInTheDocument();
    });

    // Check that button is disabled during submission
    expect(submitButton).toBeDisabled();
  });

  it("calls onSubmit with form data when submitted", async () => {
    mockOnSubmit.mockResolvedValue(undefined);
    render(<ContactForm onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const companyInput = screen.getByLabelText(/company/i);
    const messageInput = screen.getByLabelText(/message/i);
    const submitButton = screen.getByRole("button", { name: /send message/i });

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(companyInput, { target: { value: "Acme Corp" } });
    fireEvent.change(messageInput, {
      target: { value: "I need help with my project" },
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        company: "Acme Corp",
        message: "I need help with my project",
        honeypot: "",
      });
    });
  });

  it("shows success message after successful submission", async () => {
    mockOnSubmit.mockResolvedValue(undefined);
    render(<ContactForm onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/message/i);
    const submitButton = screen.getByRole("button", { name: /send message/i });

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(messageInput, { target: { value: "Test message" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/thanks for reaching out/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/we've received your message and will respond within 24 hours/i)
      ).toBeInTheDocument();
    });
  });

  it("resets form after successful submission", async () => {
    mockOnSubmit.mockResolvedValue(undefined);
    render(<ContactForm onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const messageInput = screen.getByLabelText(/message/i) as HTMLTextAreaElement;
    const submitButton = screen.getByRole("button", { name: /send message/i });

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(messageInput, { target: { value: "Test message" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(nameInput.value).toBe("");
      expect(emailInput.value).toBe("");
      expect(messageInput.value).toBe("");
    });
  });

  it("shows error message when submission fails", async () => {
    mockOnSubmit.mockRejectedValue(new Error("Network error"));
    render(<ContactForm onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/message/i);
    const submitButton = screen.getByRole("button", { name: /send message/i });

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(messageInput, { target: { value: "Test message" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });

  it("shows alternative contact methods in error message", async () => {
    mockOnSubmit.mockRejectedValue(new Error("Server error"));
    render(<ContactForm onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/message/i);
    const submitButton = screen.getByRole("button", { name: /send message/i });

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(messageInput, { target: { value: "Test message" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      // Check for error message
      expect(screen.getByText(/server error/i)).toBeInTheDocument();
      
      // Check for alternative contact methods
      expect(screen.getByText(/you can also reach us directly at/i)).toBeInTheDocument();
      
      // Check for email link
      const emailLink = screen.getByRole("link", { name: /sakia\.labs@hey\.com/i });
      expect(emailLink).toBeInTheDocument();
      expect(emailLink).toHaveAttribute("href", "mailto:sakia.labs@hey.com");
      
      // Check for LinkedIn link
      const linkedInLink = screen.getByRole("link", { name: /linkedin/i });
      expect(linkedInLink).toBeInTheDocument();
      expect(linkedInLink).toHaveAttribute("href", "https://www.linkedin.com/company/sakia-labs");
      expect(linkedInLink).toHaveAttribute("target", "_blank");
      expect(linkedInLink).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  it("applies focus styles to input fields", () => {
    render(<ContactForm onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByLabelText(/name/i);

    // Check that focus ring classes are present
    expect(nameInput.className).toContain("focus:ring-2");
    expect(nameInput.className).toContain("focus:ring-blue-500");
  });

  it("disables all inputs during submission", async () => {
    const slowSubmit = jest.fn(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );
    render(<ContactForm onSubmit={slowSubmit} />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const companyInput = screen.getByLabelText(/company/i);
    const messageInput = screen.getByLabelText(/message/i);
    const submitButton = screen.getByRole("button", { name: /send message/i });

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(messageInput, { target: { value: "Test message" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(nameInput).toBeDisabled();
      expect(emailInput).toBeDisabled();
      expect(companyInput).toBeDisabled();
      expect(messageInput).toBeDisabled();
      expect(submitButton).toBeDisabled();
    });
  });

  // Validation tests
  describe("Form Validation", () => {
    it("shows error when name field is empty on blur", async () => {
      render(<ContactForm onSubmit={mockOnSubmit} />);

      const nameInput = screen.getByLabelText(/name/i);
      fireEvent.focus(nameInput);
      fireEvent.blur(nameInput);

      await waitFor(() => {
        expect(screen.getByText(/please enter your name/i)).toBeInTheDocument();
      });
    });

    it("shows error when name is too short", async () => {
      render(<ContactForm onSubmit={mockOnSubmit} />);

      const nameInput = screen.getByLabelText(/name/i);
      fireEvent.change(nameInput, { target: { value: "A" } });
      fireEvent.blur(nameInput);

      await waitFor(() => {
        expect(
          screen.getByText(/name must be at least 2 characters/i)
        ).toBeInTheDocument();
      });
    });

    it("shows error when email field is empty on blur", async () => {
      render(<ContactForm onSubmit={mockOnSubmit} />);

      const emailInput = screen.getByLabelText(/email/i);
      fireEvent.focus(emailInput);
      fireEvent.blur(emailInput);

      await waitFor(() => {
        expect(
          screen.getByText(/please enter your email address/i)
        ).toBeInTheDocument();
      });
    });

    it("shows error when email format is invalid", async () => {
      render(<ContactForm onSubmit={mockOnSubmit} />);

      const emailInput = screen.getByLabelText(/email/i);
      fireEvent.change(emailInput, { target: { value: "invalid-email" } });
      fireEvent.blur(emailInput);

      await waitFor(() => {
        expect(
          screen.getByText(/please enter a valid email address/i)
        ).toBeInTheDocument();
      });
    });

    it("shows error when message field is empty on blur", async () => {
      render(<ContactForm onSubmit={mockOnSubmit} />);

      const messageInput = screen.getByLabelText(/message/i);
      fireEvent.focus(messageInput);
      fireEvent.blur(messageInput);

      await waitFor(() => {
        expect(
          screen.getByText(/please tell us about your project/i)
        ).toBeInTheDocument();
      });
    });

    it("shows error when message is too short (less than 10 characters)", async () => {
      render(<ContactForm onSubmit={mockOnSubmit} />);

      const messageInput = screen.getByLabelText(/message/i);
      fireEvent.change(messageInput, { target: { value: "Short" } });
      fireEvent.blur(messageInput);

      await waitFor(() => {
        expect(
          screen.getByText(/please provide more details \(at least 10 characters\)/i)
        ).toBeInTheDocument();
      });
    });

    it("clears error when user starts typing in a field with error", async () => {
      render(<ContactForm onSubmit={mockOnSubmit} />);

      const nameInput = screen.getByLabelText(/name/i);
      
      // Trigger error
      fireEvent.focus(nameInput);
      fireEvent.blur(nameInput);

      await waitFor(() => {
        expect(screen.getByText(/please enter your name/i)).toBeInTheDocument();
      });

      // Start typing
      fireEvent.change(nameInput, { target: { value: "J" } });

      await waitFor(() => {
        expect(screen.queryByText(/please enter your name/i)).not.toBeInTheDocument();
      });
    });

    it("prevents form submission when required fields are empty", async () => {
      mockOnSubmit.mockResolvedValue(undefined);
      render(<ContactForm onSubmit={mockOnSubmit} />);

      const submitButton = screen.getByRole("button", { name: /send message/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).not.toHaveBeenCalled();
        expect(screen.getByText(/please enter your name/i)).toBeInTheDocument();
        expect(screen.getByText(/please enter your email address/i)).toBeInTheDocument();
        expect(screen.getByText(/please tell us about your project/i)).toBeInTheDocument();
      });
    });

    it("prevents form submission when email format is invalid", async () => {
      mockOnSubmit.mockResolvedValue(undefined);
      render(<ContactForm onSubmit={mockOnSubmit} />);

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const messageInput = screen.getByLabelText(/message/i);
      const submitButton = screen.getByRole("button", { name: /send message/i });

      fireEvent.change(nameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "invalid-email" } });
      fireEvent.change(messageInput, { target: { value: "This is a valid message" } });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).not.toHaveBeenCalled();
        expect(
          screen.getByText(/please enter a valid email address/i)
        ).toBeInTheDocument();
      });
    });

    it("prevents form submission when message is too short", async () => {
      mockOnSubmit.mockResolvedValue(undefined);
      render(<ContactForm onSubmit={mockOnSubmit} />);

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const messageInput = screen.getByLabelText(/message/i);
      const submitButton = screen.getByRole("button", { name: /send message/i });

      fireEvent.change(nameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(messageInput, { target: { value: "Short" } });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).not.toHaveBeenCalled();
        expect(
          screen.getByText(/please provide more details \(at least 10 characters\)/i)
        ).toBeInTheDocument();
      });
    });

    it("maintains user-entered data when validation fails", async () => {
      mockOnSubmit.mockResolvedValue(undefined);
      render(<ContactForm onSubmit={mockOnSubmit} />);

      const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      const messageInput = screen.getByLabelText(/message/i) as HTMLTextAreaElement;
      const submitButton = screen.getByRole("button", { name: /send message/i });

      fireEvent.change(nameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "invalid-email" } });
      fireEvent.change(messageInput, { target: { value: "Short" } });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(nameInput.value).toBe("John Doe");
        expect(emailInput.value).toBe("invalid-email");
        expect(messageInput.value).toBe("Short");
      });
    });

    it("displays red border on invalid fields", async () => {
      render(<ContactForm onSubmit={mockOnSubmit} />);

      const nameInput = screen.getByLabelText(/name/i);
      fireEvent.focus(nameInput);
      fireEvent.blur(nameInput);

      await waitFor(() => {
        expect(nameInput.className).toContain("border-red-500");
      });
    });

    it("sets aria-invalid attribute on invalid fields", async () => {
      render(<ContactForm onSubmit={mockOnSubmit} />);

      const nameInput = screen.getByLabelText(/name/i);
      fireEvent.focus(nameInput);
      fireEvent.blur(nameInput);

      await waitFor(() => {
        expect(nameInput).toHaveAttribute("aria-invalid", "true");
      });
    });

    it("associates error messages with fields using aria-describedby", async () => {
      render(<ContactForm onSubmit={mockOnSubmit} />);

      const nameInput = screen.getByLabelText(/name/i);
      fireEvent.focus(nameInput);
      fireEvent.blur(nameInput);

      await waitFor(() => {
        expect(nameInput).toHaveAttribute("aria-describedby", "name-error");
        expect(screen.getByText(/please enter your name/i)).toHaveAttribute("id", "name-error");
      });
    });

    it("allows form submission with valid data including minimum message length", async () => {
      mockOnSubmit.mockResolvedValue(undefined);
      render(<ContactForm onSubmit={mockOnSubmit} />);

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const messageInput = screen.getByLabelText(/message/i);
      const submitButton = screen.getByRole("button", { name: /send message/i });

      fireEvent.change(nameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(messageInput, { target: { value: "Ten chars!" } }); // Exactly 10 characters

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          name: "John Doe",
          email: "john@example.com",
          company: "",
          message: "Ten chars!",
          honeypot: "",
        });
      });
    });
  });
});
