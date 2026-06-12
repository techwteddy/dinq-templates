"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeMenu = () => setIsMobileMenuOpen(false);
  const pathname = usePathname();

  const getEnglishUrl = (path: string) => {
    if (!path) return "/en";
    const mapping: Record<string, string> = {
      "/": "/en",
      "/pro-nas": "/en/about-us",
      "/novyny": "/en/news",
      "/kontakty": "/en/contacts",
      "/napryamky": "/en/directions",
      "/komanda": "/en/team",
      "/vakansiyi": "/en/vacancy",
      "/dopomoga": "/en/help",
      "/dlya-patsiyenta/dokumenty": "/en/for-patient/documents",
      "/dlya-patsiyenta/reabilitatsiya": "/en/for-patient/rehabilitation",
      "/dlya-patsiyenta/platni-poslugy": "/en/for-patient/paid-services",
      "/dlya-patsiyenta/faq": "/en/for-patient/faq",
      "/privacy-policy": "/en/privacy-policy",
    };
    if (path.startsWith('/novyny/')) {
      return path.replace('/novyny/', '/en/news/');
    }
    return mapping[path] || "/en";
  };

  const englishUrl = getEnglishUrl(pathname);
  const isActive = (path: string) => pathname === path;
  const isDropdownActive = pathname.startsWith('/dlya-patsiyenta');
  const isAboutDropdownActive = pathname === '/pro-nas' || pathname === '/komanda' || pathname === '/vakansiyi';

  return (
    <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 dark:border-slate-800 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        
        <Link href="/" className="flex items-center gap-3 md:gap-4 z-50 cursor-pointer">
          <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border border-blue-100 dark:border-slate-700 p-0.5 md:p-1 bg-white dark:bg-slate-800 shadow-inner flex-shrink-0">
              <Image src="/images/logo.png" alt="Logo" fill className="object-contain object-center" priority />
          </div>
          <span className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white tracking-tight truncate">Вітрила Життя</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
          <div className="relative group py-8">
            <button className={`flex items-center gap-1 transition cursor-pointer ${isAboutDropdownActive ? 'text-blue-600 dark:text-blue-400 font-bold' : 'hover:text-blue-600 dark:hover:text-blue-400'}`}>
              Про нас <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
            </button>
            <div className="absolute top-[70px] left-0 w-56 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xl rounded-2xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <Link href="/pro-nas" className={`block px-5 py-2.5 transition cursor-pointer ${isActive('/pro-nas') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-blue-600 dark:hover:text-blue-400'}`}>Про центр</Link>
              <Link href="/komanda" className={`block px-5 py-2.5 transition cursor-pointer ${isActive('/komanda') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-blue-600 dark:hover:text-blue-400'}`}>Команда</Link>
              <Link href="/vakansiyi" className={`block px-5 py-2.5 transition cursor-pointer ${isActive('/vakansiyi') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-blue-600 dark:hover:text-blue-400'}`}>Вакансії</Link>
            </div>
          </div>

          <Link href="/napryamky" className={`transition cursor-pointer ${isActive('/napryamky') ? 'text-blue-600 dark:text-blue-400 font-bold' : 'hover:text-blue-600 dark:hover:text-blue-400'}`}>Напрямки</Link>
          
          <div className="relative group py-8">
            <button className={`flex items-center gap-1 transition cursor-pointer ${isDropdownActive ? 'text-blue-600 dark:text-blue-400 font-bold' : 'hover:text-blue-600 dark:hover:text-blue-400'}`}>
              Для пацієнта <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
            </button>
            <div className="absolute top-[70px] left-0 w-64 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xl rounded-2xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <Link href="/dlya-patsiyenta/dokumenty" className={`block px-5 py-2.5 transition cursor-pointer ${isActive('/dlya-patsiyenta/dokumenty') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-blue-600 dark:hover:text-blue-400'}`}>Документи</Link>
              <Link href="/dlya-patsiyenta/reabilitatsiya" className={`block px-5 py-2.5 transition cursor-pointer ${isActive('/dlya-patsiyenta/reabilitatsiya') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-blue-600 dark:hover:text-blue-400'}`}>Дитяча реабілітація</Link>
              <Link href="/dlya-patsiyenta/platni-poslugy" className={`block px-5 py-2.5 transition cursor-pointer ${isActive('/dlya-patsiyenta/platni-poslugy') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-blue-600 dark:hover:text-blue-400'}`}>Платні послуги</Link>
              <Link href="/dlya-patsiyenta/faq" className={`block px-5 py-2.5 transition cursor-pointer ${isActive('/dlya-patsiyenta/faq') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-blue-600 dark:hover:text-blue-400'}`}>Часті запитання (FAQ)</Link>
            </div>
          </div>

          <Link href="/novyny" className={`transition cursor-pointer ${pathname.startsWith('/novyny') ? 'text-blue-600 dark:text-blue-400 font-bold' : 'hover:text-blue-600 dark:hover:text-blue-400'}`}>Новини</Link>
          {/* <Link href="/dopomoga" className={`transition cursor-pointer ${isActive('/dopomoga') ? 'text-blue-600 dark:text-blue-400 font-bold' : 'hover:text-blue-600 dark:hover:text-blue-400'}`}>Допомогти</Link> */}
        </nav>
        
        <div className="flex items-center gap-2 md:gap-4 z-50">
          <ThemeToggle />
          <div className="hidden sm:flex bg-slate-100 dark:bg-slate-800 rounded-full p-1 ml-2">
            <span className="text-xs px-3 py-1.5 rounded-full bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-bold shadow-sm cursor-default">УКР</span>
            <Link href={englishUrl} className="text-xs px-3 py-1.5 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-white font-bold transition cursor-pointer">EN</Link>
          </div>
          
          <Link href="/kontakty" className={`hidden md:flex px-6 py-3 rounded-full text-sm font-semibold transition shadow-lg cursor-pointer ${isActive('/kontakty') ? 'bg-blue-700 text-white shadow-blue-700/20' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20'}`}>
            Зв'язатися
          </Link>
          
          <button aria-label="Menu" className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition cursor-pointer" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }}
            className="absolute top-20 left-0 w-full max-h-[calc(100vh-80px)] overflow-y-auto bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shadow-xl md:hidden flex flex-col px-6 py-6 gap-6"
          >
            <nav className="flex flex-col gap-5 text-lg font-medium text-slate-700 dark:text-slate-200">
              <div className="border-l-2 border-blue-500 pl-4 py-1 flex flex-col gap-4 bg-slate-50 dark:bg-slate-800/50 rounded-r-xl">
                <span className="text-sm text-slate-400 uppercase tracking-wider font-bold">Про нас</span>
                <Link href="/pro-nas" onClick={closeMenu} className={`text-base transition cursor-pointer ${isActive('/pro-nas') ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>Про центр</Link>
                <Link href="/komanda" onClick={closeMenu} className={`text-base transition cursor-pointer ${isActive('/komanda') ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>Команда</Link>
                <Link href="/vakansiyi" onClick={closeMenu} className={`text-base transition cursor-pointer ${isActive('/vakansiyi') ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>Вакансії</Link>
              </div>

              <Link href="/napryamky" onClick={closeMenu} className={`transition cursor-pointer ${isActive('/napryamky') ? 'text-blue-600 dark:text-blue-400 font-bold' : 'hover:text-blue-600 dark:hover:text-blue-400'}`}>Напрямки</Link>
              
              <div className="border-l-2 border-blue-500 pl-4 py-1 flex flex-col gap-4 bg-slate-50 dark:bg-slate-800/50 rounded-r-xl">
                <span className="text-sm text-slate-400 uppercase tracking-wider font-bold">Для пацієнта</span>
                <Link href="/dlya-patsiyenta/dokumenty" onClick={closeMenu} className={`text-base transition cursor-pointer ${isActive('/dlya-patsiyenta/dokumenty') ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>Документи</Link>
                <Link href="/dlya-patsiyenta/reabilitatsiya" onClick={closeMenu} className={`text-base transition cursor-pointer ${isActive('/dlya-patsiyenta/reabilitatsiya') ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>Дитяча реабілітація</Link>
                <Link href="/dlya-patsiyenta/platni-poslugy" onClick={closeMenu} className={`text-base transition cursor-pointer ${isActive('/dlya-patsiyenta/platni-poslugy') ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>Платні послуги</Link>
                <Link href="/dlya-patsiyenta/faq" onClick={closeMenu} className={`text-base transition cursor-pointer ${isActive('/dlya-patsiyenta/faq') ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>Часті запитання (FAQ)</Link>
              </div>

              <Link href="/novyny" onClick={closeMenu} className={`transition cursor-pointer ${pathname.startsWith('/novyny') ? 'text-blue-600 dark:text-blue-400 font-bold' : 'hover:text-blue-600 dark:hover:text-blue-400'}`}>Новини</Link>
              {/* <Link href="/dopomoga" onClick={closeMenu} className={`transition cursor-pointer ${isActive('/dopomoga') ? 'text-blue-600 dark:text-blue-400 font-bold' : 'hover:text-blue-600 dark:hover:text-blue-400'}`}>Допомогти</Link> */}
            </nav>

            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-full p-1 mx-auto mt-2 w-max">
              <span className="text-sm px-6 py-2 rounded-full bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-bold shadow-sm cursor-default">УКР</span>
              <Link href={englishUrl} className="text-sm px-6 py-2 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-white font-bold transition cursor-pointer">EN</Link>
            </div>
            
            <Link href="/kontakty" onClick={closeMenu} className="w-full bg-blue-600 text-white px-6 py-4 rounded-xl text-base font-semibold hover:bg-blue-700 transition text-center block mt-2 cursor-pointer">
              Зв'язатися з нами
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
