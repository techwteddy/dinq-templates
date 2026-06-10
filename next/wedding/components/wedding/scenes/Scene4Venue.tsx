'use client';

import { motion } from 'framer-motion';
import { MapPin, ExternalLink } from 'lucide-react';

interface SceneProps {
  onNext: () => void;
  onPrev: () => void;
  isActive: boolean;
}

export default function Scene4Venue({ isActive }: SceneProps) {
  const openInMaps = () => {
    // Coordinates for Letsholathebe, Botswana (approximate)
    const mapsUrl = 'https://maps.google.com/?q=Letsholathebe,Botswana';
    if (typeof window !== 'undefined') {
      window.open(mapsUrl, '_blank');
    }
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-beige via-white to-dusty-blue/20 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%2523A3BFD9%22%20fill-opacity%3D%220.4%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center justify-center h-full px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="max-w-md"
        >
          {/* Animated map pin */}
          <motion.div
            initial={{ scale: 0, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="mb-8"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="text-6xl text-dusty-blue mb-4"
            >
              📍
            </motion.div>
          </motion.div>

          {/* Main text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-serif font-medium text-gray-800 leading-relaxed">
              All celebrations will be held at
            </h2>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-dusty-blue/20">
              <h1 className="text-4xl font-decorative text-dusty-blue mb-2">
                Letsholathebe
              </h1>
              <div className="w-16 h-px bg-dusty-blue/50 mx-auto mb-4" />
              <p className="text-lg font-serif text-gray-700">
                Botswana
              </p>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="text-lg font-serif text-gray-600 italic leading-relaxed"
            >
              A sacred place of joy, family, and forever
            </motion.p>

            {/* Map button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openInMaps}
              className="inline-flex items-center space-x-2 bg-dusty-blue text-white px-6 py-3 rounded-full font-serif font-medium shadow-lg hover:bg-dusty-blue/90 transition-colors"
            >
              <MapPin size={20} />
              <span>Open in Google Maps</span>
              <ExternalLink size={16} />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Floating location icons */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-dusty-blue/20 text-2xl"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
              animate={{
                y: [0, -15, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: Math.random() * 2,
              }}
            >
              🏛️
            </motion.div>
          ))}

          {/* Subtle sparkles */}
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute text-yellow-300/40 text-sm"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2 + Math.random(),
                repeat: Infinity,
                ease: 'easeInOut',
                delay: Math.random() * 3,
              }}
            >
              ✨
            </motion.div>
          ))}
        </div>

        {/* Bottom accent */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.5, delay: 1 }}
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-dusty-blue to-transparent"
        />
      </div>
    </div>
  );
}
