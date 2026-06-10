"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { projectsData } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";
import Image from "next/image";
import Magnetic from "@/components/ui/magnetic";

type ProjectProps = (typeof projectsData)[number] & { index: number };

function Project({ title, description, tags, imageUrl, link, index }: ProjectProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1.33 1"],
  });
  const scaleProgress = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacityProgress = useTransform(scrollYProgress, [0, 1], [0.6, 1]);

  return (
    <motion.div
      ref={ref}
      style={{
        scale: scaleProgress,
        opacity: opacityProgress,
      }}
      className="flex-shrink-0 w-full snap-center group h-full"
    >
      <div className="bg-gray-100 dark:bg-white/10 rounded-3xl overflow-hidden shadow-none sm:shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col border border-black/5 hover:border-blue-500/50 dark:hover:border-blue-400/50 h-full">
        {/* Image Container */}
        <div className="relative h-[280px] sm:h-[320px] md:h-[220px] lg:h-[240px] 2xl:h-[200px] overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 md:p-5 lg:p-6 2xl:p-5 flex flex-col flex-grow">
          <h3 className="text-2xl sm:text-3xl md:text-xl lg:text-2xl 2xl:text-xl font-semibold mb-3 sm:mb-4 md:mb-2 lg:mb-3 2xl:mb-2 text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="text-base sm:text-lg md:text-sm lg:text-base 2xl:text-sm text-gray-700 dark:text-white/70 leading-relaxed mb-4 sm:mb-6 md:mb-3 lg:mb-4 2xl:mb-3 flex-grow">
            {description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4 sm:mb-6 md:mb-3 lg:mb-4 2xl:mb-3">
            {tags.slice(0, 3).map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className="px-3 py-1 text-xs font-medium bg-black/[0.7] text-white rounded-full dark:bg-white/10"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* View Project Link */}
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gray-900 dark:text-white font-bold hover:gap-4 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 text-sm md:text-base lg:text-base 2xl:text-sm group/link hover:scale-105 active:scale-95"
          >
            <span>View Project</span>
            <svg
              className="w-4 h-4 md:w-5 md:h-5 group-hover/link:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function MobileProjectCarousel({ projects }: { projects: typeof projectsData }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextProject = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Navigation Buttons */}
      <Magnetic>
        <button
          onClick={prevProject}
          className="absolute -left-2 sm:left-2 top-1/2 -translate-y-1/2 z-20 p-3 sm:p-4 rounded-full bg-white/95 dark:bg-gray-900/95 shadow-xl hover:scale-110 active:scale-95 transition-transform"
          aria-label="Previous project"
        >
          <svg
            className="w-6 h-6 sm:w-7 sm:h-7 text-gray-700 dark:text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </Magnetic>

      <Magnetic>
        <button
          onClick={nextProject}
          className="absolute -right-2 sm:right-2 top-1/2 -translate-y-1/2 z-20 p-3 sm:p-4 rounded-full bg-white/95 dark:bg-gray-900/95 shadow-xl hover:scale-110 active:scale-95 transition-transform"
          aria-label="Next project"
        >
          <svg
            className="w-6 h-6 sm:w-7 sm:h-7 text-gray-700 dark:text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </Magnetic>

      {/* Project Card */}
      <div className="overflow-hidden px-4 sm:px-12">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                nextProject();
              } else if (swipe > swipeConfidenceThreshold) {
                prevProject();
              }
            }}
          >
            <Project {...projects[currentIndex]} index={currentIndex} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress Indicators */}
      <div className="flex justify-center gap-2 mt-8">
        {projects.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-blue-600 dark:bg-blue-400 w-10"
                : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 w-2.5"
            }`}
            aria-label={`Go to project ${index + 1}`}
          />
        ))}
      </div>

      {/* Project Counter */}
      <div className="text-center mt-5 text-base font-medium text-gray-600 dark:text-gray-400">
        {currentIndex + 1} / {projects.length}
      </div>
    </div>
  );
}

export default function Projects() {
  const ref = useSectionInView("Work", 0.2);
  const [currentPage, setCurrentPage] = useState(0);
  
  // Responsive cards per page - will be handled by CSS grid
  // On 2xl screens: 4 cards, lg: 3 cards, md: 2 cards, mobile: 1 card (carousel)
  const cardsPerPage = 4; // Maximum cards per page for 2xl screens
  const totalPages = Math.ceil(projectsData.length / cardsPerPage);

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  // Get the cards for the current page
  const getCurrentPageCards = () => {
    const startIndex = currentPage * cardsPerPage;
    return projectsData.slice(startIndex, startIndex + cardsPerPage);
  };

  return (
    <motion.section
      ref={ref}
      id="work"
      className="scroll-mt-28 mb-28 w-full px-4 relative"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.175 }}
    >
      {/* Background blobs */}
      <div className="absolute top-[-10rem] -z-10 right-[-20rem] h-[31.25rem] w-[31.25rem] rounded-full blur-[10rem] bg-[#e3f2fd] dark:bg-[#2d3d52] sm:w-[68.75rem]"></div>
      <div className="absolute top-[10rem] -z-10 left-[-25rem] h-[31.25rem] w-[50rem] rounded-full blur-[10rem] bg-[#f3e5f5] dark:bg-[#3d2f47] sm:w-[68.75rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem]"></div>
      
      <h2 className="text-3xl font-medium capitalize mb-8 text-center">
        Selected Work
      </h2>
      <p className="text-center text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12 text-base leading-relaxed">
        A curated set of product builds developed end-to-end, from early concepts to production-ready systems, using modern web, mobile, and data stacks.
      </p>

      {/* Mobile: Single Project Carousel */}
      <div className="md:hidden">
        <MobileProjectCarousel projects={projectsData} />
      </div>

      {/* Desktop: Multi-card Carousel */}
      <div className="hidden md:block relative w-full max-w-[1600px] mx-auto px-4 sm:px-0">
        {/* Left Arrow */}
        <Magnetic>
          <button
            onClick={prevPage}
            className="absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-stone-100/95 border border-white/40 hover:bg-stone-200/95 dark:bg-gray-950/75 dark:border-black/40 dark:hover:bg-gray-950/85 backdrop-blur-[0.5rem] transition-all hover:scale-110 text-gray-700 dark:text-gray-300"
            aria-label="Previous projects"
          >
            <svg
              className="w-5 h-5 text-gray-700 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </Magnetic>

        {/* Right Arrow */}
        <Magnetic>
          <button
            onClick={nextPage}
            className="absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-stone-100/95 border border-white/40 hover:bg-stone-200/95 dark:bg-gray-950/75 dark:border-black/40 dark:hover:bg-gray-950/85 backdrop-blur-[0.5rem] transition-all hover:scale-110 text-gray-700 dark:text-gray-300"
            aria-label="Next projects"
          >
            <svg
              className="w-5 h-5 text-gray-700 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </Magnetic>

        {/* Cards Grid - Responsive: 1 col (mobile), 2 cols (md), 3 cols (lg), 4 cols (2xl) */}
        <motion.div
          key={currentPage}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 items-stretch"
        >
          {getCurrentPageCards().map((project, index) => (
            <motion.div
              key={currentPage * cardsPerPage + index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut"
              }}
              className="h-full"
            >
              <Project
                {...project}
                index={currentPage * cardsPerPage + index}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Page Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentPage
                  ? "bg-blue-600 dark:bg-blue-400 w-8"
                  : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 w-2"
              }`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
