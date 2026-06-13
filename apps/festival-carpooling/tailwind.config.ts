import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#f0ead8',
        card: '#faf6ef',
        border: '#d4c4a0',
        ink: {
          DEFAULT: '#221c11',
          muted: '#7a6b54',
          subtle: '#9a8b72',
        },
        forest: {
          DEFAULT: '#2d5a27',
          light: '#e6efe4',
        },
        terra: {
          DEFAULT: '#b85c38',
          light: '#f8ede6',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      borderRadius: {
        card: '18px',
        '3xl': '1.25rem',
        '4xl': '1.5rem',
      },
      boxShadow: {
        card: '2px 3px 0px rgba(34,28,17,0.06)',
        'card-hover': '4px 6px 0px rgba(34,28,17,0.10)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'pop': {
          '0%': { transform: 'scale(0.85)' },
          '55%': { transform: 'scale(1.12)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.38s ease both',
        'fade-in': 'fade-in 0.25s ease both',
        'pop': 'pop 0.28s ease both',
      },
    },
  },
  plugins: [],
}

export default config
