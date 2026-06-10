import React from 'react';
import { render, screen } from '@testing-library/react';
import { Differentiator, DifferentiatorProps } from '../components/ui/differentiator';

describe('Differentiator Component', () => {
  const defaultProps: DifferentiatorProps = {
    title: 'Open Source & Transparent',
    description: 'We build in public and contribute to the open source community. All our portfolio projects are open source, and we believe in transparent, collaborative development.',
    supportingSignal: '50+ public repositories, 1000+ commits, active community contributions',
    icon: '🔓',
  };

  it('renders the title correctly', () => {
    render(<Differentiator {...defaultProps} />);
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
  });

  it('renders the description correctly', () => {
    render(<Differentiator {...defaultProps} />);
    expect(screen.getByText(defaultProps.description)).toBeInTheDocument();
  });

  it('renders the supporting signal when provided', () => {
    render(<Differentiator {...defaultProps} />);
    expect(screen.getByText(defaultProps.supportingSignal!)).toBeInTheDocument();
  });

  it('does not render supporting signal when not provided', () => {
    const propsWithoutSignal = { ...defaultProps, supportingSignal: undefined };
    const { container } = render(<Differentiator {...propsWithoutSignal} />);
    const supportingSignalElement = container.querySelector('.text-text-muted');
    expect(supportingSignalElement).not.toBeInTheDocument();
  });

  it('renders the icon when provided', () => {
    render(<Differentiator {...defaultProps} />);
    const iconElement = screen.getByRole('img', { name: defaultProps.title });
    expect(iconElement).toBeInTheDocument();
    expect(iconElement).toHaveTextContent(defaultProps.icon!);
  });

  it('does not render icon section when icon is not provided', () => {
    const propsWithoutIcon = { ...defaultProps, icon: undefined };
    const { container } = render(<Differentiator {...propsWithoutIcon} />);
    const iconElement = container.querySelector('[role="img"]');
    expect(iconElement).not.toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-test-class';
    const { container } = render(<Differentiator {...defaultProps} className={customClass} />);
    const rootElement = container.firstChild as HTMLElement;
    expect(rootElement).toHaveClass(customClass);
  });

  it('has proper styling classes for layout', () => {
    const { container } = render(<Differentiator {...defaultProps} />);
    const rootElement = container.firstChild as HTMLElement;
    
    // Check for background and padding
    expect(rootElement).toHaveClass('bg-dark-lighter');
    expect(rootElement).toHaveClass('rounded-md');
    expect(rootElement).toHaveClass('p-6');
    expect(rootElement).toHaveClass('md:p-8');
    
    // Check for flex layout
    expect(rootElement).toHaveClass('flex');
    expect(rootElement).toHaveClass('flex-col');
    expect(rootElement).toHaveClass('md:flex-row');
  });

  it('renders all required elements for a complete differentiator', () => {
    render(<Differentiator {...defaultProps} />);
    
    // Title should be an h3
    const titleElement = screen.getByRole('heading', { level: 3, name: defaultProps.title });
    expect(titleElement).toBeInTheDocument();
    
    // Description should be present
    expect(screen.getByText(defaultProps.description)).toBeInTheDocument();
    
    // Supporting signal should be present
    expect(screen.getByText(defaultProps.supportingSignal!)).toBeInTheDocument();
    
    // Icon should be present
    expect(screen.getByRole('img', { name: defaultProps.title })).toBeInTheDocument();
  });

  it('maintains proper text hierarchy with appropriate font sizes', () => {
    const { container } = render(<Differentiator {...defaultProps} />);
    
    // Title should have larger text
    const titleElement = screen.getByRole('heading', { level: 3 });
    expect(titleElement).toHaveClass('text-xl');
    expect(titleElement).toHaveClass('md:text-2xl');
    
    // Description should have base text size
    const descriptionElement = screen.getByText(defaultProps.description);
    expect(descriptionElement).toHaveClass('text-base');
    expect(descriptionElement).toHaveClass('md:text-lg');
    
    // Supporting signal should have smaller text
    const signalElement = screen.getByText(defaultProps.supportingSignal!);
    expect(signalElement).toHaveClass('text-sm');
  });

  it('uses appropriate text colors for different elements', () => {
    render(<Differentiator {...defaultProps} />);
    
    // Title should be white
    const titleElement = screen.getByRole('heading', { level: 3 });
    expect(titleElement).toHaveClass('text-white');
    
    // Description should be gray-300
    const descriptionElement = screen.getByText(defaultProps.description);
    expect(descriptionElement).toHaveClass('text-gray-300');
    
    // Supporting signal should be muted
    const signalElement = screen.getByText(defaultProps.supportingSignal!);
    expect(signalElement).toHaveClass('text-text-muted');
  });
});
