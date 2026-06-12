import Logo_rf_bgr from "@/components/icons/Logo_rf_bgr";
import { motion } from "framer-motion";
import React from "react";

export default function AnimateHeroLogo() {
  return (
    <div className="flex justify-center items-center">
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
  );
}
