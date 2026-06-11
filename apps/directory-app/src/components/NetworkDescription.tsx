"use client";

import { useState } from "react";

interface NetworkDescriptionProps {
  networkName: string;
  network: any;
  showReadMore?: boolean; // New prop to control Read More functionality
}

export default function NetworkDescription({ networkName, network, showReadMore = false }: NetworkDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Use the actual network description from the JSON data
  const description = network.description || 'No description available.';

  // For listing pages (showReadMore = false), show only first 2 lines
  if (!showReadMore) {
    return (
      <div className="mb-6">
        <div className="text-gray-700 leading-relaxed line-clamp-2">
          {description}
        </div>
      </div>
    );
  }

  // For dedicated network pages (showReadMore = true), show Read More functionality
  return (
    <div className="mb-6">
      <div className={`text-gray-700 leading-relaxed ${!isExpanded ? 'line-clamp-2' : ''}`}>
        {description}
      </div>
      
      {/* Read More/Less Button - only show if description is long enough */}
      {description.length > 100 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-2 mt-3 text-[#bfa14a] hover:text-[#e6c77c] font-medium transition-colors duration-200"
        >
          {isExpanded ? (
            <>
              <span>Read Less</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </>
          ) : (
            <>
              <span>Read More</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </>
          )}
        </button>
      )}
    </div>
  );
} 