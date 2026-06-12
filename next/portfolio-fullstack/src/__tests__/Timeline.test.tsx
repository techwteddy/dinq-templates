import { render, screen, fireEvent } from "@testing-library/react";
import Timeline from "@/components/Timeline";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <ThemeProvider>
      <LanguageProvider>{ui}</LanguageProvider>
    </ThemeProvider>
  );
}

describe("Timeline", () => {
  it("renders the section heading", () => {
    renderWithProviders(<Timeline />);
    expect(screen.getByText(/Experiência & Formação|Experience & Education/i)).toBeInTheDocument();
  });

  it("renders professional experience entries", () => {
    renderWithProviders(<Timeline />);
    expect(screen.getAllByText("+A Educação").length).toBeGreaterThan(0);
    expect(screen.getAllByText("EBANX").length).toBeGreaterThan(0);
  });

  it("renders education entries", () => {
    renderWithProviders(<Timeline />);
    expect(screen.getAllByText(/UNICAMP/i).length).toBeGreaterThan(0);
  });

  it("opens modal with details when a timeline item is clicked", () => {
    renderWithProviders(<Timeline />);
    fireEvent.click(screen.getAllByText(/Ver mais|View more/i)[0]);
    expect(screen.getByRole("button", { name: /✕/ })).toBeInTheDocument();
  });

  it("closes the modal when the close button is clicked", () => {
    renderWithProviders(<Timeline />);
    fireEvent.click(screen.getAllByText(/Ver mais|View more/i)[0]);
    fireEvent.click(screen.getByRole("button", { name: /✕/ }));
    expect(screen.queryByRole("button", { name: /✕/ })).not.toBeInTheDocument();
  });
});
