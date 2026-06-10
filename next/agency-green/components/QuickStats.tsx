"use client";

import { motion, useInView, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { CheckCircle, Smile, Clock, Repeat } from "lucide-react"; // Lucide icons

const stats = [
  {
    label: "Projects Done",
    value: 28,
    suffix: "+",
    icon: CheckCircle,
  },
  {
    label: "Happy Clients",
    value: 13,
    suffix: "+",
    icon: Smile,
  },
  {
    label: "Avg. Turnaround",
    value: 48,
    suffix: " hrs",
    icon: Clock,
  },
  {
    label: "Client Retention",
    value: 98,
    suffix: "%",
    icon: Repeat,
  },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inViewRef = useRef(null);
  const isInView = useInView(inViewRef, { once: true });

  useEffect(() => {
    if (!isInView || !ref.current) return;

    const controls = animate(0, value, {
      duration: 2,
      onUpdate(val) {
        if (ref.current) {
          ref.current.textContent = Math.round(val).toString();
        }
      },
    });

    return () => controls.stop();
  }, [isInView, value]);

  return (
    <span ref={inViewRef}>
      <span ref={ref} />
      {suffix}
    </span>
  );
}

export default function QuickStats() {
  return (
    <section className="relative py-32 bg-gradient-to-br from-green-50 via-white to-green-100 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-150px] left-[-100px] w-[500px] h-[500px] bg-green-200 rounded-full blur-[180px] opacity-30 z-0" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-green-100 rounded-full blur-[150px] opacity-20 z-0" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-5xl font-bold text-green-800 mb-8"
        >
          The Numbers Say It All
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-gray-600 max-w-2xl mx-auto mb-20 text-lg"
        >
          Consistency, creativity, and results — our impact measured in moments.
        </motion.p>

        {/* Horizontal Stats Row */}
        <div className="flex flex-wrap justify-center items-center gap-14 sm:gap-20">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.6, ease: "easeOut" }}
                viewport={{ once: true }}
                className="flex flex-col items-center group"
              >
                <div className="text-4xl sm:text-5xl font-bold text-green-600">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>

                <div className="flex items-center gap-1 text-sm sm:text-base text-gray-700 mt-2 text-center relative max-w-[9rem] cursor-default">
                  <Icon className="w-4 h-4 text-green-500" />
                  <span className="group-hover:text-green-800 transition">
                    {stat.label}
                  </span>

                  {/* Underline animation */}
                  <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-green-400 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
