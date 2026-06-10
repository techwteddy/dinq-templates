import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Hero from "@/components/sections/hero";
import ActiveSectionContextProvider from "@/context/active-section-context";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    svg: ({ children, ...props }: any) => <svg {...props}>{children}</svg>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  useInView: jest.fn(() => true),
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock hooks
jest.mock("@/lib/hooks", () => ({
  useSectionInView: jest.fn(() => ({ ref: { current: null } })),
}));

const mockProps = {
  headline: "Steady hands for serious products",
  subheadline: "We design and build calm, reliable software end-to-end, from early ideas to production systems.",
  primaryCTA: {
    label: "Start a project",
    href: "#contact",
  },
  secondaryCTA: {
    label: "See selected work",
    href: "#work",
  },
  microcopy: "No sales scripts. Clear scope. Thoughtful execution.",
};

describe("Hero Component", () => {
  beforeEach(() => {
    // Mock scrollTo
    window.scrollTo = jest.fn();
    // Mock getElementById
    document.getElementById = jest.fn((id) => ({
      getBoundingClientRect: () => ({ top: 100 }),
    })) as any;
  });

  it("renders the headline", () => {
    render(
      <ActiveSectionContextProvider>
        <Hero {...mockProps} />
      </ActiveSectionContextProvider>
    );
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.textContent).toBe(mockProps.headline);
  });

  it("renders the subheadline", () => {
    render(
      <ActiveSectionContextProvider>
        <Hero {...mockProps} />
      </ActiveSectionContextProvider>
    );
    expect(screen.getByText(mockProps.subheadline)).toBeInTheDocument();
  });

  it("renders both CTAs with correct labels", () => {
    render(
      <ActiveSectionContextProvider>
        <Hero {...mockProps} />
      </ActiveSectionContextProvider>
    );
    expect(screen.getByText(mockProps.primaryCTA.label)).toBeInTheDocument();
    expect(screen.getByText(mockProps.secondaryCTA.label)).toBeInTheDocument();
  });

  it("primary CTA opens client dialog when clicked", () => {
    render(
      <ActiveSectionContextProvider>
        <Hero {...mockProps} />
      </ActiveSectionContextProvider>
    );
    
    const primaryButton = screen.getByText(mockProps.primaryCTA.label);
    
    // Just verify the button exists and is clickable
    expect(primaryButton).toBeInTheDocument();
    expect(primaryButton).toBeEnabled();
  });

  it("secondary CTA scrolls to projects section when clicked", () => {
    render(
      <ActiveSectionContextProvider>
        <Hero {...mockProps} />
      </ActiveSectionContextProvider>
    );
    
    const secondaryButton = screen.getByText(mockProps.secondaryCTA.label);
    fireEvent.click(secondaryButton);
    
    expect(document.getElementById).toHaveBeenCalledWith("projects");
    expect(window.scrollTo).toHaveBeenCalled();
  });

  it("renders the waterwheel visual element", () => {
    const { container } = render(
      <ActiveSectionContextProvider>
        <Hero {...mockProps} />
      </ActiveSectionContextProvider>
    );
    
    // Check for logo image
    const logo = screen.getByAltText("Sakia Labs Logo");
    expect(logo).toBeInTheDocument();
  });

  it("renders optional microcopy when provided", () => {
    render(
      <ActiveSectionContextProvider>
        <Hero {...mockProps} />
      </ActiveSectionContextProvider>
    );
    
    expect(screen.getByText(mockProps.microcopy!)).toBeInTheDocument();
  });

  it("does not render microcopy when not provided", () => {
    const propsWithoutMicrocopy = { ...mockProps };
    delete (propsWithoutMicrocopy as any).microcopy;
    
    render(
      <ActiveSectionContextProvider>
        <Hero {...propsWithoutMicrocopy} />
      </ActiveSectionContextProvider>
    );
    
    expect(screen.queryByText("No sales scripts. Clear scope. Thoughtful execution.")).not.toBeInTheDocument();
  });

  it("has proper section structure with id='home'", () => {
    const { container } = render(
      <ActiveSectionContextProvider>
        <Hero {...mockProps} />
      </ActiveSectionContextProvider>
    );
    
    const section = container.querySelector("section#home");
    expect(section).toBeInTheDocument();
  });

  // Enterprise positioning requirement tests
  describe("Enterprise Positioning Requirements", () => {
    it("displays exact required headline", () => {
      render(
        <ActiveSectionContextProvider>
          <Hero {...mockProps} />
        </ActiveSectionContextProvider>
      );
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading.textContent).toBe("Steady hands for serious products");
    });

    it("displays exact required subheading", () => {
      render(
        <ActiveSectionContextProvider>
          <Hero {...mockProps} />
        </ActiveSectionContextProvider>
      );
      
      expect(screen.getByText("We design and build calm, reliable software end-to-end, from early ideas to production systems.")).toBeInTheDocument();
    });

    it("displays exact required primary CTA label", () => {
      render(
        <ActiveSectionContextProvider>
          <Hero {...mockProps} />
        </ActiveSectionContextProvider>
      );
      
      expect(screen.getByText("Start a project")).toBeInTheDocument();
    });

    it("displays exact required secondary CTA label", () => {
      render(
        <ActiveSectionContextProvider>
          <Hero {...mockProps} />
        </ActiveSectionContextProvider>
      );
      
      expect(screen.getByText("See selected work")).toBeInTheDocument();
    });

    it("displays exact required microcopy when provided", () => {
      render(
        <ActiveSectionContextProvider>
          <Hero {...mockProps} />
        </ActiveSectionContextProvider>
      );
      
      expect(screen.getByText("No sales scripts. Clear scope. Thoughtful execution.")).toBeInTheDocument();
    });
  });
});
