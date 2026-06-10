import { useEffect, useRef, useState } from 'react';
import { Play, Sparkles } from 'lucide-react';

const features = [
  { id: 1, title: 'Professional presentation', number: '1' },
  { id: 2, title: 'Visibility', number: '2' },
  { id: 3, title: 'Connection', number: '3' },
  { id: 4, title: 'Knowledge exchange', number: '4' },
];

export default function About() {
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
      className="relative min-h-screen bg-[#8B9A8B] overflow-hidden noise-overlay"
    >
      <div className="w-full px-6 lg:px-12 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[70vh]">
          {/* Left Column - Video */}
          <div
            className={`relative transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
          >
            {/* Decorative Circle */}
            <div className="absolute -top-10 -left-10 w-64 h-64 border-4 border-[#9B8B73] rounded-full opacity-50" />
            <div className="absolute -top-5 -left-5 w-56 h-56 border-2 border-[#9B8B73] rounded-full opacity-30" />
            
            {/* Video Thumbnail */}
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/images/video-thumb.jpg"
                alt="About flow.art"
                className="w-full aspect-video object-cover"
              />
              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-16 h-16 bg-black/80 rounded-full flex items-center justify-center hover:bg-black transition-colors group">
                  <Play className="w-6 h-6 text-white ml-1 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>

            {/* Sparkle Decoration */}
            <Sparkles className="absolute -bottom-4 -right-4 w-8 h-8 text-white/60" />
          </div>

          {/* Right Column - Content */}
          <div className="space-y-8">
            {/* Title */}
            <div
              className={`transition-all duration-700 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <h2 className="display-text text-black">
                YOUR NEXUS
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <Sparkles className="w-6 h-6 text-white/80" />
                <Sparkles className="w-4 h-4 text-white/60" />
              </div>
            </div>

            {/* Description */}
            <div
              className={`transition-all duration-700 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <p className="body-large text-white/90 max-w-lg">
                <span className="font-semibold text-white">FLOW.ART</span> is the
                first and only{' '}
                <span className="scribble-underline">network</span> made for{' '}
                <span className="scribble-underline">curators</span> and{' '}
                <span className="scribble-underline">artists</span>, combining
                tools for professional presentation, visibility, connection and
                learning.
              </p>
            </div>

            {/* Features Grid */}
            <div
              className={`grid grid-cols-2 gap-4 pt-4 transition-all duration-700 delay-400 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {features.map((feature, index) => (
                <div
                  key={feature.id}
                  className="bg-black rounded-xl p-5 hover:bg-neutral-900 transition-colors cursor-pointer group"
                  style={{ transitionDelay: `${500 + index * 100}ms` }}
                >
                  <span className="text-white/40 text-sm">{feature.number}</span>
                  <p className="text-white font-medium mt-2 group-hover:translate-x-1 transition-transform">
                    {feature.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#6B7A6B] to-transparent" />
    </div>
  );
}
