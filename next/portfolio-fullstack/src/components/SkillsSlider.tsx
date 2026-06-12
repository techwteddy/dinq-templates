"use client";

import { useState } from "react";
import Slider from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useLanguage } from "@/context/LanguageContext";
import t from "@/lib/translations";
import SkillsRadar from "@/components/SkillsRadar";

const skillGlow: Record<string, string> = {
  "React":          "rgba(97,218,251,0.55)",
  "TypeScript":     "rgba(49,120,198,0.55)",
  "JavaScript":     "rgba(247,223,30,0.55)",
  "Node.js":        "rgba(51,153,51,0.55)",
  "Next.js":        "rgba(200,200,200,0.35)",
  "PostgreSQL":     "rgba(51,103,145,0.55)",
  "Supabase":       "rgba(62,207,142,0.55)",
  "TailwindCSS":    "rgba(6,182,212,0.55)",
  "CSS3":           "rgba(21,114,182,0.55)",
  "HTML5":          "rgba(227,79,38,0.55)",
  "Git":            "rgba(240,80,50,0.55)",
  "GitHub Actions": "rgba(32,136,255,0.55)",
  "Docker":         "rgba(36,150,237,0.55)",
  "Jest":           "rgba(194,19,37,0.55)",
  "Storybook":      "rgba(255,71,133,0.55)",
  "Figma":          "rgba(242,78,30,0.55)",
  "Vite":           "rgba(100,108,255,0.55)",
  "Vercel":         "rgba(200,200,200,0.35)",
  "Webpack":        "rgba(141,214,249,0.55)",
  "Axios":          "rgba(90,41,228,0.55)",
  "NPM":            "rgba(203,56,55,0.55)",
  "Sass":           "rgba(204,102,153,0.55)",
  "Netlify":        "rgba(0,199,183,0.55)",
  "Wordpress":      "rgba(33,117,155,0.55)",
  "Hubspot":        "rgba(255,122,89,0.55)",
  "Prisma":         "rgba(180,180,200,0.35)",
  "GraphQL":        "rgba(228,52,170,0.55)",
  "ESLint":         "rgba(75,50,195,0.55)",
  "AWS":            "rgba(255,153,0,0.55)",
  "Linux":          "rgba(150,150,150,0.40)",
  "React Query":    "rgba(255,65,84,0.55)",
  "Vitest":         "rgba(110,159,24,0.55)",
  "Radix UI":       "rgba(200,200,210,0.35)",
  "Zod":            "rgba(62,103,177,0.55)",
  "Turborepo":      "rgba(239,68,68,0.55)",
  "shadcn/ui":      "rgba(200,200,200,0.35)",
};

interface Skill {
  name: string;
  icon: string;
}

const skills: Skill[] = [
  { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
  { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
  { name: "Supabase", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg" },
  { name: "TailwindCSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
  { name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
  { name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
  { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
  { name: "GitHub Actions", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/githubactions/githubactions-original.svg" },
  { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
  { name: "Jest", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg" },
  { name: "Storybook", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/storybook/storybook-original.svg" },
  { name: "Figma", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
  { name: "Vite", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vite/vite-original.svg" },
  { name: "Vercel", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg" },
  { name: "Webpack", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webpack/webpack-original.svg" },
  { name: "Axios", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/axios/axios-plain-wordmark.svg" },
  { name: "NPM", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg" },
  { name: "Sass", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg" },
  { name: "Netlify", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/netlify/netlify-original.svg" },
  { name: "Wordpress", icon: "https://static.cdnlogo.com/logos/w/65/wordpress.svg" },
  { name: "Hubspot", icon: "https://static.cdnlogo.com/logos/h/24/hubspot.svg" },
  { name: "Prisma", icon: "/skills/prisma.svg" },
  { name: "GraphQL", icon: "/skills/graphql.svg" },
  { name: "ESLint", icon: "/skills/eslint.svg" },
  { name: "AWS", icon: "/skills/aws.svg" },
  { name: "Linux", icon: "/skills/linux.svg" },
  { name: "React Query", icon: "/skills/reactquery.svg" },
  { name: "Vitest", icon: "/skills/vitest.svg" },
  { name: "Radix UI", icon: "/skills/radixui.svg" },
  { name: "Zod", icon: "/skills/zod.svg" },
  { name: "Turborepo", icon: "/skills/turborepo.svg" },
  { name: "shadcn/ui", icon: "/skills/shadcnui.svg" },
];

const midIndex = Math.ceil(skills.length / 2);
const firstSliderSkills = skills.slice(0, midIndex);
const secondSliderSkills = skills.slice(midIndex);

export default function SkillsSlider() {
  const { lang } = useLanguage();
  const tr = t[lang].skills;

  const sliderSettings = {
    autoplay: true,
    autoplaySpeed: 2000,
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: false,
    dots: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 640, settings: { slidesToShow: 2 } },
    ],
  };

  return (
    <section id="skills" className="relative py-20 px-4">
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 sm:mb-16 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
        {tr.title}
      </h2>

      <div className="skills-slider relative mb-8">
        <Slider {...sliderSettings}>
          {firstSliderSkills.map((skill, index) => (
            <SkillCard key={index} skill={skill} />
          ))}
        </Slider>
      </div>

      <div className="skills-slider relative">
        <Slider {...sliderSettings} rtl={true}>
          {secondSliderSkills.map((skill, index) => (
            <SkillCard key={index} skill={skill} />
          ))}
        </Slider>
      </div>

      <SkillsRadar />
    </section>
  );
}

function SkillCard({ skill }: { skill: Skill }) {
  const [hovered, setHovered] = useState(false);
  const glowColor = skillGlow[skill.name] ?? "rgba(20,184,166,0.45)";

  return (
    <div
      className="relative p-4 sm:p-6 m-2 sm:m-4 rounded-lg shadow-lg glass-card"
      style={{
        transform: hovered ? "scale(1.05)" : "scale(1)",
        boxShadow: hovered ? `0 4px 32px 0px ${glowColor}` : "none",
        transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.4s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Image
        src={skill.icon}
        alt={skill.name}
        width={64}
        height={64}
        sizes="(max-width: 768px) 50px, 64px"
        className="w-auto h-16 mb-4 mx-auto"
        loading="lazy"
      />
      <h3 className="text-base font-semibold text-center" style={{ color: "var(--color-text)" }}>
        {skill.name}
      </h3>
    </div>
  );
}
