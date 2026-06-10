import React, { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { packageData } from "@/lib/data";

type PackageProps = (typeof packageData)[number] & {
  onChoosePackage: (title: string) => void;
};

export default function Package({
  title,
  description,
  price,
  features,
  onChoosePackage,
}: PackageProps) {
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
    useTransform(scrollYProgress, [0, 1], [10, 0]),
    springConfig
  );
  const scale = useSpring(
    useTransform(scrollYProgress, [0, 1], [0.8, 1]),
    springConfig
  );

  return (
    <motion.div
      ref={ref}
      style={{
        y,
        rotate,
        scale,
      }}
      className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] max-w-[350px]"
    >
      <section className="bg-gray-100 h-full border border-black/5 rounded-lg overflow-hidden relative hover:bg-gray-200 transition dark:text-white dark:bg-white/10 dark:hover:bg-white/20 shadow-sm">
        <div className="p-5 flex flex-col h-full">
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-white/70">
            {description}
          </p>
          <p className="mt-4 text-2xl font-bold">{price}</p>
          <ul className="mt-4 space-y-2 flex-grow">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-green-500 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => onChoosePackage(title)}
              className="flex items-center justify-center px-4 py-2 rounded-full bg-white bg-opacity-80 shadow-lg shadow-black/[0.03] backdrop-blur-[0.5rem] dark:bg-gray-950 dark:bg-opacity-75 text-gray-500 hover:text-gray-950 transition h-10 font-semibold text-sm hover:bg-white hover:bg-opacity-100  dark:hover:bg-opacity-100 sm:text-sm whitespace-nowrap outline-none focus:scale-110 active:scale-105 dark:text-gray-400 dark:hover:text-gray-100"
            >
              Choose {title}
            </button>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
