"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase, faGraduationCap, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "@/context/LanguageContext";
import t, { TimelineItemData as TimelineItem } from "@/lib/translations";

function TimelineCard({
  item,
  onOpen,
  viewMore,
}: {
  item: TimelineItem;
  onOpen: (item: TimelineItem) => void;
  viewMore: string;
}) {
  const isProfessional = item.type === "professional";
  return (
    <div
      className="p-4 rounded-lg shadow-lg cursor-pointer glass-card lg:h-full flex flex-col"
      style={{ transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "scale(1.03)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "scale(1)"; }}
      onClick={() => onOpen(item)}
    >
      <div className="flex items-center mb-3">
        <div className={`w-9 h-9 rounded-full mr-3 flex-shrink-0 flex items-center justify-center ${isProfessional ? "bg-teal-400" : "bg-blue-500"} text-white`}>
          <FontAwesomeIcon icon={isProfessional ? faBriefcase : faGraduationCap} />
        </div>
        <h3 className="text-sm font-semibold leading-tight" style={{ color: "var(--color-heading)" }}>
          {item.title}
        </h3>
      </div>
      <ul className="list-disc ml-5 space-y-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
        <li><span className="font-medium" style={{ color: "var(--color-text)" }}>{item.institution}</span></li>
        <li>{item.period}</li>
      </ul>
      <p className="text-xs mt-auto pt-3 hover:text-teal-400 transition" style={{ color: "var(--color-text-muted)" }}>
        {viewMore}
      </p>
    </div>
  );
}

// Connector dot between card and the line
function Dot({ type }: { type: "professional" | "education" }) {
  return (
    <div
      className="w-4 h-4 rounded-full flex-shrink-0 border-2"
      style={{
        background: type === "professional" ? "var(--accent-teal)" : "var(--accent-blue)",
        borderColor: type === "professional" ? "var(--accent-teal)" : "var(--accent-blue)",
        boxShadow: type === "professional"
          ? "0 0 8px rgba(20,184,166,0.6)"
          : "0 0 8px rgba(59,130,246,0.6)",
      }}
      aria-hidden="true"
    />
  );
}

export default function Timeline() {
  const { lang } = useLanguage();
  const tr = t[lang].timeline;
  const timelineItems = tr.items;
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end center"],
  });
  const lineProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 25 });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedItem(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "right" ? 320 : -320, behavior: "smooth" });
  };

  return (
    <section id="timeline" className="py-20 px-0" ref={sectionRef}>
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 sm:mb-16 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
        {tr.title}
      </h2>

      {/* ── Mobile: left-rail vertical layout ──────────────────────── */}
      <div className="lg:hidden relative max-w-2xl mx-auto px-4 pl-10">
        {/* Vertical line on the left rail */}
        <div className="absolute top-0 bottom-0 left-6 w-0.5 overflow-hidden" aria-hidden="true"
          style={{ background: "var(--card-border)" }}>
          <motion.div
            className="w-full origin-top"
            style={{
              scaleY: lineProgress,
              height: "100%",
              background: "linear-gradient(to bottom, var(--accent-teal), var(--accent-blue))",
            }}
          />
        </div>

        {timelineItems.map((item, index) => (
          <div key={index} className="relative mb-8 flex items-start gap-4">
            {/* Dot on the left rail */}
            <div className="absolute -left-6 top-1/2 -translate-y-1/2 z-10">
              <Dot type={item.type} />
            </div>
            {/* Card — full width minus rail, small gap from dot */}
            <div className="flex-1 min-w-0 ml-2">
              <TimelineCard item={item} onOpen={setSelectedItem} viewMore={tr.viewMore} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Desktop: horizontal scroll — professional above, education below ── */}
      <div className="hidden lg:block relative max-w-7xl mx-auto px-12">
        {/* Scroll arrows */}
        <button
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full text-teal-400 hover:text-white hover:bg-teal-500 transition"
          style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <button
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full text-teal-400 hover:text-white hover:bg-teal-500 transition"
          style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>

        {/* Scrollable track — py-6 gives room for scale(1.03) so cards don't clip */}
        <div
          ref={scrollRef}
          className="timeline-scroll overflow-x-auto scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/*
            Layout per column (height fixed so line stays centered):
            Professional: [card] [dot] [── line ──] [empty]
            Education:    [empty] [── line ──] [dot] [card]
            py-6 (24px top+bottom) gives breathing room for hover scale.
          */}
          <div className="flex gap-4 w-max px-4 relative" style={{ height: "420px", paddingTop: "20px", paddingBottom: "20px", boxSizing: "content-box" }}>

            {/* Central horizontal line — centered at 200px from content top (dot center) */}
            <div
              className="absolute left-0 right-0 h-0.5 pointer-events-none overflow-hidden"
              style={{ top: "calc(20px + 200px)", background: "var(--card-border)" }}
              aria-hidden="true"
            >
              <motion.div
                className="h-full origin-left"
                style={{
                  scaleX: lineProgress,
                  width: "100%",
                  background: "linear-gradient(to right, var(--accent-teal), var(--accent-blue))",
                }}
              />
            </div>

            {timelineItems.map((item) => {
              const isProfessional = item.type === "professional";
              return (
                <div
                  key={item.title}
                  className="w-64 flex-shrink-0 flex flex-col"
                  style={{ height: "420px" }}
                >
                  {isProfessional ? (
                    <>
                      {/* Top half: card fills, anchored to bottom */}
                      <div className="flex flex-col justify-end" style={{ height: "190px", paddingBottom: "12px", overflow: "visible" }}>
                        <TimelineCard item={item} onOpen={setSelectedItem} viewMore={tr.viewMore} />
                      </div>
                      {/* Dot sits between card and line */}
                      <div className="flex justify-center items-center" style={{ height: "20px" }}>
                        <Dot type="professional" />
                      </div>
                      {/* Bottom half: empty */}
                      <div style={{ height: "210px" }} />
                    </>
                  ) : (
                    <>
                      {/* Top half: empty */}
                      <div style={{ height: "190px" }} />
                      {/* Dot sits between line and card */}
                      <div className="flex justify-center items-center" style={{ height: "20px" }}>
                        <Dot type="education" />
                      </div>
                      {/* Bottom half: card fills, anchored to top */}
                      <div className="flex flex-col justify-start" style={{ height: "210px", paddingTop: "12px", overflow: "visible" }}>
                        <TimelineCard item={item} onOpen={setSelectedItem} viewMore={tr.viewMore} />
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative p-5 sm:p-8 rounded-lg shadow-lg max-w-md w-full sm:max-w-lg mx-4 max-h-[85vh] overflow-y-auto"
            style={{ backgroundColor: "var(--nav-bg)", border: "1px solid var(--card-border)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 px-2.5 py-1 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition transform hover:scale-110 shadow-lg"
            >
              ✕
            </button>
            <h3 className="text-xl md:text-2xl font-semibold mb-4" style={{ color: "var(--color-heading)" }}>
              {selectedItem.title}
            </h3>
            <p className="mb-4" style={{ color: "var(--color-text-muted)" }}>{selectedItem.period}</p>
            <ul className="list-disc ml-5 space-y-2" style={{ color: "var(--color-text)" }}>
              {selectedItem.details.map((detail, i) => (
                <li key={i}>{detail}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
