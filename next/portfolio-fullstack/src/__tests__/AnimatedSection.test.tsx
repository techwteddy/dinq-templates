import { render, screen } from "@testing-library/react";
import AnimatedSection from "@/components/AnimatedSection";

// Passthrough mock for framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
  useReducedMotion: () => false,
}));

describe("AnimatedSection", () => {
  it("renders children", () => {
    render(
      <AnimatedSection>
        <p>Hello world</p>
      </AnimatedSection>
    );
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("renders with a custom className", () => {
    render(
      <AnimatedSection className="custom-class">
        <span>content</span>
      </AnimatedSection>
    );
    expect(screen.getByText("content")).toBeInTheDocument();
  });

  it("renders with all supported variants without crashing", () => {
    const variants = ["fadeUp", "stagger", "launch", "reveal", "flip"] as const;
    variants.forEach((variant) => {
      const { unmount } = render(
        <AnimatedSection variant={variant}>
          <span>{variant}</span>
        </AnimatedSection>
      );
      expect(screen.getByText(variant)).toBeInTheDocument();
      unmount();
    });
  });

  it("renders a plain div when reduced motion is preferred", () => {
    jest.resetModules();
    jest.doMock("framer-motion", () => ({
      motion: {
        div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
          <div {...props}>{children}</div>
        ),
      },
      useReducedMotion: () => true,
    }));
    render(
      <AnimatedSection>
        <span>reduced-motion-content</span>
      </AnimatedSection>
    );
    expect(screen.getByText("reduced-motion-content")).toBeInTheDocument();
  });
});
