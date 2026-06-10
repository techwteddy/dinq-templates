import React from 'react';
import { render, screen } from '@testing-library/react';
import Packages from '@/components/sections/packages';
import { engagementTiers } from '@/lib/data';

describe('Packages Section', () => {
  it('renders the section heading', () => {
    render(<Packages />);
    expect(screen.getByText('How We Work Together')).toBeInTheDocument();
  });

  it('renders the section description', () => {
    render(<Packages />);
    expect(screen.getByText('Choose the engagement model that fits your needs and goals')).toBeInTheDocument();
  });

  it('renders all three engagement tiers', () => {
    render(<Packages />);
    
    // Check that all tier names are rendered
    expect(screen.getByText('Launch')).toBeInTheDocument();
    expect(screen.getByText('Scale')).toBeInTheDocument();
    expect(screen.getByText('Partner')).toBeInTheDocument();
  });

  it('renders PackageCard components with correct data', () => {
    render(<Packages />);
    
    // Verify Launch tier data
    expect(screen.getByText('Startups and founders validating a new product idea')).toBeInTheDocument();
    expect(screen.getByText('MVP development (4-8 weeks)')).toBeInTheDocument();
    expect(screen.getByText('4-12 weeks')).toBeInTheDocument();
    
    // Verify Scale tier data
    expect(screen.getByText('Growing companies expanding their product capabilities')).toBeInTheDocument();
    expect(screen.getByText('Feature development and optimization')).toBeInTheDocument();
    expect(screen.getByText('3-6 months')).toBeInTheDocument();
    
    // Verify Partner tier data
    expect(screen.getByText('Organizations seeking ongoing product development support')).toBeInTheDocument();
    expect(screen.getByText('Continuous product development')).toBeInTheDocument();
    expect(screen.getByText('6+ months')).toBeInTheDocument();
  });

  it('renders CTA buttons for all tiers', () => {
    render(<Packages />);
    
    expect(screen.getByRole('link', { name: 'Start a project' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Discuss your needs' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Explore partnership' })).toBeInTheDocument();
  });

  it('uses the correct number of engagement tiers from data', () => {
    render(<Packages />);
    
    // Should render exactly 3 tiers
    const tierNames = engagementTiers.map(tier => tier.name);
    tierNames.forEach(name => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
    
    expect(engagementTiers).toHaveLength(3);
  });

  it('applies responsive grid layout classes', () => {
    const { container } = render(<Packages />);
    const gridContainer = container.querySelector('.grid');
    
    expect(gridContainer).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
  });
});
