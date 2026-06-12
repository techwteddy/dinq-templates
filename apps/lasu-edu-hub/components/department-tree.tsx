'use client';

import { useEffect, useRef, useState } from 'react';

const departments = [
  { 
    name: 'Biology Education',
    icon: '🧬',
    description: 'Life sciences education and biological discovery',
    color: 'from-green-400 to-emerald-600',
    lightColor: 'from-green-100 to-emerald-100'
  },
  { 
    name: 'Chemistry Education',
    icon: '⚗️',
    description: 'Chemical sciences and experimental learning',
    color: 'from-blue-400 to-cyan-600',
    lightColor: 'from-blue-100 to-cyan-100'
  },
  { 
    name: 'Computer Science Education',
    icon: '💻',
    description: 'Digital technology and programming skills',
    color: 'from-purple-400 to-indigo-600',
    lightColor: 'from-purple-100 to-indigo-100'
  },
  { 
    name: 'Educational Technology',
    icon: '📱',
    description: 'Tech-enhanced learning methods',
    color: 'from-pink-400 to-rose-600',
    lightColor: 'from-pink-100 to-rose-100'
  },
  { 
    name: 'Mathematics Education',
    icon: '∑',
    description: 'Quantitative skills and mathematical thinking',
    color: 'from-yellow-400 to-orange-600',
    lightColor: 'from-yellow-100 to-orange-100'
  },
  { 
    name: 'Physics Education',
    icon: '⚡',
    description: 'Physical sciences and natural phenomena',
    color: 'from-red-400 to-orange-600',
    lightColor: 'from-red-100 to-orange-100'
  },
];

export function DepartmentTree() {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleItems((prev) => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.3 }
    );

    const items = containerRef.current?.querySelectorAll('[data-index]');
    items?.forEach((item) => observer.observe(item));

    return () => {
      items?.forEach((item) => observer.unobserve(item));
    };
  }, []);

  return (
    <section ref={containerRef} className="relative py-20 sm:py-28 bg-gradient-to-b from-white via-primary/3 to-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-accent/10 to-secondary/10 rounded-full blur-3xl opacity-30 animate-float-x" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-tr from-primary/10 to-accent/10 rounded-full blur-3xl opacity-20 animate-pulse-glow" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold text-primary mb-4 animate-fade-in-up">
            Academic Departments
          </h2>
          <p className="text-xl text-secondary font-semibold mb-2 animate-fade-in-up">
            Department of Science and Technology Education
          </p>
          <div className="h-1 w-32 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mb-6" />
          <p className="text-foreground/60 max-w-2xl mx-auto animate-fade-in-up">
            Six specialized units providing comprehensive education in science and technology
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Central Timeline Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-accent via-secondary to-primary transform -translate-x-1/2 rounded-full" />

          {/* Departments Grid */}
          <div className="space-y-16 sm:space-y-20 relative">
            {departments.map((dept, index) => {
              const isLeft = index % 2 === 0;
              const isVisible = visibleItems.has(index);

              return (
                <div
                  key={index}
                  data-index={index}
                  className={`relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center transition-all duration-700 ease-out ${
                    isVisible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-12'
                  }`}
                  onMouseEnter={() => setHoveredItem(index)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {/* Left Side Content */}
                  <div className={`${isLeft ? 'order-1' : 'order-2 md:order-3'}`}>
                    <div
                      className={`group relative p-6 sm:p-8 rounded-2xl backdrop-blur-sm border-2 transition-all duration-500 transform cursor-pointer overflow-hidden ${
                        hoveredItem === index
                          ? `border-transparent bg-gradient-to-br ${dept.color} shadow-2xl scale-105`
                          : `border-primary/20 bg-gradient-to-br ${dept.lightColor} shadow-lg hover:shadow-xl`
                      }`}
                    >
                      {/* Animated Gradient Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-r from-white/40 via-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shimmer`} />

                      {/* Content */}
                      <div className="relative z-10">
                        <div className={`flex items-center gap-4 mb-4 ${isLeft ? 'md:flex-row-reverse md:justify-end' : ''}`}>
                          <span className={`text-5xl sm:text-6xl transform transition-all duration-300 ${hoveredItem === index ? 'scale-125 rotate-12' : 'scale-100'}`}>
                            {dept.icon}
                          </span>
                          <h3 className={`text-2xl sm:text-3xl font-bold transition-colors duration-300 ${
                            hoveredItem === index
                              ? 'text-white'
                              : 'text-primary group-hover:text-primary'
                          }`}>
                            {dept.name}
                          </h3>
                        </div>
                        <p className={`text-base sm:text-lg leading-relaxed transition-colors duration-300 ${
                          hoveredItem === index
                            ? 'text-white/90'
                            : 'text-foreground/70'
                        }`}>
                          {dept.description}
                        </p>
                      </div>

                      {/* Corner Accent - Animated */}
                      <div className={`absolute top-0 right-0 w-1 rounded-b-lg transition-all duration-300 ${
                        hoveredItem === index
                          ? 'h-12 bg-white opacity-100'
                          : 'h-0 opacity-0'
                      }`} />
                      <div className={`absolute bottom-0 left-0 w-1 rounded-t-lg transition-all duration-300 ${
                        hoveredItem === index
                          ? 'h-12 bg-white opacity-100'
                          : 'h-0 opacity-0'
                      }`} />
                    </div>
                  </div>

                  {/* Center Timeline Dot */}
                  <div className="flex justify-center md:order-2">
                    <div className="relative flex flex-col items-center">
                      {/* Animated Dot with Glow */}
                      <div
                        className={`relative transform transition-all duration-500 ${
                          hoveredItem === index ? 'scale-150' : 'scale-100'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-4 border-white shadow-lg transition-all duration-500 ${
                          hoveredItem === index
                            ? `bg-gradient-to-br ${departments[index].color}`
                            : 'bg-accent'
                        }`} />
                        {/* Pulse Ring */}
                        <div className={`absolute inset-0 rounded-full border-2 border-accent/50 animate-pulse ${
                          hoveredItem === index ? 'scale-150' : 'scale-100'
                        }`} />
                      </div>

                      {/* Connecting Lines */}
                      {index !== departments.length - 1 && (
                        <div
                          className={`transition-all duration-700 ${
                            isVisible ? 'opacity-100' : 'opacity-0'
                          }`}
                          style={{
                            width: '2px',
                            height: hoveredItem !== null && hoveredItem !== index ? '40px' : '60px',
                            backgroundImage: hoveredItem === index + 1 
                              ? `linear-gradient(to bottom, rgb(201, 169, 97), rgb(139, 111, 71))`
                              : 'linear-gradient(to bottom, rgb(201, 169, 97), rgb(92, 61, 46))',
                          }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Right Side - Empty for spacing */}
                  <div className={`hidden md:block ${isLeft ? 'order-3' : 'order-1'}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom accent decoration */}
        <div className="mt-20 flex justify-center animate-fade-in">
          <div className="h-1 w-48 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full" />
        </div>
      </div>
    </section>
  );
}
