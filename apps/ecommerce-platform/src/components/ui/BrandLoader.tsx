'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function BrandLoader() {
    return (
        <div className="fixed inset-0 z-[9999] bg-paper flex flex-col items-center justify-center">
            {/* Logo Container - Subtle Float */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative w-20 h-20 mb-12"
            >
                <Image
                    src="/images/logo-icon.png"
                    alt="Healmitra"
                    fill
                    className="object-contain drop-shadow-sm"
                    priority
                    unoptimized
                />
            </motion.div>

            {/* Precision Progress Line */}
            <div className="w-32 h-[1px] bg-ink/10 relative overflow-hidden">
                <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{
                        duration: 12,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "reverse",
                        repeatDelay: 0.8
                    }}
                    className="absolute top-0 left-0 h-full bg-ink"
                />
            </div>

            {/* Brand Text - Fade Up */}
            <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="mt-4"
            >
                <span className="font-display text-ink text-[10px] tracking-[0.3em] uppercase opacity-80">
                    Healmitra
                </span>
            </motion.div>
        </div>
    );
}
