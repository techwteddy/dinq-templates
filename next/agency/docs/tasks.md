# Implementation Plan: Sakia Labs Website Redesign

## Overview

This implementation plan breaks down the Sakia Labs website redesign into discrete, incremental coding tasks. Each task builds on previous work, with testing integrated throughout to validate functionality early. The plan follows a component-first approach, building reusable UI components before assembling them into complete sections.

The implementation uses React with Next.js for server-side rendering, Tailwind CSS for styling, and fast-check for property-based testing. All tasks reference specific requirements for traceability.

## Tasks

- [x] 1. Project setup and configuration
  - Initialize Next.js project with TypeScript
  - Configure Tailwind CSS with custom design tokens (dark theme, spacing scale, colors)
  - Set up ESLint, Prettier, and Git hooks
  - Configure testing environment (Jest, React Testing Library, fast-check)
  - Create project structure (components, lib, styles, public directories)
  - _Requirements: 16.1, 16.2, 16.5_

- [x] 2. Design system and base components
  - [x] 2.1 Create design tokens configuration
    - Define color palette (dark backgrounds, accent colors)
    - Define typography scale (font families, sizes, weights)
    - Define spacing scale (8px base, multiples)
    - Define border radius values
    - Define shadow values
    - _Requirements: 16.1, 16.2, 16.5_
  
  - [x] 2.2 Implement Button component with variants
    - Create Button component with primary, secondary, and text variants
    - Implement size prop (small, medium, large)
    - Implement disabled and loading states
    - Add hover, active, and focus styles
    - _Requirements: 10.1, 10.2, 10.3, 10.4_
  
  - [ ]* 2.3 Write property tests for Button component
    - **Property 11: Button variant styling**
    - **Property 12: Button hover states**
    - **Property 13: Button active states**
    - **Property 14: Button disabled states**
    - **Validates: Requirements 10.1, 10.2, 10.3, 10.4**
  
  - [x] 2.4 Implement Card component with variants
    - Create base Card component with rounded corners and shadows
    - Implement variants (service, project, package, testimonial, default)
    - Add hoverable prop for interactive cards
    - Ensure consistent padding across variants
    - _Requirements: 11.1, 11.2, 11.4_
  
  - [ ]* 2.5 Write property test for Card component
    - **Property 4: Card component styling consistency**
    - **Validates: Requirements 11.1, 11.2, 11.4**

- [x] 3. Navigation and layout components
  - [x] 3.1 Implement Navigation Bar component
    - Create fixed navigation bar with logo and links
    - Implement smooth scroll to sections on link click
    - Add active section highlighting using Intersection Observer
    - Implement scroll-based background transparency
    - _Requirements: 1.2, 1.3, 1.5, 9.1, 9.5_
  
  - [x] 3.2 Implement mobile navigation
    - Add hamburger menu icon for mobile viewports
    - Create mobile menu overlay with full-screen navigation
    - Implement menu open/close animations
    - Ensure menu closes after navigation link click
    - _Requirements: 9.2, 9.3, 9.4_
  
  - [ ]* 3.3 Write property test for navigation scroll behavior
    - **Property 1: Navigation scroll behavior**
    - **Validates: Requirements 1.3, 9.4**
  
  - [x] 3.4 Implement Footer component
    - Create footer with logo, tagline, and links
    - Add social media links (GitHub, LinkedIn)
    - Add legal links (Privacy Policy, Terms of Service)
    - Add copyright notice
    - _Requirements: 1.4, 12.2, 12.3, 12.5_


- [x] 4. Hero section implementation
  - [x] 4.1 Create Hero component with content
    - Implement hero layout with headline and subheadline
    - Add primary CTA ("Request a consultation") linking to contact section
    - Add secondary CTA ("See our work") linking to portfolio section
    - Create subtle waterwheel visual element (SVG or CSS animation)
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  
  - [ ]* 4.2 Write unit tests for Hero component
    - Test that both CTAs are present with correct labels
    - Test that CTAs link to correct sections
    - Test responsive layout at different breakpoints
    - _Requirements: 2.2, 2.3_

