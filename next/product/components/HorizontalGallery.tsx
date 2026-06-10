"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const galleryItems = [
  {
    id: 1,
    title: "Precision CNC",
    subtitle: "Aircraft-grade aluminum body",
    image: "/images/gallery/1.svg",
  },
  {
    id: 2,
    title: "Gasket Mount",
    subtitle: "Silicone dampening layers",
    image: "/images/gallery/2.svg",
  },
  {
    id: 3,
    title: "Hot-Swappable",
    subtitle: "Customize every switch",
    image: "/images/gallery/3.svg",
  },
  {
    id: 4,
    title: "RGB Brilliance",
    subtitle: "South-facing per-key LEDs",
    image: "/images/gallery/4.svg",
  },
  {
    id: 5,
    title: "Wireless Freedom",
    subtitle: "Tri-mode connectivity",
    image: "/images/gallery/5.svg",
  },
];

export default function HorizontalGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !galleryRef.current) return;

    // Use Sticky Scroll logic which is safer than pinning
    const scrollWidth = galleryRef.current.scrollWidth - window.innerWidth;

    const ctx = gsap.context(() => {
      gsap.fromTo(galleryRef.current, 
        { x: 0 },
        {
          x: -scrollWidth,
          ease: "none",
          force3D: true, 
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5, // Reduced for tighter response
            invalidateOnRefresh: true,
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    // Longer scroll height for slower experience = 500vh
    <section ref={containerRef} className="relative h-[500vh] bg-bg-primary z-30">
      
      {/* Sticky container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center">
        
        {/* Horizontal Moving Track with GPU hint */}
        <div ref={galleryRef} className="flex h-full w-max will-change-transform">
          
          {/* Intro Panel */}
          <div className="w-screen h-full flex flex-col justify-center p-8 md:p-20 flex-shrink-0 bg-bg-primary border-r border-white/5">
             <div className="max-w-4xl w-full">
               <p className="text-primary-500 font-mono text-sm tracking-widest uppercase mb-4">Gallery</p>
               <h2 className="text-5xl md:text-8xl font-space font-bold text-white mb-8">
                 Crafted with <br/>
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-300">Obsession</span>
               </h2>
               <p className="text-neutral-400 text-xl max-w-lg mb-12">
                 Swipe to explore the details that define perfection.
               </p>
               
               <div className="flex items-center gap-4 text-white/50 animate-pulse">
                  <span>SCROLL TO EXPLORE</span>
                  <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
                    →
                  </div>
               </div>
             </div>
          </div>

          {/* Gallery Cards */}
          {galleryItems.map((item, index) => (
            <div
              key={item.id}
              className="w-screen h-full flex items-center justify-center p-8 md:p-20 flex-shrink-0 bg-bg-primary border-r border-white/5"
            >
              <div className="relative w-full max-w-6xl h-[70vh] rounded-3xl overflow-hidden glass-strong border border-white/10 flex flex-col md:flex-row shadow-xl group hover-lift">
                
                {/* Visual Side with Real Image */}
                <div className="w-full md:w-1/2 h-full bg-black/50 relative overflow-hidden">
                   <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105 w-full h-full">
                     {/* SVG Optimized: Native img for vectors, no server processing */}
                     <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover opacity-80"
                        loading="lazy"
                        decoding="async"
                     />
                   </div>
                   
                   {/* Overlay Gradient */}
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent md:bg-gradient-to-r" />
                   
                   <div className="absolute bottom-8 left-8 md:top-8 md:left-8">
                      <span className="font-space text-6xl md:text-8xl font-bold text-white/10 group-hover:text-primary-500/20 transition-colors">
                        0{index + 1}
                      </span>
                   </div>
                </div>

                {/* Content Side */}
                <div className="w-full md:w-1/2 h-full p-8 md:p-16 flex flex-col justify-center bg-gradient-to-br from-white/5 to-transparent relative z-10">
                   <div className="mb-auto hidden md:block">
                      <div className="w-12 h-1 bg-primary-500/50 mb-8" />
                   </div>
                   
                   <h3 className="text-3xl md:text-5xl font-space font-bold text-white mb-6 leading-tight">
                     {item.title}
                   </h3>
                   <p className="text-neutral-400 text-lg leading-relaxed mb-8">
                     {item.subtitle}. Designed for those who appreciate the finer details in life and technology.
                   </p>
                   
                   <div className="mt-auto">
                      <button className="text-white text-sm font-medium border-b border-primary-500 pb-1 hover:text-primary-500 transition-colors">
                        Expand View
                      </button>
                   </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
