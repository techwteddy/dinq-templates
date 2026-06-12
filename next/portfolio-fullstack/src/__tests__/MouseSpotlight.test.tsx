import { render } from "@testing-library/react";
import MouseSpotlight from "@/components/MouseSpotlight";

describe("MouseSpotlight", () => {
  it("renders without crashing", () => {
    const { container } = render(<MouseSpotlight />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders an aria-hidden overlay element", () => {
    const { container } = render(<MouseSpotlight />);
    const el = container.firstChild as HTMLElement;
    expect(el.getAttribute("aria-hidden")).toBe("true");
  });

  it("does not throw when unmounted", () => {
    const { unmount } = render(<MouseSpotlight />);
    expect(() => unmount()).not.toThrow();
  });
});
