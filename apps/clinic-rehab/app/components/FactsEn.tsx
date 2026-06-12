"use client";

import Image from 'next/image';
import { motion, Variants } from 'framer-motion';

const facts = [
  { id: 1, title: 'Comprehensive Approach', desc: 'The center provides both rehabilitative and palliative care to children with severe and chronic diseases.', img: '/images/fact1.webp' },
  { id: 2, title: 'Multidisciplinary Team', desc: 'The center employs doctors, physical therapists, psychologists, speech therapists, social workers, and nurses.', img: '/images/fact2.webp' },
  { id: 3, title: 'Individual Programs', desc: 'Every child receives a tailored treatment and care plan according to their needs.', img: '/images/fact3.webp' },
  { id: 4, title: 'Modern Equipment', desc: 'The center is equipped with modern rehabilitative and diagnostic equipment.', img: '/images/fact8.webp' },
  { id: 5, title: 'Palliative Support', desc: 'Not only medical care is provided, but also psychological and emotional support for the child and their family.', img: '/images/fact5.webp' },
  { id: 6, title: 'Educational Programs', desc: 'The center organizes training and workshops for parents, caregivers, and medical staff.', img: '/images/fact11.webp' },
  { id: 7, title: 'Child-Friendly', desc: 'The interiors are designed in a cozy, child-friendly style.', img: '/images/fact7.webp' },
  { id: 8, title: 'Social Adaptation', desc: 'Specialists help children integrate into society, study, and develop communication skills.', img: '/images/fact4.webp' },
  { id: 9, title: 'Psychological Help', desc: 'The center supports not only the child but also their parents and siblings.', img: '/images/fact9.webp' },
  { id: 10, title: 'Cooperation with NGOs', desc: 'The facility collaborates with charity funds and NGOs to support patients.', img: '/images/fact10.webp' },
  { id: 11, title: 'Continuity of Care', desc: 'Medical observation and care can continue both in the hospital and at home.', img: '/images/fact6.webp' },
  { id: 12, title: 'Belief in Quality of Life', desc: 'The main goal of the center is not just to prolong the child\'s life, but to make it fulfilling.', img: '/images/fact12.webp' },
];

const FactsEn = () => {
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 18,
        duration: 0.8
      }
    },
  };

  return (
    <section className="py-24 transition-colors duration-500 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        
        <h2 className="text-4xl md:text-5xl font-bold text-center text-slate-900 dark:text-white mb-16 tracking-tight max-w-3xl mx-auto transition-colors">
          12 facts about the Medical Rehabilitation Center <span className="text-blue-600 dark:text-blue-400">Sails of Life</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {facts.map((fact) => (
            <motion.div 
              key={fact.id} 
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[32px] overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl dark:hover:shadow-blue-900/10 transition-all duration-300 group flex flex-col"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="relative h-56 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <Image 
                  src={fact.img} 
                  alt={fact.title} 
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  priority={fact.id <= 4}
                  className="object-cover object-center group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-8 flex-grow flex flex-col justify-center">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight transition-colors">
                  {fact.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed transition-colors">
                  {fact.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FactsEn;