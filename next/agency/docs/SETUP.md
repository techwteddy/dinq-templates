# Setup Guide

Complete setup guide for the Sakia Labs website project.

## Prerequisites

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Git**: Latest version

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/sakialabs/sakia-labs-website.git
cd sakia-labs-website
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required dependencies including:
- Next.js 13.5
- React 18.2
- TypeScript 5.1
- Tailwind CSS 3.3
- Framer Motion 10.15
- Testing libraries (Jest, React Testing Library, fast-check)

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Add the following environment variables:

```env
# SendGrid (for contact form)
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_VERIFIED_SENDER=sakia.labs@hey.com
RECIPIENT_EMAIL=sakia.labs@hey.com

# Environment
NODE_ENV=development
```

#### Getting SendGrid API Key

1. Sign up at [SendGrid](https://sendgrid.com/)
2. Navigate to Settings → API Keys
3. Create a new API key with "Mail Send" permissions
4. Copy the API key to your `.env.local` file
5. Verify your sender email in SendGrid

### 4. Run Development Server

```bash
npm run dev
```

The site will be available at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
sakia-labs-website/
├── app/                    # Next.js 13 app directory
│   ├── api/               # API routes
│   │   └── contact/       # Contact form API
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page
│   ├── globals.css        # Global styles
│   └── favicon.ico        # Favicon
│
├── components/            # React components
│   ├── about.tsx          # About section
│   ├── contact.tsx        # Contact section
│   ├── differentiators.tsx # Differentiators section
│   ├── footer.tsx         # Footer
│   ├── header.tsx         # Header/Navigation
│   ├── hero.tsx           # Hero section
│   ├── packages.tsx       # Packages section
│   ├── projects.tsx       # Projects section
│   ├── reviews.tsx        # Reviews section
│   ├── services.tsx       # Services section
│   ├── testimonials.tsx   # Testimonials section
│   └── ...                # Other components
│
├── lib/                   # Utilities and data
│   ├── data.ts           # Site content and configuration
│   ├── hooks.ts          # Custom React hooks
│   ├── types.ts          # TypeScript type definitions
│   └── utils.ts          # Helper functions
│
├── context/              # React context providers
│   ├── active-section-context.tsx
│   └── theme-context.tsx
│
├── public/               # Static assets
│   ├── projects/        # Project screenshots
│   ├── avatars/         # Team and client photos
│   ├── services/        # Service images
│   ├── values/          # Value icons
│   └── logo.png         # Sakia Labs logo
│
├── __tests__/           # Test files
│   ├── api/            # API tests
│   └── *.test.tsx      # Component tests
│
├── scripts/             # Automation scripts
│   ├── clean-build.js  # Clean build artifacts
│   ├── test-all.js     # Run all tests
│   └── ...             # Other scripts
│
├── docs/                # Documentation
│   ├── API_IMPLEMENTATION.md
│   └── SETUP.md (this file)
│
├── .husky/              # Git hooks
├── .kiro/               # Kiro specs
├── next.config.js       # Next.js configuration
├── tailwind.config.js   # Tailwind configuration
├── tsconfig.json        # TypeScript configuration
├── jest.config.js       # Jest configuration
└── package.json         # Dependencies and scripts
```

## Available Scripts

### Development
```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
```

### Testing
```bash
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
npm run test:all     # Run all checks (tests + lint + type-check)
```

### Code Quality
```bash
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm run type-check   # Run TypeScript type checking
```

### Maintenance
```bash
npm run clean        # Clean build artifacts (.next, .swc, coverage)
npm run clean:install # Clean and reinstall dependencies
```

## Configuration Files

### Next.js (`next.config.js`)
- Configures Next.js build and runtime settings
- Sets up image optimization
- Configures redirects and rewrites

### Tailwind CSS (`tailwind.config.js`)
- Defines custom colors, fonts, and spacing
- Configures dark mode
- Sets up custom utilities

### TypeScript (`tsconfig.json`)
- Configures TypeScript compiler options
- Sets up path aliases (@/components, @/lib, etc.)
- Enables strict type checking

### Jest (`jest.config.js`)
- Configures test environment
- Sets up module name mapping
- Defines coverage thresholds

## Development Workflow

### 1. Start Development Server
```bash
npm run dev
```

### 2. Make Changes
- Edit files in `components/`, `app/`, or `lib/`
- Changes will hot-reload automatically

### 3. Test Your Changes
```bash
# Run tests
npm test

# Check types
npm run type-check

# Check linting
npm run lint

# Or run all checks at once
npm run test:all
```

### 4. Format Code
```bash
npm run format
```

### 5. Commit Changes
```bash
git add .
git commit -m "feat: your feature description"
```

## Troubleshooting

### Port Already in Use
If port 3000 is already in use:
```bash
# Kill the process using port 3000
npx kill-port 3000

# Or run on a different port
PORT=3001 npm run dev
```

### Module Not Found Errors
```bash
# Clean and reinstall dependencies
npm run clean:install
```

### Type Errors
```bash
# Run type check to see all errors
npm run type-check
```

### Test Failures
```bash
# Run tests with verbose output
npm test -- --verbose

# Run a specific test file
npm test -- path/to/test.test.tsx
```

### Build Errors
```bash
# Clean build artifacts
npm run clean

# Rebuild
npm run build
```

## Next Steps

1. **Customize Content**: Edit `lib/data.ts` to update site content
2. **Add Features**: Create new components in `components/`
3. **Write Tests**: Add tests in `__tests__/`
4. **Deploy**: Follow deployment guide in README.md

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)

## Support

If you encounter any issues:
1. Check this documentation
2. Search existing GitHub issues
3. Create a new issue with details
4. Email sakia.labs@hey.com

---

Happy coding! 🚀
