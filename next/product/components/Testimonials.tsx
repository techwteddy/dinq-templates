"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    id: 1,
    name: "Alex Chen",
    role: "Software Engineer",
    avatar: "AC",
    quote: "The typing experience is unmatched. Every keystroke feels like butter.",
    rating: 5,
  },
  {
    id: 2,
    name: "Sarah Kim",
    role: "Content Creator",
    avatar: "SK",
    quote: "Finally, a keyboard that looks as good as it sounds. Pure perfection.",
    rating: 5,
  },
  {
    id: 3,
    name: "Marcus Johnson",
    role: "Game Developer",
    avatar: "MJ",
    quote: "1000Hz polling rate is a game-changer. Zero lag, infinite satisfaction.",
    rating: 5,
  },
  {
    id: 4,
    name: "Emily Davis",
    role: "Designer",
    avatar: "ED",
    quote: "The attention to detail is obsessive. I'm in love with every aspect.",
    rating: 5,
  },
  {
    id: 5,
    name: "James Wilson",
    role: "Writer",
    avatar: "JW",
    quote: "8 hours of typing, zero fatigue. This keyboard saved my wrists.",
    rating: 5,
  },
  {
    id: 6,
    name: "Nina Patel",
    role: "Product Manager",
    avatar: "NP",
    quote: "Wireless with no compromises. The future of mechanical keyboards.",
    rating: 5,
  },
];

function TestimonialCard({ testimonial }: { testimonial: typeof testimonials[0] }) {
  return (
    <div className="flex-shrink-0 w-[350px] md:w-[400px] p-6 mx-3 rounded-2xl glass-strong hover-lift group cursor-default">
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star
            key={i}
            size={14}
            className="fill-primary-500 text-primary-500"
          />
        ))}
      </div>

      {/* Quote */}
      <p className="text-white text-base leading-relaxed mb-6">
        "{testimonial.quote}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-gold flex items-center justify-center text-white text-sm font-medium">
          {testimonial.avatar}
        </div>
        <div>
          <p className="text-white font-medium text-sm">{testimonial.name}</p>
          <p className="text-neutral-500 text-xs">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="reviews"
      ref={containerRef}
      className="relative py-32 bg-bg-primary overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 w-1/3 h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
        <div className="absolute top-1/2 right-0 w-1/3 h-px bg-gradient-to-l from-transparent via-accent-gold/20 to-transparent" />
      </div>

      <div className="relative">
        {/* Section Header */}
        <div className="text-center mb-16 px-6">
          <p className="text-neutral-500 text-sm font-mono tracking-widest uppercase mb-4">
            Testimonials
          </p>
          <h2 className="text-4xl md:text-6xl font-space font-semibold text-white mb-4">
            Loved by <span className="text-gradient">Enthusiasts</span>
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Join thousands of satisfied keyboard enthusiasts
          </p>
        </div>

        {/* Marquee Row 1 */}
        <div className="relative mb-6">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-bg-primary to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-bg-primary to-transparent z-10" />

          <div className="flex animate-marquee hover:[animation-play-state:paused]">
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <TestimonialCard key={`row1-${index}`} testimonial={testimonial} />
            ))}
          </div>
        </div>

        {/* Marquee Row 2 (Reverse) */}
        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-bg-primary to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-bg-primary to-transparent z-10" />

          <div className="flex animate-marquee-reverse hover:[animation-play-state:paused]">
            {[...testimonials.slice(3), ...testimonials.slice(0, 3), ...testimonials.slice(3), ...testimonials.slice(0, 3)].map(
              (testimonial, index) => (
                <TestimonialCard key={`row2-${index}`} testimonial={testimonial} />
              )
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 flex flex-wrap justify-center gap-12 md:gap-20 px-6">
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-space font-bold text-gradient">
              10K+
            </p>
            <p className="text-neutral-500 text-sm mt-2">Happy Users</p>
          </div>
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-space font-bold text-white">
              4.9
            </p>
            <p className="text-neutral-500 text-sm mt-2">Average Rating</p>
          </div>
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-space font-bold text-white">
              50+
            </p>
            <p className="text-neutral-500 text-sm mt-2">Countries</p>
          </div>
        </div>
      </div>
    </section>
  );
}
