# Contributing to Gallery App

Thank you for your interest in contributing to the Gallery App! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm, yarn, pnpm, or bun
- Git
- A Supabase account (for backend features)

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/gallery-app.git
   cd gallery-app
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.local.example` to `.env.local`
   - Add your Supabase credentials:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📋 Development Guidelines

### Code Style

- **TypeScript**: Use TypeScript for all new files
- **ESLint**: Follow the existing ESLint configuration
- **Prettier**: Code formatting is handled by Prettier
- **Tailwind CSS**: Use Tailwind classes for styling
- **Components**: Create reusable components in the `src/components/` directory

### Architecture Principles

- **Server Components**: Prefer server components over client components
- **App Router**: Use Next.js App Router patterns
- **Type Safety**: Maintain strong TypeScript typing
- **Responsive Design**: Ensure all features work on mobile and desktop
- **Performance**: Optimize images and use Next.js Image component

### Commit Messages

Follow conventional commits format:
```
feat: add image upload functionality
fix: resolve gallery grid layout issue
docs: update README with Supabase setup
refactor: improve TypeScript types
test: add tests for image component
```

### Branch Naming

- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

## 🧪 Testing

- Run tests: `npm test`
- Run linter: `npm run lint`
- Check types: `npm run type-check`

## 📚 Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── page.tsx        # Home page
│   ├── layout.tsx      # Root layout
│   └── globals.css     # Global styles
├── components/         # Reusable UI components
│   ├── GradientBackground.tsx
│   └── LoadingSpinner.tsx
├── lib/                # Utility functions
│   └── supabase.ts     # Supabase client
└── types/              # TypeScript definitions
    └── index.ts
```

## 🎯 Areas for Contribution

### High Priority
- [ ] Image upload functionality
- [ ] User authentication with Supabase
- [ ] Gallery grid with real images
- [ ] Image lightbox/modal viewer
- [ ] Search and filtering

### Medium Priority
- [ ] Image metadata editing
- [ ] Drag and drop upload
- [ ] Image optimization
- [ ] User profiles
- [ ] Image sharing

### Low Priority
- [ ] Image editing tools
- [ ] Album/collection organization
- [ ] Social features
- [ ] Mobile app
- [ ] Offline support

## 🐛 Bug Reports

When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, browser, Node.js version)
- Screenshots if applicable

## 💡 Feature Requests

For new features:
- Check existing issues first
- Describe the feature clearly
- Explain the use case
- Consider the impact on existing functionality

## 🔒 Security

- Never commit sensitive data (API keys, passwords)
- Use environment variables for configuration
- Follow security best practices
- Report security issues privately

## 📝 Documentation

- Update README.md for major changes
- Add JSDoc comments for functions
- Include code examples
- Update type definitions

## 🎨 Design Guidelines

- Follow the black-focused design theme
- Use consistent spacing and typography
- Ensure accessibility compliance
- Test on different screen sizes
- Maintain design consistency

## 📞 Getting Help

- Check existing issues and discussions
- Ask questions in the GitHub Discussions
- Review the README and documentation
- Join our community channels

## 🙏 Recognition

Contributors will be recognized in:
- GitHub Contributors section
- README.md acknowledgments
- Release notes

Thank you for contributing to Gallery App! 🎉
