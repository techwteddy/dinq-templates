'use client';

import { useState } from 'react';

export function HexagonalDepartments() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const departments = [
    {
      id: 'bio',
      name: 'Biology Education',
      icon: '🧬',
      color: 'cyan',
      description: 'Advanced biological sciences and educational methodologies',
      stats: '45 Faculty | 380 Students',
    },
    {
      id: 'chem',
      name: 'Chemistry',
      icon: '⚗️',
      color: 'purple',
      description: 'Organic, inorganic, and analytical chemistry programs',
      stats: '38 Faculty | 320 Students',
    },
    {
      id: 'cs',
      name: 'Computer Science',
      icon: '💻',
      color: 'gold',
      description: 'AI, cybersecurity, and software development',
      stats: '52 Faculty | 420 Students',
    },
    {
      id: 'et',
      name: 'Educational Technology',
      icon: '🎓',
      color: 'cyan',
      description: 'Digital learning platforms and tech integration',
      stats: '28 Faculty | 250 Students',
    },
    {
      id: 'math',
      name: 'Mathematics',
      icon: '∑',
      color: 'purple',
      description: 'Pure and applied mathematics education',
      stats: '42 Faculty | 350 Students',
    },
    {
      id: 'physics',
      name: 'Physics Education',
      icon: '⚛️',
      color: 'gold',
      description: 'Theoretical and experimental physics',
      stats: '35 Faculty | 300 Students',
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-[#1a1f3a] to-[#0a0f1c] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#00f5ff] opacity-3 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-[#9d00ff] opacity-3 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 neon-text-purple animate-neon-glow">
            Academic Departments
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-[#9d00ff] to-[#ffd700] mx-auto mb-6" />
          <p className="text-[#a0a6b8] text-lg max-w-2xl mx-auto">
            Explore our six cutting-edge departments driving excellence in science and technology education
          </p>
        </div>

        {/* Hexagonal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {departments.map((dept) => (
            <div key={dept.id} className="flex justify-center">
              <button
                onClick={() => setActiveModal(dept.id)}
                className="group relative w-full max-w-sm"
              >
                {/* Hexagon Container */}
                <div className="relative aspect-square cyber-pop">
                  {/* SVG Hexagon */}
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 200 230"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <defs>
                      <filter id={`glow-${dept.id}`}>
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Hexagon Shape */}
                    <polygon
                      points="100,20 180,70 180,170 100,220 20,170 20,70"
                      fill="rgba(10, 15, 28, 0.6)"
                      stroke={
                        dept.color === 'cyan' ? '#00f5ff' :
                        dept.color === 'purple' ? '#9d00ff' :
                        '#ffd700'
                      }
                      strokeWidth="2"
                      filter={`url(#glow-${dept.id})`}
                      className="transition-all duration-300 group-hover:opacity-80"
                      style={{
                        filter: `drop-shadow(0 0 10px ${
                          dept.color === 'cyan' ? '#00f5ff' :
                          dept.color === 'purple' ? '#9d00ff' :
                          '#ffd700'
                        }20%)`,
                      }}
                    />

                    {/* Inner glow on hover */}
                    <polygon
                      points="100,20 180,70 180,170 100,220 20,170 20,70"
                      fill="none"
                      stroke={
                        dept.color === 'cyan' ? '#00f5ff' :
                        dept.color === 'purple' ? '#9d00ff' :
                        '#ffd700'
                      }
                      strokeWidth="1"
                      opacity="0"
                      className="group-hover:opacity-50 transition-opacity duration-300 animate-neon-pulse"
                    />
                  </svg>

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <div className="text-5xl mb-3 animate-float group-hover:animate-spin">
                      {dept.icon}
                    </div>
                    <h3 className={`font-bold text-sm uppercase tracking-wider ${
                      dept.color === 'cyan' ? 'text-[#00f5ff]' :
                      dept.color === 'purple' ? 'text-[#9d00ff]' :
                      'text-[#ffd700]'
                    }`}>
                      {dept.name}
                    </h3>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 3D Portal Modal */}
      {activeModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="glass-cyber rounded-2xl max-w-2xl w-full p-8 max-h-96 overflow-y-auto relative border border-[#00f5ff]/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-2xl text-[#00f5ff] hover:text-[#9d00ff] transition-colors"
            >
              ✕
            </button>

            {/* Modal Content */}
            {departments
              .filter((d) => d.id === activeModal)
              .map((dept) => (
                <div key={dept.id} className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-5xl">{dept.icon}</span>
                    <div>
                      <h2 className={`text-3xl font-bold ${
                        dept.color === 'cyan' ? 'text-[#00f5ff]' :
                        dept.color === 'purple' ? 'text-[#9d00ff]' :
                        'text-[#ffd700]'
                      }`}>
                        {dept.name}
                      </h2>
                      <p className="text-[#a0a6b8] text-sm">{dept.stats}</p>
                    </div>
                  </div>

                  <div className="border-t border-[#00f5ff]/20 pt-4">
                    <p className="text-[#e0e6ff] leading-relaxed">
                      {dept.description}
                    </p>
                  </div>

                  <div className="pt-4 space-y-2">
                    <button className="w-full cyber-button block">
                      Explore Programmes
                    </button>
                    <button className="w-full cyber-button purple block">
                      View Faculty
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </section>
  );
}
