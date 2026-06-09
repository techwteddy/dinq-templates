import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  usePresence,
  useAnimationControls,
} from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Plus,
  Bone,
  Dna,
  Gem,
  Leaf,
  BookOpen,
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const chaptersData = [
  { name: "Age of Dinosaurs", image: "https://res.cloudinary.com/dsdxaxkiz/image/upload/v1779624247/01_udnber.png" },
  { name: "Fossils of Ancient Life", image: "https://res.cloudinary.com/dsdxaxkiz/image/upload/v1779624374/02_pmvxxl.png" },
  { name: "Reptiles of the Mesozoic", image: "https://res.cloudinary.com/dsdxaxkiz/image/upload/v1779624236/03_hcp3jc.png" },
  { name: "Marine Fossil Gallery", image: "https://res.cloudinary.com/dsdxaxkiz/image/upload/v1779624256/04_get63z.png" },
  { name: "Prehistoric Giants", image: "https://res.cloudinary.com/dsdxaxkiz/image/upload/v1779624251/05_kz1tyu.png" },
];

// ─── Animation variants ───────────────────────────────────────────────────────

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const letterBlock = {
  initial: { y: 120, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
  },
};

// ─── SandTransitionImage ──────────────────────────────────────────────────────

function SandTransitionImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [isPresent, safeToRemove] = usePresence();
  const filterIdRef = useRef(`sand-${Math.random().toString(36).slice(2)}`);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  const turbRef = useRef<SVGFETurbulenceElement | null>(null);
  const dispRef = useRef<SVGFEDisplacementMapElement | null>(null);
  const offsetRef = useRef<SVGFEOffsetElement | null>(null);
  const blurRef = useRef<SVGFEGaussianBlurElement | null>(null);
  const colorRef = useRef<SVGFEColorMatrixElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const duration = 900;

    const animate = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const raw = Math.min(elapsed / duration, 1);

      let progress: number;
      if (isPresent) {
        // quartic ease-out
        progress = 1 - Math.pow(1 - raw, 4);
      } else {
        // cubic ease-in
        progress = Math.pow(raw, 3);
      }

      const t = isPresent ? progress : progress;

      if (turbRef.current) turbRef.current.setAttribute("baseFrequency", "1.8");
      if (dispRef.current) dispRef.current.setAttribute("scale", String(isPresent ? 150 * (1 - t) : 150 * t));
      if (offsetRef.current) {
        const dy = isPresent ? -80 * (1 - t) : 120 * t;
        const dx = isPresent ? -30 * (1 - t) : 30 * t;
        offsetRef.current.setAttribute("dy", String(dy));
        offsetRef.current.setAttribute("dx", String(dx));
      }
      if (blurRef.current) blurRef.current.setAttribute("stdDeviation", String(isPresent ? 6 * (1 - t) : 6 * t));
      if (colorRef.current) {
        const opacity = isPresent ? 1 - (1 - t) * 1.2 : 1 - t * 1.2;
        const clamped = Math.max(0, Math.min(1, opacity));
        colorRef.current.setAttribute(
          "values",
          `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${clamped} 0`
        );
      }

      if (raw < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        if (!isPresent) safeToRemove?.();
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPresent, safeToRemove]);

  const filterId = filterIdRef.current;

  return (
    <div className={className} style={{ filter: `url(#${filterId})` }}>
      <svg ref={svgRef} style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
            <feTurbulence
              ref={turbRef}
              type="fractalNoise"
              baseFrequency="1.8"
              numOctaves={4}
              result="noise"
            />
            <feDisplacementMap
              ref={dispRef}
              in="SourceGraphic"
              in2="noise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feOffset ref={offsetRef} in="displaced" dx="0" dy="0" result="offset" />
            <feGaussianBlur ref={blurRef} in="offset" stdDeviation="0" result="blurred" />
            <feColorMatrix
              ref={colorRef}
              in="blurred"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"
            />
          </filter>
        </defs>
      </svg>
      <img
        src={src}
        alt={alt}
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-4/5 h-4/5 m-auto object-contain mix-blend-lighten"
      />
    </div>
  );
}

// ─── Leaf SVG icon ────────────────────────────────────────────────────────────

function LeafIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-8 2 1-3 5-3 5-3C14 3 12 5 12 5c-3-3-6-3-9-3h-.5A6.5 6.5 0 0 1 9 10c3 2 4 4 4 7h1c1-3 3-5 3-9Z" />
    </svg>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [showVideo, setShowVideo] = useState(false);
  const [activeChapter, setActiveChapter] = useState(2);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHoveringCta, setIsHoveringCta] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowVideo(true), 2800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveChapter((prev) => (prev + 1) % 5);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const navLinks = ["Visit", "Exhibitions", "Discover", "Learn", "About"];

  return (
    <div className="bg-[#fcfcfc] text-[#111] overflow-x-hidden font-sans">
      {/* ── SECTION 1: HERO ─────────────────────────────────────── */}
      <section className="relative w-full min-h-screen flex flex-col overflow-hidden">
        {/* Background Video */}
        <AnimatePresence>
          {showVideo && (
            <motion.div
              className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source
                  src="https://res.cloudinary.com/dsdxaxkiz/video/upload/v1779624998/magnific_use-img-2-as-the-exact-ba_Piu3X0W42C_wnrc8f.mp4"
                  type="video/mp4"
                />
              </video>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.header
          className="pt-6 px-6 md:px-16 z-20"
          initial="initial"
          animate="animate"
          variants={{ animate: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
        >
          {/* NHM SVG Logo */}
          <motion.h1
            variants={{
              initial: { scale: 1.03 },
              animate: { scale: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
            }}
            className="w-full"
          >
            <svg viewBox="0 0 840 100" fill="#111" className="w-full" xmlns="http://www.w3.org/2000/svg">
              {/* Letter N */}
              <g transform="translate(0,0)">
                <motion.polygon variants={letterBlock} points="0,0 14,0 14,100 0,100" />
                <motion.polygon variants={letterBlock} points="200,0 214,0 214,100 200,100" />
                <motion.polygon variants={letterBlock} points="0,0 33,0 214,100 181,100" />
              </g>
              {/* Letter H */}
              <g transform="translate(280,0)">
                <motion.polygon variants={letterBlock} points="0,0 14,0 14,100 0,100" />
                <motion.polygon variants={letterBlock} points="200,0 214,0 214,100 200,100" />
                <motion.polygon variants={letterBlock} points="14,43 200,43 200,57 14,57" />
              </g>
              {/* Letter M */}
              <g transform="translate(560,0)">
                <motion.polygon variants={letterBlock} points="0,0 14,0 14,100 0,100" />
                <motion.polygon variants={letterBlock} points="266,0 280,0 280,100 266,100" />
                <motion.polygon variants={letterBlock} points="0,0 26,0 153,100 127,100" />
                <motion.polygon variants={letterBlock} points="254,0 280,0 153,100 127,100" />
              </g>
            </svg>
          </motion.h1>

          {/* Sub-nav bar */}
          <motion.div
            className="flex justify-between items-start mt-8"
            variants={{
              initial: {},
              animate: { transition: { staggerChildren: 0.08, delayChildren: 0.4 } },
            }}
          >
            {/* Left: Museum name */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-[15%] min-w-[80px] text-[10px] md:text-[11px] font-mono tracking-[0.2em] uppercase leading-relaxed"
            >
              <div>Natura</div>
              <div>History</div>
              <div>Museum</div>
            </motion.div>

            {/* Arrow 1 */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="hidden md:flex w-[5%] justify-center pt-1"
            >
              <ArrowRight size={14} strokeWidth={1} className="text-gray-400" />
            </motion.div>

            {/* Center: Description */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex-1 md:flex-none md:w-[30%] text-[10px] md:text-[11px] text-gray-800 leading-relaxed font-mono tracking-[0.05em] px-4 md:px-0"
            >
              <span className="md:hidden">Exploring the story of life on earth through science, discovery and wonder.</span>
              <span className="hidden md:inline">
                Exploring the story of life on earth<br />
                through science, discovery<br />
                and wonder.
              </span>
            </motion.div>

            {/* Arrow 2 */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="hidden md:flex w-[5%] justify-center pt-1"
            >
              <ArrowRight size={14} strokeWidth={1} className="text-gray-400" />
            </motion.div>

            {/* Right: Nav links */}
            <motion.nav
              variants={fadeUp}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="hidden md:block w-[15%] text-[10px] md:text-[11px] font-mono tracking-[0.2em] uppercase leading-relaxed"
            >
              {navLinks.map((link) => (
                <div key={link}>
                  <a href="#" className="text-gray-800 hover:text-black hover:underline transition-colors">
                    {link}
                  </a>
                </div>
              ))}
            </motion.nav>

            {/* Hamburger */}
            <motion.button
              variants={fadeUp}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-[60] flex flex-col gap-[6px] cursor-pointer ml-4"
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <span
                className={`block h-[1.5px] bg-black origin-center transition-all duration-300 ${
                  isMobileMenuOpen
                    ? "w-8 rotate-45 translate-y-[7px]"
                    : "w-8 hover:w-6"
                }`}
              />
              <span
                className={`block h-[1.5px] bg-black origin-center transition-all duration-300 ${
                  isMobileMenuOpen
                    ? "w-8 -rotate-45 -translate-y-[0.5px]"
                    : "w-8 hover:w-10"
                }`}
              />
            </motion.button>
          </motion.div>
        </motion.header>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden absolute top-[calc(100px+2rem)] left-0 right-0 bg-[#fcfcfc] border-b border-gray-200 shadow-xl z-50 px-6 py-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <nav className="space-y-6">
                {navLinks.map((link) => (
                  <div key={link}>
                    <a
                      href="#"
                      className="block text-sm font-mono tracking-[0.2em] uppercase text-gray-800 hover:text-black transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link}
                    </a>
                  </div>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Left Sidebar Content */}
        <motion.div
          className="relative px-6 md:px-16 mt-20 sm:mt-28 md:mt-32 w-full md:w-[320px] z-10"
          initial="initial"
          animate="animate"
          variants={{ animate: { transition: { staggerChildren: 0.15, delayChildren: 0.6 } } }}
        >
          {/* Section indicator */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="text-xs font-mono tracking-widest text-gray-500">01</span>
            <span className="w-16 h-[1.5px] bg-black/20 block" />
          </motion.div>

          {/* Headline */}
          <motion.h2
            variants={fadeUp}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-[3.5rem] md:text-[5rem] font-normal tracking-tight leading-[1] mb-6"
          >
            TIMELESS<br />WONDERS
          </motion.h2>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-[13px] md:text-[14px] text-gray-700 w-[240px] leading-[1.6] mb-8"
          >
            Step into the natural world and<br />
            discover the stories written<br />
            millions of years ago.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.button
              className="relative overflow-hidden bg-[#1a1a1a] px-6 py-3.5 border border-[#1a1a1a] rounded-md shadow-sm flex items-center gap-3 group"
              onHoverStart={() => setIsHoveringCta(true)}
              onHoverEnd={() => setIsHoveringCta(false)}
              whileHover={{ y: -0.5, boxShadow: "3px 3px 0px rgba(17,17,17,0.5)" }}
              whileTap={{ y: 0, boxShadow: "none" }}
            >
              {/* Sliding bg panel */}
              <motion.span
                className="absolute inset-0 bg-[#fcfcfc] z-0"
                initial={{ x: "-101%" }}
                animate={{ x: isHoveringCta ? "0%" : "-101%" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              />
              {/* Leaf icon */}
              <motion.span
                className="relative z-10"
                animate={
                  isHoveringCta
                    ? { color: "#111", scale: 1.1, rotate: -12, y: -4 }
                    : { color: "#fff", scale: 1, rotate: 0, y: 0 }
                }
                transition={{ duration: 0.3 }}
              >
                <LeafIcon />
              </motion.span>
              {/* Text */}
              <motion.span
                className="relative z-10 text-[15px] font-medium"
                animate={{ color: isHoveringCta ? "#111" : "#fff" }}
                transition={{ duration: 0.3 }}
              >
                Explore Now
              </motion.span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Right Sidebar */}
        <motion.div
          className="hidden md:flex flex-col gap-6 absolute right-16 top-[calc(100px+2rem)] w-[200px] mt-12 md:mt-20 z-10"
          initial="initial"
          animate="animate"
          variants={{ animate: { transition: { staggerChildren: 0.15, delayChildren: 0.9 } } }}
        >
          {/* Specimen info */}
          <motion.div variants={fadeUp} transition={{ duration: 0.8, ease: "easeOut" }}>
            <div className="text-[10px] font-bold font-mono tracking-widest uppercase mb-1">
              Tyrannosaurus Rex
            </div>
            <div className="text-[12px] text-gray-600 leading-[1.6]">
              Late Cretaceous period<br />68–66 million years ago
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div variants={fadeUp} transition={{ duration: 0.8, ease: "easeOut" }} className="space-y-3">
            {[["Length", "12.3 m"], ["Height", "4.0 m"]].map(([label, val]) => (
              <div key={label}>
                <div className="text-[10px] font-mono tracking-widest uppercase text-gray-500">{label}</div>
                <div className="text-[13px] font-medium">{val}</div>
              </div>
            ))}
          </motion.div>

          {/* View Details */}
          <motion.div variants={fadeUp} transition={{ duration: 0.8, ease: "easeOut" }}>
            <button className="flex items-center gap-3 group">
              <span className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center transition-all duration-300 group-hover:border-black group-hover:bg-[#111]">
                <Plus size={16} strokeWidth={1.5} className="text-gray-600 group-hover:text-white transition-colors duration-300" />
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">View Details</span>
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll to explore */}
        <motion.div
          className="absolute bottom-10 left-10 md:left-16 hidden md:flex items-center gap-4 z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
        >
          <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center gap-[4px]">
            <span className="w-[1px] h-[12px] bg-gray-600 block" />
            <span className="w-[1px] h-[12px] bg-gray-600 block" />
          </div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-gray-500 font-semibold">
            Scroll to explore
          </span>
        </motion.div>
      </section>

      {/* ── SECTION 2: EXPLORE OUR WORLD ────────────────────────── */}
      <section className="relative w-full min-h-[75vh] md:min-h-screen bg-[#fcfcfc] flex flex-col items-center pt-24 md:pt-32 pb-0 z-20">
        {/* Section label */}
        <motion.div
          className="flex items-center gap-3 mb-12 text-[10px] md:text-[11px] font-mono tracking-[0.2em]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <span className="text-gray-500">02</span>
          <span className="text-gray-900 font-bold uppercase">Explore Our World</span>
        </motion.div>

        {/* Main heading */}
        <motion.h2
          className="text-[2.2rem] md:text-[3.5rem] lg:text-[4.2rem] leading-[1.1] font-medium tracking-tight text-[#111] max-w-[1000px] text-center px-6"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          Unearth the stories of our planet's{" "}
          <span className="hidden md:inline"><br /></span>
          past through fossils, minerals, and ancient wonders.
        </motion.h2>

        {/* Action pills */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 md:gap-4 mt-10 mb-10 md:mb-24 px-6"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={{ animate: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } } }}
        >
          {[
            { icon: <Bone size={14} strokeWidth={2} />, label: "Dinosaurs" },
            { icon: <Dna size={14} strokeWidth={2} />, label: "Ancient Life" },
            { icon: <Gem size={14} strokeWidth={2} />, label: "Minerals" },
            { icon: <Leaf size={14} strokeWidth={2} />, label: "Fossils" },
            { icon: <BookOpen size={14} strokeWidth={2} />, label: "Learn More" },
          ].map(({ icon, label }) => (
            <motion.button
              key={label}
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-300 text-[11px] font-medium uppercase tracking-wider bg-white/50 backdrop-blur-sm text-gray-800 hover:border-black hover:bg-black hover:text-white transition-all duration-300"
            >
              {icon}
              {label}
            </motion.button>
          ))}
        </motion.div>

        {/* Spacer for pterodactyl overlap */}
        <div className="w-full min-h-[220px] md:min-h-[450px]" />

        {/* Bottom text */}
        <div className="absolute bottom-0 left-0 right-0 px-8 md:px-16 pb-8 md:pb-12 pointer-events-none">
          <div className="hidden md:flex justify-between">
            <span className="text-[10px] font-mono tracking-widest uppercase text-gray-500 font-medium">
              We don't just tell stories.
            </span>
            <span className="text-[10px] font-mono tracking-widest uppercase text-gray-500 font-medium">
              Paleontology (C) 2026
            </span>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: ANCIENT COLLECTION ───────────────────────── */}
      <section className="relative w-full bg-[#0a0a0a] text-white flex flex-col z-30">
        {/* Pterodactyl image */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 w-[160vw] md:w-[1100px] pointer-events-none z-0"
          style={{ top: 0 }}
          initial={{ y: "-65%", opacity: 0 }}
          whileInView={{ y: "-78%", opacity: 1 }}
          viewport={{ once: true, margin: "100px" }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        >
          <img
            src="https://res.cloudinary.com/dsdxaxkiz/image/upload/v1779625001/ChatGPT_Image_May_23_2026_12_24_44_PM_1_lv1dne.png"
            alt="Pterodactyl"
            className="w-full"
          />
        </motion.div>

        {/* Heading area */}
        <div className="relative px-8 md:px-16 pt-32 md:pt-48 mb-16 z-10">
          <div className="flex flex-col xl:flex-row justify-between gap-12 xl:gap-20">
            {/* Left: main heading */}
            <motion.h2
              className="text-[1.8rem] md:text-[3rem] lg:text-[3.8rem] xl:text-[4rem] leading-[1.15] font-medium tracking-tight text-white max-w-[700px]"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              Curated from millions of years of wonder{" "}
              <span className="inline-flex gap-2 md:gap-3 align-middle mx-2 md:mx-4 -translate-y-1">
                {[Bone, Dna, Leaf].map((Icon, i) => (
                  <button
                    key={i}
                    className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-gray-600 bg-black text-gray-400 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all duration-300"
                  >
                    <Icon size={22} />
                  </button>
                ))}
              </span>
              {" "}& discovery.
            </motion.h2>

            {/* Right: tagline + pills */}
            <motion.div
              className="flex flex-col gap-6 xl:pt-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <p className="text-[9px] md:text-[10px] font-mono tracking-widest text-gray-400 uppercase leading-relaxed">
                We don't just display fossils<br />We share earth's story
              </p>
              <div className="flex flex-wrap gap-3">
                {["Educational", "Authentic", "Inspiring"].map((label) => (
                  <button
                    key={label}
                    className="px-5 py-2 rounded-full border border-gray-600 text-[9px] font-mono tracking-widest uppercase text-gray-300 hover:bg-white hover:text-black hover:border-white transition-all duration-300"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-gray-800 mx-8 md:mx-16" />

        {/* Two-column panel */}
        <div className="flex flex-col md:flex-row relative z-10">
          {/* Left panel */}
          <div className="w-full md:w-[35%] border-b md:border-b-0 md:border-r border-gray-800 min-h-[400px] md:min-h-[500px] flex flex-col justify-between p-8">
            <div className="text-gray-500 text-xl tracking-[0.3em]">***</div>

            {/* Chapter image with sand transition */}
            <div className="relative flex-1 flex items-center justify-center my-8">
              <AnimatePresence mode="wait">
                <SandTransitionImage
                  key={activeChapter}
                  src={chaptersData[activeChapter].image}
                  alt={chaptersData[activeChapter].name}
                  className="absolute inset-0 w-full h-full"
                />
              </AnimatePresence>
            </div>

            {/* Chapter counter */}
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase overflow-hidden">
              <div className="relative h-[1.2em] overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activeChapter}
                    className="block text-[#888]"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {String(activeChapter + 1).padStart(2, "0")}
                  </motion.span>
                </AnimatePresence>
              </div>
              <span className="text-[#333]">/</span>
              <span className="text-[#888]">05</span>
            </div>
          </div>

          {/* Right panel */}
          <div className="flex-1 flex flex-col">
            {/* Top bar */}
            <div className="border-b border-gray-800 px-8 py-5 flex items-center justify-between text-[10px] font-mono text-gray-400 tracking-widest">
              <span>Explore the past. Understand the present.</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={activeChapter}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  Chapter {String(activeChapter + 1).padStart(2, "0")}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Chapter list */}
            <div className="flex flex-col">
              {chaptersData.map((chapter, idx) => {
                const isActive = idx === activeChapter;
                return (
                  <button
                    key={idx}
                    className="w-full text-left border-b border-gray-800/80 px-8 py-8 flex items-center justify-between group transition-colors duration-300"
                    onClick={() => setActiveChapter(idx)}
                  >
                    <span
                      className={`text-2xl md:text-[2rem] font-medium tracking-tight transition-colors duration-300 ${
                        isActive ? "text-white" : "text-[#444] hover:text-[#999]"
                      }`}
                    >
                      {chapter.name}
                    </span>
                    <AnimatePresence>
                      {isActive && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ArrowUpRight size={22} strokeWidth={1} className="text-gray-400" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer divider */}
        <div className="h-[1px] bg-gray-800" />

        {/* Bottom footer text */}
        <div className="px-8 py-8 text-[10px] font-mono tracking-widest text-gray-500 uppercase bg-[#0a0a0a]">
          Digging into our planet's past
        </div>
      </section>
    </div>
  );
}
