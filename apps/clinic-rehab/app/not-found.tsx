"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Імпортуємо обидва Хедери
import Header from "@/app/components/Header"; 
import HeaderEn from "@/app/components/HeaderEn";

export default function NotFound() {
  const pathname = usePathname();
  
  // Перевіряємо, чи був користувач в англійському розділі
  const isEnglish = pathname?.startsWith('/en');

  // ==========================================
  // АНГЛІЙСЬКА ВЕРСІЯ 404
  // ==========================================
  if (isEnglish) {
    return (
      <>
        <HeaderEn />
        <main className="min-h-[75vh] flex flex-col items-center justify-center text-center px-6">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 blur-[80px] opacity-20 rounded-full w-full h-full -z-10"></div>
            <h1 className="text-8xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 mb-4 drop-shadow-sm">
              404
            </h1>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-4">
            Oops! Page not found
          </h2>
          
          <p className="text-slate-600 dark:text-slate-300 max-w-lg mb-10 text-lg">
            It looks like you followed a broken link. We recently updated our website, and some pages have moved. But don't worry, you can find everything you need on the homepage!
          </p>
          
          <Link 
            href="/en" 
            className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition shadow-xl shadow-blue-600/30 hover:scale-105 active:scale-95"
          >
            Return to Homepage
          </Link>
        </main>
      </>
    );
  }

  // ==========================================
  // УКРАЇНСЬКА ВЕРСІЯ 404 (За замовчуванням)
  // ==========================================
  return (
    <>
      <Header />
      <main className="min-h-[75vh] flex flex-col items-center justify-center text-center px-6">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500 blur-[80px] opacity-20 rounded-full w-full h-full -z-10"></div>
          
          <h1 className="text-8xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 mb-4 drop-shadow-sm">
            404
          </h1>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-4">
          Ой! Сторінку не знайдено
        </h2>
        
        <p className="text-slate-600 dark:text-slate-300 max-w-lg mb-10 text-lg">
          Схоже, ви перейшли за старим посиланням. Ми нещодавно оновили наш сайт, і деякі сторінки переїхали за новими адресами. Але не хвилюйтеся, все найважливіше — на головній!
        </p>
        
        <Link 
          href="/" 
          className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition shadow-xl shadow-blue-600/30 hover:scale-105 active:scale-95"
        >
          Повернутися на головну
        </Link>
      </main>
    </>
  );
}