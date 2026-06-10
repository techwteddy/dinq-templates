import { useEffect, useState } from 'react';
import { ArrowDownRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProfileCard {
  id: number;
  name: string;
  role: string;
  location: string;
  image: string;
}

const profileCards: ProfileCard[] = [
  {
    id: 1,
    name: 'Alberto Balocca',
    role: 'Artist',
    location: 'Italy',
    image: '/images/profile1.jpg',
  },
  {
    id: 2,
    name: 'Thomas Oosterhof',
    role: 'Curator',
    location: 'Netherlands',
    image: '/images/profile2.jpg',
  },
  {
    id: 3,
    name: 'Isabela Galeano',
    role: 'Curator',
    location: 'USA',
    image: '/images/profile3.jpg',
  },
];

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % profileCards.length);
    }, 5000); // Slower interval for better readability
    return () => clearInterval(interval);
  }, []);

  const getCardStyle = (index: number) => {
    const total = profileCards.length;
    let diff = (index - activeIndex) % total;
    if (diff < 0) diff += total;
    if (diff > total / 2) diff -= total;

    return {
      x: diff * 220, // Increased spacing
      y: Math.abs(diff) * 40,
      z: -Math.abs(diff) * 150,
      rotateY: diff * -20,
      rotateX: 5,
      scale: 1 - Math.abs(diff) * 0.15,
      zIndex: 10 - Math.abs(diff),
      opacity: 1 - Math.abs(diff) * 0.4,
    };
  };

  return (
    <div className="relative min-h-screen bg-taupe overflow-hidden noise-overlay perspective-1000 flex flex-col justify-between">
      {/* Massive Background Text - Refined Typography */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none">
        <motion.h1
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 0.15, y: 0, scale: 1 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="hero-text-massive text-outline font-black tracking-tighter"
        >
          FLOW.ART
        </motion.h1>
      </div>

      {/* 3D Rotating Cards - Centered */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center perspective-[1200px] z-10">
        <div className="relative w-full max-w-5xl h-[600px] flex items-center justify-center preserve-3d">
          <AnimatePresence>
            {profileCards.map((card, index) => {
              const style = getCardStyle(index);

              return (
                <motion.div
                  key={card.id}
                  className="absolute cursor-pointer"
                  initial={false}
                  animate={{
                    x: style.x,
                    y: style.y,
                    z: style.z,
                    rotateY: style.rotateY,
                    rotateX: style.rotateX,
                    scale: style.scale,
                    zIndex: style.zIndex,
                    opacity: style.opacity,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 25,
                    mass: 1.1
                  }}
                  onClick={() => setActiveIndex(index)}
                  whileHover={{ scale: style.scale * 1.05 }}
                >
                  <div className="card-3d group">
                    <div className="bg-charcoal rounded-[2rem] overflow-hidden shadow-2xl w-[280px] h-[400px] border border-white/10 transition-colors duration-500 group-hover:border-white/20">
                      {/* Card Content */}
                      <div className="relative h-full flex flex-col">
                        <div className="p-8 z-10">
                          <motion.h3
                            className="text-white text-3xl font-serif font-medium leading-none mb-2 tracking-tight"
                            layoutId={`title-${card.id}`}
                          >
                            {card.name.split(' ')[0]} <br />
                            <span className="text-white/60 font-sans text-xl font-normal">{card.name.split(' ')[1]}</span>
                          </motion.h3>
                          <div className="flex flex-col gap-1 mt-4">
                            <p className="text-sage text-sm uppercase tracking-widest font-medium">{card.role}</p>
                            <p className="text-white/40 text-xs">{card.location}</p>
                          </div>
                        </div>

                        {/* Card Image */}
                        <div className="absolute bottom-0 w-full h-[60%] overflow-hidden">
                          <div className="w-full h-full bg-gray-800 relative">
                            <img
                              src={card.image}
                              alt={card.name}
                              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out scale-105 group-hover:scale-100"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent opacity-60" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Content - Editorial Layout */}
      <div className="absolute bottom-12 left-0 right-0 px-8 md:px-16 flex justify-between items-end z-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-6"
        >
          <div className="flex items-start gap-4 max-w-xs group cursor-pointer">
            <div className="p-3 bg-white/5 rounded-full backdrop-blur-sm border border-white/10 group-hover:bg-white/10 transition-colors">
              <ArrowDownRight className="w-6 h-6 text-white group-hover:rotate-45 transition-transform duration-500 ease-in-out" />
            </div>
            <div>
              <p className="text-white text-lg font-light leading-snug">
                <span className="font-medium">Discover</span> the nexus where <br />
                curators and artists <span className="italic text-sage-light">collide</span>.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Custom Pagination */}
        <div className="hidden md:flex gap-4 mb-4">
          {profileCards.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className="group relative h-12 w-4 flex items-center justify-center"
            >
              <div className={`w-1 h-1 rounded-full bg-white transition-all duration-500 ${index === activeIndex ? 'h-8 opacity-100' : 'h-1 opacity-40 group-hover:opacity-80 group-hover:h-2'}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1, duration: 2 }}
        className="absolute bottom-32 right-32 hidden lg:block"
      >
        <svg width="120" height="120" viewBox="0 0 100 100" className="animate-spin-slow">
          <path id="curve" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent" />
          <text className="text-[10px] uppercase tracking-[0.2em] fill-white font-medium">
            <textPath href="#curve">
              Curated • Digital • Art • Experience •
            </textPath>
          </text>
        </svg>
      </motion.div>
    </div>
  );
}
