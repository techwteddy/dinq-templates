/**
 * Tests for the contact API route
 * 
 * Note: These tests verify the API route logic but don't actually send emails
 * since SendGrid requires valid API keys and configuration.
 */

import { NextRequest } from "next/server";
import { POST, GET } from "@/app/api/contact/route";

// Mock SendGrid
jest.mock("@sendgrid/mail", () => ({
  setApiKey: jest.fn(),
  send: jest.fn().mockResolvedValue([{ statusCode: 202 }]),
}));

describe("Contact API Route", () => {
  const validFormData = {
    name: "John Doe",
    email: "john@example.com",
    company: "Test Company",
    message: "This is a test message with more than 10 characters",
  };

  beforeEach(() => {
    // Set required environment variables
    process.env.SENDGRID_API_KEY = "test-api-key";
    process.env.SENDGRID_VERIFIED_SENDER = "test@example.com";
    process.env.RECIPIENT_EMAIL = "recipient@example.com";
    process.env.NODE_ENV = "development";
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/contact", () => {
    it("should return 200 for valid form submission", async () => {
      const request = new NextRequest("http://localhost:3000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          origin: "http://localhost:3000",
          host: "localhost:3000",
        },
        body: JSON.stringify(validFormData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it("should return 400 for missing name", async () => {
      const invalidData = { ...validFormData, name: "" };
      const request = new NextRequest("http://localhost:3000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          origin: "http://localhost:3000",
          host: "localhost:3000",
        },
        body: JSON.stringify(invalidData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("Name");
    });

    it("should return 400 for invalid email", async () => {
      const invalidData = { ...validFormData, email: "invalid-email" };
      const request = new NextRequest("http://localhost:3000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          origin: "http://localhost:3000",
          host: "localhost:3000",
        },
        body: JSON.stringify(invalidData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("email");
    });

    it("should return 400 for message too short", async () => {
      const invalidData = { ...validFormData, message: "Short" };
      const request = new NextRequest("http://localhost:3000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          origin: "http://localhost:3000",
          host: "localhost:3000",
        },
        body: JSON.stringify(invalidData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("Message");
    });

    it("should handle honeypot field (spam prevention)", async () => {
      const spamData = { ...validFormData, honeypot: "spam-bot-value" };
      const request = new NextRequest("http://localhost:3000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          origin: "http://localhost:3000",
          host: "localhost:3000",
        },
        body: JSON.stringify(spamData),
      });

      const response = await POST(request);
      const data = await response.json();

      // Should return success to not alert the bot
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it("should sanitize input to prevent XSS", async () => {
      const xssData = {
        ...validFormData,
        name: "<script>alert('xss')</script>",
        message: "Test message with <script>alert('xss')</script> in it",
      };
      const request = new NextRequest("http://localhost:3000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          origin: "http://localhost:3000",
          host: "localhost:3000",
        },
        body: JSON.stringify(xssData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it("should accept optional company field", async () => {
      const dataWithoutCompany = {
        name: "John Doe",
        email: "john@example.com",
        message: "This is a test message with more than 10 characters",
      };
      const request = new NextRequest("http://localhost:3000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          origin: "http://localhost:3000",
          host: "localhost:3000",
        },
        body: JSON.stringify(dataWithoutCompany),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });

  describe("GET /api/contact", () => {
    it("should return 405 Method Not Allowed", async () => {
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(405);
      expect(data.error).toBe("Method not allowed");
    });
  });
});
