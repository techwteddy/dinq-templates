import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* 기본 Tailwind 단계별 +4px (0.25rem @16px) */
      fontSize: {
        xs: ["1rem", { lineHeight: "1.4rem" }],
        sm: ["1.125rem", { lineHeight: "1.55rem" }],
        base: ["1.25rem", { lineHeight: "1.8125rem" }],
        lg: ["1.375rem", { lineHeight: "1.9375rem" }],
        xl: ["1.5rem", { lineHeight: "1.9375rem" }],
        "2xl": ["1.75rem", { lineHeight: "2.25rem" }],
        "3xl": ["2.125rem", { lineHeight: "2.75rem" }],
        "4xl": ["2.5rem", { lineHeight: "3.125rem" }],
        "5xl": ["3.25rem", { lineHeight: "1" }],
        "6xl": ["4rem", { lineHeight: "1" }],
        "7xl": ["4.75rem", { lineHeight: "1" }],
        "8xl": ["6.25rem", { lineHeight: "1" }],
        "9xl": ["8.25rem", { lineHeight: "1" }],
      },
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        heading: ["var(--font-heading)", "var(--font-sans)", "sans-serif"],
        latin: [
          "\"KG Midnight Memories\"",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 1px 2px oklch(0.28 0.03 55 / 0.05), 0 18px 40px -22px oklch(0.28 0.03 55 / 0.1)",
        "glow-sm":
          "0 0 0 1px oklch(0.78 0.1 85 / 0.28), 0 10px 32px -10px oklch(0.48 0.09 150 / 0.28)",
        glow: "0 0 0 1px oklch(0.8 0.11 85 / 0.35), 0 16px 44px -12px oklch(0.45 0.09 150 / 0.38)",
      },
      backgroundImage: {
        "gradient-brand":
          "linear-gradient(135deg, oklch(0.91 0.07 145 / 0.42) 0%, oklch(0.94 0.055 85 / 0.42) 48%, oklch(0.92 0.08 35 / 0.28) 100%)",
      },
    },
  },
  plugins: [typography],
};
export default config;
