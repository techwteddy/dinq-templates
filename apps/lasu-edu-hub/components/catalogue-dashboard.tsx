'use client';

import Link from 'next/link';
import { useState } from 'react';

export function CatalogueDashboard() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const catalogue = [
    {
      id: 'academics',
      title: 'Academic Programmes',
      description: 'Comprehensive curriculum across 6 departments with cutting-edge courses',
      icon: '📚',
      color: 'cyan',
      tags: ['STEM', 'Education', '45+ Courses'],
      count: '45+',
      category: 'academics',
    },
    {
      id: 'research',
      title: 'Research & Innovation',
      description: 'State-of-the-art laboratories and research centers for groundbreaking discoveries',
      icon: '🔬',
      color: 'purple',
      tags: ['Labs', 'Innovation', 'Grants'],
      count: '12',
      category: 'research',
    },
    {
      id: 'digital',
      title: 'Digital Learning Hub',
      description: 'Interactive online platforms for seamless hybrid and remote learning experiences',
      icon: '💻',
      color: 'gold',
      tags: ['e-Learning', 'Virtual', 'LMS'],
      count: '100%',
      category: 'digital',
    },
    {
      id: 'library',
      title: 'Resource Library',
      description: 'Extensive collection of textbooks, journals, videos, and multimedia materials',
      icon: '📖',
      color: 'cyan',
      tags: ['Digital', 'Physical', 'Open Access'],
      count: '50K+',
      category: 'resources',
    },
    {
      id: 'exchange',
      title: 'Faculty Exchange Programme',
      description: 'International collaborations and academic partnerships with global institutions',
      icon: '🌍',
      color: 'purple',
      tags: ['International', 'Partnerships', 'Mobility'],
      count: '20+',
      category: 'partnerships',
    },
    {
      id: 'mentorship',
      title: 'Mentorship Program',
      description: 'Expert guidance from experienced faculty members and industry professionals',
      icon: '👨‍🎓',
      color: 'gold',
      tags: ['Guidance', 'Career', 'Development'],
      count: '280',
      category: 'student-support',
    },
  ];

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'academics', label: 'Academics' },
    { id: 'research', label: 'Research' },
    { id: 'resources', label: 'Resources' },
    { id: 'partnerships', label: 'Partnerships' },
    { id: 'student-support', label: 'Student Support' },
  ];

  const filteredCatalogue =
    activeFilter === 'all'
      ? catalogue
      : catalogue.filter((item) => item.category === activeFilter);

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-[#1a1f3a] to-[#0a0f1c] relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00f5ff] opacity-3 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-[#9d00ff] opacity-3 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 neon-text-purple animate-neon-glow">
            Service Catalogue
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-[#9d00ff] to-[#00f5ff] mx-auto mb-6" />
          <p className="text-[#a0a6b8] text-lg max-w-2xl mx-auto">
            Explore our comprehensive suite of academic, research, and student support services
          </p>
        </div>

        {/* Filter Tags */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`px-4 py-2 rounded-full font-semibold uppercase text-xs tracking-wider transition-all duration-300 ${
                activeFilter === cat.id
                  ? 'bg-gradient-to-r from-[#00f5ff] to-[#9d00ff] text-[#0a0f1c] shadow-lg shadow-[#00f5ff]/50'
                  : 'cyber-button border-[#9d00ff]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Catalogue Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCatalogue.map((item, idx) => (
            <div
              key={item.id}
              className="group"
              onMouseEnter={() => setHoveredCard(item.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s both`,
              }}
            >
              {/* Holographic Glass Card */}
              <div className={`glass-cyber rounded-xl p-6 h-full flex flex-col transition-all duration-500 relative overflow-hidden ${
                hoveredCard === item.id ? 'neon-glow-purple' : ''
              }`}>
                {/* Animated Border Gradient */}
                <div className={`absolute inset-0 rounded-xl p-px bg-gradient-to-r ${
                  item.color === 'cyan' ? 'from-[#00f5ff] to-[#9d00ff]' :
                  item.color === 'purple' ? 'from-[#9d00ff] to-[#ffd700]' :
                  'from-[#ffd700] to-[#00f5ff]'
                } opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                {/* Corner Accents */}
                <div className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 ${
                  item.color === 'cyan' ? 'border-[#00f5ff]' :
                  item.color === 'purple' ? 'border-[#9d00ff]' :
                  'border-[#ffd700]'
                } opacity-60 group-hover:opacity-100 transition-opacity`} />
                <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 ${
                  item.color === 'cyan' ? 'border-[#00f5ff]' :
                  item.color === 'purple' ? 'border-[#9d00ff]' :
                  'border-[#ffd700]'
                } opacity-60 group-hover:opacity-100 transition-opacity`} />

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                  {/* Icon & Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl animate-float group-hover:animate-spin">
                      {item.icon}
                    </div>
                    <div className={`text-2xl font-bold ${
                      item.color === 'cyan' ? 'neon-text-cyan' :
                      item.color === 'purple' ? 'neon-text-purple' :
                      'neon-text-gold'
                    }`}>
                      {item.count}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-[#e0e6ff] mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#00f5ff] group-hover:to-[#9d00ff] group-hover:bg-clip-text transition-all">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[#a0a6b8] text-sm mb-4 flex-grow leading-relaxed">
                    {item.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          item.color === 'cyan'
                            ? 'bg-[#00f5ff]/10 text-[#00f5ff] border border-[#00f5ff]/30'
                            : item.color === 'purple'
                            ? 'bg-[#9d00ff]/10 text-[#9d00ff] border border-[#9d00ff]/30'
                            : 'bg-[#ffd700]/10 text-[#ffd700] border border-[#ffd700]/30'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Learn More Button */}
                  <button
                    className={`cyber-button w-full ${
                      item.color === 'cyan' ? '' :
                      item.color === 'purple' ? 'purple' :
                      'gold'
                    } text-xs uppercase tracking-wider`}
                  >
                    Explore →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-16">
          <Link
            href="/academics"
            className="inline-flex items-center gap-2 px-8 py-4 cyber-button purple font-bold uppercase tracking-wider"
          >
            View All Services & Programmes
            <span className="group-hover:translate-x-2 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
