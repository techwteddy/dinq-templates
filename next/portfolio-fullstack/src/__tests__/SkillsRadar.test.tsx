import { render, screen } from "@testing-library/react";
import SkillsRadar from "@/components/SkillsRadar";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";

jest.mock("recharts", () => ({
  RadarChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="radar-chart">{children}</div>
  ),
  Radar: () => null,
  PolarGrid: () => null,
  PolarAngleAxis: () => null,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Tooltip: () => null,
}));

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <ThemeProvider>
      <LanguageProvider>{ui}</LanguageProvider>
    </ThemeProvider>
  );
}

describe("SkillsRadar", () => {
  it("renders without crashing", () => {
    const { container } = renderWithProviders(<SkillsRadar />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders the radar chart section title", () => {
    renderWithProviders(<SkillsRadar />);
    expect(screen.getByText(/expertise areas|áreas de expertise/i)).toBeInTheDocument();
  });

  it("renders the recharts RadarChart", () => {
    renderWithProviders(<SkillsRadar />);
    expect(screen.getByTestId("radar-chart")).toBeInTheDocument();
  });
});
