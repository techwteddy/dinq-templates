import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: '#1A4D1A',
        leaf: '#2D7A2D',
        'harvest-gold': '#A67C00',
        'soil-black': '#1A1814',
        clay: '#4A4540',
        stone: '#78726A',
        silt: '#D1CCC5',
        'warm-white': '#FAFAF8',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
