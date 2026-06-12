import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "@/components/Navbar";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <ThemeProvider>
      <LanguageProvider>{ui}</LanguageProvider>
    </ThemeProvider>
  );
}

describe("Navbar", () => {
  it("renders the logo link", () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByText("Ghiberti.dev")).toBeInTheDocument();
  });

  it("renders all navigation links on desktop", () => {
    renderWithProviders(<Navbar />);
    const links = ["Home", "Skills", "Projects", "Timeline", "Contact"];
    links.forEach((name) => {
      expect(screen.getAllByText(name).length).toBeGreaterThan(0);
    });
  });

  it("toggles mobile menu when hamburger button is clicked", () => {
    renderWithProviders(<Navbar />);
    const toggleButton = screen.getByLabelText("Toggle menu");
    fireEvent.click(toggleButton);
    expect(screen.getAllByText("Home").length).toBeGreaterThan(1);
    fireEvent.click(toggleButton);
  });

  it("renders language toggle buttons", () => {
    renderWithProviders(<Navbar />);
    expect(screen.getAllByText("EN").length).toBeGreaterThan(0);
    expect(screen.getAllByText("PT").length).toBeGreaterThan(0);
  });

  it("renders theme toggle button", () => {
    renderWithProviders(<Navbar />);
    expect(screen.getAllByLabelText(/switch to/i).length).toBeGreaterThan(0);
  });
});
