import { render, screen, fireEvent } from "@testing-library/react";
import ProjectsGrid from "@/components/ProjectsGrid";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <ThemeProvider>
      <LanguageProvider>{ui}</LanguageProvider>
    </ThemeProvider>
  );
}

describe("ProjectsGrid", () => {
  it("renders the Projects section heading", () => {
    renderWithProviders(<ProjectsGrid />);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("renders the 'All' filter button", () => {
    renderWithProviders(<ProjectsGrid />);
    // first button is "All Projects" / "Todos os Projetos"
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("renders exactly 6 projects initially", () => {
    renderWithProviders(<ProjectsGrid />);
    // Match lowercase "ver mais" or "view more" (card links) but not "Ver Mais" button
    const cardLinks = screen.getAllByText(/^(ver mais|view more)$/i).filter(
      (el) => el.tagName.toLowerCase() !== "button"
    );
    expect(cardLinks).toHaveLength(6);
  });

  it("shows more projects when show-more button is clicked", () => {
    renderWithProviders(<ProjectsGrid />);
    const showMoreBtn = screen.getByRole("button", { name: /ver mais|show more/i });
    fireEvent.click(showMoreBtn);
    expect(screen.getAllByText(/ver mais|view more/i).length).toBeGreaterThan(6);
  });

  it("filters projects by tag", () => {
    renderWithProviders(<ProjectsGrid />);
    const nextjsButton = screen.getByRole("button", { name: "Next.js" });
    fireEvent.click(nextjsButton);
    const cards = screen.getAllByText(/ver mais|view more/i);
    expect(cards.length).toBeGreaterThan(0);
    expect(cards.length).toBeLessThan(12);
  });

  it("opens a modal when a project card is clicked", () => {
    renderWithProviders(<ProjectsGrid />);
    fireEvent.click(screen.getAllByText(/ver mais|view more/i)[0]);
    expect(screen.getByRole("button", { name: /✕/ })).toBeInTheDocument();
  });

  it("closes the modal when the close button is clicked", () => {
    renderWithProviders(<ProjectsGrid />);
    fireEvent.click(screen.getAllByText(/ver mais|view more/i)[0]);
    fireEvent.click(screen.getByRole("button", { name: /✕/ }));
    expect(screen.queryByRole("button", { name: /✕/ })).not.toBeInTheDocument();
  });
});
