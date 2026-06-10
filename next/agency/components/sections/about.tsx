"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useInView,
  useSpring,
  useTransform,
  useScroll,
  useAnimationControls,
} from "framer-motion";
import { useSectionInView } from "@/lib/hooks";
import { teamData, valuesData, differentiators } from "@/lib/data";
import SectionHeading from "@/components/ui/heading";

type ValueProps = (typeof valuesData)[number];

function Value({
  title,
  description,
  icon,
  index,
}: ValueProps & { index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
      transition={{
        duration: 0.8,
        delay: index * 0.2,
        ease: [0, 0.71, 0.2, 1.01],
      }}
      className="group h-full"
    >
      <div className="bg-gray-100 h-full border border-black/5 rounded-lg overflow-hidden relative hover:bg-gray-200 transition dark:text-white dark:bg-white/10 dark:hover:bg-white/20">
        <div className="p-4 flex flex-col h-full">
          <div className="mt-3 flex-grow flex items-center justify-center">
            <span className="text-5xl transition-transform duration-300 group-hover:scale-110 mb-2">
              {icon}
            </span>
          </div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-white/70">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

type DifferentiatorProps = (typeof differentiators)[number] & { index: number };

function Differentiator({
  title,
  description,
  icon,
  supportingSignal,
  index,
}: DifferentiatorProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
      transition={{
        duration: 0.8,
        delay: index * 0.2,
        ease: [0, 0.71, 0.2, 1.01],
      }}
      className="group h-full"
    >
      <div className="bg-gray-100 h-full border border-black/5 rounded-lg overflow-hidden relative hover:bg-gray-200 transition dark:text-white dark:bg-white/10 dark:hover:bg-white/20">
        <div className="p-4 flex flex-col h-full">
          <div className="mt-3 flex-grow flex items-center justify-center">
            <span className="text-5xl transition-transform duration-300 group-hover:scale-110 mb-2">
              {icon}
            </span>
          </div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-white/70">
            {description}
          </p>
          {supportingSignal && (
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 font-medium">
              {supportingSignal}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

type TeamMemberProps = (typeof teamData)[number];

function TeamMember({ name, role, image }: TeamMemberProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1.33 1"],
  });

  const springConfig = { stiffness: 300, damping: 30, mass: 1 };
  const y = useSpring(
    useTransform(scrollYProgress, [0, 1], [100, 0]),
    springConfig
  );
  const rotate = useSpring(
    useTransform(scrollYProgress, [0, 1], [-10, 0]),
    springConfig
  );
  const scale = useSpring(
    useTransform(scrollYProgress, [0, 1], [0.8, 1]),
    springConfig
  );

  return (
    <motion.div
      ref={ref}
      style={{ y, rotate, scale }}
      className="group bg-gray-100 h-full border border-black/5 rounded-lg overflow-hidden relative hover:bg-gray-200 transition dark:text-white dark:bg-white/10 dark:hover:bg-white/20 p-6 flex flex-col items-center"
    >
      <div className="w-40 h-40 relative mb-4 overflow-hidden rounded-full">
        <Image
          src={image}
          alt={`${name} - ${role}`}
          fill
          sizes="160px"
          className="transition-transform duration-300 group-hover:scale-110 object-cover object-center"
        />
      </div>
      <h3 className="text-2xl font-semibold">{name}</h3>
      <p className="text-lg text-gray-700 dark:text-white/70">{role}</p>
    </motion.div>
  );
}

const AnimatedParagraph = ({ children }: { children: React.ReactNode }) => {
  const controls = useAnimationControls();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });

  React.useEffect(() => {
    if (isInView) {
      controls.start({ opacity: 1, y: 0 });
    } else {
      controls.start({ opacity: 0, y: 10 });
    }
  }, [isInView, controls]);

  return (
    <motion.p
      ref={ref}
      className="text-base leading-relaxed"
      initial={{ opacity: 0, y: 10 }}
      animate={controls}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.p>
  );
};

const AnimatedSlogan = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });
  const controls = useAnimationControls();
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView) {
      if (!hasAnimated) {
        controls.start("visible");
        setHasAnimated(true);
      } else {
        controls.start({ opacity: 1, y: 0 });
      }
    } else {
      controls.start({ opacity: 0, y: 10 });
    }
  }, [isInView, controls, hasAnimated]);

  const fadeAnimation = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      ref={ref}
      className="text-gray-700 dark:text-white/80 -mt-6 mb-16"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <br />

      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <AnimatedParagraph>
          Sakia Labs is a product studio that designs and builds software end-to-end for organizations with complex requirements.
        </AnimatedParagraph>

        <AnimatedParagraph>
          We build web applications, mobile products, and data-driven systems from early concepts to production-ready deployments. Our work includes user research, interface design, backend architecture, API development, and deployment infrastructure using modern web, mobile, and data stacks.
        </AnimatedParagraph>

        <AnimatedParagraph>
          We work collaboratively with clients to define scope, validate assumptions through prototyping and testing, and iterate based on real feedback. Projects are scoped clearly upfront, delivered incrementally with regular check-ins, and supported through launch and stabilization.
        </AnimatedParagraph>

        <AnimatedParagraph>
          Our name comes from <strong>Sakia</strong> (Arabic: <strong>ساقية</strong>), a waterwheel that sustained communities through steady, reliable flow.
        </AnimatedParagraph>
      </div>
    </motion.div>
  );
};

