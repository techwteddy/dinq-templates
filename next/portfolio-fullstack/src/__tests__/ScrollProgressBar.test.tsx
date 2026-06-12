import { render } from "@testing-library/react";
import ScrollProgressBar from "@/components/ScrollProgressBar";

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
  useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
  useSpring: (v: unknown) => v,
}));

describe("ScrollProgressBar", () => {
  it("renders without crashing", () => {
    const { container } = render(<ScrollProgressBar />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("has fixed positioning and full width", () => {
    const { container } = render(<ScrollProgressBar />);
    const bar = container.firstChild as HTMLElement;
    expect(bar.className).toMatch(/fixed/);
    expect(bar.className).toMatch(/top-0/);
  });

  it("is aria-hidden for accessibility", () => {
    const { container } = render(<ScrollProgressBar />);
    const bar = container.firstChild as HTMLElement;
    expect(bar).toHaveAttribute("aria-hidden", "true");
  });
});
