import { render, screen } from "@testing-library/react";
import Hero from "@/components/Hero";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";

jest.mock("typewriter-effect", () => {
  const Typewriter = () => <span data-testid="typewriter" />;
  Typewriter.displayName = "Typewriter";
  return Typewriter;
});

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <ThemeProvider>
      <LanguageProvider>{ui}</LanguageProvider>
    </ThemeProvider>
  );
}

describe("Hero", () => {
  it("renders Fernando Ghiberti's name", () => {
    renderWithProviders(<Hero />);
    expect(screen.getByText(/Fernando Ghiberti/i)).toBeInTheDocument();
  });

  it("renders the role subtitle", () => {
    renderWithProviders(<Hero />);
    // role text exists in both EN and PT
    expect(screen.getByText(/Engenheiro de Software|Software Engineer/i)).toBeInTheDocument();
  });

  it("renders GitHub social link", () => {
    renderWithProviders(<Hero />);
    expect(screen.getByLabelText("GitHub Profile")).toBeInTheDocument();
  });

  it("renders LinkedIn social link", () => {
    renderWithProviders(<Hero />);
    expect(screen.getByLabelText("LinkedIn Profile")).toBeInTheDocument();
  });

  it("renders CV download button", () => {
    renderWithProviders(<Hero />);
    // label is "Download CV" (EN) or "Baixar CV" (PT)
    expect(screen.getByText(/Download CV|Baixar CV/i)).toBeInTheDocument();
  });

  it("CV download link points to the correct PDF", () => {
    renderWithProviders(<Hero />);
    const link = screen.getByText(/Download CV|Baixar CV/i).closest("a");
    expect(link).toHaveAttribute("href", "/fernando-ghiberti-cv-en.pdf");
  });
});
