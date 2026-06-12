'use client';

import { useEffect, useRef, useState } from 'react';

interface StatItem {
  value: string;
  label: string;
  prefix?: string;
}

const stats: StatItem[] = [
  { value: '20', label: 'Active Courses', prefix: '' },
  { value: '500', label: 'Faculty Members', prefix: '+' },
  { value: '95', label: 'Graduation Rate', prefix: '' },
];

function AnimatedCounter({ value, prefix = '' }: { value: string; prefix?: string }) {
  const [count, setCount] = useState('0');
  const elementRef = useRef<HTMLDivElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.5 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    const target = parseInt(value);
    const duration = 2000;
    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(progress * target);
      setCount(current.toString());

      if (progress === 1) clearInterval(timer);
    }, 16);

    return () => clearInterval(timer);
  }, [hasStarted, value]);

  return (
    <div ref={elementRef} className="text-4xl sm:text-5xl font-bold text-primary">
      {prefix}{count}{value.includes('%') ? '%' : value === '20' ? '+' : ''}
    </div>
  );
}

export function PremiumStats() {
  return (
    <section className="py-20 sm:py-28 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">By The Numbers</h2>
          <p className="text-lg text-foreground/70">LASU Department of Science & Technology Education</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center p-8 rounded-lg bg-white border-2 border-accent/20 hover:border-accent transition-all hover:shadow-md"
            >
              <AnimatedCounter value={stat.value} prefix={stat.prefix} />
              <p className="text-lg text-foreground/70 mt-4 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
