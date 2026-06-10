import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';

const floatingImages = [
  { id: 1, src: '/images/profile1.jpg', top: '10%', left: '15%', size: 'w-24 h-32' },
  { id: 2, src: '/images/profile3.jpg', top: '30%', left: '8%', size: 'w-20 h-28' },
  { id: 3, src: '/images/profile5.jpg', top: '55%', left: '12%', size: 'w-16 h-24' },
];

export default function JoinUs() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative min-h-screen bg-[#9B8B73] overflow-hidden noise-overlay"
    >
      {/* Massive Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <h2 className="display-text text-black/30 whitespace-nowrap">
          JOIN US
        </h2>
      </div>

      {/* Floating Images */}
      {floatingImages.map((img, index) => (
        <div
          key={img.id}
          className={`absolute hidden lg:block transition-all duration-1000 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
          style={{
            top: img.top,
            left: img.left,
            transitionDelay: `${300 + index * 150}ms`,
          }}
        >
          <div
            className={`${img.size} rounded-xl overflow-hidden shadow-xl animate-float`}
            style={{ animationDelay: `${index * 0.5}s` }}
          >
            <img
              src={img.src}
              alt="Community member"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      ))}

      <div className="relative z-10 w-full px-6 lg:px-12 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[60vh]">
          {/* Left Column - Big Text */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
          >
            <h2 className="display-text text-black leading-none">
              JOIN
            </h2>
            <div className="relative inline-block">
              <span className="display-text text-black leading-none">US</span>
              <span
                className="absolute -top-4 -right-8 text-6xl lg:text-8xl font-light italic text-white/80"
                style={{ fontFamily: 'serif' }}
              >
                Us
              </span>
            </div>
          </div>

          {/* Right Column - CTA */}
          <div className="space-y-8">
            <div
              className={`transition-all duration-700 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <p className="body-large text-white/90 max-w-md">
                Ready to take control of your{' '}
                <span className="scribble-underline">creative journey</span>? Join
                now and let's shape the future of the art world together!
              </p>
            </div>

            <div
              className={`transition-all duration-700 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <a
                href="#"
                className="inline-flex items-center gap-4 bg-black text-white px-8 py-5 rounded-xl hover:bg-neutral-800 transition-all duration-300 group"
              >
                <span className="text-lg font-medium">Get Started</span>
                <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </a>
            </div>

            {/* Additional Info */}
            <div
              className={`pt-8 border-t border-white/20 transition-all duration-700 delay-400 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <p className="text-white/60 text-sm">
                Join Nexus of Curators and Artists today. Free for artists, premium
                features for professionals.
              </p>
            </div>
          </div>
        </div>

        {/* Scribble Arrow */}
        <div
          className={`flex justify-center lg:justify-end mt-12 transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <svg
            className="w-20 h-10 text-black/50"
            viewBox="0 0 80 30"
            fill="none"
          >
            <path
              d="M10 15 Q 30 5, 50 15 T 75 20"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M70 15 L 78 20 L 75 25"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
