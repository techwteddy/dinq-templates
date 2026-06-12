'use client';

import { useState, useEffect } from 'react';
import { getNews } from '@/lib/storage';

export function NewsCarousel() {
  const [news, setNews] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [tiltStyle, setTiltStyle] = useState({ rotateX: 0, rotateY: 0 });

  useEffect(() => {
    const loadNews = async () => {
      const newsData = await getNews();
      setNews(Array.isArray(newsData) ? newsData.slice(0, 5) : []);
    };
    loadNews();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const rotateY = ((mouseX - centerX) / centerX) * 15;
    const rotateX = ((centerY - mouseY) / centerY) * 15;

    setTiltStyle({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTiltStyle({ rotateX: 0, rotateY: 0 });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % Math.max(news.length, 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [news.length]);

  if (news.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-[#1a1f3a] to-[#0a0f1c] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#00f5ff] opacity-3 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 neon-text-cyan animate-neon-glow">
            Latest News & Updates
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-[#00f5ff] to-[#9d00ff] mx-auto" />
        </div>

        {/* 3D Carousel */}
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          {/* Main Featured Card */}
          <div className="flex-1 perspective">
            <div
              className="glass-cyber rounded-2xl p-8 min-h-96 flex flex-col justify-between cursor-none transition-transform duration-200"
              style={{
                perspective: '1000px',
                transform: `rotateX(${tiltStyle.rotateX}deg) rotateY(${tiltStyle.rotateY}deg)`,
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#00f5ff]" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#9d00ff]" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#9d00ff]" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#00f5ff]" />

              {/* Tag */}
              <div>
                <span className="inline-block px-3 py-1 bg-[#00f5ff]/20 border border-[#00f5ff] text-[#00f5ff] text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                  Featured
                </span>

                {/* Date */}
                <p className="text-[#a0a6b8] text-sm mb-3">
                  {new Date(news[activeIndex]?.date).toLocaleDateString()}
                </p>

                {/* Title */}
                <h3 className="text-3xl font-bold text-[#e0e6ff] mb-4 line-clamp-3">
                  {news[activeIndex]?.title}
                </h3>

                {/* Description */}
                <p className="text-[#a0a6b8] mb-6 line-clamp-2">
                  {news[activeIndex]?.description}
                </p>
              </div>

              {/* Read More Button */}
              <button className="cyber-button gold self-start">
                Read Full Story →
              </button>
            </div>
          </div>

          {/* Carousel Thumbnails */}
          <div className="flex-1 space-y-4">
            {news.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`w-full glass-cyber rounded-lg p-4 text-left transition-all duration-300 ${
                  activeIndex === idx ? 'neon-border-cyan' : 'hover:border-[#00f5ff]/30'
                }`}
              >
                <div className="flex gap-4">
                  {/* Thumbnail Indicator */}
                  <div className={`w-2 h-full rounded flex-shrink-0 ${
                    activeIndex === idx
                      ? 'bg-gradient-to-b from-[#00f5ff] to-[#9d00ff]'
                      : 'bg-[#00f5ff]/30'
                  }`} />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#a0a6b8] mb-1">
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                    <h4 className="text-sm font-bold text-[#e0e6ff] line-clamp-2">
                      {item.title}
                    </h4>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
