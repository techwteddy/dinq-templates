/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Custom color palette for dark theme
      colors: {
        // Dark backgrounds
        dark: {
          DEFAULT: '#0a0a0a',
          lighter: '#1a1a1a',
          card: '#141414',
        },
        // Accent colors
        accent: {
          primary: '#2563eb', // Blue (WCAG AA compliant: 5.17:1 with white)
          secondary: '#10b981', // Green
          hover: '#1d4ed8', // Darker blue for hover (6.70:1 with white)
          lavender: '#8d8ba3', // Sage lavender for light mode accents
          lavenderDark: '#6d6b82', // Balanced dark lavender for dark mode
        },
        // Text colors
        text: {
          primary: '#ffffff',
          secondary: '#a3a3a3',
          muted: '#7a7a7a', // WCAG AA compliant: 4.61:1 on dark backgrounds
        },
      },
      // Spacing scale (8px base)
      spacing: {
        '0': '0',
        '1': '0.125rem', // 2px
        '2': '0.25rem',  // 4px
        '3': '0.5rem',   // 8px
        '4': '1rem',     // 16px
        '5': '1.5rem',   // 24px
        '6': '2rem',     // 32px
        '7': '2.5rem',   // 40px
        '8': '3rem',     // 48px
        '9': '4rem',     // 64px
        '10': '5rem',    // 80px
        '11': '6rem',    // 96px
        '12': '8rem',    // 128px
      },
      // Border radius values
      borderRadius: {
        'none': '0',
        'sm': '0.25rem',   // 4px
        'DEFAULT': '0.5rem', // 8px
        'md': '0.75rem',   // 12px
        'lg': '1rem',      // 16px
        'xl': '1.5rem',    // 24px
        'full': '9999px',
      },
      // Shadow values
      boxShadow: {
        'sm': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'DEFAULT': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'md': '0 6px 12px rgba(0, 0, 0, 0.15)',
        'lg': '0 8px 16px rgba(0, 0, 0, 0.15)',
        'xl': '0 12px 24px rgba(0, 0, 0, 0.2)',
        'none': 'none',
      },
      // Typography
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],      // 12px
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
        'base': ['1rem', { lineHeight: '1.5rem' }],     // 16px
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],      // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px
        '5xl': ['3rem', { lineHeight: '1' }],           // 48px
        '6xl': ['3.75rem', { lineHeight: '1' }],        // 60px
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: 0 },
          "50%": { opacity: 1 },
        },
      },
      animation: {
        blink: "blink 1s steps(1) infinite",
      },
      transitionProperty: {
        colors: "color, background-color, border-color",
      },
      transitionDuration: {
        200: "200ms",
        300: "300ms",
        400: "400ms",
      },
      transitionTimingFunction: {
        subtle: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};

