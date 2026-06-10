"use client";

import { useEffect, useState } from "react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";
import {
  FaPalette,
  FaPaintBrush,
  FaPenNib,
  FaFileAlt,
  FaCode,
} from "react-icons/fa";

import ScrollTiltCard from "./ScrollTiltCard";

const services = [
  {
    title: "Web Design",
    icon: <FaPalette className="text-4xl text-green-600" />,
    desc: "Modern, user-focused website designs that look great and work flawlessly on every screen.",
  },
  {
    title: "Web Development",
    icon: <FaCode className="text-4xl text-green-600" />,
    desc: "Fast, scalable, and secure websites built to power your brand and business goals.",
  },
  {
    title: "Poster Making",
    icon: <FaPaintBrush className="text-4xl text-green-600" />,
    desc: "Creative, scroll-stopping posters for promotions, events, and campaigns — digital or print.",
  },
  {
    title: "Booklets & Data Entry",
    icon: <FaFileAlt className="text-4xl text-green-600" />,
    desc: "Structured booklets and clean data input designed for clarity, delivery, and impact.",
  },
  {
    title: "Business Branding",
    icon: <FaPenNib className="text-4xl text-green-600" />,
    desc: "Logos, brand kits, and visuals that tell your story and leave a lasting impression.",
  },
];

export default function Services() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section className="relative w-full overflow-hidden -skew-y-3 bg-gradient-to-tr from-white to-green-50 z-10">
      {/* Inner un-skewed wrapper */}
      <div
        id="services"
        className="skew-y-3 py-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto"
      >
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-green-700"
          >
            Our Creative Services
          </motion.h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Elevate your visual presence with our tailored design solutions –
            from brands to booklets.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-y-12">
          {services.map((service, i) => {
            const CardWrapper = isMobile ? ScrollTiltCard : Tilt;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <CardWrapper className="h-full">
                  <div
                    className={`group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 
            border border-transparent hover:border-green-400 relative overflow-hidden 
            transform 
            ${i % 2 === 0 ? "rotate-[-3deg]" : "rotate-[3deg]"}
          `}
                  >
                    {/* Glowing gradient ring */}
                    <div className="absolute -inset-0.5 bg-gradient-to-tr from-green-300 to-green-600 opacity-0 group-hover:opacity-30 rounded-2xl blur-2xl transition duration-500 z-0" />

                    <div className="relative z-10 flex flex-col items-center text-center gap-4">
                      <div className="bg-green-100 p-4 rounded-full">
                        {service.icon}
                      </div>
                      <h3 className="text-xl font-semibold text-green-700">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{service.desc}</p>
                    </div>
                  </div>
                </CardWrapper>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
