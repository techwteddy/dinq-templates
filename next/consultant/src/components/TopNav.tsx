"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Home, User, Briefcase, FileText, Mail, Moon, Sun, BookOpen } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform, MotionValue, MotionStyle } from "framer-motion";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/about", label: "About", icon: User },
  { href: "/services", label: "Services", icon: Briefcase },
  { href: "/case-studies", label: "Case Studies", icon: FileText },
  { href: "/blog", label: "Blog", icon: BookOpen },
  { href: "/contact", label: "Contact", icon: Mail },
];

export function TopNav() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const mouseX = useMotionValue(Infinity);

  return (
    <div className="fixed bottom-10 top-auto md:bottom-auto md:top-10 left-1/2 z-50 flex -translate-x-1/2 items-center max-w-[95vw]">
      {/* Integrated Floating Menu */}
      <nav
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="flex h-14 items-center gap-1 md:gap-2 px-4 rounded-full bg-white/20 dark:bg-zinc-950/10 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 shadow-lg"
      >
        {links.map((link) => (
          <DockIcon
            key={link.label}
            link={link}
            isActive={pathname === link.href}
            mouseX={mouseX}
          />
        ))}

        {/* Theme Toggle - Integrated into the same alignment flow */}
        <div className="h-full flex items-center justify-center ml-2 md:ml-4">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="group flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full border border-transparent hover:border-zinc-500/20 hover:bg-zinc-100/10 transition-all duration-300 active:scale-95 relative"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 group-hover:text-accent" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 group-hover:text-accent" />

            {/* Theme Toggle Tooltip */}
            <span className="absolute -top-12 md:top-full md:mt-2 scale-0 rounded-md border border-border/40 bg-zinc-900/90 dark:bg-zinc-800/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase text-white shadow-lg transition-all group-hover:scale-100 z-50 whitespace-nowrap">
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </span>
          </button>
        </div>
      </nav>
    </div>
  );
}

function DockIcon({
  mouseX,
  link,
  isActive,
}: {
  mouseX: MotionValue<number>;
  link: typeof links[0];
  isActive: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [45, 85, 45]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <motion.div style={{ width } as MotionStyle} className="flex items-center justify-center">
      <Link
        ref={ref}
        href={link.href}
        className={cn(
          "group relative flex h-full w-full items-center justify-center rounded-full transition-all duration-300",
          isActive ? "bg-accent/10 border-accent/20 border shadow-sm" : "hover:bg-zinc-100/10 hover:border-zinc-500/20 border border-transparent"
        )}
      >
        <link.icon className={cn(
          "h-1/2 w-1/2 text-zinc-500 transition-colors group-hover:text-accent",
          isActive && "text-accent"
        )} />
        {/* Tooltip positioned flexibly based on viewport */}
        <span className="absolute -top-12 md:top-full md:mt-2 scale-0 rounded-md border border-border/40 bg-zinc-900/90 dark:bg-zinc-800/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase text-white shadow-lg transition-all group-hover:scale-100 z-50 whitespace-nowrap">
          {link.label}
        </span>
      </Link>
    </motion.div>
  );
}
