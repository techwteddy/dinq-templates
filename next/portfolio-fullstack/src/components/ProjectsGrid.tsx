"use client";

import { useState, useEffect, useRef, CSSProperties } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { useLanguage } from "@/context/LanguageContext";
import t from "@/lib/translations";

interface Project {
  title: string;
  image: string;
  github: string;
  live: string;
  tags: string[];
}

// Define projects with deterministic tags
const projects: Project[] = [
  {
    title: "AI Code Reviewer",
    image: "https://raw.githubusercontent.com/ghiberti85/ai-code-reviewer/main/public/screenshot.png",
    github: "https://github.com/ghiberti85/ai-code-reviewer",
    live: "https://ghiberti-code-reviewer.vercel.app",
    tags: ["React", "TypeScript", "Vite", "Groq API", "Llama 4", "Shiki", "Framer Motion"],
  },
  {
    title: "DevInterviewLab",
    image: "https://raw.githubusercontent.com/ghiberti85/devinterviewlab/main/public/og-image.png",
    github: "https://github.com/ghiberti85/devinterviewlab",
    live: "https://devinterviewlab.vercel.app",
    tags: ["Next.js", "TypeScript", "Supabase", "Groq AI", "PWA", "Radix UI"],
  },
  {
    title: "Interview Command Center",
    image: "https://raw.githubusercontent.com/ghiberti85/interview-command-center/main/public/screenshot.png",
    github: "https://github.com/ghiberti85/interview-command-center",
    live: "https://ghiberti-interview-center.vercel.app",
    tags: ["React", "TypeScript", "Vite", "Supabase", "Claude AI", "PWA"],
  },
  {
    title: "Ghiberti UI",
    image: "https://raw.githubusercontent.com/ghiberti85/ui/main/apps/docs/public/screenshot.png",
    github: "https://github.com/ghiberti85/ui",
    live: "https://ghiberti-ui.vercel.app",
    tags: ["React", "TypeScript", "Next.js", "Storybook", "Turborepo", "Radix UI"],
  },
  {
    title: "Finanças do Casal",
    image: "https://raw.githubusercontent.com/ghiberti85/financa-casal/main/public/screenshot.png",
    github: "https://github.com/ghiberti85/financa-casal",
    live: "https://financa-casal.vercel.app",
    tags: ["React", "TypeScript", "Vite", "Supabase", "Claude AI", "PWA"],
  },
  {
    title: "Ignite Call",
    image: "https://github.com/ghiberti85/ignite-call/raw/main/public/registration-1.png",
    github: "https://github.com/ghiberti85/ignite-call",
    live: "https://ignitecall-ghiberti85.vercel.app/",
    tags: ["Next.js", "React", "Typescript"],
  },
  {
    title: "Design System",
    image: "https://github.com/ghiberti85/ignite-design-system/blob/main/design-system.png?raw=true",
    github: "https://github.com/ghiberti85/ignite-design-system",
    live: "https://ghiberti85.github.io/ignite-design-system/",
    tags: ["React", "Typescript"],
  },
  {
    title: "upload.ai",
    image: "https://github.com/ghiberti85/nlw-ai/raw/main/upload-ai-web/public/screenshot.png",
    github: "https://github.com/ghiberti85/nlw-ai",
    live: "",
    tags: ["React", "Typescript", "Vite", "Vercel"],
  },
  {
    title: "Coffee Delivery",
    image: "https://github.com/ghiberti85/ignite-coffee-delivery/blob/main/coffee-delivery.png?raw=true",
    github: "https://github.com/ghiberti85/ignite-coffee-delivery",
    live: "",
    tags: ["React", "Typescript", "Vite"],
  },
  {
    title: "ToDo",
    image: "https://github.com/ghiberti85/ignite-todo-list/blob/main/to-do.png?raw=true",
    github: "https://github.com/ghiberti85/ignite-todo-list",
    live: "",
    tags: ["Typescript", "React", "Vite"],
  },
  {
    title: "Pizza Shop",
    image: "https://github.com/ghiberti85/ignite-pizza-shop-web/raw/main/public/image-3.png",
    github: "https://github.com/ghiberti85/ignite-pizza-shop-web",
    live: "",
    tags: ["React", "Typescript", "Vite"],
  },
  {
    title: "Be The Hero",
    image: "https://github.com/ghiberti85/omnistack/blob/master/be-the-hero.png?raw=true",
    github: "https://github.com/ghiberti85/omnistack",
    live: "",
    tags: ["React", "Node.js", "React Native"],
  },
  {
    title: "Feedget",
    image: "https://github.com/ghiberti85/nlw-return-impulse/raw/main/Capa.png",
    github: "https://github.com/ghiberti85/nlw-return-impulse",
    live: "",
    tags: ["React", "React Native", "Node.js"],
  },
  {
    title: "Happy",
    image: "https://github.com/ghiberti85/nlw3/blob/master/happy.png?raw=true",
    github: "https://github.com/ghiberti85/nlw3/blob/master/web/src/images/happy.png",
    live: "",
    tags: ["Node.js", "Express", "React"],
  },
  {
    title: "move.it",
    image: "https://placehold.co/300x200?text=move.it",
    github: "https://github.com/ghiberti85/moveit-next",
    live: "",
    tags: ["Next.js", "Typescript", "React"],
  },
  {
    title: "Ecoleta",
    image: "https://github.com/ghiberti85/nlw/raw/master/public/assets/Home.svg",
    github: "https://github.com/yourusername/photo-gallery",
    live: "",
    tags: ["Javascript", "Node.js", "React"],
  },
  {
    title: "NLW Esports",
    image: "https://github.com/ghiberti85/nlw-esports/blob/main/nlw-esports.png?raw=true",
    github: "https://github.com/ghiberti85/nlw-esports",
    live: "",
    tags: ["React", "Node.js", "React Native"],
  },
];


