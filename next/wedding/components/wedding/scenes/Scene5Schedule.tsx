'use client';

import { motion } from 'framer-motion';
import { Clock, Sun, Church, Users, Moon } from 'lucide-react';

interface SceneProps {
  onNext: () => void;
  onPrev: () => void;
  isActive: boolean;
}

interface ScheduleItem {
  time: string;
  title: string;
  caption: string;
  icon: React.ReactNode;
  color: string;
}

const scheduleItems: ScheduleItem[] = [
  {
    time: '5:00 AM',
    title: 'Patlo',
    caption: 'The morning begins with unity and tradition',
    icon: <Sun size={24} />,
    color: 'text-orange-500',
  },
  {
    time: '9:00 AM',
    title: 'Church Service',
    caption: 'We gather before God to vow our forever',
    icon: <Church size={24} />,
    color: 'text-dusty-blue',
  },
  {
    time: '11:30 AM',
    title: 'Reception',
    caption: 'Laughter, feasting, and celebration follow',
    icon: <Users size={24} />,
    color: 'text-green-500',
  },
  {
    time: '5:30 PM',
    title: 'Kgoroso',
    caption: 'Evening reflection and family fellowship',
    icon: <Moon size={24} />,
    color: 'text-purple-500',
  },
];

export default function Scene5Schedule({ isActive }: SceneProps) {
  return (
    <div className="relative w-full h-full bg-gradient-to-b from-white via-beige/30 to-dusty-blue/10 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,_#A3BFD9_1px,_transparent_1px),_linear-gradient(-45deg,_#A3BFD9_1px,_transparent_1px)] bg-[length:20px_20px]" />
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center justify-start h-full px-6 py-8 relative z-10 overflow-y-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-8"
        >
          <div className="text-4xl mb-4">⏰</div>
          <h2 className="typography-heading text-dusty-blue mb-2">
            Our Special Day
          </h2>
          <div className="w-16 h-px bg-dusty-blue mx-auto" />
        </motion.div>

        {/* Timeline */}
        <div className="max-w-md w-full space-y-6">
          {scheduleItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.3 + index * 0.2,
                ease: 'easeOut' 
              }}
              className="relative"
            >
              {/* Timeline line */}
              {index < scheduleItems.length - 1 && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: '100%' }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.5 + index * 0.2 
                  }}
                  className="absolute left-6 top-12 w-px bg-dusty-blue/30 h-full"
                />
              )}

              {/* Timeline item */}
              <div className="flex items-start space-x-4">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: 0.4 + index * 0.2,
                    type: 'spring',
                    stiffness: 200 
                  }}
                  className={`flex-shrink-0 w-12 h-12 rounded-full bg-white shadow-lg border-2 border-dusty-blue/20 flex items-center justify-center ${item.color}`}
                >
                  {item.icon}
                </motion.div>

                {/* Content */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.6 + index * 0.2 
                  }}
                  className="flex-1 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-dusty-blue/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg typography-formal font-medium text-gray-800">
                      {item.title}
                    </h3>
                    <div className="flex items-center space-x-1 text-dusty-blue">
                      <Clock size={16} />
                      <span className="text-sm typography-formal font-medium">
                        {item.time}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm typography-formal text-gray-600 leading-relaxed">
                    {item.caption}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="text-center mt-8 max-w-sm"
        >
          <p className="text-sm typography-formal text-gray-600 italic">
            Join us for a day filled with love, tradition, and celebration
          </p>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-dusty-blue/10 text-3xl"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 3,
            }}
          >
            ⭐
          </motion.div>
        ))}
      </div>
    </div>
  );
}
