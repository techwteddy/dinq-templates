# FlowArt Project Guide

This guide provides an in-depth look at the FlowArt project structure, design philosophy, and development workflows.

## 📂 Project Structure

```text
flowart/
├── app/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── sections/         # Page sections (Hero, About, etc.)
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utility functions
│   │   ├── styles/           # Global styles and Tailwind config
│   │   ├── App.tsx           # Main application entry point
│   │   └── main.tsx          # React DOM rendering
│   ├── public/               # Static assets (images, icons)
│   ├── index.html            # HTML entry point
│   ├── package.json          # Dependencies and scripts
│   ├── vite.config.ts        # Vite configuration
│   └── tsconfig.json         # TypeScript configuration
└── ...
```

## 🎨 Design System

FlowArt uses a curated "editorial" aesthetic with a focus on typography, negative space, and smooth motion.

### Colors

- **Taupe**: Primary background/surface tones.
- **Sage**: Accents and fresh highlights.
- **Charcoal/Black**: Text and high-contrast elements.
- **Cream/White**: Light accents and text.

### Typography

- **Headings**: Broad, bold, or high-contrast display fonts.
- **Body**: Clean sans-serif (Inter) for readability.

### Motion

- **Entrance Animations**: Staggered reveals using `framer-motion`.
- **Interactions**: Hover states on cards, buttons, and links.
- **Scroll Effects**: Parallax or scroll-triggered reveals.

## 🛠️ Development Workflow

1. **Component Creation**:
    - Create new components in `src/components` for reusability.
    - Create section-specific components in `src/sections`.
    - Use Tailwind utility classes for styling.

2. **State Management**:
    - Use React `useState` and `useEffect` for local state.
    - Lift state up to `App.tsx` or use Context for global needs (e.g., current section).

3. **Optimization**:
    - Images should be optimized/compressed in `public/`.
    - Code splitting is handled automatically by Vite/Rollup.

## 🚀 Deployment

The project is configured for Vercel deployment.

- `vercel.json` handles rewrites (SPA routing) and security headers.
- Build command: `npm run build`.
- Output directory: `dist`.

## 🧪 Testing

- Run linting: `npm run lint`.
- Ensure no TypeScript errors before committing.

For more details, refer to the `README.md` and `CONTRIBUTING.md` files.
