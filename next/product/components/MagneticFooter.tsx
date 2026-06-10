"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";

export default function MagneticFooter() {
  const footerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    const text = textRef.current;
    if (!button || !text) return;

    // Magnetic Effect Logic
    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Strength of the pull
      gsap.to(button, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.5,
        ease: "power2.out",
      });
      
      gsap.to(text, {
        x: x * 0.15, // Text moves slightly less for parallax feel inside button
        y: y * 0.15,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to([button, text], {
        x: 0,
        y: 0,
        duration: 1,
        ease: "elastic.out(1, 0.3)",
      });
    };

    button.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <footer ref={footerRef} className="relative w-full min-h-[50vh] bg-[#050505] flex flex-col items-center justify-center py-20 overflow-hidden z-20">
        {/* Background Ambient Glow */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
            <div className="w-[50vw] h-[50vw] bg-orange-500 rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-12 text-center">
            <h3 className="text-3xl md:text-4xl text-white font-medium tracking-tight">
                Ready to feel the difference?
            </h3>

            {/* Magnetic CTA */}
            <button
                ref={buttonRef}
                className="group relative flex items-center justify-center w-64 h-64 md:w-80 md:h-80 rounded-full bg-orange-600 hover:bg-orange-500 transition-colors duration-300 border-none outline-none cursor-pointer"
            >
                <span ref={textRef} className="text-4xl md:text-5xl font-bold text-black tracking-tighter z-10 pointer-events-none">
                    PRE-ORDER
                </span>
                {/* Rolling Ripple Effect on Hover (Optional, handled by CSS usually, keeping simple for clean magnetic look) */}
            </button>
            
            <div className="flex gap-8 text-gray-500 text-sm mt-8 uppercase tracking-widest">
                <a href="#" className="hover:text-white transition-colors">Specs</a>
                <a href="#" className="hover:text-white transition-colors">Gallery</a>
                <a href="#" className="hover:text-white transition-colors">Support</a>
                <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            
             <div className="mt-8 text-xs text-gray-700">
                © 2024 PRECISION KEYBOARDS. DESIGNED WITH PASSION.
            </div>
        </div>
    </footer>
  );
}
