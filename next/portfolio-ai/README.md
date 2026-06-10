# Kanika's AI Portfolio Website

A modern, interactive portfolio website showcasing AI and Data Science expertise with stunning animations and responsive design.

## 🌟 Features

### Interactive Design
- **Cyberpunk Aesthetic**: Dark theme with neon purple/pink accents and glowing effects
- **Framer Motion Animations**: Smooth scroll animations, hover effects, and page transitions
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices
- **Theme Toggle**: Switch between dark and light themes with purple accent preservation

### Dynamic Content
- **Typing Animation**: Rotating job titles (AI Engineer → Data Analyst → Data Scientist)
- **Smooth Navigation**: One-click scrolling to different sections
- **Interactive Elements**: Hover effects on cards, buttons, and logos
- **Animated Illustrations**: Rotating workspace illustration with subtle movement

### Portfolio Sections
1. **Hero Section**: Professional photo, animated title, and navigation buttons
2. **About**: Personal summary with animated illustration and key statistics
3. **Education**: Academic journey with institutional logos and focus areas
4. **Experience**: Timeline-based professional history with company logos
5. **Projects**: Featured ML/AI projects with metrics and technology stacks
6. **Skills**: Categorized technical skills with animated progress bars
7. **Contact**: Multiple ways to connect with social media integration

## 🛠 Technology Stack

### Frontend Framework
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS v4**: Utility-first styling with custom design tokens

### Animation & Interaction
- **Framer Motion**: Advanced animations and gestures
- **Lucide React**: Modern icon library
- **Custom CSS**: Neon effects, gradients, and hover animations

### UI Components
- **shadcn/ui**: High-quality, accessible component library
- **Custom Cards**: Neon-bordered cards with backdrop blur effects
- **Responsive Grid**: Flexible layouts for all screen sizes

### Data Management
- **JSON Configuration**: Centralized data in `data/master.json`
- **Dynamic Rendering**: All content loaded from configuration file
- **Modular Components**: Reusable, maintainable code structure

## 📁 Project Structure

\`\`\`
├── app/
│   ├── layout.tsx          # Root layout with fonts and metadata
│   ├── page.tsx            # Main portfolio page with all sections
│   └── globals.css         # Global styles and design tokens
├── components/
│   └── ui/                 # shadcn/ui components (Button, Card, Badge)
├── data/
│   └── master.json         # Portfolio data configuration
├── public/
│   ├── favicon.png         # Custom cat favicon
│   ├── kanika-photo-new.png # Professional headshot
│   ├── working-with-cat-new.png # Animated illustration
│   └── logos/              # Company and institution logos
└── README.md               # This file
\`\`\`

## 🎨 Design System

### Color Palette
- **Primary**: Purple (#8B5CF6) - Main brand color
- **Accent**: Pink/Magenta (#EC4899) - Highlight color
- **Secondary**: Cyan (#06B6D4) - Supporting color
- **Background**: Dark navy with subtle gradients
- **Text**: High contrast white/gray for accessibility

### Typography
- **Headings**: Geist font family for modern, clean look
- **Body**: Manrope for excellent readability
- **Hierarchy**: Clear size progression from text-sm to text-4xl

### Animation Principles
- **Subtle Movement**: 8-degree rotation for illustrations
- **Hover Effects**: Scale, rotate, and glow transformations
- **Scroll Animations**: Staggered reveals as content enters viewport
- **Performance**: Optimized animations with proper easing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation
1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd kanika-portfolio
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Run development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

4. **Open in browser**
   Navigate to `http://localhost:3000`

### Building for Production
\`\`\`bash
npm run build
npm start
\`\`\`

## 📊 Data Configuration

All portfolio content is managed through `data/master.json`:

### Personal Information
- Contact details and social media links
- Professional photo and tagline
- Alternative job titles for typing animation

### Professional Data
- **Education**: Degrees, institutions, focus areas, logos
- **Experience**: Job history, achievements, company logos
- **Projects**: ML/AI projects with metrics and tech stacks
- **Skills**: Categorized technical abilities with proficiency levels

### Adding New Content
1. **New Experience**: Add entry to `experience` array with company logo
2. **New Project**: Include in `projects` with appropriate icon and metrics
3. **New Skill**: Add to relevant category in `skills` object
4. **New Education**: Include degree info with institutional logo

## 🎯 Key Features Explained

### Typing Animation
- Cycles through job titles with realistic typing/backspacing
- Configurable speed and pause timing
- Smooth cursor blinking effect

### Timeline Experience
- Alternating left/right card layout
- Central vertical line with gradient
- Hover effects with 3D transformations
- Clickable company logos linking to websites

### Responsive Navigation
- Fixed header with smooth scroll navigation
- Theme toggle with icon switching
- Resume download with Google Drive integration
- Mobile-optimized button layouts

### Interactive Elements
- Logo hover effects with rotation and scaling
- Card lift animations on hover
- Progress bar animations on scroll
- Social media icons with bounce effects

## 🔧 Customization

### Changing Colors
Edit CSS custom properties in `globals.css`:
\`\`\`css
:root {
  --primary: 262 83% 58%;    /* Purple */
  --accent: 330 81% 60%;     /* Pink */
  --secondary: 188 95% 68%;  /* Cyan */
}
\`\`\`

### Adding New Sections
1. Create section component in `page.tsx`
2. Add navigation button in `NavigationButtons` component
3. Include scroll target in `scrollToSection` function
4. Update data structure in `master.json` if needed

### Modifying Animations
- Adjust Framer Motion props for different effects
- Change animation durations and delays
- Customize hover states and transitions

## 📱 Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Features**: CSS Grid, Flexbox, CSS Custom Properties, ES6+

## 🚀 Deployment

### Vercel (Recommended)
1. Connect GitHub repository to Vercel
2. Configure build settings (auto-detected for Next.js)
3. Deploy with automatic CI/CD

### Other Platforms
- **Netlify**: Static site generation support
- **AWS Amplify**: Full-stack deployment
- **GitHub Pages**: Static export with `next export`

## 📈 Performance Optimizations

- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic route-based splitting
- **Animation Performance**: GPU-accelerated transforms
- **Bundle Size**: Tree-shaking and dynamic imports
- **SEO**: Proper meta tags and semantic HTML

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Kanika**
- Email: kanika281196@gmail.com
- LinkedIn: [linkedin.com/in/kanika96](https://linkedin.com/in/kanika96)
- GitHub: [github.com/dev-kanika](https://github.com/dev-kanika)
- Location: Toronto, ON, Canada

## 🙏 Acknowledgments

- **shadcn/ui**: Beautiful, accessible component library
- **Framer Motion**: Powerful animation library
- **Lucide**: Clean, consistent icon set
- **Tailwind CSS**: Utility-first CSS framework
- **Next.js**: React framework for production

---

*Built with ❤️ and lots of ☕ in Toronto*
