"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring, MotionValue, MotionStyle } from "framer-motion";
import Link from "next/link";
import { Home, Briefcase, FileCode2, BookOpen, Layers, Mail, User } from "lucide-react";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/about", label: "About", icon: User },
  { href: "/services", label: "Services", icon: Briefcase },
  { href: "/case-studies", label: "Case Studies", icon: FileCode2 },
  { href: "/stack", label: "Tech Stack", icon: Layers },
  { href: "/blog", label: "Blog", icon: BookOpen },
  { href: "/contact", label: "Contact", icon: Mail },
];

export function BottomDock() {
  const mouseX = useMotionValue(Infinity);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="mx-auto flex h-16 items-end gap-4 rounded-full bg-canvas-dark/80 px-4 pb-3 backdrop-blur-md border border-white/10 shadow-xl"
      >
        {links.map((link) => (
          <DockIcon mouseX={mouseX} key={link.label} href={link.href} label={link.label}>
            <link.icon className="h-full w-full text-white/80 group-hover:text-primary transition-colors" />
          </DockIcon>
        ))}
      </motion.div>
    </div>
  );
}

function DockIcon({
  mouseX,
  href,
  label,
  children,
}: {
  mouseX: MotionValue<number>;
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <Link href={href} aria-label={label} className="group relative">
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 scale-0 rounded-md bg-canvas-dark px-2 py-1 text-xs font-medium text-white opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100">
        {label}
      </div>
      <motion.div
        ref={ref}
        style={{ width, height: width } as MotionStyle}
        className="flex items-center justify-center rounded-full bg-white/5 p-2 ring-1 ring-white/10 transition-colors group-hover:bg-white/10 group-hover:ring-primary/50"
      >
        {children}
      </motion.div>
    </Link>
  );
}
