import React from 'react';
import { render, screen } from '@testing-library/react';
import Testimonials from '@/components/sections/testimonials';
import { testimonials } from '@/lib/data';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock the useSectionInView hook
jest.mock('@/lib/hooks', () => ({
  useSectionInView: jest.fn(() => ({ ref: { current: null } })),
}));

describe('Testimonials Section', () => {
  it('renders the section heading', () => {
    render(<Testimonials />);
    expect(screen.getByText('What Clients Say')).toBeInTheDocument();
  });

  it('renders the section description', () => {
    render(<Testimonials />);
    expect(screen.getByText('Real results from real clients who trusted us with their vision')).toBeInTheDocument();
  });

  it('renders all testimonials from the data', () => {
    render(<Testimonials />);
    
    testimonials.forEach((testimonial) => {
      expect(screen.getByText(testimonial.quote)).toBeInTheDocument();
      expect(screen.getByText(testimonial.clientName)).toBeInTheDocument();
    });
  });

  it('renders the correct number of testimonials', () => {
    render(<Testimonials />);
    
    // Check that all 3 testimonials are rendered
    expect(screen.getByText('Sarah Chen')).toBeInTheDocument();
    expect(screen.getByText('Marcus Johnson')).toBeInTheDocument();
    expect(screen.getByText('Priya Patel')).toBeInTheDocument();
  });

  it('renders testimonials in a grid layout', () => {
    const { container } = render(<Testimonials />);
    const grid = container.querySelector('.grid');
    
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveClass('grid-cols-1');
    expect(grid).toHaveClass('md:grid-cols-2');
    expect(grid).toHaveClass('lg:grid-cols-3');
  });

  it('has proper section structure with id="testimonials"', () => {
    const { container } = render(<Testimonials />);
    const section = container.querySelector('section#testimonials');
    
    expect(section).toBeInTheDocument();
  });

  it('renders all testimonial metrics', () => {
    render(<Testimonials />);
    
    testimonials.forEach((testimonial) => {
      if (testimonial.metric) {
        expect(screen.getByText(testimonial.metric)).toBeInTheDocument();
      }
    });
  });

  it('renders client roles and companies', () => {
    render(<Testimonials />);
    
    expect(screen.getByText(/Founder/)).toBeInTheDocument();
    expect(screen.getByText(/LocalHarvest Co-op/)).toBeInTheDocument();
    expect(screen.getByText(/Executive Director/)).toBeInTheDocument();
    expect(screen.getByText(/Community Food Alliance/)).toBeInTheDocument();
    expect(screen.getByText(/CEO/)).toBeInTheDocument();
    expect(screen.getByText(/FinWell/)).toBeInTheDocument();
  });
});
