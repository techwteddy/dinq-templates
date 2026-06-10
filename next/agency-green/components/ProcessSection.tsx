"use client";

import { motion } from "framer-motion";
import {
  Lightbulb,
  PenTool,
  Code2,
  Rocket,
  LifeBuoy,
  ArrowRight,
} from "lucide-react";

const processSteps = [
  {
    icon: <Lightbulb size={28} />,
    title: "Discovery",
    description: "We listen, research, and define your vision.",
  },
  {
    icon: <PenTool size={28} />,
    title: "Design",
    description: "Crafting engaging visuals that align with your brand.",
  },
  {
    icon: <Code2 size={28} />,
    title: "Development",
    description: "We build responsive, high-performance products.",
  },
  {
    icon: <Rocket size={28} />,
    title: "Launch",
    description: "Ready for takeoff—your brand goes live!",
  },
  {
    icon: <LifeBuoy size={28} />,
    title: "Support",
    description: "Continuous care to keep things running smoothly.",
  },
];

export default function ProcessFlowChart() {
  return (
    <section className="bg-white py-24 px-6 overflow-hidden">
      <h2 className="text-3xl font-bold text-green-800 text-center mb-20">
        Our Creative Process
      </h2>

      {/* Mobile scroll hint */}
      <motion.div
        className="md:hidden flex justify-center mb-6"
        initial={{ opacity: 0, x: 0 }}
        animate={{
          opacity: [0, 1, 1, 0],
          x: [0, 10, 10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      >
        <ArrowRight className="text-green-400 animate-pulse" />
      </motion.div>

      <div className="relative no-scrollbar overflow-x-auto">
        {/* Timeline Line */}
        <div className="absolute top-8 md:top-14 left-0 w-full h-[2px] bg-green-100 z-0" />

        <div className="flex items-start md:items-center gap-10 md:gap-16 w-max md:mx-auto px-4 py-3 md:px-10">
          {processSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{
                rotateX: 8,
                rotateY: -8,
                scale: 1.05,
                transition: { type: "spring", stiffness: 180, damping: 10 },
              }}
              className="relative z-10 flex flex-col items-center text-center group"
            >
              {/* Connector Line */}
              {index !== processSteps.length - 1 && (
                <div className="absolute top-7 left-full w-10 md:w-16 h-1 bg-green-300 z-0" />
              )}

              {/* Icon */}
              <div className="w-14 h-14 bg-green-100 text-green-700 flex items-center justify-center rounded-full shadow-md group-hover:scale-105 transition-transform duration-300">
                {step.icon}
              </div>

              {/* Text */}
              <div className="mt-4 w-36 md:w-40">
                <h3 className="font-semibold text-green-900 text-base">
                  {step.title}
                </h3>
                <p className="text-sm text-green-700 mt-1">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
