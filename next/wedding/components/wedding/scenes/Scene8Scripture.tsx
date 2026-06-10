'use client';

import { motion } from 'framer-motion';

interface SceneProps {
  onNext: () => void;
  onPrev: () => void;
  isActive: boolean;
}

export default function Scene8Scripture({ isActive }: SceneProps) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/Wedding Pose.JPG')"
        }}
      />
      
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Main content */}
      <div className="flex flex-col items-center justify-center h-full px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="max-w-2xl"
        >
          {/* Scripture verse */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Quote marks */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-4xl text-white/80 font-serif"
            >
              &ldquo;
            </motion.div>

            {/* Main verse */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
            >
              <p className="text-2xl font-serif text-white leading-relaxed italic">
                So then, they are no longer two but one flesh. Therefore what God has joined together, let not man separate.
              </p>
            </motion.div>

            {/* Closing quote marks */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="text-4xl text-white/80 font-serif transform rotate-180"
            >
              &rdquo;
            </motion.div>

            {/* Scripture reference */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="pt-4"
            >
              <div className="w-24 h-px bg-white/50 mx-auto mb-4" />
              <p className="text-xl font-serif font-medium text-white">
                Matthew 19:6 NKJV
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