- [x] 5. Services section implementation
  - [x] 5.1 Create ServiceCard component
    - Implement service card layout with icon, title, description
    - Add deliverables list rendering
    - Style with Card component variant
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [x] 5.2 Create Services section with data
    - Define service data (Product Strategy & UX, Web & Mobile Dev, Data & AI)
    - Render three ServiceCard components
    - Implement responsive grid (3 columns desktop, 1 column mobile)
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [ ]* 5.3 Write property test for service bucket completeness
    - **Property 2: Service bucket completeness**
    - **Validates: Requirements 3.2, 3.3**

- [x] 6. Portfolio section implementation
  - [x] 6.1 Create ProjectCard component
    - Implement project card layout with all required fields
    - Add project type badge and stack tags
    - Add demo and code link buttons
    - Implement hover effects (scale, shadow)
    - _Requirements: 4.2, 4.3, 4.4_
  
  - [x] 6.2 Create project data model and content
    - Define Project TypeScript interface
    - Create project data for all 8 flagship projects (TapIn, Nimbly, Chapters, fLOKr, Makana, RiseUp, Takia, sNDa)
    - Include all required fields (name, tagline, type, stack, outcomes, links)
    - _Requirements: 4.1, 4.2_
  
  - [x] 6.3 Create Portfolio section with grid layout
    - Render ProjectCard components in responsive grid
    - Implement 3-column desktop, 2-column tablet, 1-column mobile layout
    - _Requirements: 4.1, 4.5, 4.6_
  
  - [ ]* 6.4 Write property tests for project cards
    - **Property 3: Project card completeness**
    - **Property 15: Portfolio project demo links**
    - **Validates: Requirements 4.2, 4.3, 12.4**

- [x] 7. Checkpoint - Ensure core sections render correctly
  - Verify hero, services, and portfolio sections display properly
  - Test navigation between sections
  - Check responsive behavior at key breakpoints
  - Ask the user if questions arise

- [x] 8. Packages section implementation
  - [x] 8.1 Create PackageCard component
    - Implement package card layout with tier information
    - Add ideal client profile, scope examples, timeline, collaboration style
    - Add CTA button at bottom of card
    - Style with Card component variant
    - _Requirements: 5.2, 5.3_
  
  - [x] 8.2 Create Packages section with tier data
    - Define engagement tier data (Launch, Scale, Partner)
    - Render three PackageCard components
    - Implement responsive grid layout
    - _Requirements: 5.1, 5.2, 5.3_
  
  - [ ]* 8.3 Write property test for engagement tier completeness
    - **Property 5: Engagement tier completeness**
    - **Validates: Requirements 5.2, 5.3**

- [x] 9. Differentiators section implementation
  - [x] 9.1 Create Differentiator component
    - Implement horizontal card layout with icon and content
    - Add title, description, and optional supporting signal
    - Style with appropriate spacing and typography
    - _Requirements: 6.2, 6.3_
  
  - [x] 9.2 Create Differentiators section with content
    - Define differentiator data (Open Source, Design-Led, Mission-Driven, Full-Stack)
    - Render differentiator components
    - Implement responsive layout
    - _Requirements: 6.1, 6.2, 6.3_
  
  - [ ]* 9.3 Write property test for differentiator completeness
    - **Property 6: Differentiator completeness**
    - **Validates: Requirements 6.2**

- [x] 10. Testimonials section implementation
  - [x] 10.1 Create Testimonial component
    - Implement testimonial card with quote, client info, and optional metric
    - Style with Card component variant
    - Add quote styling (larger text, subtle background)
    - _Requirements: 7.1, 7.2_
  
  - [x] 10.2 Create Testimonials section with data
    - Define testimonial data (3+ testimonials from different client types)
    - Render testimonial components in grid or carousel
    - Implement responsive layout
    - _Requirements: 7.1, 7.2, 7.3, 7.5_
  
  - [ ]* 10.3 Write property test for testimonial completeness
    - **Property 7: Testimonial completeness**
    - **Validates: Requirements 7.1**


