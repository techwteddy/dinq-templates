"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Loader from "./Loader";
import Hotspot from "./Hotspot";
import { MoveDown, ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const frameCount = 192;

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  // Scroll kilidi ve Global yükleme durumu
  useEffect(() => {
    if (!isLoaded) {
      document.body.style.overflow = "hidden";
      window.dispatchEvent(new CustomEvent("experience-loading"));
    } else {
      // Yükleme ekranı tamamen kapandığında (transition süresi kadar bekle) kilidi aç
      const timeout = setTimeout(() => {
        document.body.style.overflow = "unset";
        window.dispatchEvent(new CustomEvent("experience-loaded"));
      }, 1000); 
      return () => clearTimeout(timeout);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isLoaded]);

  // Preload images with priority batching
  useEffect(() => {
    let loadedCount = 0;
    const imgs: HTMLImageElement[] = [];
    const minLoadTime = 1000;
    const startTime = Date.now();
    
    const priorityBatchCount = 30; // Load first 30 frames to show the experience

    const loadImages = async () => {
      // 1. Load Priority Batch
      const priorityPromises = [];
      for (let i = 1; i <= priorityBatchCount; i++) {
        priorityPromises.push(new Promise<void>((resolve) => {
          const img = new Image();
          const frameNumber = String(i).padStart(5, "0");
          img.src = `/frames/${frameNumber}.webp`; // Updated to WEBP
          img.onload = () => {
            loadedCount++;
            setLoadProgress(Math.round((loadedCount / priorityBatchCount) * 100));
            resolve();
          };
          img.onerror = () => resolve();
          imgs[i-1] = img;
        }));
      }

      await Promise.all(priorityPromises);

      // Early unlock
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minLoadTime - elapsed);
      if (remaining > 0) await new Promise(resolve => setTimeout(resolve, remaining));

      setImages([...imgs]);
      setIsLoaded(true);

      // 2. Load the rest in the background
      for (let i = priorityBatchCount + 1; i <= 192; i++) {
        const img = new Image();
        const frameNumber = String(i).padStart(5, "0");
        img.src = `/frames/${frameNumber}.webp`;
        img.onload = () => {
            imgs[i-1] = img;
            // Update state periodically or just rely on the reference if we were using one
            // Here we update state to trigger re-render for those frames
            if (i % 20 === 0 || i === 192) {
                setImages([...imgs]);
            }
        };
      }
    };

    loadImages();
  }, []);

  // GSAP Animation Context
  useEffect(() => {
    if (!isLoaded || !canvasRef.current || !containerRef.current || images.length === 0) return;

    const ctx = gsap.context(() => {
      const canvas = canvasRef.current!;
      const context = canvas.getContext("2d");
      if (!context) return;

      const renderFrame = (index: number) => {
        const img = images[Math.round(index)];
        if (!img || !img.complete || img.naturalWidth === 0) return;
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        const ratio = Math.max(hRatio, vRatio);
        
        const centerShift_x = (canvas.width - img.width * ratio) / 2;
        const centerShift_y = (canvas.height - img.height * ratio) / 2;
        
        context.clearRect(0, 0, canvas.width, canvas.height);
        try {
          context.drawImage(
            img,
            0,
            0,
            img.width,
            img.height,
            centerShift_x,
            centerShift_y,
            img.width * ratio,
            img.height * ratio
          );
        } catch (e) {
          console.warn("Frame skip: Image not ready", index);
        }
      };

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        onUpdate: (self) => {
          const frameIndex = Math.min(191, Math.floor(self.progress * 191));
          renderFrame(frameIndex);
        }
      });

      gsap.to(textRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "20% top",
          scrub: true,
        },
        opacity: 0,
        y: -100,
        scale: 0.9,
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isLoaded, images]);

  return (
    <section ref={containerRef} className="relative z-10 h-[250vh] bg-[#030303]">
      {/* Loading Overlay */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 100000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#030303',
          color: '#ffffff',
          width: '100vw',
          height: '100vh',
          opacity: isLoaded ? 0 : 1,
          pointerEvents: isLoaded ? 'none' : 'auto',
          transition: 'opacity 0.8s ease-in-out',
        }}
      >
        <p className="mb-4 text-xl font-medium tracking-[0.2em] uppercase">Loading Experience</p>
        <div className="relative h-1 w-64 overflow-hidden rounded-full bg-neutral-800">
          <div 
            className="absolute left-0 top-0 h-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)] transition-all duration-100"
            style={{ width: `${loadProgress}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-neutral-500 font-mono">{loadProgress}%</p>
      </div>

      <div className={`sticky top-0 h-screen w-full overflow-hidden transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full object-cover" />
        
        <div className="absolute inset-0 z-20 pointer-events-none">
          <Hotspot 
            startFrame={20} endFrame={50} x={20} y={40} 
            title="Aircraft-Grade Aluminum" description="CNC machined unibody chassis."
            frameCount={frameCount} containerRef={containerRef}
          />
          <Hotspot 
            startFrame={70} endFrame={110} x={75} y={30} 
            title="Gasket Mount Design" description="Isolates plate from the case."
            frameCount={frameCount} containerRef={containerRef}
          />
          <Hotspot 
            startFrame={120} endFrame={160} x={30} y={60} 
            title="Hotswap G-Pro Switches" description="Pre-lubed for buttery smooth acoustics."
            frameCount={frameCount} containerRef={containerRef}
          />
        </div>
        
        <div className="pointer-events-none absolute inset-0 z-5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-bg-primary/80" />

        <div ref={textRef} className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-15 p-4">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary-500" />
            <span className="text-sm font-medium tracking-wide text-gray-300">Premium Collection 2025</span>
          </div>
          
          <h1 className="font-space text-6xl md:text-8xl font-bold leading-tight tracking-tight">
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">Type Above</span>
            <span className="block text-primary-500">The Clouds</span>
          </h1>
          
          <p className="mt-6 max-w-xl text-lg text-gray-400 leading-relaxed">
            Precision engineered mechanics. Unmatched typing purity.
          </p>

          <div className="mt-10 flex gap-4">
            <button className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-600 to-primary-500 px-8 py-4 font-semibold text-white transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(249,115,22,0.5)]">
              Discover <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
            <button className="group rounded-full border border-white/20 bg-white/5 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10">
              Watch Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
