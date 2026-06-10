"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image, { ImageProps } from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ZoomableImage({ className, alt, quality = 60, ...props }: ImageProps & { quality?: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { width, height, ...restProps } = props;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent scroll when expanded
  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isExpanded]);

  // Handle escape key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsExpanded(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const lightbox = (
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-12 cursor-zoom-out"
          onClick={() => setIsExpanded(false)}
        >
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute top-6 right-6 z-[10000] p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20 shadow-2xl backdrop-blur-md"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(false);
            }}
          >
            <X size={28} />
          </motion.button>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full h-full flex items-center justify-center pointer-events-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full max-w-[95vw] max-h-[95vh] flex items-center justify-center">
              <Image
                {...restProps}
                alt={alt || "Expanded image"}
                fill
                className="object-contain pointer-events-auto cursor-zoom-out select-none"
                onClick={() => setIsExpanded(false)}
                priority
                quality={100}
                unoptimized // Optional: sometimes helps with very large layout shifts in portals
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div 
        className={cn("relative cursor-zoom-in group inline-block w-full h-full", className)}
        onClick={() => setIsExpanded(true)}
      >
        <Image
          alt={alt}
          width={width}
          height={height}
          quality={quality}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 900px"
          {...restProps}
          className={cn("transition-all duration-300 group-hover:brightness-95", className)}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 rounded-inherit pointer-events-none" />
      </div>

      {mounted && createPortal(lightbox, document.body)}
    </>
  );
}