- [x] 11. Contact form implementation
  - [x] 11.1 Create ContactForm component with fields
    - Implement form with name, email, company (optional), and message fields
    - Add field labels and placeholders
    - Style form inputs with focus states
    - Add submit button with loading state
    - _Requirements: 8.1_
  
  - [x] 11.2 Implement client-side form validation
    - Add validation for required fields (name, email, message)
    - Implement email format validation
    - Add minimum length validation for message (10 characters)
    - Display inline error messages below invalid fields
    - Maintain user-entered data on validation errors
    - _Requirements: 8.2, 18.1, 18.2, 18.3_
  
  - [x] 11.3 Implement form submission logic
    - Create API route for form submission (/api/contact)
    - Implement server-side validation
    - Integrate with email service (SendGrid or similar)
    - Add CSRF protection and rate limiting
    - _Requirements: 8.2, 8.3_
  
  - [x] 11.4 Implement form success and error states
    - Display success message on successful submission
    - Display error message on server failure with alternative contact methods
    - Implement form reset after successful submission
    - _Requirements: 18.4, 18.5_
  
  - [ ]* 11.5 Write property tests for form validation
    - **Property 8: Required form field validation**
    - **Property 9: Email format validation**
    - **Property 10: Form data persistence on validation error**
    - **Validates: Requirements 8.2, 18.1, 18.2, 18.3**
  
  - [x] 11.6 Create Contact section with form and alternatives
    - Add section heading and description
    - Render ContactForm component
    - Add alternative contact methods (email, LinkedIn)
    - Add privacy reassurance text
    - _Requirements: 8.1, 8.3, 8.4, 8.5_

- [x] 12. Checkpoint - Test complete user journey
  - Test navigation from hero through all sections to contact form
  - Test form submission with valid and invalid data
  - Verify all CTAs work correctly
  - Check mobile navigation and responsiveness
  - Ask the user if questions arise

- [x] 13. Image optimization implementation
  - [x] 13.1 Create OptimizedImage component
    - Implement Next.js Image component wrapper
    - Add automatic WebP/AVIF format conversion
    - Implement lazy loading for below-fold images
    - Add responsive srcset and sizes attributes
    - Add placeholder backgrounds to prevent layout shift
    - _Requirements: 13.4, 13.5, 17.4, 19.2_
  
  - [ ]* 13.2 Write property test for image optimization
    - **Property 16: Image optimization**
    - **Property 28: Image loading placeholders**
    - **Validates: Requirements 13.4, 13.5, 17.4, 19.2**
  
  - [x] 13.3 Replace all img tags with OptimizedImage
    - Update project card images
    - Update hero section images (if any)
    - Update differentiator icons (if using images)
    - Ensure all images have descriptive alt text
    - _Requirements: 14.5_

- [x] 14. Accessibility implementation
  - [x] 14.1 Implement keyboard navigation support
    - Ensure all interactive elements are keyboard accessible
    - Add visible focus indicators to all focusable elements
    - Implement skip-to-content link
    - Test tab order throughout the page
    - _Requirements: 14.2, 14.6_
  
  - [x] 14.2 Add ARIA labels and semantic HTML
    - Use semantic HTML elements (header, nav, main, section, footer)
    - Add ARIA labels to interactive components without clear text labels
    - Add ARIA live regions for dynamic content (form errors, success messages)
    - Ensure proper heading hierarchy (h1 → h2 → h3)
    - _Requirements: 14.3, 14.4, 15.3_
  
  - [x] 14.3 Implement color contrast compliance
    - Audit all text colors against backgrounds
    - Ensure 4.5:1 contrast for normal text, 3:1 for large text
    - Update colors that don't meet WCAG standards
    - _Requirements: 14.1_
  
  - [ ]* 14.4 Write property tests for accessibility
    - **Property 17: Color contrast accessibility**
    - **Property 18: Keyboard focus indicators**
    - **Property 19: ARIA labels for interactive components**
    - **Property 20: Image alt text**
    - **Property 21: Keyboard navigation support**
    - **Property 22: Heading hierarchy**
    - **Validates: Requirements 14.1, 14.2, 14.4, 14.5, 14.6, 15.3**

