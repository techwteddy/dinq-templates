"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const images = [
    { src: "/images/maroonbells-hiking.jpg", alt: "Sheamus hiking Maroon Bells" },
    { src: "/images/nasa.jpg", alt: "Sheamus at NASA" },
    { src: "/images/server-room.png", alt: "Sheamus analyzing a server room" },
];

export default function AboutCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Rotate every 2.5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 2500);
        return () => clearInterval(timer);
    }, []);

    // UPDATE: Opacity for left and right is now set to 1 for full visibility
    const variants = {
        center: { x: "0%", scale: 1, zIndex: 30, opacity: 1 },
        right: { x: "40%", scale: 0.85, zIndex: 20, opacity: 1 },
        left: { x: "-40%", scale: 0.85, zIndex: 20, opacity: 1 },
    };

    return (
        <div className="relative w-full h-[300px] md:h-[340px] flex items-center justify-center overflow-hidden">
            {images.map((image, index) => {
                const positionIndex = (index - currentIndex + 3) % 3;
                const position = positionIndex === 0 ? "center" : positionIndex === 1 ? "right" : "left";

                return (
                    <motion.div
                        key={index}
                        className="absolute w-[200px] h-[280px] md:w-[240px] md:h-[320px]"
                        initial="center"
                        animate={position}
                        variants={variants}
                        transition={{ duration: 0.7, ease: "easeInOut" }}
                    >
                        {/* The mask-image creates the bottom fade effect */}
                        <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-border/50 [mask-image:linear-gradient(to_bottom,black_95%,transparent_100%)]">
                            <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 200px, 240px"
                                priority={index === 0}
                            />
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}