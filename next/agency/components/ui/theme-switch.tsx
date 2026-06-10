"use client";

import { useTheme } from "@/context/theme-context";
import React from "react";
import { BsMoon, BsSun } from "react-icons/bs";
import { motion } from "framer-motion";

export default function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      className="hidden lg:flex fixed bottom-5 right-5 w-[3rem] h-[3rem] bg-opacity-80 backdrop-blur-[0.5rem] rounded-full items-center justify-center bg-white border-black/5 dark:bg-gray-950 dark:border-white dark:border-opacity-40 border shadow-lg transition-colors duration-300"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        key={theme}
      >
        {theme === "light" ? <BsSun /> : <BsMoon />}
      </motion.div>
    </motion.button>
  );
}
