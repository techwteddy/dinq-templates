"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";
import Tilt from "react-parallax-tilt";
import { useEffect, useState } from "react";

const testimonials = [
  {
    name: "Aarav Mehta",
    role: "Founder, BrandScape",
    quote:
      "DtPix Studios took our brand visuals to a whole new level. Their creativity and attention to detail are unmatched!",
  },
  {
    name: "Sana Iqbal",
    role: "Marketing Head, BloomTech",
    quote:
      "Loved working with the team! The designs were fresh, modern, and delivered right on schedule.",
  },
  {
    name: "Rohan Das",
    role: "CEO, PixelPlay",
    quote:
      "From ideation to execution, DtPix Studios nailed it. Our clients love the new look!",
  },
];

export default function Testimonials() {
  const { scrollYProgress } = useScroll();
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section
      id="testimonials"
      className="relative w-full bg-gradient-to-tr from-white to-green-50 py-24 px-4 sm:px-6 md:px-12 z-10 overflow-hidden"
    >
      {/* Parallax Background Effect */}
      <motion.div
        className="absolute inset-0 bg-[url('/testimonials-bg.svg')] bg-no-repeat bg-cover bg-center opacity-10"
        style={{ y: bgY }}
      />

      {/* Section Heading */}
      <div className="text-center relative z-10 mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-green-700"
        >
          What Our Clients Say
        </motion.h2>
        <p className="text-gray-600 mt-4 max-w-xl mx-auto">
          Real stories from real clients who trusted DtPix Studios to transform
          their brand.
        </p>
      </div>

      {/* Testimonial Cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {testimonials.map((testimonial, index) => {
          const CardContent = (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="relative bg-white rounded-xl shadow-xl border border-green-100 p-8 pt-12 transition duration-300 hover:shadow-2xl"
            >
              {/* Paperclip SVG */}
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute -top-6 -left-9 w-20 h-20 text-green-600 rotate-[8deg] drop-shadow-sm"
                whileHover={{ rotate: [0, 6, -6, 0] }}
                transition={{ duration: 0.6 }}
              >
                <path d="M21 12.79V7a5 5 0 0 0-10 0v9a3 3 0 0 0 6 0V8" />
              </motion.svg>

              <div className="flex items-center gap-4 mb-4">
                <div className="text-green-600 text-4xl">
                  <FaUserCircle />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-800">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed italic">
                “{testimonial.quote}”
              </p>
            </motion.div>
          );

          return isMobile ? (
            <div key={index}>{CardContent}</div> // ✅ key for mobile
          ) : (
            <Tilt
              key={index} // ✅ key for desktop
              tiltMaxAngleX={10}
              tiltMaxAngleY={10}
              glareEnable
              glareColor="rgba(144, 238, 144, 0.2)"
            >
              {CardContent}
            </Tilt>
          );
        })}
      </div>
    </section>
  );
}
