"use client";

import { motion, Variants } from "framer-motion";
import { Quote, CheckCircle2, Activity, Brain, Users, BookOpen } from "lucide-react";
import Image from "next/image";

// Імпортуємо англійські компоненти
import HeaderEn from "@/app/components/HeaderEn";
import FooterEn from "@/app/components/FooterEn";

export default function RehabilitationArticlePageEn() {
  
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };

  return (
    <div className="relative min-h-screen text-slate-900 dark:text-slate-50 transition-colors duration-500 overflow-x-hidden">
      
      {/* АБСТРАКТНИЙ ФОН */}
      <div className="fixed inset-0 -z-50 h-full w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
         <div className="absolute left-0 right-0 top-[-10%] -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 dark:bg-blue-700 opacity-20 dark:opacity-30 blur-[100px]"></div>
      </div>

      <HeaderEn />

      <main className="py-16 md:py-24 relative z-10">
        <article className="max-w-4xl mx-auto px-6">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center mb-16">
            <span className="text-blue-600 dark:text-blue-400 font-semibold tracking-wider uppercase text-sm mb-4 block">
              Director's Note
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-8 text-slate-900 dark:text-white leading-[1.15]">
              Child Rehabilitation: <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                An Investment in the Future
              </span>
            </h1>
            
            <div className="flex items-center justify-center gap-4 mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
              <div className="w-14 h-14 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
                <Image src="/images/shevckenko.webp" alt="Tetiana Shevchenko" fill className="object-cover" />
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-900 dark:text-white">Tetiana Shevchenko</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Acting Director, Pediatric Psychiatrist, Pediatric Neurologist</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2 }} className="prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed space-y-8">
            
            <p className="text-xl md:text-2xl font-medium text-slate-800 dark:text-slate-200 leading-relaxed mb-10">
              Child rehabilitation is a complex of medical, psychological, pedagogical, and social measures aimed at restoring or developing lost or unformed functions in children. Its main task is to help the child maximize their potential, prepare for education, socialization, and independent living.
            </p>

            <div className="grid md:grid-cols-2 gap-8 items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 rounded-3xl border border-slate-100 dark:border-slate-800 my-12 shadow-sm">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Today's Challenges</h3>
                <p>
                  In Ukraine, this topic is particularly relevant. According to UNICEF, about 1.5 million children in Ukraine are at risk of developing mental health problems, such as depression, anxiety, and PTSD. Furthermore, every year thousands of children are born with congenital diseases or sustain injuries that require long-term support.
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-900 dark:text-white">Main risk groups:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2"><CheckCircle2 className="text-blue-500 shrink-0 mt-1" size={18} /> <span>Children with disabilities (motor, sensory, intellectual).</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="text-blue-500 shrink-0 mt-1" size={18} /> <span>Children recovering from severe illnesses or injuries.</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="text-blue-500 shrink-0 mt-1" size={18} /> <span>Children with autism spectrum disorders and hyperactivity.</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="text-blue-500 shrink-0 mt-1" size={18} /> <span>Children who have experienced psychological trauma.</span></li>
                </ul>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-12 mb-6">Statistics and the Problem of CP</h2>
            <p>
              In the structure of childhood disability in the Zhytomyr region, mental and behavioral disorders take the second leading place (20.8%), which is 1,260 children. In third place are diseases of the central nervous system – 792 children (13.1%). The number of children with disabilities is growing every year.
            </p>
            <p>
              Cerebral palsy (CP) is the most common cause of disability. Rates in Ukraine (2.11 per 1000) and the Zhytomyr region (2.09 per 1000) remain stable, but there is a sharp increase among children with very low birth weight.
            </p>

            <div className="my-12">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">5 Categories of CP Risk Factors:</h3>
              <div className="space-y-4">
                {[
                  { title: "Pre-conception", desc: "Maternal epileptic seizures, thyroid diseases, maternal age over 40, etc." },
                  { title: "Prenatal period", desc: "Congenital defects, low birth weight, maternal illnesses (respiratory, cardiac), preeclampsia." },
                  { title: "Intrapartum (During birth)", desc: "Birth hypoxia, meconium aspiration, abnormal labor duration." },
                  { title: "Neonatal period", desc: "Seizures, respiratory distress, hypoglycemia, infections, and jaundice." },
                  { title: "Postneonatal period", desc: "Stroke, head trauma, bacterial meningitis, traffic accidents." }
                ].map((factor, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-100 dark:border-slate-800">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{factor.title}</h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{factor.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p>
              Molnar's work in the 1970s laid the foundation for understanding: if a child can sit independently before the age of 2, it is a positive prognosis for ambulation. Treatment requires a <strong>multidisciplinary team</strong>. It is essential that the family and the child are active team members in the goal-setting process. The ultimate goal is to facilitate the maximum development of the child's potential in motor, cognitive, and social spheres.
            </p>

            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-16 mb-8">Directions of Child Rehabilitation</h2>
            <div className="grid sm:grid-cols-2 gap-6 mb-12">
              <div className="p-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
                <Activity className="text-blue-500 mb-4" size={32} />
                <h4 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Medical Rehabilitation</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Physiotherapy, physical therapy, occupational therapy, speech therapy sessions.</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
                <Brain className="text-amber-500 mb-4" size={32} />
                <h4 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Psychological Support</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Individual and group consultations, art therapy, fairy-tale therapy, trauma work.</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
                <Users className="text-emerald-500 mb-4" size={32} />
                <h4 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Social Adaptation</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Integration into the educational environment, development of communication skills, inclusion.</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
                <BookOpen className="text-purple-500 mb-4" size={32} />
                <h4 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Educational Help</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Corrective and developmental sessions, family support, early intervention.</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-12 mb-6">The Future: Creation of a Child Center</h2>
            <p>
              Currently, a number of measures are being taken in the Zhytomyr region to create a modern, client-oriented, family-centric <strong>Child Center</strong>. It will be the legal successor of the regional orphanage, where back in 1996 (under the leadership of S.V. Ursulenko), early medical and social rehabilitation was introduced for the first time in Ukraine.
            </p>
            <p>
              Plans include: building an indoor pool with a ceiling suspension system, creating a hydrokinesitherapy room, building an art studio, and a sports playground for alternative sports. With the support of the Regional State Administration, an active search for funding is underway.
            </p>

            <blockquote className="mt-16 p-8 md:p-12 bg-blue-600 rounded-3xl text-white relative overflow-hidden shadow-2xl shadow-blue-600/30">
              <Quote className="absolute top-4 right-4 text-blue-500 opacity-50 rotate-180" size={120} />
              <div className="relative z-10">
                <p className="text-2xl md:text-3xl font-semibold leading-snug mb-8">
                  "Child rehabilitation in Ukraine today is not just a medical issue, but a strategic task for society. Supporting every child means investing in the future of the country."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur overflow-hidden relative border border-white/30">
                    <Image src="/images/shevckenko.webp" alt="Tetiana Shevchenko" fill className="object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Tetiana Shevchenko</p>
                    <p className="text-blue-200 text-sm">Acting Director of the Center</p>
                  </div>
                </div>
              </div>
            </blockquote>

          </motion.div>
        </article>
      </main>

      <FooterEn />
    </div>
  );
}