import React from 'react';
import { render, screen } from '@testing-library/react';
import { PackageCard } from '@/components/ui/package-card';

describe('PackageCard', () => {
  const mockPackageData = {
    name: 'Launch',
    idealFor: 'Startups and founders validating a new product idea',
    scopeExamples: [
      'MVP development (4-8 weeks)',
      'Landing page and brand identity',
      'User research and prototype',
    ],
    timeline: '4-12 weeks',
    collaborationStyle: 'Weekly check-ins, async communication, rapid iteration',
    cta: {
      label: 'Start a project',
      href: '#contact',
    },
  };

  it('renders the package name', () => {
    render(<PackageCard {...mockPackageData} />);
    expect(screen.getByText('Launch')).toBeInTheDocument();
  });

  it('renders the ideal client profile', () => {
    render(<PackageCard {...mockPackageData} />);
    expect(screen.getByText('Startups and founders validating a new product idea')).toBeInTheDocument();
  });

  it('renders all scope examples', () => {
    render(<PackageCard {...mockPackageData} />);
    expect(screen.getByText('MVP development (4-8 weeks)')).toBeInTheDocument();
    expect(screen.getByText('Landing page and brand identity')).toBeInTheDocument();
    expect(screen.getByText('User research and prototype')).toBeInTheDocument();
  });

  it('renders the timeline', () => {
    render(<PackageCard {...mockPackageData} />);
    expect(screen.getByText('4-12 weeks')).toBeInTheDocument();
  });

  it('renders the collaboration style', () => {
    render(<PackageCard {...mockPackageData} />);
    expect(screen.getByText('Weekly check-ins, async communication, rapid iteration')).toBeInTheDocument();
  });

  it('renders the CTA button with correct label', () => {
    render(<PackageCard {...mockPackageData} />);
    const ctaButton = screen.getByRole('link', { name: 'Start a project' });
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton).toHaveAttribute('href', '#contact');
  });

  it('renders all required section headings', () => {
    render(<PackageCard {...mockPackageData} />);
    expect(screen.getByText('Ideal For')).toBeInTheDocument();
    expect(screen.getByText('Scope Examples')).toBeInTheDocument();
    expect(screen.getByText('Timeline')).toBeInTheDocument();
    expect(screen.getByText('Collaboration')).toBeInTheDocument();
  });

  it('applies the package card variant styling', () => {
    const { container } = render(<PackageCard {...mockPackageData} />);
    const card = container.firstChild;
    expect(card).toHaveClass('p-6', 'md:p-8', 'flex', 'flex-col', 'h-full');
  });
});