export default function ProjectsGrid() {
  const { lang } = useLanguage();
  const tr = t[lang].projects;
  const [visibleProjects, setVisibleProjects] = useState(6);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedProject(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tiltStyles = useRef<CSSProperties[]>([]);
  const [, forceUpdate] = useState(0);
  const prefersReducedMotion = useRef(false);
  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const handleTiltMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (prefersReducedMotion.current) return;
    const card = cardRefs.current[index];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    tiltStyles.current[index] = {
      transform: `perspective(600px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale(1.03)`,
      transition: "transform 0.1s ease-out",
    };
    forceUpdate((n) => n + 1);
  };

  const handleTiltLeave = (index: number) => {
    tiltStyles.current[index] = {
      transform: "perspective(600px) rotateY(0deg) rotateX(0deg) scale(1)",
      transition: "transform 0.4s ease-out",
    };
    forceUpdate((n) => n + 1);
  };

  // Extract unique tags dynamically
  const uniqueTags = Array.from(new Set(projects.flatMap((project) => project.tags)));

  const handleShowMore = () => {
    setVisibleProjects((prev) => (prev === 6 ? projects.length : 6));
  };

  const descriptions = t[lang].projectDescriptions;

  const handleOpenModal = (project: Project) => {
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  const filteredProjects = activeTag
    ? projects.filter((project) => project.tags.includes(activeTag))
    : projects;

  const isAllProjects = !activeTag;

  return (
    <section id="projects" className="py-20 px-4">
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 sm:mb-16 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
        {tr.title}
      </h2>

      {/* Filter Tags — horizontal scroll on mobile, centered wrap on sm+ */}
      <div className="relative mb-8">
        {/* fade edges on mobile */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-6 z-10 sm:hidden"
          style={{ background: "linear-gradient(to right, var(--bg-from), transparent)" }} />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-6 z-10 sm:hidden"
          style={{ background: "linear-gradient(to left, var(--bg-from), transparent)" }} />

        <div className="flex sm:flex-wrap sm:justify-center gap-3 overflow-x-auto sm:overflow-x-visible px-2 sm:px-0 pb-1 sm:pb-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          <button
            onClick={() => {
              setActiveTag(null);
              setVisibleProjects(6);
            }}
            className={`flex-shrink-0 px-5 py-1 rounded-full text-sm font-semibold transition ${
              isAllProjects
                ? "bg-teal-700 text-white"
                : "hover:bg-teal-700 hover:text-white"
            }`}
            style={!isAllProjects ? { background: "var(--card-bg)", border: "1px solid var(--card-border)", color: "var(--color-text)" } : {}}
          >
            {tr.all}
          </button>
          {uniqueTags.map((tag, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveTag(tag);
                setVisibleProjects(filteredProjects.length);
              }}
              className={`flex-shrink-0 px-5 py-1 rounded-full text-sm font-semibold transition ${
                activeTag === tag
                  ? "bg-teal-700 text-white"
                  : "hover:bg-teal-700 hover:text-white"
              }`}
              style={activeTag !== tag ? { background: "var(--card-bg)", border: "1px solid var(--card-border)", color: "var(--color-text)" } : {}}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.slice(0, visibleProjects).map((project, index) => (
          <div
            key={index}
            ref={(el) => { cardRefs.current[index] = el; }}
            className="group rounded-lg shadow-lg relative cursor-pointer glass-card"
            style={{
              ...(tiltStyles.current[index] ?? { transform: "perspective(600px) rotateY(0deg) rotateX(0deg) scale(1)", transition: "transform 0.4s ease-out" }),
            }}
            onMouseMove={(e) => handleTiltMove(e, index)}
            onMouseLeave={() => handleTiltLeave(index)}
            onClick={() => handleOpenModal(project)}
          >
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {project.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 text-xs bg-teal-700 text-white rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 480px) 100vw, (max-width: 768px) 75vw, (max-width: 1024px) 50vw, 400px"
                loading="lazy"
                quality={70}
                className="object-cover object-top"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-300">
                {project.title}
              </h3>
              <p
                className="text-sm text-gray-400 mt-2 cursor-pointer hover:text-teal-400 transition"
                onClick={() => handleOpenModal(project)}
              >
                {tr.viewMore}
              </p>
            </div>
          </div>
        ))}
      </div>

      {isAllProjects && (
        <div className="text-center mt-8">
          <button
            onClick={handleShowMore}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-teal-400 to-blue-500 text-white font-semibold hover:scale-105 transition-transform"
          >
            {visibleProjects === 6 ? tr.showMore : tr.showLess}
          </button>
        </div>
      )}

      {selectedProject && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75 px-4"
          onClick={handleCloseModal}
        >
          <div
            className="relative p-6 rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto glass-card"
            style={{ backgroundColor: "var(--nav-bg)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4">
              <Image
                src={selectedProject.image}
                alt={selectedProject.title}
                fill
                loading="lazy"
                quality={80}
                sizes="(max-width: 768px) 90vw, (max-width: 1024px) 50vw, 400px"
                className="object-cover object-top"
              />
            </div>
            <h3 className="text-2xl font-semibold mb-4" style={{ color: "var(--color-heading)" }}>
              {selectedProject.title}
            </h3>
            <p className="mb-6" style={{ color: "var(--color-text-muted)" }}>
              {descriptions[projects.indexOf(selectedProject)] ?? ""}
            </p>
            <div className="flex justify-between">
              <a
                href={selectedProject.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-teal-500 transition flex items-center"
              >
                <FontAwesomeIcon icon={faGithub} size="lg" className="mr-2" />
                GitHub
              </a>
              {selectedProject.live && (
                <a
                  href={selectedProject.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-500 transition flex items-center"
                >
                  <FontAwesomeIcon
                    icon={faExternalLinkAlt}
                    size="lg"
                    className="mr-2"
                  />
                  {tr.liveSite}
                </a>
              )}
            </div>
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 py-1 px-2.5 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition transform hover:scale-110 shadow-lg"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
