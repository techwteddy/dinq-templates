"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function SplashScreen() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Перевіряємо, чи користувач вже бачив заставку (чи є запис у пам'яті браузера)
    const hasSeenSplash = sessionStorage.getItem("splash_shown");
    
    if (hasSeenSplash) {
      // Якщо вже бачив - миттєво ховаємо
      setShowSplash(false);
    } else {
      // Якщо це перший захід - показуємо анімацію і робимо запис в пам'ять
      sessionStorage.setItem("splash_shown", "true");
      
      // Через 2 секунди запускаємо процес зникнення
      const timer = setTimeout(() => setShowSplash(false), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          key="splash"
          // Заставка плавно зникає, відкриваючи сайт
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-50 dark:bg-slate-950"
        >
          <motion.div
            // Логотип гарно виринає з центру
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            // МАГІЯ: Логотип летить у лівий верхній кут і зменшується, імітуючи посадку в хедер
            exit={{ scale: 0.4, y: "-40vh", x: "-30vw", opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="flex flex-col items-center gap-6"
          >
            <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center p-2 shadow-2xl shadow-blue-500/20">
              <Image 
                src="/images/logo.png" 
                alt="Логотип Вітрила Життя" 
                width={100} 
                height={100} 
                className="rounded-full object-contain"
                priority 
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Вітрила Життя
            </h1>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}