"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  BsLinkedin,
  BsFacebook,
  BsTwitter,
  BsInstagram,
  BsTiktok,
} from "react-icons/bs";
import { FaGithubSquare } from "react-icons/fa";
import { useSectionInView } from "@/lib/hooks";
import { useActiveSectionContext } from "@/context/active-section-context";
import Magnetic from "@/components/ui/magnetic";
import BecomeClientDialog from "@/components/dialogs/become-a-client";
import logo from "@/public/logo.png";

interface HeroProps {
  headline: string;
  subheadline: string;
  primaryCTA: {
    label: string;
    href: string;
  };
  secondaryCTA: {
    label: string;
    href: string;
  };
  microcopy?: string;
}

export default function Hero({
  headline,
  subheadline,
  primaryCTA,
  secondaryCTA,
  microcopy,
}: HeroProps) {
  const ref = useSectionInView("Home", 0.2);
  const { setActiveSection, setTimeOfLastClick } = useActiveSectionContext();
  const [showClientDialog, setShowClientDialog] = useState(false);

  const logoRef = useRef(null);
  const buttonRef = useRef(null);
  const socialRef = useRef(null);

  const logoInView = useInView(logoRef, { once: false, amount: 0.5 });
  const buttonInView = useInView(buttonRef, { once: false, amount: 0.5 });
  const socialInView = useInView(socialRef, { once: false, amount: 0.5 });

  const handlePrimaryCTAClick = () => {
    setShowClientDialog(true);
  };

  const handleSecondaryCTAClick = () => {
    const element = document.getElementById("work");
    if (element) {
      const yOffset = -100;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    setActiveSection("Work");
    setTimeOfLastClick(Date.now());
  };

  return (
    <section
      ref={ref}
      id="home"
      className="mb-28 w-full max-w-[90rem] mx-auto text-center sm:mb-0 scroll-mt-[100rem] px-4 sm:px-6 md:px-8 lg:px-12 pt-8 sm:pt-4 lg:pt-0"
      aria-labelledby="hero-heading"
    >
      <AnimatePresence>
        {showClientDialog && (
          <BecomeClientDialog
            initialPackage=""
            onClose={() => setShowClientDialog(false)}
          />
        )}
      </AnimatePresence>
      
      <div className="flex flex-col items-center justify-center">
        <motion.div
          ref={logoRef}
          initial={{ opacity: 0, scale: 0 }}
          animate={
            logoInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }
          }
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Image
              src={logo}
              alt="Sakia Labs Logo"
              width={192}
              height={192}
              quality={95}
              priority={true}
              className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 drop-shadow-2xl"
            />
          </motion.div>
        </motion.div>

        <motion.div
          className="w-full mt-6 sm:mt-8 mb-8 sm:mb-10"
        >
          <div className="flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 gap-6">
            <motion.h1 
              id="hero-heading"
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium text-center text-gray-900 dark:text-gray-100 leading-[1.3] sm:leading-[1.2] tracking-tight max-w-5xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {headline}
            </motion.h1>
            <motion.p 
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-center text-gray-700 dark:text-gray-300 max-w-3xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {subheadline}
            </motion.p>
          </div>
        </motion.div>

        <motion.div
          ref={buttonRef}
          className="w-full mt-0 flex flex-col items-center"
          initial={{ opacity: 0, y: 50 }}
          animate={
            buttonInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
          }
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
            <Magnetic>
              <button
                onClick={handlePrimaryCTAClick}
                className="px-5 py-2.5 sm:px-6 sm:py-3 bg-stone-100/95 border border-white/40 hover:bg-stone-200/95 dark:bg-gray-950/75 dark:border-black/40 dark:hover:bg-gray-950/85 backdrop-blur-[0.5rem] shadow-lg shadow-black/[0.03] dark:text-white text-gray-800 font-semibold whitespace-nowrap flex items-center justify-center gap-2 rounded-full outline-none focus:scale-110 hover:scale-110 active:scale-105 transition text-sm sm:text-base lg:text-lg"
                aria-label={`${primaryCTA.label} - Open contact dialog`}
              >
                {primaryCTA.label}
              </button>
            </Magnetic>

            <Magnetic>
              <button
                onClick={handleSecondaryCTAClick}
                className="px-5 py-2.5 sm:px-6 sm:py-3 bg-transparent border-2 border-gray-800/40 hover:border-gray-800/60 dark:border-white/40 dark:hover:border-white/60 backdrop-blur-[0.5rem] dark:text-white text-gray-800 font-semibold whitespace-nowrap flex items-center justify-center gap-2 rounded-full outline-none focus:scale-110 hover:scale-110 active:scale-105 transition text-sm sm:text-base lg:text-lg"
                aria-label={`${secondaryCTA.label} - Navigate to projects section`}
              >
                {secondaryCTA.label}
              </button>
            </Magnetic>
          </div>

          {microcopy && (
            <motion.p
              className="text-sm sm:text-base text-gray-600 dark:text-gray-400 text-center mb-6 sm:mb-8 max-w-md mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {microcopy}
            </motion.p>
          )}

          <motion.div
            ref={socialRef}
            className="flex flex-wrap justify-center gap-2 sm:gap-3"
            initial={{ opacity: 0, y: 50 }}
            animate={
              socialInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
            }
            transition={{ delay: 0.3 }}
          >
            {[
              { icon: BsFacebook, href: "https://facebook.com/sakialabs" },
              { icon: BsTwitter, href: "https://twitter.com/sakialabs" },
              { icon: BsInstagram, href: "https://instagram.com/sakialabs" },
              { icon: BsTiktok, href: "https://tiktok.com/@sakia.labs" },
              {
                icon: BsLinkedin,
                href: "https://www.linkedin.com/company/sakialabs",
              },
              { icon: FaGithubSquare, href: "https://github.com/sakialabs" },
            ].map((item, index) => (
              <Magnetic key={index}>
                <a
                  className="bg-stone-100/95 hover:bg-stone-200/95 p-1.5 sm:p-2 text-gray-700 hover:text-gray-950 flex items-center gap-2 rounded-full focus:scale-[1.15] hover:scale-[1.15] active:scale-105 transition cursor-pointer border border-white/40 dark:bg-gray-950/75 dark:text-white/60 dark:hover:bg-gray-950/85 dark:border-black/40 backdrop-blur-[0.5rem] shadow-lg shadow-black/[0.03]"
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <item.icon size={16} className="sm:w-[18px] sm:h-[18px]" />
                </a>
              </Magnetic>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
