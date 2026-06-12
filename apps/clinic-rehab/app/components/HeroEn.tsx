"use client";

import { motion, Variants } from "framer-motion";
import { ShieldCheck, ArrowRight, PhoneCall } from "lucide-react";
import Image from "next/image";
import Link from "next/link"; 

export default function HeroEn() {
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  return (
    <section className="relative pt-16 pb-16 md:pt-24 md:pb-20 lg:pt-32 lg:pb-28 overflow-hidden border-b border-slate-100 dark:border-slate-800 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-center">
        
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="lg:col-span-6 text-center lg:text-left">
          
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 text-blue-700 dark:text-blue-300 text-xs md:text-sm font-semibold mb-6 md:mb-8 transition-colors">
            <ShieldCheck size={16} />
            <span className="truncate">Communal Medical Institution</span>
          </motion.div>
          
          <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15] mb-6 transition-colors">
            A space of <span className="text-blue-600 dark:text-blue-400">care</span>, support, and recovery.
          </motion.h1>
          
          <motion.p variants={fadeUp} className="text-base md:text-lg lg:text-xl text-slate-600 dark:text-slate-300 mb-8 md:mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0 transition-colors">
            Medical Rehabilitation and Palliative Care Center for Children. We combine modern medicine, psychological support, and boundless empathy.
          </motion.p>
          
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 md:gap-4">
            <Link 
              href="/en/contacts" 
              className="w-full sm:w-auto px-6 py-4 md:px-10 md:py-5 bg-blue-600 text-white rounded-xl md:rounded-2xl font-semibold hover:bg-blue-700 transition shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 group"
            >
              Book an Appointment
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <a 
              href="tel:+380674572828" 
              className="w-full sm:w-auto px-6 py-4 md:px-10 md:py-5 bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-800 transition flex items-center justify-center gap-2 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <PhoneCall size={18} className="text-slate-400 dark:text-slate-400 transition-colors" />
              (067) 457-28-28
            </a>
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="lg:col-span-6 relative aspect-[4/3] md:aspect-[5/4] rounded-3xl md:rounded-[40px] overflow-hidden shadow-2xl shadow-slate-200 dark:shadow-none border-4 border-white dark:border-slate-800 transition-colors w-full">
          <Image src="/images/fact1.webp" alt="Child with a rehabilitator" className="object-cover object-center" priority fill sizes="(max-width: 1024px) 100vw, 50vw" />
        </motion.div>
      </div>
    </section>
  );
}