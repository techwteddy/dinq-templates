import { render, screen } from "@testing-library/react";
import SkillsSlider from "@/components/SkillsSlider";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";

// Mock react-slick carousel
jest.mock("react-slick", () => {
  const Slider = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="slider">{children}</div>
  );
  Slider.displayName = "Slider";
  return Slider;
});

// Mock recharts (used by SkillsRadar, imported within SkillsSlider)
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

describe("SkillsSlider", () => {
  it("renders without crashing", () => {
    const { container } = renderWithProviders(<SkillsSlider />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders the Skills section heading", () => {
    renderWithProviders(<SkillsSlider />);
    expect(screen.getByText(/skills|habilidades/i)).toBeInTheDocument();
  });

  it("renders skill names in the carousel", () => {
    renderWithProviders(<SkillsSlider />);
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();
  });

  it("renders two slider instances", () => {
    renderWithProviders(<SkillsSlider />);
    expect(screen.getAllByTestId("slider").length).toBe(2);
  });

  it("renders the SkillsRadar chart", () => {
    renderWithProviders(<SkillsSlider />);
    expect(screen.getByTestId("radar-chart")).toBeInTheDocument();
  });
});
