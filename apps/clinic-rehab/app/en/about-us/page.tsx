"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, FileText, HeartPulse, ShieldCheck, History, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";

// ІМПОРТУЄМО АНГЛІЙСЬКІ КОМПОНЕНТИ
import HeaderEn from "@/app/components/HeaderEn";
import FooterEn from "@/app/components/FooterEn";

export default function AboutPageEn() {
  const [showFullHistory, setShowFullHistory] = useState(false);

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const nszuPackages = [
    { 
      id: "23", 
      title: "Inpatient palliative medical care",
      description: "Comprehensive medical care, pain relief, and 24/7 support in an inpatient setting for patients with severe diseases."
    },
    { 
      id: "24", 
      title: "Mobile palliative medical care",
      description: "Mobile medical, social, and psychological support for patients directly at their current location (at home)."
    },
    { 
      id: "25", 
      title: "Medical rehabilitation of infants (up to 3 years)",
      description: "Early intervention and rehabilitation measures for premature babies or those with congenital/acquired defects."
    },
    { 
      id: "53", 
      title: "Rehabilitation care in inpatient settings",
      description: "Intensive comprehensive rehabilitation under the supervision of a multidisciplinary team with 24/7 stay."
    },
    { 
      id: "54", 
      title: "Rehabilitation care in outpatient settings",
      description: "Rehabilitation sessions and procedures according to a schedule, without the need for a 24/7 stay at our center."
    },
    { 
      id: "86", 
      title: "Medical care for children requiring treatment and constant observation",
      description: "Includes 24/7 nursing care, medical observation, provision of medicines and food for children, especially under 4 years old, in vulnerable conditions."
    },
  ];

  return (
    <div className="relative min-h-screen text-slate-900 dark:text-slate-50 transition-colors duration-500 overflow-x-hidden">
      
      {/* АБСТРАКТНИЙ ФОН */}
      <div className="fixed inset-0 -z-50 h-full w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
         <div className="absolute left-0 right-0 top-[-10%] -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 dark:bg-blue-700 opacity-20 dark:opacity-30 blur-[100px]"></div>
      </div>

      <HeaderEn />

      {/* HERO СЕКЦІЯ */}
      <section className="pt-20 pb-16 bg-transparent border-b border-slate-200/50 dark:border-slate-800/50 transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
              From history to <span className="text-blue-600 dark:text-blue-400">modern standards</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              "Sails of Life" is the result of over a century of transformation. From an orphanage founded in 1919 to a modern Center for Medical Rehabilitation and Palliative Care for Children.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ДІЯЛЬНІСТЬ ТА АУДИТОРІЯ */}
      <section className="py-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                <HeartPulse size={24} />
              </div>
              <h2 className="text-3xl font-bold">Who We Serve</h2>
            </div>
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex gap-4 items-start">
                <CheckCircle2 className="text-emerald-500 shrink-0 mt-1" size={20} />
                <p className="text-slate-700 dark:text-slate-300">Children from birth to 3 years old (inclusive) requiring early intervention or medical rehabilitation services.</p>
              </div>
              <div className="flex gap-4 items-start">
                <CheckCircle2 className="text-emerald-500 shrink-0 mt-1" size={20} />
                <p className="text-slate-700 dark:text-slate-300">Children up to 14 years old who are at risk of acquiring a disability, and children with complex (palliative) diagnoses who require mobile palliative care.</p>
              </div>
              <div className="flex gap-4 items-start">
                <CheckCircle2 className="text-emerald-500 shrink-0 mt-1" size={20} />
                <p className="text-slate-700 dark:text-slate-300">Children with disabilities (up to 14 years old inclusive) and their legal representatives.</p>
              </div>
            </div>
          </motion.div>

          {/* ІСТОРІЯ (Інтерактивний таймлайн) */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center">
                <History size={24} />
              </div>
              <h2 className="text-3xl font-bold">Our Heritage</h2>
            </div>
            
            <div className="relative border-l-2 border-slate-200 dark:border-slate-700 pl-6 space-y-8 pb-4">
               {/* Базові етапи (завжди видимі) */}
               <div className="relative">
                 <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-600 border-4 border-slate-50 dark:border-slate-950"></div>
                 <h3 className="font-bold text-lg">1919</h3>
                 <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Foundation of the Zhytomyr Orphanage No. 1.</p>
               </div>

               {/* Розгорнута історія (анімована поява) */}
               <AnimatePresence>
                 {showFullHistory && (
                   <motion.div 
                     initial={{ height: 0, opacity: 0 }} 
                     animate={{ height: "auto", opacity: 1 }} 
                     exit={{ height: 0, opacity: 0 }}
                     className="space-y-8 overflow-hidden"
                   >
                     <div className="relative pt-8">
                       <div className="absolute -left-[31px] top-9 w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-600 border-4 border-slate-50 dark:border-slate-950"></div>
                       <h3 className="font-bold text-lg">1945 - 1973</h3>
                       <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">The first head doctors: H.Ya. Sadova (until 1966) and M.A. Bobokha (until 1973).</p>
                     </div>
                     <div className="relative">
                       <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-600 border-4 border-slate-50 dark:border-slate-950"></div>
                       <h3 className="font-bold text-lg">1973 - 1995</h3>
                       <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">A period of management changes. The facility was headed by: L.V. Krylova, S.S. Svyrydov, V.F. Kalyniuk, D.D. Yarmoliuk, V.F. Voloshyn, A.I. Miroshnychenko, V.O. Mariunin.</p>
                     </div>
                     <div className="relative">
                       <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-600 border-4 border-slate-50 dark:border-slate-950"></div>
                       <h3 className="font-bold text-lg">1980</h3>
                       <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">The Orphanage relocated to a new building at 8 Korabelna St.</p>
                     </div>
                     <div className="relative">
                       <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-600 border-4 border-slate-50 dark:border-slate-950"></div>
                       <h3 className="font-bold text-lg">1995 - 2025</h3>
                       <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">S.V. Ursulenko serves as Director — Honored Doctor of Ukraine. Beginning of the enterprise&apos;s reorganization in accordance with the National Reform Strategy.</p>
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>

               {/* Сьогодення (завжди видиме в кінці) */}
               <div className="relative">
                 <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-blue-500 border-4 border-slate-50 dark:border-slate-950 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                 <h3 className="font-bold text-lg text-blue-600 dark:text-blue-400">Present Day</h3>
                 <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                   Since April 2025, Tetiana Shevchenko has been the Acting Director. The institution is a modern Center for Medical Rehabilitation and Palliative Care.
                 </p>
               </div>
            </div>

            {/* Кнопка розгортання/згортання */}
            <button 
              onClick={() => setShowFullHistory(!showFullHistory)}
              className="mt-6 flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            >
              {showFullHistory ? "Collapse history" : "Expand history"}
              {showFullHistory ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </motion.div>
        </div>
      </section>

      {/* ПАКЕТИ НСЗУ */}
      <section className="py-20 bg-blue-50/80 dark:bg-slate-900/40 backdrop-blur border-y border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">State Guarantees and Licenses</h2>
            <p className="text-slate-650 dark:text-slate-350">
                The enterprise is a medical institution of the highest accreditation level and provides <span className="font-bold text-blue-600 dark:text-blue-400">free</span> services under contracts with the National Health Service of Ukraine (NHSU).
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              {nszuPackages.map((pkg, idx) => (
                <motion.div 
                  key={pkg.id}
                  initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                  className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 flex flex-col gap-3.5 hover:shadow-md hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-extrabold px-3 py-1.5 rounded-xl shrink-0">
                      №{pkg.id}
                    </div>
                    <h3 className="text-slate-900 dark:text-white font-bold text-sm leading-snug">{pkg.title}</h3>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed pl-1">{pkg.description}</p>
                </motion.div>
              ))}
            </div>

            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 flex items-center gap-4 hover:shadow-md hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all duration-300">
                <div className="w-12 h-12 bg-amber-50 dark:bg-amber-950/30 text-amber-500 dark:text-amber-400 rounded-xl flex items-center justify-center shrink-0">
                  <Award size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">ISO 9001:2015 Certificate</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Meets national quality management standards.</p>
                </div>
              </div>
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 flex items-center gap-4 hover:shadow-md hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all duration-300">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/30 text-blue-500 dark:text-blue-400 rounded-xl flex items-center justify-center shrink-0">
                  <FileText size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Educational License</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Organization of the educational process.</p>
                </div>
              </div>
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 flex items-center gap-4 hover:shadow-md hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all duration-300">
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 dark:text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Special Licenses</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Medical practice, use of ionizing radiation sources.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ГАЛЕРЕЯ */}
      <section className="py-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-10 text-center">Life at Our Center</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 relative h-80 rounded-3xl overflow-hidden group">
              <Image src="/images/news/visiv1.webp" alt="Rehabilitation Team" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <p className="absolute bottom-6 left-6 text-white font-medium text-lg">Our Team</p>
            </div>
            <div className="relative h-80 rounded-3xl overflow-hidden group">
              <Image src="/images/pro-nas/image1.webp" alt="Main Entrance" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <p className="absolute bottom-6 left-6 text-white font-medium">Main Entrance</p>
            </div>
            <div className="relative h-64 rounded-3xl overflow-hidden group">
              <Image src="/images/pro-nas/image3.webp" alt="Playground" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <p className="absolute bottom-6 left-6 text-white font-medium">Playground</p>
            </div>
            <div className="relative h-64 rounded-3xl overflow-hidden group">
              <Image src="/images/pro-nas/image4.webp" alt="Physical Therapy Hall" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <p className="absolute bottom-6 left-6 text-white font-medium">Physical Therapy Hall</p>
            </div>
            <div className="relative h-64 rounded-3xl overflow-hidden group">
              <Image src="/images/pro-nas/image7.webp" alt="Aquarium" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <p className="absolute bottom-6 left-6 text-white font-medium">Our Patients' Favorites</p>
            </div>
          </div>
        </div>
      </section>

      <FooterEn />
    </div>
  );
}