- [x] 15. Responsive design implementation
  - [x] 15.1 Implement mobile-first responsive layouts
    - Add responsive breakpoints (mobile <768px, tablet 768-1024px, desktop >1024px)
    - Ensure all sections adapt to different screen sizes
    - Test touch target sizes on mobile (minimum 44x44px)
    - Prevent horizontal scrolling at all breakpoints
    - _Requirements: 17.1, 17.2, 17.3, 17.5, 17.6_
  
  - [ ]* 15.2 Write property tests for responsive behavior
    - **Property 25: Responsive image adaptation**
    - **Property 26: Touch target minimum size**
    - **Property 27: No horizontal scroll**
    - **Validates: Requirements 17.4, 17.5, 17.6**

- [x] 16. Animation and motion implementation
  - [x] 16.1 Add subtle animations and transitions
    - Implement smooth scroll behavior for navigation
    - Add hover transitions to buttons and cards
    - Add fade-in animations for sections on scroll (optional, subtle)
    - Implement loading animations for form submission
    - _Requirements: 16.3_
  
  - [x] 16.2 Implement reduced motion support
    - Add prefers-reduced-motion media query support
    - Disable or reduce animations when user prefers reduced motion
    - Ensure all functionality works without animations
    - _Requirements: 16.4_
  
  - [ ]* 16.3 Write property test for reduced motion
    - **Property 23: Reduced motion preference**
    - **Validates: Requirements 16.4**


- [x] 17. SEO and meta tags implementation
  - [x] 17.1 Implement SEO meta tags
    - Add unique meta title and description
    - Implement proper heading hierarchy throughout site
    - Add Open Graph meta tags for social sharing
    - Add Twitter Card meta tags
    - Add canonical URL
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_
  
  - [x] 17.2 Create sitemap and robots.txt
    - Generate sitemap.xml
    - Create robots.txt file
    - Add meta robots tags as needed
    - _Requirements: 15.1_
  
  - [ ]* 17.3 Write unit tests for SEO meta tags
    - Test that meta title and description are present
    - Test that OG tags are present with correct content
    - Test that Twitter Card tags are present
    - _Requirements: 15.1, 15.2, 15.4, 15.5_

- [x] 18. Analytics and tracking implementation
  - [x] 18.1 Integrate privacy-respecting analytics
    - Set up Plausible or Fathom Analytics
    - Add analytics script to site
    - Configure custom events for tracking
    - Ensure analytics respects privacy preferences
    - _Requirements: 20.1, 20.5_
  
  - [x] 18.2 Implement event tracking for conversions
    - Track CTA button clicks (hero, packages)
    - Track contact form submissions
    - Track portfolio project link clicks
    - Track navigation interactions
    - _Requirements: 20.2, 20.3, 20.4_
  
  - [ ]* 18.3 Write property test for analytics event tracking
    - **Property 30: Analytics event tracking**
    - **Validates: Requirements 20.2, 20.4**

- [x] 19. Performance optimization
  - [x] 19.1 Optimize bundle size and loading
    - Implement code splitting for routes
    - Lazy load non-critical components
    - Optimize font loading (subset, preload)
    - Minimize and compress CSS and JS bundles
    - _Requirements: 13.1, 13.2, 13.3_
  
  - [x] 19.2 Implement performance monitoring
    - Add Lighthouse CI to build pipeline
    - Configure Core Web Vitals monitoring
    - Set up performance budgets
    - _Requirements: 13.1, 13.2, 13.3_
  
  - [ ]* 19.3 Run performance tests and validate metrics
    - Test LCP < 2.5s
    - Test FID < 100ms
    - Test CLS < 0.1
    - _Requirements: 13.1, 13.2, 13.3_

- [x] 20. Security implementation
  - [x] 20.1 Configure security headers
    - Add Content-Security-Policy header
    - Add X-Frame-Options header
    - Add X-Content-Type-Options header
    - Add Referrer-Policy header
    - Configure Permissions-Policy
    - _Requirements: 12.1_
  
  - [x] 20.2 Implement form security measures
    - Add CSRF token validation to contact form
    - Implement rate limiting (5 submissions per IP per hour)
    - Add honeypot field for spam prevention
    - Sanitize and validate all form inputs
    - _Requirements: 8.2, 18.1_
  
  - [ ]* 20.3 Write unit tests for form security
    - Test CSRF token validation
    - Test rate limiting behavior
    - Test input sanitization
    - _Requirements: 8.2_

