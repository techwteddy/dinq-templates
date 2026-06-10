import React from "react";
import { render, screen } from "@testing-library/react";
import Contact from "@/components/sections/contact";

// Mock framer-motion to avoid animation issues in tests
jest.mock("framer-motion", () => ({
  motion: {
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
  },
}));

// Mock the useSectionInView hook
jest.mock("@/lib/hooks", () => ({
  useSectionInView: jest.fn(() => ({ current: null })),
}));

describe("Contact Section", () => {
  it("renders section heading", () => {
    render(<Contact />);
    
    const heading = screen.getByText(/tell us what you're trying to build/i);
    expect(heading).toBeInTheDocument();
  });

  it("renders section description with selectivity signal", () => {
    render(<Contact />);
    
    const description = screen.getByText(/we'll review your request and follow up with next steps if it's a good fit/i);
    expect(description).toBeInTheDocument();
  });

  it("renders ContactForm component", () => {
    render(<Contact />);
    
    // Check for form fields using more specific queries
    expect(screen.getByLabelText(/^name$/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/your\.email@example\.com/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/company/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument();
  });

  it("renders alternative contact methods section", () => {
    render(<Contact />);
    
    const alternativeText = screen.getByText(/or reach out directly/i);
    expect(alternativeText).toBeInTheDocument();
  });

  it("renders email contact method", () => {
    render(<Contact />);
    
    const emailLink = screen.getByText(/sakia\.labs@hey\.com/i);
    expect(emailLink).toBeInTheDocument();
    expect(emailLink.closest("a")).toHaveAttribute("href", "mailto:sakia.labs@hey.com");
  });

  it("renders LinkedIn contact method", () => {
    render(<Contact />);
    
    const linkedInLink = screen.getByText(/^linkedin$/i);
    expect(linkedInLink).toBeInTheDocument();
    
    const linkElement = linkedInLink.closest("a");
    expect(linkElement).toHaveAttribute("href", "https://www.linkedin.com/company/sakia-labs");
    expect(linkElement).toHaveAttribute("target", "_blank");
    expect(linkElement).toHaveAttribute("rel", "noopener noreferrer");
  });
});
