"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

export default function About() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);

  return (
    <section
      ref={ref}
      id="about"
      className="w-full bg-gradient-to-tl from-white to-green-50 py-20 px-4 sm:px-6 md:px-12 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
        {/* Left: Image */}
        <motion.div
          style={{ y: imageY }}
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex-1 w-full flex justify-center"
        >
          <Image
            src="/about-page.svg"
            alt="About Us Illustration"
            width={500}
            height={500}
            className="object-contain"
          />
        </motion.div>

        {/* Right: Text */}
        <motion.div
          style={{ y: textY }}
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex-1 text-center md:text-left"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-green-700 mb-4">
            Your Vision, Perfectly Designed
          </h2>
          <p className="text-lg sm:text-xl text-gray-800 leading-relaxed max-w-4xl mx-auto">
            At{" "}
            <span className="font-semibold text-green-600">DtPix Studios</span>,
            we turn bold ideas into stunning realities. From crafting sleek,
            responsive websites and building powerful web solutions to designing
            scroll-stopping posters and polished booklets, we’re your one-stop
            creative partner. Whether you need meticulous data entry, branded
            marketing materials, or a visual identity that speaks volumes, we
            help you stand out with strategy, speed, and style. Let’s build
            something unforgettable together.
          </p>

          <div className="mt-6 flex justify-center md:justify-start">
            <Link href="/contact">
              <button className="border border-green-600 text-green-600 px-6 py-3 rounded-lg font-semibold text-lg hover:bg-green-600 hover:text-white transition">
                Contact Us
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
