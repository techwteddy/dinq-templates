import { render, screen } from "@testing-library/react";
import StatsCounter from "@/components/StatsCounter";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <ThemeProvider>
      <LanguageProvider>{ui}</LanguageProvider>
    </ThemeProvider>
  );
}

describe("StatsCounter", () => {
  it("renders without crashing", () => {
    const { container } = renderWithProviders(<StatsCounter />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders stat labels from translations", () => {
    renderWithProviders(<StatsCounter />);
    // These labels exist in both EN (default fallback) and PT
    expect(
      screen.getByText(/years of experience|anos de experiência/i)
    ).toBeInTheDocument();
  });

  it("renders multiple stat items", () => {
    const { container } = renderWithProviders(<StatsCounter />);
    // 4 stat items expected from translations
    const statItems = container.querySelectorAll(".flex.flex-col.items-center");
    expect(statItems.length).toBeGreaterThanOrEqual(4);
  });
});
