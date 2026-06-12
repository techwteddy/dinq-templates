import { render } from "@testing-library/react";
import CustomCursor from "@/components/CustomCursor";

describe("CustomCursor", () => {
  it("renders nothing by default (no pointer device in jsdom)", () => {
    // jsdom matchMedia returns matches: false, so the cursor stays hidden
    const { container } = render(<CustomCursor />);
    expect(container.firstChild).toBeNull();
  });

  it("does not throw when mounted and unmounted", () => {
    const { unmount } = render(<CustomCursor />);
    expect(() => unmount()).not.toThrow();
  });
});
