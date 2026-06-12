import { render, screen } from "@testing-library/react";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <ThemeProvider>
      <LanguageProvider>{ui}</LanguageProvider>
    </ThemeProvider>
  );
}

describe("Footer", () => {
  it("renders the author credit", () => {
    renderWithProviders(<Footer />);
    expect(screen.getByText("Fernando Ghiberti")).toBeInTheDocument();
  });

  it("does not show back-to-top button on initial render (no scroll)", () => {
    renderWithProviders(<Footer />);
    expect(screen.queryByLabelText("Back to top")).not.toBeInTheDocument();
  });
});
