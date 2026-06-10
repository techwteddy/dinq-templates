"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export default function ScrollTiltCard({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rotateY = useSpring(useTransform(scrollYProgress, [0, 1], [-5, 5]), {
    stiffness: 40,
    damping: 12,
  });

  const rotateX = useSpring(useTransform(scrollYProgress, [0, 1], [5, -5]), {
    stiffness: 40,
    damping: 12,
  });

  return (
    <motion.div
      ref={ref}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </motion.div>
  );
}
