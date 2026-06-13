'use client';

import { JSX, useEffect } from 'react';
import ReadMoreBtn from '@/components/ui/read-more-btn';
import AnimatedUnderline from '@/components/ui/animated-underline';
import { inriaSans, kodchasan, poppins } from '@/app/fonts';
import { motion, Variants } from 'motion/react';
import useIsDesktop from '@/hooks/useIsDesktop';

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const videoVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: 'easeOut', delay: 0.2 },
  },
};
const OurMission = (): JSX.Element => {
  const isDesktop = useIsDesktop();

  useEffect(() => {
    const line1 = ' %c Built by Thomas Ghali ';
    const line2 =
      ' %c Check out the source on GitHub: https://github.com/ThomasGhali/engineering-company-webpage';

    const style1 = `
    background: linear-gradient(90deg, #ef4c00 0%, #ff7f50 100%);
    color: white;
    padding: 8px 16px;
    border-radius: 8px 8px 0 0;
    font-size: 16px;
    font-weight: 800;
    font-family: system-ui, -apple-system, sans-serif;
    text-transform: uppercase;
    letter-spacing: 1px;
  `;

    const style2 = `
    background: #131111;
    color: #ef4c00;
    padding: 10px 16px;
    border-radius: 0 0 8px 8px;
    font-size: 13px;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    border: 1px solid #2d2c2c;
    border-top: none;
  `;

    console.log(line1, style1);
    console.log(line2, style2);
  }, []);

  return (
    <>
      <motion.div
        className="pb-10 overflow-x-hidden bg-charcoal-700 transition-colors duration-1000"
        whileInView={{ backgroundColor: 'white' }}
        viewport={{ amount: 0.2, once: true }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          viewport={{ amount: 0.5, once: true }}
          className={
            inriaSans.className +
            ' text-text-muted md:text-[2.7rem] lg:text-[3.7rem] text-center text-[2rem] font-bold uppercase mb-5 pt-20 md:pt-30 tracking-widest'
          }
        >
          Our Mission
        </motion.h1>

        <section className="grid grid-cols-1 text-black items-center md:grid-cols-2 gap-10 md:gap-20 mx-5 mt-10 md:mt-20">
          {/* --- LEFT COLUMN --- */}
          <motion.div
            className="md:w-[72%] justify-self-end"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.25, once: true }}
          >
            <div className="leading-relaxed">
              <motion.h2
                variants={fadeInUp}
                className={
                  poppins.className +
                  ' md:text-[2.7rem] lg:text-6xl lg:min-w-[360px] text-[2rem] md:min-w-[260px] font-normal lg:mb-10 mb-5'
                }
              >
                Engineering the Future
              </motion.h2>

              <div
                className={kodchasan.className + ' text-text-muted text-[1rem]'}
              >
                <motion.p variants={fadeInUp}>
                  We design and build infrastructure that balances{' '}
                  <AnimatedUnderline delay={0.6}>
                    structural excellence
                  </AnimatedUnderline>{' '}
                  with{' '}
                  <AnimatedUnderline delay={0.8}>
                    environmental responsibility
                  </AnimatedUnderline>
                  .
                </motion.p>

                <motion.p className="my-4.5" variants={fadeInUp}>
                  From civil energy projects to high-speed transit networks, we
                  partner with governments to solve the world's{' '}
                  <AnimatedUnderline delay={1.0}>
                    most complex challenges
                  </AnimatedUnderline>
                  .
                </motion.p>

                <motion.p className="my-4.5" variants={fadeInUp}>
                  Reliable engineering, and infrastructure that delivers{' '}
                  <AnimatedUnderline delay={1.2}>
                    lasting value
                  </AnimatedUnderline>
                  .
                </motion.p>
              </div>

              <motion.div className="mt-9" variants={fadeInUp}>
                <ReadMoreBtn filled={true} />
              </motion.div>
            </div>
          </motion.div>

          {/* --- RIGHT COLUMN --- */}
          <motion.video
            variants={videoVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.25, once: true }}
            src="/our-mission.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="object-cover w-full md:max-h-[85vh] rounded-sm aspect-square shadow-lg"
          />
        </section>
      </motion.div>
    </>
  );
};

export default OurMission;