- [x] 21. Error handling and loading states
  - [x] 21.1 Implement error boundaries
    - Create React error boundary component
    - Add error boundaries around major sections
    - Display fallback UI for crashed components
    - Log errors to monitoring service
    - _Requirements: 18.4, 18.5_
  
  - [x] 21.2 Implement loading states
    - Add loading indicator for initial page load
    - Add loading state to form submit button
    - Add loading placeholders for images
    - Prevent multiple form submissions
    - _Requirements: 19.1, 19.3, 19.4_
  
  - [ ]* 21.3 Write unit tests for error and loading states
    - Test error boundary fallback UI
    - Test form loading state
    - Test form submission prevention
    - _Requirements: 18.4, 18.5, 19.3, 19.4_

- [x] 22. Checkpoint - Final testing and validation
  - Run full test suite (unit, property, integration)
  - Test all user journeys end-to-end
  - Validate accessibility with screen reader
  - Check performance metrics
  - Test on multiple browsers and devices
  - Ask the user if questions arise

- [x] 23. Deployment configuration
  - [x] 23.1 Configure Vercel deployment
    - Set up Vercel project
    - Configure environment variables
    - Set up custom domain (if applicable)
    - Configure SSL/HTTPS
    - _Requirements: 12.1_
  
  - [x] 23.2 Set up monitoring and error tracking
    - Integrate Sentry for error monitoring
    - Configure alerts for error rate spikes
    - Set up uptime monitoring
    - _Requirements: 20.1_
  
  - [x] 23.3 Create privacy policy and terms of service pages
    - Write privacy policy content
    - Write terms of service content
    - Create static pages for legal documents
    - Link from footer
    - _Requirements: 12.5_

- [x] 24. Final integration and polish
  - [x] 24.1 Wire all components together in main page
    - Assemble all sections in correct order
    - Ensure smooth navigation between sections
    - Verify all links and CTAs work correctly
    - Test complete user journeys
    - _Requirements: 1.1, 1.2, 1.3_
  
  - [x] 24.2 Final visual polish and consistency check
    - Verify spacing consistency across all sections
    - Check typography consistency
    - Verify color palette usage
    - Ensure all hover states work correctly
    - _Requirements: 16.1, 16.2, 16.5_
  
  - [ ]* 24.3 Run comprehensive integration tests
    - Test complete navigation flow
    - Test form submission end-to-end
    - Test responsive behavior at all breakpoints
    - Test accessibility with automated tools
    - _Requirements: 1.1, 1.2, 1.3, 8.1, 8.2_

- [x] 25. Final checkpoint - Production readiness
  - Verify all tests pass
  - Check performance metrics meet targets
  - Validate accessibility compliance
  - Review security headers and configurations
  - Confirm analytics tracking works
  - Ask the user for final approval before deployment

## Notes

- Tasks marked with `*` are optional testing tasks and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation and provide opportunities for user feedback
- Property tests validate universal correctness properties across all inputs
- Unit tests validate specific examples, edge cases, and error conditions
- The implementation follows a component-first approach, building reusable components before assembling sections
- All components should be tested in isolation before integration
- Performance, accessibility, and security are integrated throughout rather than added at the end


---

## Enterprise Positioning Refinement Tasks

