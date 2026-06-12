'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BrandLoader from '@/components/ui/BrandLoader';

export default function SplashLoader() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Enforce fixed 6-second splash time
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 6000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[99999]"
                >
                    <BrandLoader />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
