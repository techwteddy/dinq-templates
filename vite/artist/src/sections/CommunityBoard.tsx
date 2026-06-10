import { useEffect, useRef, useState } from 'react';
import { Star } from 'lucide-react';

interface Testimonial {
  id: number;
  text: string;
  author: string;
  role: string;
  rotation: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    text: "I believe FLOW.ART is a bold initiative. A very needed one. I resonate with the idea that you must create a path that can be walked by many not only by few. I believe the idea that there is an art market and an art world that sometimes are two worlds apart.",
    author: "Sarah Chen",
    role: "Gallery Curator",
    rotation: -5,
  },
  {
    id: 2,
    text: "I find this project really useful, especially for getting an insight into different art scenes. I'd love to get involved, as the platform facilitates the process of connecting with emerging curators and artists beyond my country.",
    author: "Marcus Webb",
    role: "Independent Artist",
    rotation: 8,
  },
  {
    id: 3,
    text: "Art is connection. I joined FLOW.ART to connect with artists and curators without intermediaries. It's not only with the strength of our vision. It's time for sharing and living.",
    author: "Elena Rossi",
    role: "Art Director",
    rotation: -3,
  },
];

export default function CommunityBoard() {
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
      className="relative min-h-screen bg-[#5A6A5A] overflow-hidden noise-overlay"
    >
      {/* Massive Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <h2 className="display-text text-black/20 whitespace-nowrap">
          TESTIMONIALS
        </h2>
      </div>

      <div className="relative z-10 w-full px-6 lg:px-12 py-24 lg:py-32">
        {/* Header */}
        <div
          className={`mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex items-center gap-3">
            <Star className="w-8 h-8 text-white/80" />
            <h2 className="text-4xl lg:text-5xl font-bold text-white">
              ART <span className="font-light italic">the</span> WORLD
            </h2>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: `${200 + index * 150}ms`,
                transform: `rotate(${testimonial.rotation}deg)`,
              }}
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 lg:p-8 hover:bg-white/15 transition-colors">
                <p className="text-white/90 text-sm lg:text-base leading-relaxed mb-6">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#9B8B73] flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {testimonial.author.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">
                      {testimonial.author}
                    </p>
                    <p className="text-white/60 text-xs">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Content */}
        <div
          className={`mt-20 grid lg:grid-cols-2 gap-12 transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div>
            <h3 className="text-2xl lg:text-3xl font-semibold text-white mb-4">
              A dynamic directory to find who you need and get found by those who
              matter.
            </h3>
          </div>
          <div>
            <p className="body-large text-white/80">
              Think of it as the Yellow Pages for curators and artists. No
              algorithms, no paywalls, no limits. It's an open space for{' '}
              <span className="scribble-underline">organic</span>, community-driven
              networking.
            </p>
          </div>
        </div>

        {/* Scribble Arrow */}
        <div
          className={`flex justify-end mt-8 transition-all duration-700 delay-600 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <svg
            className="w-16 h-8 text-black/40"
            viewBox="0 0 60 20"
            fill="none"
          >
            <path
              d="M5 10 Q 20 5, 40 10 T 55 10"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              markerEnd="url(#arrowhead)"
            />
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
              </marker>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}
