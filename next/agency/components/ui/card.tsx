import React from 'react';
import { clsx } from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'service' | 'project' | 'package' | 'testimonial' | 'default';
  hoverable?: boolean;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  hoverable = false,
  children,
  className,
  ...props
}) => {
  const baseStyles = 'bg-dark-card rounded-md shadow-md transition-all duration-200 ease-subtle';
  
  const variantStyles = {
    service: 'p-6 md:p-8 flex flex-col h-full',
    project: 'p-6 md:p-8 flex flex-col h-full',
    package: 'p-6 md:p-8 flex flex-col h-full border-2 border-transparent',
    testimonial: 'p-6 md:p-8',
    default: 'p-6 md:p-8',
  };
  
  const hoverStyles = hoverable
    ? 'hover:shadow-lg hover:scale-[1.02] cursor-pointer'
    : '';
  
  const packageHoverStyles = variant === 'package' && hoverable
    ? 'hover:border-accent-primary'
    : '';
  
  const cardClasses = clsx(
    baseStyles,
    variantStyles[variant],
    hoverStyles,
    packageHoverStyles,
    className
  );
  
  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};