export default function About() {
  const ref = useSectionInView("About Us", 0.1);
  const controls = useAnimationControls();

  const getGridColumns = () => {
    const teamSize = teamData.length;
    if (teamSize === 2) return "sm:grid-cols-2";
    if (teamSize === 3) return "sm:grid-cols-3";
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
  };

  return (
    <motion.section
      ref={ref}
      id="about-us"
      className="mb-8 scroll-mt-28 text-center relative"
      whileInView={{ opacity: 1 }}
      viewport={{ once: false }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      aria-labelledby="about-heading"
    >
      {/* Background blobs for lower part of About section */}
      <div className="absolute bottom-[-10rem] -z-10 right-[-20rem] h-[31.25rem] w-[31.25rem] rounded-full blur-[10rem] bg-[#e3f2fd] dark:bg-[#2d3d52] sm:w-[68.75rem]"></div>
      <div className="absolute bottom-[10rem] -z-10 left-[-25rem] h-[31.25rem] w-[50rem] rounded-full blur-[10rem] bg-[#f3e5f5] dark:bg-[#3d2f47] sm:w-[68.75rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem]"></div>
      
      <div className="max-w-[60rem] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.175 }}
        >
          <SectionHeading size="large" id="about-heading">About Us</SectionHeading>
        </motion.div>
        <AnimatedSlogan />
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.175 }}
        >
          <SectionHeading size="medium" id="values-heading">Our Core Values</SectionHeading>
          <p className="text-gray-600 dark:text-gray-400 text-base max-w-3xl mx-auto mt-4 mb-8 leading-relaxed">
            We build with care, pride in our craft, respect for the people using it, and responsibility for what we leave behind.
          </p>
        </motion.div>
        <div 
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16 auto-rows-fr"
          role="list"
          aria-labelledby="values-heading"
        >
          {valuesData.map((value, index) => (
            <div key={index} role="listitem" className="h-full">
              <Value {...value} index={index} />
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.175 }}
        >
          <SectionHeading size="medium" id="team-heading">Our Team</SectionHeading>
        </motion.div>
        <div 
          className={`grid ${getGridColumns()} gap-8 mt-8 mb-16 justify-center`}
          role="list"
          aria-labelledby="team-heading"
        >
          {teamData.map((member, index) => (
            <div key={index} role="listitem">
              <TeamMember {...member} />
            </div>
          ))}
        </div>

      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.175 }}
      >
        <SectionHeading size="medium" id="differentiators-heading">How We Work Together</SectionHeading>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-3xl mx-auto mb-8">
          Our approach to building exceptional digital products
        </p>
      </motion.div>
        <div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 auto-rows-fr"
          role="list"
          aria-labelledby="differentiators-heading"
        >
          {differentiators.map((differentiator, index) => (
            <div key={differentiator.id} role="listitem" className="h-full">
              <Differentiator {...differentiator} index={index} />
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
