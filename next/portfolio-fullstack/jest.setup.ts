import "@testing-library/jest-dom";

// Guard: these browser APIs are only available in jsdom (not in node env used by API tests)
if (typeof window !== "undefined") {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();

  const mockIntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
  Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    value: mockIntersectionObserver,
  });

  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }),
  });
}
