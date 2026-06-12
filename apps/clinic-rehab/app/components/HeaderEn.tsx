"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

export default function HeaderEn() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeMenu = () => setIsMobileMenuOpen(false);
  const pathname = usePathname();

  const getUkrainianUrl = (path: string) => {
    if (!path) return "/";
    const mapping: Record<string, string> = {
      "/en": "/",
      "/en/about-us": "/pro-nas",
      "/en/news": "/novyny",
      "/en/contacts": "/kontakty",
      "/en/directions": "/napryamky",
      "/en/team": "/komanda",
      "/en/vacancy": "/vakansiyi",
      "/en/help": "/dopomoga",
      "/en/for-patient/documents": "/dlya-patsiyenta/dokumenty",
      "/en/for-patient/rehabilitation": "/dlya-patsiyenta/reabilitatsiya",
      "/en/for-patient/paid-services": "/dlya-patsiyenta/platni-poslugy",
      "/en/for-patient/faq": "/dlya-patsiyenta/faq",
      "/en/privacy-policy": "/privacy-policy",
    };
    if (path.startsWith('/en/news/')) {
      return path.replace('/en/news/', '/novyny/');
    }
    return mapping[path] || "/";
  };

  const ukrainianUrl = getUkrainianUrl(pathname);
  const isActive = (path: string) => pathname === path;
  const isDropdownActive = pathname.startsWith('/en/for-patient');
  const isAboutDropdownActive = pathname === '/en/about-us' || pathname === '/en/team' || pathname === '/en/vacancy';

  return (
    <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 dark:border-slate-800 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        
        <Link href="/en" className="flex items-center gap-3 md:gap-4 z-50 cursor-pointer">
          <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border border-blue-100 dark:border-slate-700 p-0.5 md:p-1 bg-white dark:bg-slate-800 shadow-inner flex-shrink-0">
              <Image src="/images/logo.png" alt="Logo" fill className="object-contain object-center" priority />
          </div>
          <span className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white tracking-tight truncate">Sails of Life</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
          <div className="relative group py-8">
            <button className={`flex items-center gap-1 transition cursor-pointer ${isAboutDropdownActive ? 'text-blue-600 dark:text-blue-400 font-bold' : 'hover:text-blue-600 dark:hover:text-blue-400'}`}>
              About Us <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
            </button>
            <div className="absolute top-[70px] left-0 w-56 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xl rounded-2xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <Link href="/en/about-us" className={`block px-5 py-2.5 transition cursor-pointer ${isActive('/en/about-us') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-blue-600 dark:hover:text-blue-400'}`}>About the Center</Link>
              <Link href="/en/team" className={`block px-5 py-2.5 transition cursor-pointer ${isActive('/en/team') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-blue-600 dark:hover:text-blue-400'}`}>Team</Link>
              <Link href="/en/vacancy" className={`block px-5 py-2.5 transition cursor-pointer ${isActive('/en/vacancy') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-blue-600 dark:hover:text-blue-400'}`}>Vacancies</Link>
            </div>
          </div>

          <Link href="/en/directions" className={`transition cursor-pointer ${isActive('/en/directions') ? 'text-blue-600 dark:text-blue-400 font-bold' : 'hover:text-blue-600 dark:hover:text-blue-400'}`}>Directions</Link>
          
          <div className="relative group py-8">
            <button className={`flex items-center gap-1 transition cursor-pointer ${isDropdownActive ? 'text-blue-600 dark:text-blue-400 font-bold' : 'hover:text-blue-600 dark:hover:text-blue-400'}`}>
              For Patients <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
            </button>
            <div className="absolute top-[70px] left-0 w-64 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xl rounded-2xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <Link href="/en/for-patient/documents" className={`block px-5 py-2.5 transition cursor-pointer ${isActive('/en/for-patient/documents') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-blue-600 dark:hover:text-blue-400'}`}>Documents</Link>
              <Link href="/en/for-patient/rehabilitation" className={`block px-5 py-2.5 transition cursor-pointer ${isActive('/en/for-patient/rehabilitation') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-blue-600 dark:hover:text-blue-400'}`}>Child Rehabilitation</Link>
              <Link href="/en/for-patient/paid-services" className={`block px-5 py-2.5 transition cursor-pointer ${isActive('/en/for-patient/paid-services') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-blue-600 dark:hover:text-blue-400'}`}>Paid Services</Link>
              <Link href="/en/for-patient/faq" className={`block px-5 py-2.5 transition cursor-pointer ${isActive('/en/for-patient/faq') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-blue-600 dark:hover:text-blue-400'}`}>FAQ</Link>
            </div>
          </div>

          <Link href="/en/news" className={`transition cursor-pointer ${pathname.startsWith('/en/news') ? 'text-blue-600 dark:text-blue-400 font-bold' : 'hover:text-blue-600 dark:hover:text-blue-400'}`}>News</Link>
          {/* <Link href="/en/help" className={`transition cursor-pointer ${isActive('/en/help') ? 'text-blue-600 dark:text-blue-400 font-bold' : 'hover:text-blue-600 dark:hover:text-blue-400'}`}>Help Us</Link> */}
        </nav>
        
        <div className="flex items-center gap-2 md:gap-4 z-50">
          <ThemeToggle />
          <div className="hidden sm:flex bg-slate-100 dark:bg-slate-800 rounded-full p-1 ml-2">
            <Link href={ukrainianUrl} className="text-xs px-3 py-1.5 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-white font-bold transition cursor-pointer">УКР</Link>
            <span className="text-xs px-3 py-1.5 rounded-full bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-bold shadow-sm cursor-default">EN</span>
          </div>
          
          <Link href="/en/contacts" className={`hidden md:flex px-6 py-3 rounded-full text-sm font-semibold transition shadow-lg cursor-pointer ${isActive('/en/contacts') ? 'bg-blue-700 text-white shadow-blue-700/20' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20'}`}>
            Contact Us
          </Link>
          
          <button aria-label="Open menu" className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition cursor-pointer" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
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
                <span className="text-sm text-slate-400 uppercase tracking-wider font-bold">About Us</span>
                <Link href="/en/about-us" onClick={closeMenu} className={`text-base transition cursor-pointer ${isActive('/en/about-us') ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>About the Center</Link>
                <Link href="/en/team" onClick={closeMenu} className={`text-base transition cursor-pointer ${isActive('/en/team') ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>Team</Link>
                <Link href="/en/vacancy" onClick={closeMenu} className={`text-base transition cursor-pointer ${isActive('/en/vacancy') ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>Vacancies</Link>
              </div>

              <Link href="/en/directions" onClick={closeMenu} className={`transition cursor-pointer ${isActive('/en/directions') ? 'text-blue-600 dark:text-blue-400 font-bold' : 'hover:text-blue-600 dark:hover:text-blue-400'}`}>Directions</Link>
              
              <div className="border-l-2 border-blue-500 pl-4 py-1 flex flex-col gap-4 bg-slate-50 dark:bg-slate-800/50 rounded-r-xl">
                <span className="text-sm text-slate-400 uppercase tracking-wider font-bold">For Patients</span>
                <Link href="/en/for-patient/documents" onClick={closeMenu} className={`text-base transition cursor-pointer ${isActive('/en/for-patient/documents') ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>Documents</Link>
                <Link href="/en/for-patient/rehabilitation" onClick={closeMenu} className={`text-base transition cursor-pointer ${isActive('/en/for-patient/rehabilitation') ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>Child Rehabilitation</Link>
                <Link href="/en/for-patient/paid-services" onClick={closeMenu} className={`text-base transition cursor-pointer ${isActive('/en/for-patient/paid-services') ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>Paid Services</Link>
                <Link href="/en/for-patient/faq" onClick={closeMenu} className={`text-base transition cursor-pointer ${isActive('/en/for-patient/faq') ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>FAQ</Link>
              </div>

              <Link href="/en/news" onClick={closeMenu} className={`transition cursor-pointer ${pathname.startsWith('/en/news') ? 'text-blue-600 dark:text-blue-400 font-bold' : 'hover:text-blue-600 dark:hover:text-blue-400'}`}>News</Link>
              {/* <Link href="/en/help" onClick={closeMenu} className={`transition cursor-pointer ${isActive('/en/help') ? 'text-blue-600 dark:text-blue-400 font-bold' : 'hover:text-blue-600 dark:hover:text-blue-400'}`}>Help Us</Link> */}
            </nav>

            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-full p-1 mx-auto mt-2 w-max">
              <Link href={ukrainianUrl} className="text-sm px-6 py-2 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-white font-bold transition cursor-pointer">УКР</Link>
              <span className="text-sm px-6 py-2 rounded-full bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-bold shadow-sm cursor-default">EN</span>
            </div>
            
            <Link href="/en/contacts" onClick={closeMenu} className="w-full bg-blue-600 text-white px-6 py-4 rounded-xl text-base font-semibold hover:bg-blue-700 transition text-center block mt-2 cursor-pointer">
              Contact Us
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
