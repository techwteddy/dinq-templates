"use client";
import React from "react";
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
import Link from "next/link";
import Logo_rf_bgr from "./icons/Logo_rf_bgr";

const HeroSection = () => {
  return (
    <section className="lg:py-16">
      <div className="grid grid-cols-1 sm:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="col-span-8 place-self-center text-center sm:text-left justify-self-start"
        >
          <h1 className="text-white mb-4 text-3xl sm:text-4xl lg:text-6xl lg:leading-normal font-extrabold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Frigear
            </span>
            <br></br>
            <TypeAnimation
              sequence={[
                "Non-profit",
                2000,
                "Frivillig drevet",
                2000,
                "Forening og fond",
                2000,
                "Projektorienteret",
                2000,
                "Skal du være med?",
                2000,
                "Bliv medlem!",
                2000,
                "Bliv frivillig!",
                2000,
              ]}
              wrapper="span"
              speed={30}
              repeat={Infinity}
            />
          </h1>
          <p className="text-[#ADB7BE] text-base sm:text-lg mb-6 lg:text-xl">
            Foreningen Frigear støtter, driver og faciliterer non-profit
            frivillig projekter i DK.
          </p>
          <div>
            <Link
              href="#contact"
              className="px-4 inline-block py-2 w-full border-2 border-transparent sm:w-fit rounded-2xl mr-4 bg-gradient-to-br from-indigo-600 to-purple-600 hover:border-indigo-500 text-white"
            >
              Kontakt os
            </Link>
            <Link
              href="/pricing"
              className="px-4 inline-block py-2 w-full sm:w-fit rounded-2xl bg-gradient-to-br border-2 border-transparent from-blue-950 to-indigo-900 hover:border-indigo-500 text-white mt-3"
            >
              {/* <span className="block bg-[#121212] hover:bg-slate-800 rounded-full px-5 py-2"> */}
              Bliv medlem
              {/* </span> */}
            </Link>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="col-span-4 place-self-center mt-4 lg:mt-0"
        >
          <div className="rounded-full bg-[#181818] w-[250px] h-[250px] lg:w-[350px] lg:h-[350px] relative">
            <Logo_rf_bgr className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 rounded-full" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
