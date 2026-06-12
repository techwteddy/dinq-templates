'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface AdvancedScrollAnimationProps {
  children: ReactNode;
  animationType?: 'fadeUp' | 'slideLeft' | 'slideRight' | 'scale' | 'revealLeft' | 'revealRight';
  delay?: number;
  duration?: number;
  className?: string;
}

export function AnimateOnScroll({
  children,
  animationType = 'fadeUp',
  delay = 0,
  duration = 0.6,
  className = '',
}: AdvancedScrollAnimationProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          element.style.animation = 'none';
          
          const animationMap: Record<string, string> = {
            fadeUp: `fadeInUp ${duration}s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s forwards`,
            slideLeft: `slideInLeft ${duration}s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s forwards`,
            slideRight: `slideInRight ${duration}s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s forwards`,
            scale: `scaleInCenter ${duration}s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s forwards`,
            revealLeft: `revealFromLeft ${duration}s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s forwards`,
            revealRight: `revealFromRight ${duration}s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s forwards`,
          };

          setTimeout(() => {
            element.style.animation = animationMap[animationType];
          }, 0);

          observer.unobserve(element);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (elementRef.current) {
      elementRef.current.style.opacity = '0';
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) observer.unobserve(elementRef.current);
    };
  }, [animationType, delay, duration]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}

interface ParallaxImageProps {
  src: string;
  alt: string;
  strength?: number;
  className?: string;
}

export function ParallaxImage({ src, alt, strength = 0.5, className = '' }: ParallaxImageProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current) return;

      const rect = elementRef.current.getBoundingClientRect();
      const scrolled = window.scrollY;
      const coords = scrolled * strength;

      const img = elementRef.current.querySelector('img') as HTMLImageElement;
      if (img) {
        img.style.transform = `translateY(${coords}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [strength]);

  return (
    <div ref={elementRef} className={`overflow-hidden ${className}`}>
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
}

interface CountUpProps {
  target: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export function CountUp({ target, duration = 2, suffix = '', prefix = '', className = '' }: CountUpProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const element = entry.target as HTMLElement;
          let current = 0;
          const increment = target / (duration * 60);
          const startTime = Date.now();

          const animate = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            if (elapsed < duration) {
              current = Math.floor(target * (elapsed / duration));
              element.textContent = `${prefix}${current}${suffix}`;
              requestAnimationFrame(animate);
            } else {
              element.textContent = `${prefix}${target}${suffix}`;
            }
          };

          requestAnimationFrame(animate);
          observer.unobserve(element);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) observer.unobserve(elementRef.current);
    };
  }, [target, duration, suffix, prefix]);

  return <div ref={elementRef} className={className}>0{suffix}</div>;
}
