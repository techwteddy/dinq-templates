"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Audio Context Singleton to prevent multiple contexts
let audioCtx: AudioContext | null = null;

export default function SoundWaveSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const [manualUnlockDone, setManualUnlockDone] = React.useState(false);

  // Sound Generation Logic (The "Thock")
  const playThock = () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") {
        audioCtx.resume();
    }
    // REMOVED: setIsAudioUnlocked(true) from here. 
    // The button must stay until manually dismissed.

    const t = audioCtx.currentTime;

    // 1. The "Thud" (Body - Deep & Resonant)
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = "triangle"; // Rounder sound
    osc.frequency.setValueAtTime(180, t); // Start pitch
    osc.frequency.exponentialRampToValueAtTime(50, t + 0.15); // Pitch drop (kick drum like)
    
    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15); // Fast decay
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(t);
    osc.stop(t + 0.15);

    // 2. The "Click" (Switch Stem Hit - Crispy)
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(3000, t);
    osc2.frequency.exponentialRampToValueAtTime(800, t + 0.04);

    gain2.gain.setValueAtTime(0.1, t); 
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.start(t);
    osc2.stop(t + 0.04);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = container.offsetWidth;
    let height = container.offsetHeight;
    let animationId: number;
    let time = 0;
    
    // Wave parameters
    const params = {
      amplitude: 50,
      frequency: 0.01,
      speed: 0.05,
      yOffset: height / 2,
      color: "#F97316", // Orange
      baseAmplitude: 30,
      scrollVelocity: 0,
    };

    // Scroll Sound Logic
    let lastScrollPos = window.scrollY;
    let scrollAccumulator = 0;
    const soundThreshold = 50; // Pixels of scroll before triggering a sound

    // Resize handler
    const handleResize = () => {
      width = container.offsetWidth;
      height = container.offsetHeight;
      canvas.width = width;
      canvas.height = height;
      params.yOffset = height / 2;
    };
    
    window.addEventListener("resize", handleResize);
    handleResize();

    // GSAP ScrollTrigger
    const trigger = ScrollTrigger.create({
      trigger: container,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const velocity = Math.abs(self.getVelocity());
        const currentPos = self.scroll();
        const delta = Math.abs(currentPos - lastScrollPos);
        lastScrollPos = currentPos;

        // Visual feedback
        gsap.to(params, {
          scrollVelocity: velocity * 0.3, // Sensitive reaction
          duration: 0.2,
          ease: "power1.out",
          overwrite: true
        });

        // Audio Feedback
        // Only play if we are significantly inside the section or close to it
        if (self.isActive && velocity > 100) { // Minimum speed to start making noise
            scrollAccumulator += delta;
            
            // Dynamic threshold: precise fast typing feel
            // If scrolling super fast, we trigger more often but maybe limit loudness?
            // For now, linear accumulation is good for "typing speed" mapping.
            if (scrollAccumulator > soundThreshold) {
                playThock();
                scrollAccumulator = 0;
            }
        }
      },
    });

    // Visibility optimization: Pause animation loop when off-screen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!animationId) {
                draw(); // Resume
            }
          } else {
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = 0; // Mark as stopped
            }
          }
        });
      },
      { threshold: 0 }
    );
    
    observer.observe(container);

    // Animation Loop
    const draw = () => {
      if (!ctx || !canvas) return; // Safety check

      ctx.fillStyle = "rgba(5, 5, 5, 0.2)"; 
      ctx.fillRect(0, 0, width, height);

      ctx.beginPath();
      ctx.lineWidth = 4;
      ctx.strokeStyle = params.color;
      ctx.lineCap = "round";
      ctx.shadowBlur = 20;
      ctx.shadowColor = params.color;

      const currentAmplitude = params.baseAmplitude + params.scrollVelocity;

      for (let x = 0; x < width; x++) {
        const y = params.yOffset + 
          Math.sin(x * params.frequency + time) * currentAmplitude * Math.sin(time * 0.5) +
          Math.sin(x * params.frequency * 0.5 + time * 1.5) * (currentAmplitude * 0.5);
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      time += params.speed;
      animationId = requestAnimationFrame(draw);
    };
    
    // Initial start handled by observer if visible, or manually here? 
    // IntersectionObserver usually triggers once on load, so we rely on it.

    // Text Animation
    const ctxText = gsap.context(() => {
        gsap.from(textRef.current, {
            scrollTrigger: {
                trigger: container,
                start: "center 80%",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            scale: 0.9,
            duration: 0.8,
            ease: "back.out(1.7)"
        });
    }, container);


    // Global interaction listener to unlock audio
    const unlockAudio = () => {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }
      // Note: We DON'T set isAudioUnlocked(true) here anymore 
      // so the button stays until the user sees this section.
      
      // Remove listeners once unlocked
      window.removeEventListener("mousedown", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };

    window.addEventListener("mousedown", unlockAudio);
    window.addEventListener("touchstart", unlockAudio);
    window.addEventListener("keydown", unlockAudio);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousedown", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      if (animationId) cancelAnimationFrame(animationId);
      trigger.kill();
      ctxText.revert();
      observer.disconnect();
    };
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-[80vh] bg-[#050505] overflow-hidden flex flex-col items-center justify-center z-20 cursor-ns-resize"
    >
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full opacity-80 pointer-events-none"
      />
      
      <div ref={textRef} className="relative z-10 text-center px-4 mix-blend-difference select-none flex flex-col items-center">
        <h2 className="text-7xl md:text-9xl font-bold tracking-tighter text-white mb-2">
          THOCK.
        </h2>
        
        <div className="mt-4 transition-all duration-500">
          {!manualUnlockDone ? (
            <button 
              onClick={() => {
                if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
                audioCtx.resume();
                setManualUnlockDone(true);
              }}
              className="group relative flex items-center gap-3 bg-white/10 border border-orange-500 px-10 py-5 rounded-full text-orange-500 font-black uppercase tracking-[0.3em] hover:bg-orange-500 hover:text-white transition-all animate-pulse pointer-events-auto shadow-[0_0_30px_rgba(249,115,22,0.4)]"
            >
              <span className="relative z-10">ENABLE 3D AUDIO</span>
              <div className="absolute inset-0 rounded-full bg-orange-500/10 blur-2xl group-hover:blur-3xl transition-all" />
            </button>
          ) : (
            <p className="text-xl md:text-3xl text-orange-500 font-medium tracking-[0.2em] uppercase animate-in fade-in slide-in-from-bottom-4 duration-1000">
              Scroll to Type
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
