import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Fondos y superficies
        surface: {
          base: "#080c14",
          raised: "#0e1421",
          overlay: "#141b2d",
          border: "#1e2840",
          muted: "#232e47",
        },
        // Acento principal — verde clínico
        accent: {
          DEFAULT: "#00d4aa",
          dim: "#00a888",
          muted: "rgba(0,212,170,0.12)",
          glow: "rgba(0,212,170,0.25)",
        },
        // Texto
        ink: {
          primary: "#e8edf5",
          secondary: "#8896ae",
          muted: "#4a5670",
        },
        // Semáforo macro
        macro: {
          protein: "#5b8fff",
          fat: "#ff7c5b",
          carbs: "#f5c542",
        },
        // Estados
        ok: "#22c55e",
        warn: "#f59e0b",
        danger: "#ef4444",
      },
      fontFamily: {
        display: ["var(--font-outfit)", "sans-serif"],
        mono: ["var(--font-dm-mono)", "monospace"],
        sans: ["var(--font-outfit)", "sans-serif"],
      },
      borderRadius: {
        app: "1.25rem",
        card: "0.875rem",
        input: "0.625rem",
      },
      boxShadow: {
        card: "0 0 0 1px #1e2840, 0 4px 24px rgba(0,0,0,0.4)",
        "accent-glow": "0 0 24px rgba(0,212,170,0.2)",
        input: "0 0 0 1px #1e2840",
        "input-focus": "0 0 0 2px #00d4aa",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulse_accent: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s ease forwards",
        "fade-up-delay-1": "fade-up 0.4s 0.1s ease forwards",
        "fade-up-delay-2": "fade-up 0.4s 0.2s ease forwards",
        "fade-up-delay-3": "fade-up 0.4s 0.3s ease forwards",
      },
    },
  },
  plugins: [],
};

export default config;
