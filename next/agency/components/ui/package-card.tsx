import React from 'react';
import { Card } from './card';
import { Button } from './button';

export interface PackageCardProps {
  name: string;
  idealFor: string;
  scopeExamples: readonly string[];
  timeline: string;
  collaborationStyle: string;
  cta: {
    label: string;
    href: string;
  };
}

export const PackageCard: React.FC<PackageCardProps> = ({
  name,
  idealFor,
  scopeExamples,
  timeline,
  collaborationStyle,
  cta,
}) => {
  return (
    <Card variant="package" hoverable className="flex flex-col justify-between">
      {/* Tier Name */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-4">{name}</h3>
        
        {/* Ideal For Section */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-accent-primary uppercase tracking-wide mb-2">
            Ideal For
          </h4>
          <p className="text-gray-300 text-base leading-relaxed">{idealFor}</p>
        </div>
        
        {/* Scope Examples Section */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-accent-primary uppercase tracking-wide mb-2">
            Scope Examples
          </h4>
          <ul className="space-y-2">
            {scopeExamples.map((example, index) => (
              <li key={index} className="flex items-start">
                <span className="text-accent-primary mr-2 mt-1 flex-shrink-0">•</span>
                <span className="text-gray-300 text-sm">{example}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Timeline Section */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-accent-primary uppercase tracking-wide mb-2">
            Timeline
          </h4>
          <p className="text-gray-300 text-base">{timeline}</p>
        </div>
        
        {/* Collaboration Style Section */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-accent-primary uppercase tracking-wide mb-2">
            Collaboration
          </h4>
          <p className="text-gray-300 text-sm leading-relaxed">{collaborationStyle}</p>
        </div>
      </div>
      
      {/* CTA Button at Bottom */}
      <div className="mt-auto pt-4">
        <Button 
          variant="primary" 
          size="medium" 
          href={cta.href}
          className="w-full"
        >
          {cta.label}
        </Button>
      </div>
    </Card>
  );
};
