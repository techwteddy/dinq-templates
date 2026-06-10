import React from 'react';
import { render, screen } from '@testing-library/react';
import Differentiators from '../components/sections/differentiators';
import { differentiators } from '../lib/data';

// Mock the Differentiator component to simplify testing
jest.mock('../components/ui/differentiator', () => ({
  Differentiator: ({ title, description, supportingSignal, icon }: any) => (
    <div data-testid="differentiator">
      <h3>{title}</h3>
      <p>{description}</p>
      {supportingSignal && <span>{supportingSignal}</span>}
      {icon && <span role="img">{icon}</span>}
    </div>
  ),
}));

describe('Differentiators Section', () => {
  it('renders the section heading', () => {
    render(<Differentiators />);
    expect(screen.getByText('Why Sakia Labs')).toBeInTheDocument();
  });

  it('renders the section subheading', () => {
    render(<Differentiators />);
    expect(screen.getByText('What makes us different from other studios')).toBeInTheDocument();
  });

  it('renders all differentiators from data', () => {
    render(<Differentiators />);
    const differentiatorElements = screen.getAllByTestId('differentiator');
    expect(differentiatorElements).toHaveLength(differentiators.length);
  });

  it('renders each differentiator with correct title', () => {
    render(<Differentiators />);
    differentiators.forEach((diff) => {
      expect(screen.getByText(diff.title)).toBeInTheDocument();
    });
  });

  it('renders each differentiator with correct description', () => {
    render(<Differentiators />);
    differentiators.forEach((diff) => {
      expect(screen.getByText(diff.description)).toBeInTheDocument();
    });
  });

  it('renders each differentiator with supporting signal', () => {
    render(<Differentiators />);
    differentiators.forEach((diff) => {
      if (diff.supportingSignal) {
        expect(screen.getByText(diff.supportingSignal)).toBeInTheDocument();
      }
    });
  });

  it('renders each differentiator with icon', () => {
    render(<Differentiators />);
    differentiators.forEach((diff) => {
      if (diff.icon) {
        const icons = screen.getAllByRole('img');
        const hasIcon = icons.some(icon => icon.textContent === diff.icon);
        expect(hasIcon).toBe(true);
      }
    });
  });

  it('has the correct section id for navigation', () => {
    const { container } = render(<Differentiators />);
    const section = container.querySelector('section');
    expect(section).toHaveAttribute('id', 'studio');
  });

  it('applies responsive styling classes', () => {
    const { container } = render(<Differentiators />);
    const section = container.querySelector('section');
    
    // Check for scroll margin and spacing
    expect(section).toHaveClass('scroll-mt-20');
    expect(section).toHaveClass('mb-16');
    expect(section).toHaveClass('sm:mb-20');
    
    // Check for max width and centering
    expect(section).toHaveClass('max-w-7xl');
    expect(section).toHaveClass('mx-auto');
  });

  it('renders differentiators in a vertical stack layout', () => {
    const { container } = render(<Differentiators />);
    const differentiatorsList = container.querySelector('.space-y-6');
    expect(differentiatorsList).toBeInTheDocument();
  });

  it('renders all four differentiators as specified in requirements', () => {
    render(<Differentiators />);
    
    // Check for all four differentiators from the design document
    expect(screen.getByText('Open Source & Transparent')).toBeInTheDocument();
    expect(screen.getByText('Design-Led Development')).toBeInTheDocument();
    expect(screen.getByText('Mission-Driven Focus')).toBeInTheDocument();
    expect(screen.getByText('Full-Stack Capability')).toBeInTheDocument();
  });

  it('validates differentiator completeness - each has title and description', () => {
    render(<Differentiators />);
    
    // Property 6: Differentiator completeness
    // Each differentiator must include a title and explanation text (1-2 sentences)
    differentiators.forEach((diff) => {
      // Title should be present
      expect(screen.getByText(diff.title)).toBeInTheDocument();
      
      // Description should be present and not empty
      expect(screen.getByText(diff.description)).toBeInTheDocument();
      expect(diff.description.length).toBeGreaterThan(0);
      
      // Description should be 1-2 sentences (rough check: contains at least one period)
      expect(diff.description).toMatch(/\./);
    });
  });
});
