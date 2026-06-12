"use client";

import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      // Початковий стан (невидимий і трохи опущений вниз)
      initial={{ opacity: 0, y: 20 }}
      
      // Кінцевий стан (повністю видимий і на своєму місці)
      animate={{ opacity: 1, y: 0 }}
      
      // Налаштування плавності
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20, 
        duration: 0.5 
      }}
    >
      {children}
    </motion.div>
  );
}