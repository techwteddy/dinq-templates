"use server";

import { Resend } from "resend";
import { validateString, validateEmail, validatePhone, getErrorMessage } from "@/lib/utils";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (formData: FormData) => {
  const formType = formData.get("formType") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  // Common validations
  if (!validateString(name, 1, 100)) {
    return { error: "Name should be between 1 and 100 characters" };
  }
  if (!validateEmail(email)) {
    return { error: "Invalid email address" };
  }
  if (!validateString(message, 1, 5000)) {
    return { error: "Message should be between 1 and 5000 characters" };
  }

  let htmlContent: string;
  let subject: string;

  if (formType === "becomeClient") {
    const phone = formData.get("phone") as string;
    const organization = formData.get("organization") as string;
    const selectedPackage = formData.get("package") as string;

    // Additional validations for "Become a Client" form
    if (!validatePhone(phone)) {
      return { error: "Invalid phone number" };
    }
    if (!validateString(organization, 1, 100)) {
      return { error: "Organization name should be between 1 and 100 characters" };
    }
    if (!validateString(selectedPackage, 1, 100)) {
      return { error: "Please select a package" };
    }

    htmlContent = `
      <h1>New Client Application</h1>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Organization:</strong> ${organization}</p>
      <p><strong>Selected Package:</strong> ${selectedPackage}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;
    subject = "New Client Application";
  } else {
    htmlContent = `
      <h1>Contact Form Submission</h1>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;
    subject = "New Message from Contact Form";
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
  const recipientEmail = process.env.RECIPIENT_EMAIL || fromEmail;
  const bccEmail = process.env.BCC_EMAIL;

  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set in environment variables");
    return { error: "Email configuration error" };
  }

  try {
    const emailData: any = {
      from: fromEmail,
      to: recipientEmail,
      subject: subject,
      html: htmlContent,
      reply_to: email,
    };

    // Add BCC if configured
    if (bccEmail) {
      emailData.bcc = bccEmail;
    }

    await resend.emails.send(emailData);
    return { data: "Email sent successfully" };
  } catch (error: unknown) {
    console.error("Resend error:", error);
    return {
      error: getErrorMessage(error),
    };
  }
};
