'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface ParallaxSectionProps {
  children: ReactNode;
  offset?: number;
  className?: string;
}

export function ParallaxSection({ 
  children, 
  offset = 50,
  className = ''
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top;
      const elementHeight = rect.height;
      const windowHeight = window.innerHeight;

      // Check if element is in viewport
      if (elementTop < windowHeight && elementTop + elementHeight > 0) {
        // Calculate parallax offset
        const scrollProgress = 1 - (elementTop / windowHeight);
        const parallaxOffset = scrollProgress * offset;
        
        element.style.transform = `translateY(${parallaxOffset}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [offset]);

  return (
    <div 
      ref={ref}
      className={`transition-transform duration-300 ${className}`}
      style={{ willChange: 'transform' }}
    >
      {children}
    </div>
  );
}

interface SlideInImageProps {
  src: string;
  alt: string;
  direction?: 'left' | 'right';
  className?: string;
}

export function SlideInImage({ 
  src, 
  alt, 
  direction = 'left',
  className = ''
}: SlideInImageProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add('visible');
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.unobserve(element);
  }, []);

  const slideClass = direction === 'left' ? 'animate-slideInLeft' : 'animate-slideInRight';

  return (
    <div 
      ref={ref}
      className={`scroll-fade ${slideClass} ${className}`}
    >
      <img 
        src={src} 
        alt={alt}
        className="w-full h-auto object-cover rounded-lg shadow-lg"
      />
    </div>
  );
}

interface SlideUpTextProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function SlideUpText({ 
  children, 
  className = '',
  delay = 0
}: SlideUpTextProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            element.classList.add('visible');
          }, delay);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.unobserve(element);
  }, [delay]);

  return (
    <div 
      ref={ref}
      className={`scroll-fade animate-fadeInUp ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
