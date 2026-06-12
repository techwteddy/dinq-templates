import { render, screen } from "@testing-library/react";
import SkipLink from "@/components/SkipLink";

describe("SkipLink", () => {
  it("renders the skip link", () => {
    render(<SkipLink />);
    expect(screen.getByText("Skip to main content")).toBeInTheDocument();
  });

  it("points to the hero section", () => {
    render(<SkipLink />);
    const link = screen.getByText("Skip to main content");
    expect(link).toHaveAttribute("href", "#hero");
  });
});
