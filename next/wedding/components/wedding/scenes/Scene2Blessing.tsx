'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SceneProps {
  onNext: () => void;
  onPrev: () => void;
  isActive: boolean;
}

export default function Scene2Blessing({ isActive }: SceneProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Countdown timer effect
  useEffect(() => {
    const weddingDate = new Date('2025-12-06T00:00:00').getTime();
    
    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = weddingDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer(); // Initial call
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  // Generate consistent positions for floating elements
  const floatingElements = Array.from({ length: 6 }, (_, i) => ({
    x: (i * 67 + 50) % 400,
    y: (i * 89 + 100) % 600,
    duration: 4 + (i % 3),
    delay: i * 0.3,
    symbol: ['💙', '✨', '🌸', '💫', '🤍', '🌟'][i],
  }));

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-white to-beige overflow-hidden">
      {/* Watercolor border effect */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-dusty-blue/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-dusty-blue/20 to-transparent" />
        <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-dusty-blue/10 to-transparent" />
        <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-dusty-blue/10 to-transparent" />
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center justify-center h-full px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="max-w-md"
        >
          {/* Decorative element */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
            className="mb-8"
          >
            <div className="mb-4 flex justify-center">
              <img 
                src="/images/illustrations/hand-drawn-one-line-art-illustration copy.png" 
                alt="Decorative flower illustration"
                className="w-38 h-38 object-contain"
              />
            </div>
            <div className="w-24 h-px bg-dusty-blue mx-auto mb-4" />
          </motion.div>

          {/* Main text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="space-y-6"
          >
            <p className="typography-body text-xl text-gray-700 leading-relaxed">
             It is with great joy and love that the families of Lepora and Letsholathebe invite you to witness and celebrate the beginning of our forever.
             As we exchange our vows and start a new chapter, your presense will mean the world to us.
            </p>

            {/* Setswana greeting */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="border-t border-b border-dusty-blue/30 py-4 my-6"
            >
              <p className="typography-body italic text-dusty-blue">
                Rea go laletsa lona mo lenyalong la rona.
              </p>
       
            </motion.div>

            {/* Initials with heart */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 1.5, ease: 'easeOut' }}
              className="text-center"
            >
              <div className="inline-flex items-center space-x-3 text-3xl font-script text-dusty-blue">
                <span>K</span>
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-red-400"
                >
                  💙
                </motion.span>
                <span>N</span>
              </div>
            </motion.div>

            {/* Countdown Timer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.0 }}
              className="text-center mt-8"
            >
              <h3 className="typography-formal text-lg text-gray-600 mb-4">SEE YOU IN</h3>
              <div className="grid grid-cols-4 gap-4 max-w-sm mx-auto">
                <motion.div 
                  className="bg-white/80 rounded-lg p-3 shadow-sm border border-dusty-blue/20"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                >
                  <div className="typography-heading text-2xl text-dusty-blue">{timeLeft.days}</div>
                  <div className="typography-caption text-gray-600">Days</div>
                </motion.div>
                <motion.div 
                  className="bg-white/80 rounded-lg p-3 shadow-sm border border-dusty-blue/20"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.25 }}
                >
                  <div className="typography-heading text-2xl text-dusty-blue">{timeLeft.hours}</div>
                  <div className="typography-caption text-gray-600">Hours</div>
                </motion.div>
                <motion.div 
                  className="bg-white/80 rounded-lg p-3 shadow-sm border border-dusty-blue/20"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                >
                  <div className="typography-heading text-2xl text-dusty-blue">{timeLeft.minutes}</div>
                  <div className="typography-caption text-gray-600">Minutes</div>
                </motion.div>
                <motion.div 
                  className="bg-white/80 rounded-lg p-3 shadow-sm border border-dusty-blue/20"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.75 }}
                >
                  <div className="typography-heading text-2xl text-dusty-blue">{timeLeft.seconds}</div>
                  <div className="typography-caption text-gray-600">Seconds</div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Floating elements - only render after mount */}
        {isMounted && (
          <div className="absolute inset-0 pointer-events-none">
            {floatingElements.map((element, i) => (
              <motion.div
                key={i}
                className="absolute text-dusty-blue/20 text-2xl"
                initial={{
                  x: element.x,
                  y: element.y,
                  rotate: 0,
                }}
                animate={{
                  rotate: 360,
                  y: [element.y, element.y - 20, element.y],
                }}
                transition={{
                  duration: element.duration,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: element.delay,
                }}
              >
                {element.symbol}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
