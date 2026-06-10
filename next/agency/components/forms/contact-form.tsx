"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ContactFormProps {
  onSubmit: (data: ContactFormData) => Promise<void>;
}

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  message: string;
  honeypot?: string; // Spam prevention field
}

interface ContactFormState {
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function ContactForm({ onSubmit }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    company: "",
    message: "",
    honeypot: "", // Hidden field for spam prevention
  });

  const [formState, setFormState] = useState<ContactFormState>({
    isSubmitting: false,
    isSuccess: false,
    error: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showError, setShowError] = useState(false);

  // Validation functions
  const validateName = (name: string): string | undefined => {
    if (!name.trim()) {
      return "Please enter your name";
    }
    if (name.trim().length < 2) {
      return "Name must be at least 2 characters";
    }
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) {
      return "Please enter your email address";
    }
    // Email format validation using a standard regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return undefined;
  };

  const validateMessage = (message: string): string | undefined => {
    if (!message.trim()) {
      return "Please tell us about your project";
    }
    if (message.trim().length < 10) {
      return "Please provide more details (at least 10 characters)";
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const messageError = validateMessage(formData.message);

    if (nameError) newErrors.name = nameError;
    if (emailError) newErrors.email = emailError;
    if (messageError) newErrors.message = messageError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // Validate field on blur
    let error: string | undefined;
    if (name === "name") {
      error = validateName(value);
    } else if (name === "email") {
      error = validateEmail(value);
    } else if (name === "message") {
      error = validateMessage(value);
    }

    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setFormState({
      isSubmitting: true,
      isSuccess: false,
      error: null,
    });

    try {
      await onSubmit(formData);
      setFormState({
        isSubmitting: false,
        isSuccess: true,
        error: null,
      });
      // Reset form on success
      setFormData({
        name: "",
        email: "",
        company: "",
        message: "",
        honeypot: "",
      });
      setErrors({});
    } catch (error) {
      setFormState({
        isSubmitting: false,
        isSuccess: false,
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
      setShowError(true);
    }
  };

  // Input field base classes with focus states and error states
  const getInputClasses = (hasError: boolean) => `
    w-full px-4 py-3 rounded-lg
    bg-white dark:bg-gray-800
    text-black dark:text-white
    border ${hasError ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'}
    transition-all duration-200
    outline-none
    ${hasError ? 'focus:ring-2 focus:ring-red-500 focus:border-transparent' : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'}
    placeholder:text-gray-400 dark:placeholder:text-gray-500
  `;

  const labelClasses = `
    block text-sm font-medium mb-2
    text-gray-700 dark:text-gray-300
  `;

  const errorClasses = `
    mt-1 text-sm text-red-600 dark:text-red-400
  `;

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="w-full max-w-[45rem] mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence mode="wait">
        {/* Error Message - Top of form */}
        {formState.error && showError && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="mb-6 overflow-hidden"
          >
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 relative">
              <button
                onClick={() => setShowError(false)}
                className="absolute top-3 right-3 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors"
                aria-label="Close error message"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <p className="text-red-600 dark:text-red-400 text-sm font-semibold mb-2 pr-8">
                {formState.error}
              </p>
              <p className="text-red-600 dark:text-red-400 text-xs">
                You can also reach us directly at{" "}
                <a
                  href="mailto:sakia.labs@hey.com"
                  className="underline hover:text-red-700 dark:hover:text-red-300"
                >
                  sakia.labs@hey.com
                </a>{" "}
                or via{" "}
                <a
                  href="https://www.linkedin.com/company/sakia-labs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-red-700 dark:hover:text-red-300"
                >
                  LinkedIn
                </a>
                .
              </p>
            </div>
          </motion.div>
        )}

        {/* Success Message - Top of form */}
        {formState.isSuccess && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="mb-6 overflow-hidden"
          >
            <div className="p-6 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 relative">
              <button
                onClick={() => setFormState(prev => ({ ...prev, isSuccess: false }))}
                className="absolute top-3 right-3 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 transition-colors"
                aria-label="Close success message"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="flex items-start gap-3 pr-8">
                <span className="text-2xl" aria-hidden="true">✓</span>
                <div>
                  <p className="text-green-600 dark:text-green-400 font-semibold mb-1">
                    Thanks for reaching out!
                  </p>
                  <p className="text-green-600 dark:text-green-400 text-sm">
                    We've received your message and will respond within 24 hours.
                  </p>
                  <p className="text-green-600 dark:text-green-400 text-xs mt-2">
                    In the meantime, check out our{" "}
                    <a
                      href="https://github.com/sakialabs"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-green-700 dark:hover:text-green-300"
                    >
                      GitHub
                    </a>{" "}
                    to see what we're building.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        <div className="hidden" aria-hidden="true">
          <label htmlFor="honeypot">Leave this field empty</label>
          <input
            id="honeypot"
            name="honeypot"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={formData.honeypot}
            onChange={handleInputChange}
          />
        </div>

        {/* Name Field */}
        <div>
          <label htmlFor="name" className={labelClasses}>
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            maxLength={100}
            placeholder="Your name"
            value={formData.name}
            onChange={handleInputChange}
            onBlur={handleBlur}
            disabled={formState.isSubmitting}
            className={getInputClasses(!!errors.name)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p id="name-error" className={errorClasses} role="alert">
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className={labelClasses}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="text"
            maxLength={100}
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={handleBlur}
            disabled={formState.isSubmitting}
            className={getInputClasses(!!errors.email)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className={errorClasses} role="alert">
              {errors.email}
            </p>
          )}
        </div>

        {/* Company Field (Optional) */}
        <div>
          <label htmlFor="company" className={labelClasses}>
            Company <span className="text-gray-400">(optional)</span>
          </label>
          <input
            id="company"
            name="company"
            type="text"
            maxLength={100}
            placeholder="Your company name"
            value={formData.company}
            onChange={handleInputChange}
            disabled={formState.isSubmitting}
            className={getInputClasses(false)}
          />
        </div>

        {/* Message Field */}
        <div>
          <label htmlFor="message" className={labelClasses}>
            Message
          </label>
          <textarea
            id="message"
            name="message"
            maxLength={1000}
            rows={6}
            placeholder="Tell us about your project..."
            value={formData.message}
            onChange={handleInputChange}
            onBlur={handleBlur}
            disabled={formState.isSubmitting}
            className={`${getInputClasses(!!errors.message)} resize-none`}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
          />
          {errors.message && (
            <p id="message-error" className={errorClasses} role="alert">
              {errors.message}
            </p>
          )}
        </div>
        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={formState.isSubmitting}
            className={`
              px-8 py-3 rounded-full
              font-semibold text-base
              bg-white/80 hover:bg-white/90
              dark:bg-gray-950/75 dark:hover:bg-gray-950/85
              border border-white/40 dark:border-black/40
              backdrop-blur-[0.5rem]
              shadow-lg shadow-black/[0.03]
              text-gray-800 dark:text-white
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-accent-lavender dark:focus:ring-accent-lavenderDark focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
              ${formState.isSubmitting ? "cursor-wait" : "hover:scale-110 active:scale-105"}
            `}
          >
          {formState.isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Sending...
            </span>
          ) : (
            "Send Message"
          )}
          </button>
        </div>
      </div>
    </motion.form>
  );
}
