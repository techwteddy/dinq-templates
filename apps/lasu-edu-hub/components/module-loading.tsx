'use client';

import { useState, useEffect } from 'react';

interface ModuleLoadingProps {
  moduleType: 'resources' | 'news' | 'academics';
}

const moduleMessages = {
  resources: [
    'Gathering learning materials...',
    'Organizing course resources...',
    'Loading documents and media...',
  ],
  news: [
    'Fetching latest updates...',
    'Loading announcements...',
    'Preparing news feeds...',
  ],
  academics: [
    'Loading course catalog...',
    'Organizing departments...',
    'Preparing curriculum...',
  ],
};

export function ModuleLoading({ moduleType }: ModuleLoadingProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = moduleMessages[moduleType];
  const messageCount = messages.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messageCount);
    }, 2000);
    return () => clearInterval(interval);
  }, [messageCount]);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <style>{`
        @keyframes bounce-3d-small {
          0%, 100% { 
            transform: translateY(0) scale(1);
          }
          50% { 
            transform: translateY(-30px) scale(1.05);
          }
        }
        @keyframes rotate-360 {
          0% { transform: rotateX(0) rotateY(0) rotateZ(0); }
          100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 0 0 15px rgba(212, 165, 116, 0.6), 
                        inset 0 0 15px rgba(212, 165, 116, 0.3);
          }
          50% { 
            box-shadow: 0 0 30px rgba(212, 165, 116, 0.9), 
                        inset 0 0 20px rgba(212, 165, 116, 0.5);
          }
        }
        .mini-ball {
          animation: bounce-3d-small 1s ease-in-out infinite,
                     rotate-360 2s linear infinite,
                     pulse-glow 1.5s ease-in-out infinite;
        }
        @keyframes fade-in-text {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .fade-text {
          animation: fade-in-text 0.5s ease-in-out;
        }
      `}</style>

      {/* Mini Bouncing Ball */}
      <div className="mb-8">
        <div className="mini-ball w-16 h-16 rounded-full bg-gradient-to-br from-accent via-accent/80 to-accent/60 relative">
          <div className="absolute top-3 left-3 w-4 h-4 bg-white/30 rounded-full blur-sm" />
          <div className="absolute bottom-3 right-3 w-3 h-3 bg-white/20 rounded-full blur-xs" />
        </div>
      </div>

      {/* Module Type Badge */}
      <div className="mb-6">
        <span className="px-4 py-2 capitalize text-sm font-bold bg-primary text-primary-foreground rounded-full">
          Loading {moduleType}
        </span>
      </div>

      {/* Dynamic Status Message */}
      <div className="text-center mb-6 h-6">
        <p className="fade-text text-muted-foreground font-medium text-sm">
          {messages[messageIndex]}
        </p>
      </div>

      {/* Animated Dots */}
      <div className="flex gap-2">
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
      </div>
    </div>
  );
}
