import React from 'react';
import { render, screen } from '@testing-library/react';
import { Testimonial } from '@/components/ui/testimonial';

describe('Testimonial Component', () => {
  const mockTestimonial = {
    quote: "This is a great testimonial about the amazing work done.",
    clientName: "John Doe",
    clientRole: "CEO",
    clientCompany: "Tech Corp",
    metric: "50% increase in revenue"
  };

  it('renders the quote text', () => {
    render(<Testimonial {...mockTestimonial} />);
    expect(screen.getByText(mockTestimonial.quote)).toBeInTheDocument();
  });

  it('renders client name', () => {
    render(<Testimonial {...mockTestimonial} />);
    expect(screen.getByText(mockTestimonial.clientName)).toBeInTheDocument();
  });

  it('renders client role and company', () => {
    render(<Testimonial {...mockTestimonial} />);
    expect(screen.getByText(`${mockTestimonial.clientRole} at ${mockTestimonial.clientCompany}`)).toBeInTheDocument();
  });

  it('renders metric when provided', () => {
    render(<Testimonial {...mockTestimonial} />);
    expect(screen.getByText(mockTestimonial.metric!)).toBeInTheDocument();
  });

  it('does not render metric section when metric is not provided', () => {
    const testimonialWithoutMetric = {
      quote: "Great work!",
      clientName: "Jane Smith",
      clientRole: "CTO",
      clientCompany: "StartupCo"
    };
    
    const { container } = render(<Testimonial {...testimonialWithoutMetric} />);
    const metricElement = container.querySelector('.border-t');
    expect(metricElement).not.toBeInTheDocument();
  });

  it('renders with testimonial card variant', () => {
    const { container } = render(<Testimonial {...mockTestimonial} />);
    // The Card component should be rendered
    const card = container.firstChild;
    expect(card).toBeInTheDocument();
  });

  it('displays quote in italic style', () => {
    const { container } = render(<Testimonial {...mockTestimonial} />);
    const quoteElement = container.querySelector('blockquote p');
    expect(quoteElement).toHaveClass('italic');
  });
});
