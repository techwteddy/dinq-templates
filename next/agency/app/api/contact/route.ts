import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { validateString, validateEmail, getErrorMessage } from "@/lib/utils";

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Rate limiting store (in-memory for simplicity, use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const RATE_LIMIT_MAX_REQUESTS = 5; // Max 5 submissions per IP per hour

/**
 * Rate limiting function
 * Limits submissions to 5 per IP address per hour
 */
function checkRateLimit(ip: string): { allowed: boolean; error?: string } {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    // Create new record or reset expired record
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return { allowed: true };
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      error: "Too many requests. Please wait a moment and try again.",
    };
  }

  // Increment count
  record.count += 1;
  rateLimitStore.set(ip, record);
  return { allowed: true };
}

/**
 * Get client IP address from request
 */
function getClientIp(request: NextRequest): string {
  // Check various headers for IP address (Vercel, Cloudflare, etc.)
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfConnectingIp = request.headers.get("cf-connecting-ip");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  if (realIp) {
    return realIp;
  }
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  return "unknown";
}

/**
 * Simple CSRF token validation
 * In production, use a more robust CSRF protection library
 */
function validateCsrfToken(request: NextRequest): boolean {
  // Check if request has a valid origin
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  // Allow requests from same origin
  if (origin && host) {
    const originUrl = new URL(origin);
    return originUrl.host === host;
  }

  // For development, allow localhost
  if (process.env.NODE_ENV === "development") {
    return true;
  }

  return false;
}

/**
 * Sanitize input to prevent XSS attacks
 */
function sanitizeInput(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * POST /api/contact
 * Handle contact form submissions
 */
export async function POST(request: NextRequest) {
  try {
    // CSRF Protection
    if (!validateCsrfToken(request)) {
      return NextResponse.json(
        { error: "Invalid request origin" },
        { status: 403 }
      );
    }

    // Rate Limiting
    const clientIp = getClientIp(request);
    const rateLimitResult = checkRateLimit(clientIp);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: rateLimitResult.error },
        { status: 429 }
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { name, email, company, message, honeypot } = body;

    // Honeypot field check (spam prevention)
    // If honeypot field is filled, it's likely a bot
    if (honeypot) {
      console.log("Honeypot triggered, potential spam detected");
      // Return success to not alert the bot
      return NextResponse.json(
        { success: true, message: "Message sent successfully" },
        { status: 200 }
      );
    }

    // Server-side validation
    if (!validateString(name, 2, 100)) {
      return NextResponse.json(
        { error: "Name must be between 2 and 100 characters" },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    if (company && !validateString(company, 0, 100)) {
      return NextResponse.json(
        { error: "Company name must be less than 100 characters" },
        { status: 400 }
      );
    }

    if (!validateString(message, 10, 1000)) {
      return NextResponse.json(
        { error: "Message must be between 10 and 1000 characters" },
        { status: 400 }
      );
    }

    // Check Resend configuration
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
    const recipientEmail = process.env.RECIPIENT_EMAIL || fromEmail;
    const bccEmail = process.env.BCC_EMAIL; // Optional BCC for backup copy

    // Debug logging (remove in production)
    console.log("Resend Config Check:", {
      hasApiKey: !!process.env.RESEND_API_KEY,
      fromEmail,
      recipientEmail,
      bccEmail,
    });

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        {
          error:
            "Email service is not configured. Please try emailing us directly at sakia.labs@hey.com",
        },
        { status: 500 }
      );
    }

    // Sanitize inputs for email content
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedCompany = company ? sanitizeInput(company) : "";
    const sanitizedMessage = sanitizeInput(message);

    // Prepare email content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">
          New Contact Form Submission
        </h1>
        <div style="margin: 20px 0;">
          <p style="margin: 10px 0;">
            <strong>Name:</strong> ${sanitizedName}
          </p>
          <p style="margin: 10px 0;">
            <strong>Email:</strong> ${sanitizedEmail}
          </p>
          ${
            sanitizedCompany
              ? `<p style="margin: 10px 0;"><strong>Company:</strong> ${sanitizedCompany}</p>`
              : ""
          }
          <p style="margin: 10px 0;">
            <strong>Message:</strong>
          </p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 10px;">
            <p style="white-space: pre-wrap; margin: 0;">${sanitizedMessage}</p>
          </div>
        </div>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
        <p style="color: #666; font-size: 12px;">
          This message was sent from the Sakia Labs contact form.
        </p>
      </div>
    `;

    const textContent = `
New Contact Form Submission

Name: ${sanitizedName}
Email: ${sanitizedEmail}
${sanitizedCompany ? `Company: ${sanitizedCompany}\n` : ""}
Message:
${sanitizedMessage}

---
This message was sent from the Sakia Labs contact form.
    `;

    // Send email via Resend
    const emailData: any = {
      from: fromEmail,
      to: recipientEmail,
      subject: `New Contact Form Submission from ${sanitizedName}`,
      html: htmlContent,
      reply_to: email, // Use original email for reply-to (not sanitized)
    };

    // Add BCC if configured
    if (bccEmail) {
      emailData.bcc = bccEmail;
    }

    try {
      await resend.emails.send(emailData);
      console.log(`Contact form email sent successfully from ${email}`);

      return NextResponse.json(
        {
          success: true,
          message: "Message sent successfully. We'll get back to you soon!",
        },
        { status: 200 }
      );
    } catch (error: any) {
      console.error("Resend error details:", {
        message: error.message,
        name: error.name,
        statusCode: error.statusCode,
      });
      return NextResponse.json(
        {
          error:
            "Failed to send message. Please try emailing us directly at sakia.labs@hey.com",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      {
        error: getErrorMessage(error),
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/contact
 * Return method not allowed for GET requests
 */
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}
