'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const carouselImages = [
  {
    url: 'https://lasu.edu.ng/home/img/banner_new3.png',
    title: 'Academic Excellence',
  },
  {
    url: 'https://lasu.edu.ng/home/img/group_picture.jpg',
    title: 'Our Community',
  },
  {
    url: 'https://lasu.edu.ng/home/img/banner_slider88.jpg',
    title: 'Innovation & Learning',
  },
];

export function PremiumHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAutoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollPercent = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / window.innerHeight));
      setScrollY(scrollPercent);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlay(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    setIsAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
    setIsAutoPlay(false);
  };

  return (
    <section ref={containerRef} className="relative w-full overflow-hidden">
      {/* Carousel Container */}
      <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] group">
        {/* Slides */}
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              transform: `translateY(${scrollY * 30}px)`,
              transition: 'transform 0.1s ease-out',
            }}
          >
            <Image
              src={image.url}
              alt={image.title}
              fill
              className="object-cover w-full h-full"
              priority={index === 0}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            
            {/* Content */}
            <div 
              className="absolute inset-0 flex flex-col items-center justify-end pb-12 sm:pb-16 lg:pb-20 px-4"
              style={{
                opacity: 1 - scrollY * 0.3,
                transform: `translateY(${scrollY * 20}px)`,
              }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white text-center mb-6 animate-fade-in">
                Welcome to <span className="text-accent">STE</span>
              </h2>
              <p className="text-xl sm:text-2xl text-white font-semibold mb-8 animate-fade-in">
                Science and Technology Education
              </p>
              <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto text-center leading-relaxed mb-8 animate-fade-in">
                Your comprehensive hub for accessing courses, learning resources, and staying updated with departmental announcements.
              </p>
              
              {/* CTA Buttons with Black Background */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
                <a
                  href="#academics"
                  className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-black/70 hover:bg-black text-white font-semibold transition-all hover:shadow-lg hover:scale-105 transform duration-300 backdrop-blur-sm border border-white/20"
                >
                  Explore Courses
                </a>
                <a
                  href="#resources"
                  className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-black/70 hover:bg-black text-white font-semibold transition-all duration-300 backdrop-blur-sm border border-white/20 hover:shadow-lg hover:scale-105 transform"
                >
                  Browse Resources
                </a>
              </div>
            </div>
          </div>
        ))}

        {/* Previous Button */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-300 text-white opacity-0 group-hover:opacity-100 transform hover:scale-110"
          aria-label="Previous slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-300 text-white opacity-0 group-hover:opacity-100 transform hover:scale-110"
          aria-label="Next slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-3">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-accent w-8'
                  : 'bg-white/50 w-2 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
