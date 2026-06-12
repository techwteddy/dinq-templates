"use client";

import Image from 'next/image';
import { motion, Variants } from 'framer-motion';

const facts = [
  { id: 1, title: 'Комплексний підхід', desc: 'Центр забезпечує як реабілітаційну, так і паліативну допомогу дітям з важкими та хронічними захворюваннями.', img: '/images/fact1.webp' },
  { id: 2, title: 'Мультидисциплінарна команда', desc: 'У центрі працюють лікарі, реабілітологи, психологи, логопеди, соціальні працівники та медичні сестри.', img: '/images/fact2.webp' },
  { id: 3, title: 'Індивідуальні програми', desc: 'Кожна дитина отримує індивідуально розроблений план лікування та догляду відповідно до своїх потреб.', img: '/images/fact3.webp' },
  { id: 4, title: 'Сучасне обладнання', desc: 'Центр оснащений сучасною реабілітаційною та діагностичною апаратурою.', img: '/images/fact8.webp' },
  { id: 5, title: 'Паліативна підтримка', desc: 'Надається не лише медична допомога, а й психологічна та емоційна підтримка для дитини та її родини.', img: '/images/fact5.webp' },
  { id: 6, title: 'Освітні програми', desc: 'Центр організовує навчання та тренінги для батьків, доглядульників та медичних працівників.', img: '/images/fact11.webp' },
  { id: 7, title: 'Доброзичливість до дітей', desc: 'Інтер\'єри закладу оформлені в затишному, дружньому до дитини стилі.', img: '/images/fact7.webp' },
  { id: 8, title: 'Соціальна адаптація', desc: 'Фахівці допомагають дітям інтегруватися в суспільство, навчання, розвивати навички спілкування.', img: '/images/fact4.webp' },
  { id: 9, title: 'Психологічна допомога родині', desc: 'Центр підтримує не лише дитину, а й її батьків та братів/сестер.', img: '/images/fact9.webp' },
  { id: 10, title: 'Співпраця з БФ', desc: 'Заклад співпрацює з фондами та громадськими організаціями для підтримки пацієнтів.', img: '/images/fact10.webp' },
  { id: 11, title: 'Безперервність допомоги', desc: 'Медичне спостереження та догляд можуть тривати як у стаціонарі, так і вдома.', img: '/images/fact6.webp' },
  { id: 12, title: 'Віра в якість життя', desc: 'Головна мета центру — не лише продовжити життя дитини, а зробити його повноцінним.', img: '/images/fact12.webp' },
];

const Facts = () => {
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
        
        {/* Заголовок тепер підтримує темну тему */}
        <h2 className="text-4xl md:text-5xl font-bold text-center text-slate-900 dark:text-white mb-16 tracking-tight max-w-3xl mx-auto transition-colors">
          12 фактів про Центр медичної реабілітації <span className="text-blue-600 dark:text-blue-400">Вітрила Життя</span>
        </h2>
        
        {/* Повернув вашу сітку з 4 колонок (xl:grid-cols-4) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {facts.map((fact) => (
            <motion.div 
              key={fact.id} 
              // МАГІЯ ТУТ: напівпрозорий фон та класи dark:
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

export default Facts;