import React from 'react';
import { Card } from './card';

export interface TestimonialProps {
  quote: string;
  clientName: string;
  clientRole: string;
  clientCompany: string;
  metric?: string;
}

export const Testimonial: React.FC<TestimonialProps> = ({
  quote,
  clientName,
  clientRole,
  clientCompany,
  metric,
}) => {
  return (
    <Card variant="testimonial" className="flex flex-col h-full">
      {/* Quote Section - Larger text with subtle styling */}
      <div className="mb-6 flex-1">
        <blockquote className="relative">
          {/* Opening quote mark */}
          <span 
            className="absolute -top-2 -left-1 text-4xl text-accent-primary opacity-30 font-serif"
            aria-hidden="true"
          >
            "
          </span>
          
          {/* Quote text */}
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed italic pl-6">
            {quote}
          </p>
        </blockquote>
      </div>
      
      {/* Client Info Section */}
      <div className="mt-auto">
        <div className="flex flex-col gap-1 mb-3">
          <p className="text-base font-bold text-white">
            {clientName}
          </p>
          <p className="text-sm text-gray-400">
            {clientRole} at {clientCompany}
          </p>
        </div>
        
        {/* Optional Metric - Prominently displayed */}
        {metric && (
          <div className="pt-3 border-t border-gray-700">
            <p className="text-sm font-semibold text-accent-primary">
              {metric}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