- [x] 1. Set up content validation infrastructure
  - [x] 1.1 Create content validation types and interfaces
    - Define TypeScript interfaces for ContentRefinementRule, ValidationResult, EnterpriseSignalChecklist
    - Define types for content sections and validation reports
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
  
  - [x] 1.2 Implement forbidden terms checker
    - Create utility to detect forbidden terms: "empower", "uplift", "inspire", "driven by innovation", "Let's Build Something Amazing"
    - Create utility to detect forbidden patterns in project content: unverifiable claims, user counts
    - Create utility to detect marketing jargon and abstract language
    - _Requirements: 2.2, 2.3, 4.5, 7.2, 8.1, 9.2, 9.4, 11.3_
  
  - [x] 1.4 Implement required language pattern checker
    - Create utility to detect flexibility signals in service content
    - Create utility to detect enterprise signals across site content
    - Create utility to detect risk-reduction language in contact section
    - _Requirements: 5.1, 5.2, 5.4, 7.3, 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 2. Update Hero Section content
  - [x] 2.1 Replace hero section headline, subheading, and CTAs
    - Update headline to "Steady hands for serious products"
    - Update subheading to "We design and build calm, reliable software end-to-end, from early ideas to production systems."
    - Update primary CTA to "Start a project"
    - Update secondary CTA to "See selected work"
    - Add optional microcopy: "No sales scripts. Clear scope. Thoughtful execution."
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 3. Refine Selected Work section and project cards
  - [x] 3.1 Update Selected Work section description
    - Replace description with: "A curated set of product builds developed end-to-end, from early concepts to production-ready systems, using modern web, mobile, and data stacks."
    - Remove any unverifiable traction claims from section
    - _Requirements: 2.1, 2.2, 2.3_
  
  - [x] 3.2 Audit and refine all project card content
    - For each project card, ensure clear problem statement exists
    - For each project card, ensure organization type is implied
    - Remove poetic/ideological framing from all project cards
    - Remove unverifiable traction numbers and user counts
    - _Requirements: 3.1, 3.2, 3.3, 2.2, 2.3_

- [x] 4. Checkpoint - Ensure validation tests pass
  - Run all validation tests on updated hero and project content
  - Ensure all tests pass, ask the user if questions arise

- [x] 5. Restructure About section
  - [x] 5.1 Rewrite About section with enterprise structure
    - Write "What Sakia Labs is" section (1-2 sentences, factual)
    - Write "What Sakia Labs builds" section (2-3 sentences, specific capabilities)
    - Write "How Sakia Labs works" section (2-3 sentences, process and approach)
    - Move name origin to supporting role (1 sentence, contextual)
    - Remove all instances of "empower", "uplift", "inspire", "driven by innovation"
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [x] 6. Refine Services section
  - [x] 6.1 Reframe all service packages as starting points
    - For each service package, add flexibility signal language
    - For each service package, add collaborative scoping language
    - Remove all hard timeline and scope promises
    - Remove all price-shopping language
    - Ensure at least one of: "Typical engagement", "Starting from", "Scoped collaboratively", "Adjusted based on complexity"
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 7. Tighten Reviews section
  - [x] 7.1 Refine all review content
    - For each review, emphasize professionalism, clarity, delivery, or calm execution
    - Remove generic praise without specifics
    - Ensure no fabricated outcomes
    - _Requirements: 6.1, 6.2, 6.3_

- [x] 8. Update Contact section
  - [x] 8.1 Replace contact section headline and copy
    - Change headline to "Tell us what you're trying to build"
    - Add support copy that reduces pressure and signals selectivity
    - Include language similar to: "We'll review your request and follow up with next steps if it's a good fit."
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 9. Update Footer and taglines
  - [x] 9.1 Refine footer content and tagline
    - Remove or de-emphasize "mission-driven organizations" as primary descriptor
    - Use one of approved taglines: "Steady hands for serious products", "Calm systems for complex ideas", or "Thoughtful software, built end-to-end"
    - Emphasize product-focused, systems-oriented, long-term reliability framing
    - _Requirements: 8.1, 8.2, 8.3_

- [x] 10. Global content refinement pass
  - [x] 10.1 Apply global copy rules to all sections
    - Ensure all sections lead with capability before values
    - Replace abstract language with specific language
    - Prefer "what we do" over "what we believe" throughout
    - Remove aspirational/manifesto language
    - Ensure no marketing jargon introduced
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 11.3_
  
  - [x] 10.3 Verify copy length constraint
    - For each refined section, measure word count before and after
    - Ensure refined copy is not longer than original (or max 10% longer)
    - _Requirements: 11.2_

- [x] 11. Final validation and integration
  - [x] 11.2 Perform manual tone and positioning review
    - Review overall tone for calm, grounded, experienced voice
    - Verify enterprise positioning effectiveness
    - Check that site feels more confident without being louder
    - Ensure copy is shorter, sharper, more defensible
    - _Requirements: 4.6, 9.5_
  
  - [x] 11.3 Final checkpoint - Ensure all tests pass
    - Ensure all automated tests pass
    - Confirm manual review complete
    - Ask the user if questions arise
