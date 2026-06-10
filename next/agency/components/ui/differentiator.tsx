import React from 'react';
import { clsx } from 'clsx';

export interface DifferentiatorProps {
  title: string;
  description: string;
  supportingSignal?: string;
  icon?: string;
  className?: string;
}

export const Differentiator: React.FC<DifferentiatorProps> = ({
  title,
  description,
  supportingSignal,
  icon,
  className,
}) => {
  return (
    <div
      className={clsx(
        'bg-dark-lighter rounded-md p-6 md:p-8',
        'flex flex-col md:flex-row gap-4 md:gap-6',
        'transition-all duration-200 ease-subtle',
        className
      )}
    >
      {/* Icon Section */}
      {icon && (
        <div className="flex-shrink-0">
          <span 
            className="text-4xl md:text-5xl" 
            role="img" 
            aria-label={title}
          >
            {icon}
          </span>
        </div>
      )}
      
      {/* Content Section */}
      <div className="flex-1">
        {/* Title */}
        <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-base md:text-lg text-gray-300 leading-relaxed mb-3">
          {description}
        </p>
        
        {/* Supporting Signal */}
        {supportingSignal && (
          <p className="text-sm text-text-muted leading-relaxed">
            {supportingSignal}
          </p>
        )}
      </div>
    </div>
  );
};
