"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import {
  FaLightbulb,
  FaClock,
  FaMoneyBillWave,
  FaHandshake,
} from "react-icons/fa";

const reasons = [
  {
    title: "Creative Expertise",
    icon: <FaLightbulb />,
    desc: "Years of visual design experience that breathe life into your vision.",
  },
  {
    title: "Quick Turnaround",
    icon: <FaClock />,
    desc: "Timely deliveries without compromising on quality or originality.",
  },
  {
    title: "Affordable Packages",
    icon: <FaMoneyBillWave />,
    desc: "Get stunning results while staying within your budget.",
  },
  {
    title: "Client-Centric",
    icon: <FaHandshake />,
    desc: "We collaborate with you, ensuring each project exceeds expectations.",
  },
];

export default function WhyChooseUs() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Parallax effect on background
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  return (
    <section
      id="why-us"
      ref={ref}
      className="relative w-full bg-gradient-to-br from-green-50 to-white py-24 px-4 sm:px-6 md:px-12 z-10 overflow-hidden"
    >
      {/* Parallax Background */}
      <motion.div
        className="absolute inset-0 bg-[url('/whychooseus-bg.svg')] bg-cover bg-center opacity-20"
        style={{ y: bgY }}
      />

      {/* Section Title */}
      <div className="text-center relative z-10 mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-green-700"
        >
          Why Choose DtPix Studios?
        </motion.h2>
        <p className="text-gray-600 mt-4 max-w-xl mx-auto">
          We don’t just deliver services — we deliver creative partnerships that
          grow with your brand.
        </p>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
        {/* Illustration Side */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="w-full max-w-md my-auto"
        >
          <Image
            src="/whychooseus.svg"
            alt="Why Choose Us Illustration"
            width={500}
            height={500}
            className="w-full h-auto"
            priority
          />
        </motion.div>

        {/* Content Side */}
        <div className=" mx-auto flex-1 text-center md:text-left">
          <div className="relative space-y-10 before:absolute before:top-0 before:left-19 before:w-[3px] before:h-full before:bg-green-300">
            {reasons.map((reason, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="relative flex items-start gap-6 pl-12"
              >
                {/* Icon with Wobble Effect on Mobile */}
                <motion.div
                  className="bg-white border-4 border-green-300 rounded-full p-4 shadow-lg text-green-600 text-2xl"
                  whileHover={{ rotate: [0, 5, -5, 0] }}
                  whileInView={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.6, repeat: 1 }}
                >
                  {reason.icon}
                </motion.div>

                {/* Text */}
                <div>
                  <h3 className="text-xl font-semibold text-green-700 mb-2">
                    {reason.title}
                  </h3>
                  <p className="text-gray-600 max-w-md">{reason.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
