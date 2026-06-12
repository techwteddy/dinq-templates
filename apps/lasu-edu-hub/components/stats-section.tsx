'use client';

import { useEffect, useRef, useState } from 'react';

export function StatsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const stats = [
    { number: 7500, suffix: '+', label: 'Active Students', color: 'cyan' },
    { number: 280, suffix: '+', label: 'Faculty Members', color: 'purple' },
    { number: 450, suffix: '+', label: 'Courses', color: 'gold' },
    { number: 95, suffix: '%', label: 'Graduation Rate', color: 'cyan' },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-28 bg-gradient-to-b from-[#0a0f1c] via-[#1a1f3a] to-[#0a0f1c] relative overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#9d00ff] opacity-5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#00f5ff] opacity-5 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 neon-text-gold animate-neon-glow">
            By The Numbers
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-[#ffd700] to-[#00f5ff] mx-auto" />
        </div>

        {/* Stats Grid with Holographic Rings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex justify-center">
              <div className="relative w-48 h-48">
                {/* Outer Ring Container */}
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 200 200"
                  style={{
                    filter: `drop-shadow(0 0 15px ${
                      stat.color === 'cyan' ? '#00f5ff' :
                      stat.color === 'purple' ? '#9d00ff' :
                      '#ffd700'
                    }40%)`,
                  }}
                >
                  {/* Outer Ring */}
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke={
                      stat.color === 'cyan' ? '#00f5ff' :
                      stat.color === 'purple' ? '#9d00ff' :
                      '#ffd700'
                    }
                    strokeWidth="1"
                    opacity="0.3"
                  />

                  {/* Animated Ring */}
                  <circle
                    cx="100"
                    cy="100"
                    r="85"
                    fill="none"
                    stroke={
                      stat.color === 'cyan' ? '#00f5ff' :
                      stat.color === 'purple' ? '#9d00ff' :
                      '#ffd700'
                    }
                    strokeWidth="2"
                    opacity={isVisible ? '0.7' : '0.2'}
                    className="transition-opacity duration-1000"
                    style={{
                      animation: isVisible
                        ? `pulse-ring 2s ease-out infinite`
                        : 'none',
                    }}
                  />

                  {/* Inner Circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="70"
                    fill={
                      stat.color === 'cyan' ? 'rgba(0, 245, 255, 0.05)' :
                      stat.color === 'purple' ? 'rgba(157, 0, 255, 0.05)' :
                      'rgba(255, 215, 0, 0.05)'
                    }
                    stroke={
                      stat.color === 'cyan' ? '#00f5ff' :
                      stat.color === 'purple' ? '#9d00ff' :
                      '#ffd700'
                    }
                    strokeWidth="0.5"
                    opacity="0.5"
                  />
                </svg>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <div className={`text-5xl font-bold mb-2 ${
                    stat.color === 'cyan' ? 'neon-text-cyan' :
                    stat.color === 'purple' ? 'neon-text-purple' :
                    'neon-text-gold'
                  } ${isVisible ? 'animate-cyber-pop' : ''}`}>
                    {isVisible ? stat.number : 0}
                    <span className="text-3xl">{stat.suffix}</span>
                  </div>
                  <p className="text-[#a0a6b8] text-xs uppercase tracking-widest font-semibold">
                    {stat.label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
