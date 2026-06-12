"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Eye, RotateCcw, X, Check, Type, SunMoon, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccessibility } from "@/app/components/AccessibilityProvider";

export function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState<"normal" | "lg" | "xl">("normal");
  const [readable, setReadable] = useState(false);
  const [colorMode, setColorMode] = useState<"normal" | "mono" | "contrast" | "invert">("normal");
  const { animationsDisabled, setAnimationsDisabled } = useAccessibility();

  const pathname = usePathname();
  const isEnglish = pathname.startsWith("/en");

  const applyFont = (size: "normal" | "lg" | "xl") => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    root.classList.remove("ac-font-lg", "ac-font-xl");
    if (size === "lg") root.classList.add("ac-font-lg");
    if (size === "xl") root.classList.add("ac-font-xl");
    localStorage.setItem("ac-font-size", size);
    setFontSize(size);
  };

  const applyReadable = (enabled: boolean) => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    if (enabled) {
      root.classList.add("ac-font-readable");
    } else {
      root.classList.remove("ac-font-readable");
    }
    localStorage.setItem("ac-readable-font", enabled ? "true" : "false");
    setReadable(enabled);
  };

  const applyColorMode = (mode: "normal" | "mono" | "contrast" | "invert") => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    root.classList.remove("ac-mono", "ac-contrast-high", "ac-invert");
    if (mode === "mono") root.classList.add("ac-mono");
    if (mode === "contrast") root.classList.add("ac-contrast-high");
    if (mode === "invert") root.classList.add("ac-invert");
    localStorage.setItem("ac-color-mode", mode);
    setColorMode(mode);
  };

  const resetAll = () => {
    applyFont("normal");
    applyReadable(false);
    applyColorMode("normal");
    setAnimationsDisabled(false);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedFont = (localStorage.getItem("ac-font-size") as any) || "normal";
    const savedReadable = localStorage.getItem("ac-readable-font") === "true";
    const savedColorMode = (localStorage.getItem("ac-color-mode") as any) || "normal";

    applyFont(savedFont);
    applyReadable(savedReadable);
    applyColorMode(savedColorMode);
  }, []);

  const translations = {
    title: isEnglish ? "Accessibility Settings" : "Налаштування доступності",
    fontSizeTitle: isEnglish ? "Text Size" : "Розмір тексту",
    fontNormal: isEnglish ? "Default" : "Звичайний",
    fontLg: isEnglish ? "Large (115%)" : "Збільшений (115%)",
    fontXl: isEnglish ? "Extra Large (130%)" : "Дуже великий (130%)",
    fontStyleTitle: isEnglish ? "Font Style" : "Стиль шрифту",
    fontStyleDefault: isEnglish ? "Default" : "Стандартний",
    fontStyleReadable: isEnglish ? "Readable (Arial)" : "Чіткий шрифт (Arial)",
    colorTitle: isEnglish ? "Color Filters" : "Колірні фільтри",
    colorNormal: isEnglish ? "Default" : "Звичайні кольори",
    colorMono: isEnglish ? "Monochrome" : "Чорно-білий (Моно)",
    colorContrast: isEnglish ? "High Contrast" : "Висока контрастність",
    colorInvert: isEnglish ? "Invert Colors" : "Інверсія кольорів",
    animationsTitle: isEnglish ? "Animations" : "Анімації",
    animationsEnabled: isEnglish ? "Enabled" : "Увімкнено",
    animationsDisabled: isEnglish ? "Disabled" : "Вимкнено",
    reset: isEnglish ? "Reset settings" : "Скинути налаштування",
    close: isEnglish ? "Close" : "Закрити",
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed right-4 bottom-20 md:bottom-auto md:top-1/3 z-[80]">
        <button
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all cursor-pointer group"
          title={translations.title}
          aria-label={translations.title}
        >
          <Eye size={24} className="group-hover:scale-110 transition-transform" />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            />

            {/* Panel Content */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-sm h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl p-6 flex flex-col justify-between z-10 text-slate-850 dark:text-slate-200 overflow-hidden"
            >
              <div className="flex flex-col flex-1 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800 mb-6 flex-shrink-0">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    <Eye size={20} className="text-blue-600 dark:text-blue-400" />
                    {translations.title}
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition cursor-pointer"
                    aria-label={translations.close}
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Scrollable list of controls */}
                <div className="flex-1 overflow-y-auto pr-1 -mr-1 space-y-6 pb-6 select-none">
                  {/* Font Size Section */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Type size={14} />
                      {translations.fontSizeTitle}
                    </label>
                    <div className="flex flex-col gap-2">
                      {[
                        { id: "normal", label: translations.fontNormal },
                        { id: "lg", label: translations.fontLg },
                        { id: "xl", label: translations.fontXl },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => applyFont(item.id as any)}
                          className={`flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm font-semibold transition cursor-pointer text-left ${
                            fontSize === item.id
                              ? "bg-blue-50 dark:bg-blue-950/30 border-blue-500 text-blue-600 dark:text-blue-400"
                              : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-white"
                          }`}
                        >
                          {item.label}
                          {fontSize === item.id && <Check size={16} />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Style Section */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Type size={14} />
                      {translations.fontStyleTitle}
                    </label>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => applyReadable(false)}
                        className={`flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm font-semibold transition cursor-pointer text-left ${
                          !readable
                            ? "bg-blue-50 dark:bg-blue-950/30 border-blue-500 text-blue-600 dark:text-blue-400"
                            : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        {translations.fontStyleDefault}
                        {!readable && <Check size={16} />}
                      </button>
                      <button
                        onClick={() => applyReadable(true)}
                        className={`flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm font-semibold transition cursor-pointer text-left ${
                          readable
                            ? "bg-blue-50 dark:bg-blue-950/30 border-blue-500 text-blue-600 dark:text-blue-400"
                            : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        {translations.fontStyleReadable}
                        {readable && <Check size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Color Filters Section */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <SunMoon size={14} />
                      {translations.colorTitle}
                    </label>
                    <div className="flex flex-col gap-2">
                      {[
                        { id: "normal", label: translations.colorNormal },
                        { id: "mono", label: translations.colorMono },
                        { id: "contrast", label: translations.colorContrast },
                        { id: "invert", label: translations.colorInvert },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => applyColorMode(item.id as any)}
                          className={`flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm font-semibold transition cursor-pointer text-left ${
                            colorMode === item.id
                              ? "bg-blue-50 dark:bg-blue-950/30 border-blue-500 text-blue-600 dark:text-blue-400"
                              : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-white"
                          }`}
                        >
                          {item.label}
                          {colorMode === item.id && <Check size={16} />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Animations Section */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Sparkles size={14} />
                      {translations.animationsTitle}
                    </label>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => setAnimationsDisabled(false)}
                        className={`flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm font-semibold transition cursor-pointer text-left ${
                          !animationsDisabled
                            ? "bg-blue-50 dark:bg-blue-950/30 border-blue-500 text-blue-600 dark:text-blue-400"
                            : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        {translations.animationsEnabled}
                        {!animationsDisabled && <Check size={16} />}
                      </button>
                      <button
                        onClick={() => setAnimationsDisabled(true)}
                        className={`flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm font-semibold transition cursor-pointer text-left ${
                          animationsDisabled
                            ? "bg-blue-50 dark:bg-blue-950/30 border-blue-500 text-blue-600 dark:text-blue-400"
                            : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        {translations.animationsDisabled}
                        {animationsDisabled && <Check size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reset Controls */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex-shrink-0">
                <button
                  onClick={resetAll}
                  className="w-full flex items-center justify-center gap-2 py-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white rounded-xl text-sm font-bold transition cursor-pointer"
                >
                  <RotateCcw size={16} />
                  {translations.reset}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

