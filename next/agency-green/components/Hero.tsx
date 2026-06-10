"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  return (
    <section
      ref={ref}
      id="home"
      className="w-full bg-gradient-to-br from-green-100 to-white lg:mt-15  lg:pt-30 pt-26 pb-22 px-4 sm:px-6 md:px-12 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-10">
        {/* Left: Text */}
        <motion.div
          style={{ y: textY }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold text-green-700 leading-tight">
            Building Brands.
            <br className="block sm:inline" />
            Designing Impact.
          </h1>
          <p className="mt-4 text-gray-700 text-lg max-w-md">
            From websites to branding materials, DtPix Studios delivers
            creative, digital, and production solutions that bring your vision
            to life.
          </p>
          <Link
            href="#contact"
            className="inline-block mt-6 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
          >
            Get a Quote
          </Link>
        </motion.div>

        {/* Right: Image */}
        <motion.div
          style={{ y: imgY }}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 w-full flex justify-center"
        >
          <Image
            src="/hero-page.png"
            alt="Hero Illustration"
            width={500}
            height={500}
            className="object-contain"
          />
        </motion.div>
      </div>
    </section>
  );
}
