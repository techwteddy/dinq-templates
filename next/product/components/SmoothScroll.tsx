"use client";

import { ReactNode, useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Global olayları dinle
    const handleLoading = () => {
      lenis.stop(); // Scroll'u tamamen durdur
      document.body.classList.add('overflow-hidden');
    };
    const handleLoaded = () => {
      lenis.start(); // Scroll'u tekrar aç
      document.body.classList.remove('overflow-hidden');
    };

    window.addEventListener("experience-loading", handleLoading);
    window.addEventListener("experience-loaded", handleLoaded);

    // İlk başta durdur (çünkü sayfa yükleniyor durumunda başlıyor)
    lenis.stop();

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
      window.removeEventListener("experience-loading", handleLoading);
      window.removeEventListener("experience-loaded", handleLoaded);
    };
  }, []);

  return <div className="will-change-transform">{children}</div>;
}
