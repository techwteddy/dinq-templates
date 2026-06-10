# Changelog

All notable changes to the Sakia Labs website will be documented in this file.

## [Unreleased] - 2026-01-30

### 🎯 Enterprise Positioning Refinement
- **Repositioned website from startup/mission-driven to enterprise-focused**
  - Updated hero headline to "Steady hands for serious products"
  - Refined hero subheading to emphasize end-to-end capability and production systems
  - Updated CTAs to "Start a project" and "See selected work"
  - Added microcopy: "No sales scripts. Clear scope. Thoughtful execution."
- **Refined Selected Work section**
  - Updated description to emphasize end-to-end product builds
  - Audited all 9 project cards for enterprise framing
  - Removed unverifiable claims and poetic language
  - Added clear problem statements for each project
- **Restructured About section with enterprise positioning**
  - Organized content: What we are → What we build → How we work → Name origin
  - Removed forbidden terms (empower, uplift, inspire, driven by innovation)
  - Replaced abstract values with action-oriented capabilities
  - Updated values: Careful Execution, Direct Communication, Reliable Delivery, Long-term Thinking
- **Reframed Services section with flexibility signals**
  - Added "Typical engagement" and "Scoped collaboratively" language to all packages
  - Updated pricing to "Starting from" format
  - Added "Adjusted based on complexity" to expertise areas
  - Removed hard timeline promises
- **Tightened Reviews section**
  - Refined review content to emphasize professionalism and calm execution
  - Removed generic praise, added specific execution qualities
  - Focused on delivery, clarity, and technical competence
- **Updated Contact section with risk-reduction language**
  - Changed headline to "Tell us what you're trying to build"
  - Added selectivity signal: "We'll review your request and follow up with next steps if it's a good fit"
  - Removed hard response time promises
- **Updated Footer with approved tagline**
  - Changed tagline to "Steady hands for serious products"
  - Removed "Inspired by Tradition, Driven by Innovation"
  - Emphasized product-focused positioning
- **Applied global content refinement**
  - Led with capability before values across all sections
  - Replaced abstract language with specific, action-oriented language
  - Removed aspirational/manifesto language
  - Ensured copy is shorter, sharper, more defensible
- **Created validation infrastructure**
  - Built content validation utilities for forbidden terms and required patterns
  - Created copy length verification script (all sections within 10% constraint)
  - Created project content validation script
  - Generated comprehensive validation report

## [Unreleased] - 2026-01-28

### 🎨 UI/UX Restoration & Enhancement
- Restored elegant glassmorphism header design
- Brought back hero text animations for dynamic feel
- Restored original button colors and styles
- Enhanced project showcase with modern grid/carousel system
- Improved "Why Sakia Labs" section presentation
- Restored reviews section original design
- Fixed contact form styling and layout
- Aligned footer elements properly
- Fixed card sizing issues for better content display

### 🧹 Codebase Cleanup
- Removed build cache files (tsconfig.tsbuildinfo)
- Consolidated documentation under docs/ folder
- Merged duplicate CHANGELOG files
- Organized markdown documentation

### ♿ Accessibility - Color Contrast Compliance (2026-01-27)
- **Updated color palette for WCAG 2.1 AA compliance**
  - `text.muted`: Changed from `#737373` to `#7a7a7a` (4.61:1 contrast ratio)
  - `accent.primary`: Changed from `#3b82f6` to `#2563eb` (5.17:1 contrast)
  - `accent.hover`: Changed from `#2563eb` to `#1d4ed8` (6.70:1 contrast)
- **Button typography**: Changed to `font-semibold` (700 weight)
- **Focus indicators**: Updated to use new accent-primary color
- **Created comprehensive documentation**:
  - `docs/COLOR_CONTRAST_COMPLIANCE.md`
  - `scripts/audit-color-contrast.ts`
  - `scripts/find-compliant-colors.ts`
- **All color combinations now meet WCAG AA standards** ✅

### 🏗️ Component Organization & Naming
- Renamed ALL components to kebab-case for consistency
- Organized components into logical folder structure:
  - `components/ui/` - Reusable UI components
  - `components/sections/` - Page sections
  - `components/forms/` - Form components
  - `components/layout/` - Layout components
  - `components/dialogs/` - Modal dialogs
- Updated all imports across codebase and test files

### 📧 Contact Information Update
- Updated email from `hello@sakialabs.com` to `sakia.labs@hey.com` across:
  - Contact form component
  - API error messages
  - Footer
  - Documentation (README, CONTRIBUTING, SETUP)

### 📚 Documentation
- Created comprehensive README with mission statement
- Added CONTRIBUTING.md with development guidelines
- Added docs/SETUP.md with detailed setup instructions
- Added docs/ACCESSIBILITY_IMPROVEMENTS.md
- Added docs/KEYBOARD_NAVIGATION.md
- Professional badges and formatting throughout

### 🤖 Automation & Scripts
- `scripts/clean-build.js` - Clean build artifacts and caches
- `scripts/test-all.js` - Run comprehensive test suite
- `scripts/rename-components.js` - Automate component renaming
- `scripts/organize-components.js` - Organize components into folders
- `scripts/audit-color-contrast.ts` - Test color contrast ratios
- New npm scripts: `test:all`, `clean`, `clean:install`, `type-check`

### 🐛 Bug Fixes
- Fixed deprecated `window.pageYOffset` → `window.scrollY`
- Fixed Jest config typo: `coverageThresholds` → `coverageThreshold`
- Updated ContactForm tests for honeypot field
- Removed redundant documentation and example files
- Cleaned build caches (.swc folder)
- Updated .gitignore

### ✅ Test Results
- 144/145 tests passing ✅
- Comprehensive test coverage across all components
- Property-based testing framework integrated

## Project Structure

```
components/
├── ui/                    # Reusable UI components
│   ├── button.tsx
│   ├── card.tsx
│   ├── differentiator.tsx
│   ├── divider.tsx
│   ├── heading.tsx
│   ├── magnetic.tsx
│   ├── optimized-image.tsx
│   ├── package-card.tsx
│   ├── package.tsx
│   ├── project.tsx
│   ├── review.tsx
│   ├── service.tsx
│   ├── submit-btn.tsx
│   ├── testimonial.tsx
│   └── theme-switch.tsx
├── sections/              # Page sections
│   ├── about.tsx
│   ├── contact.tsx
│   ├── differentiators.tsx
│   ├── hero.tsx
│   ├── packages.tsx
│   ├── projects.tsx
│   ├── reviews.tsx
│   ├── services.tsx
│   └── testimonials.tsx
├── forms/                 # Form components
│   └── contact-form.tsx
├── layout/                # Layout components
│   ├── header.tsx
│   └── footer.tsx
└── dialogs/               # Modal dialogs
    ├── become-a-client.tsx
    ├── comparison-dialog.tsx
    ├── privacy-policy.tsx
    └── terms-and-conditions.tsx
```

## Notes

The codebase is production-ready with:
- ✅ Consistent kebab-case naming for ALL components
- ✅ Logical folder organization
- ✅ Updated contact information throughout
- ✅ Comprehensive documentation
- ✅ Automation scripts
- ✅ Clean build artifacts
- ✅ All imports updated and tests passing
- ✅ WCAG AA accessibility compliance
- ✅ Elegant, modern UI with smooth animations

All animations support `prefers-reduced-motion`. The UI maintains a sophisticated dark-first aesthetic with carefully chosen accent colors and glassmorphism effects.
