'use client';

import { ReactNode } from 'react';

interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

interface BentoGridItemProps {
  children: ReactNode;
  className?: string;
  span?: 'full' | 'half' | 'third';
  highlight?: boolean;
}

export function BentoGrid({ children, className = '' }: BentoGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-max ${className}`}>
      {children}
    </div>
  );
}

export function BentoGridItem({
  children,
  className = '',
  span = 'third',
  highlight = false,
}: BentoGridItemProps) {
  const spanClasses = {
    full: 'md:col-span-3 lg:col-span-4',
    half: 'md:col-span-2 lg:col-span-2',
    third: 'md:col-span-1 lg:col-span-1',
  };

  return (
    <div
      className={`
        glass-card rounded-3xl p-8 transition-all duration-500
        hover:shadow-2xl hover:-translate-y-3
        ${spanClasses[span]}
        ${highlight ? 'ring-2 ring-accent animate-glow-pulse' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// Feature card component
interface FeatureCardProps {
  icon?: ReactNode;
  title: string;
  description: string;
  gradient?: boolean;
}

export function FeatureCard({ icon, title, description, gradient = false }: FeatureCardProps) {
  return (
    <div className={`
      glass-card rounded-2xl p-6 transition-all duration-300
      hover:shadow-xl hover:scale-105
      ${gradient ? 'bg-gradient-to-br from-accent/10 to-secondary/10' : ''}
    `}>
      {icon && <div className="mb-4 text-4xl">{icon}</div>}
      <h3 className="text-xl font-bold mb-2 text-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
