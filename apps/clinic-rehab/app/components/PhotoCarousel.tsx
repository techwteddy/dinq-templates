"use client";

import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useAccessibility } from "@/app/components/AccessibilityProvider";

export default function PhotoCarousel({ images }: { images: string[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  
  // Стани для масштабування та паннінгу
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const pathname = usePathname();
  const isEnglish = pathname.startsWith("/en");
  const { animationsDisabled } = useAccessibility();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Блокуємо скрол основної сторінки, коли фото відкрито на весь екран
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedIndex]);

  // Скидаємо масштаб та зсув при перемиканні фото
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setIsDragging(false);
  }, [selectedIndex]);

  // Функції гортання вліво/вправо в модальному вікні
  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0));
  };

  // Слухаємо клавіатуру (Escape для закриття, стрілки для гортання)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex]);

  // Масштабування коліщатком миші
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomStep = 0.2;
    setScale((prev) => {
      const nextScale = prev - (e.deltaY > 0 ? zoomStep : -zoomStep);
      const finalScale = Math.min(Math.max(nextScale, 1), 5); // масштаб від 1х до 5х
      if (finalScale === 1) {
        setPosition({ x: 0, y: 0 });
      }
      return finalScale;
    });
  };

  // Перетягування мишею збільшеного зображення
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || scale <= 1) return;
    e.preventDefault();
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    // Обмежуємо вихід картинки за межі екрана
    const maxShiftX = window.innerWidth * (scale - 1) * 0.45;
    const maxShiftY = window.innerHeight * (scale - 1) * 0.45;

    setPosition({
      x: Math.min(Math.max(newX, -maxShiftX), maxShiftX),
      y: Math.min(Math.max(newY, -maxShiftY), maxShiftY)
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: animationsDisabled ? "auto" : "smooth" });
    }
  };

  if (!images || images.length === 0) return null;

  const modalContent = (
    <AnimatePresence>
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 md:p-10">
          
          {/* Темний фон, клік по якому закриває фото */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelectedIndex(null)}
            className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-zoom-out"
          />

          {/* Інструкція з масштабування */}
          <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20 text-[10px] md:text-xs text-white/50 pointer-events-none select-none">
            {isEnglish 
              ? "Mouse wheel: zoom • Drag to pan" 
              : "Коліщатко миші: масштаб • Затисніть та тягніть для руху"}
          </div>

          {/* Кнопка "Вліво" */}
          {images.length > 1 && (
            <button
              onClick={handlePrev}
              className="absolute left-4 md:left-6 z-20 w-12 h-12 bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95 text-white rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg backdrop-blur-xs border border-white/10"
              aria-label="Попереднє фото"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          {/* Контейнер з фотографією */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl aspect-[4/3] md:aspect-video rounded-3xl overflow-hidden shadow-2xl z-10 bg-black/20"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
              cursor: scale > 1 ? (isDragging ? "grabbing" : "grab") : "default"
            }}
          >
            {/* Кнопка закриття (Хрестик) */}
            <button 
              onClick={() => setSelectedIndex(null)}
              className="absolute top-4 right-4 md:top-6 md:right-6 z-20 w-10 h-10 md:w-12 md:h-12 bg-black/50 hover:bg-black/85 backdrop-blur-md text-white rounded-full flex items-center justify-center transition-all hover:scale-105 cursor-pointer shadow-lg"
              title="Закрити"
            >
              <X size={24} />
            </button>

            {/* Лічильник */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-black/50 backdrop-blur-md text-white text-xs md:text-sm font-bold px-4 py-2 rounded-full pointer-events-none select-none">
                {selectedIndex + 1} / {images.length}
              </div>
            )}

            <Image 
              src={images[selectedIndex]} 
              alt={`Збільшене фото ${selectedIndex + 1}`} 
              fill 
              className="object-contain select-none" 
              priority
              unoptimized
              style={{
                transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                transition: isDragging ? "none" : "transform 0.15s ease-out"
              }}
            />
          </motion.div>

          {/* Кнопка "Вправо" */}
          {images.length > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 md:right-6 z-20 w-12 h-12 bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95 text-white rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg backdrop-blur-xs border border-white/10"
              aria-label="Наступне фото"
            >
              <ChevronRight size={28} />
            </button>
          )}

        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* --- ОСНОВНА КАРУСЕЛЬ (Або одне фото) --- */}
      {images.length === 1 ? (
        <div 
          className="relative w-full aspect-video md:aspect-[21/9] rounded-[32px] overflow-hidden mb-10 shadow-lg cursor-zoom-in group bg-slate-200 dark:bg-slate-800"
          onClick={() => setSelectedIndex(0)}
        >
          <Image 
            src={images[0]} 
            alt="Фото новини" 
            fill 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            className="object-cover group-hover:scale-105 transition-transform duration-700" 
            priority 
            unoptimized
          />
        </div>
      ) : (
        <div className="relative w-full mb-10 group">
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {images.map((src, index) => (
              <div 
                key={`${src}-${index}`} 
                className="relative w-full md:w-[85%] shrink-0 aspect-video md:aspect-[21/9] snap-center rounded-[32px] overflow-hidden shadow-md cursor-zoom-in group/photo bg-slate-200 dark:bg-slate-800"
                onClick={() => setSelectedIndex(index)}
              >
                <Image 
                  src={src} 
                  alt={`Фото ${index + 1}`} 
                  fill 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px" 
                  className="object-cover group-hover/photo:scale-105 transition-transform duration-700" 
                  priority
                  unoptimized 
                />
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full pointer-events-none">
                  {index + 1} / {images.length}
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:block pointer-events-none absolute inset-0">
            <button 
              onClick={(e) => { e.stopPropagation(); scroll("left"); }}
              className="pointer-events-auto absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-xl rounded-full flex items-center justify-center text-slate-800 dark:text-white opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hover:bg-white"
            >
              <ChevronLeft size={28} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); scroll("right"); }}
              className="pointer-events-auto absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-xl rounded-full flex items-center justify-center text-slate-800 dark:text-white opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hover:bg-white"
            >
              <ChevronRight size={28} />
            </button>
          </div>
        </div>
      )}

      {/* --- МОДАЛЬНЕ ВІКНО ЧЕРЕЗ ПОРТАЛ --- */}
      {mounted ? createPortal(modalContent, document.body) : null}
    </>
  );
}