import { render, screen, fireEvent } from "@testing-library/react";
import TerminalIntro from "@/components/TerminalIntro";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";

function renderWithProviders(
  ui: React.ReactElement
) {
  return render(
    <ThemeProvider>
      <LanguageProvider>{ui}</LanguageProvider>
    </ThemeProvider>
  );
}

describe("TerminalIntro", () => {
  it("renders without crashing", () => {
    const onDone = jest.fn();
    const { container } = renderWithProviders(
      <TerminalIntro onDone={onDone} />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders the skip button", () => {
    const onDone = jest.fn();
    renderWithProviders(<TerminalIntro onDone={onDone} />);
    expect(screen.getByText(/skip|pular/i)).toBeInTheDocument();
  });

  it("calls onDone when skip button is clicked", () => {
    const onDone = jest.fn();
    renderWithProviders(<TerminalIntro onDone={onDone} />);
    fireEvent.click(screen.getByText(/skip|pular/i));
    expect(onDone).toHaveBeenCalled();
  });

  it("applies opacity 0 when exiting prop is true", () => {
    const onDone = jest.fn();
    const { container } = renderWithProviders(
      <TerminalIntro onDone={onDone} exiting={true} />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.opacity).toBe("0");
  });

  it("applies opacity 1 when not exiting", () => {
    const onDone = jest.fn();
    const { container } = renderWithProviders(
      <TerminalIntro onDone={onDone} exiting={false} />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.opacity).toBe("1");
  });
});
