# Design Document: Sakia Labs Website Redesign

## Overview

This design document outlines the technical and visual architecture for transforming the Sakia Labs website into a high-credibility, client-winning studio site. The redesign focuses on clear communication of services, proof of capability through portfolio work, and conversion optimization while maintaining a minimal, dark, modern aesthetic.

The site will be implemented as a single-page application with anchor-based navigation, optimized for performance, accessibility, and SEO. The design emphasizes simplicity, generous white space, and purposeful interactions that reflect Sakia Labs' design sensibility.

### Design Principles

1. **Clarity over cleverness**: Every element serves a clear purpose in communicating value or driving conversion
2. **Proof through work**: Portfolio projects and outcomes take center stage
3. **Minimal and intentional**: Dark aesthetic with generous spacing, limited animations, purposeful interactions
4. **Performance-first**: Fast loading, smooth interactions, optimized for mid-range mobile devices
5. **Accessible by default**: WCAG 2.1 AA compliance, keyboard navigation, semantic HTML

## Architecture

### Technology Stack

**Frontend Framework**: React with Next.js
- Server-side rendering for SEO and performance
- Static generation for marketing pages
- Built-in image optimization
- API routes for form handling

**Styling**: Tailwind CSS with custom design tokens
- Utility-first approach for rapid development
- Custom configuration for Sakia brand colors and spacing
- Dark mode as default theme
- Responsive design utilities

**Form Handling**: React Hook Form + API route
- Client-side validation
- Server-side submission to email service (SendGrid or similar)
- CSRF protection

**Analytics**: Plausible or Fathom Analytics
- Privacy-respecting, GDPR-compliant
- No cookies, no personal data collection
- Event tracking for CTAs and conversions

**Hosting**: Vercel
- Automatic deployments from Git
- Edge network for global performance
- Built-in SSL/HTTPS

### Site Structure

```
/
├── Hero Section (#home)
├── Services Section (#services)
├── Portfolio Section (#work)
├── Packages Section (#packages)
├── Differentiators Section (#studio)
├── Testimonials Section (#testimonials)
├── Contact Section (#contact)
└── Footer
```

**Navigation Flow**:
- Fixed navigation bar with anchor links
- Smooth scroll behavior between sections
- Active section highlighting in nav
- Mobile hamburger menu for small screens

### Information Architecture

**Primary Navigation**:
- Home (scrolls to top/hero)
- Services (scrolls to #services)
- Work (scrolls to #work)
- Studio (scrolls to #studio)
- Contact (scrolls to #contact)

**Secondary Navigation (Footer)**:
- GitHub Organization
- Privacy Policy
- Terms of Service
- LinkedIn
- Twitter/X (if applicable)

**Conversion Paths**:
1. Hero CTA → Contact Form (primary path)
2. Hero Secondary CTA → Portfolio → Contact Form
3. Services → Packages → Contact Form
4. Portfolio Project → External Demo → Return → Contact Form

## Components and Interfaces

### Navigation Bar Component

**Desktop Layout**:
```
[Sakia Labs Logo] ............ [Home] [Services] [Work] [Studio] [Contact]
```

**Mobile Layout**:
```
[Sakia Labs Logo] ............................ [☰]
```

**Props Interface**:
```typescript
interface NavigationProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}
```

**Behavior**:
- Fixed position at top of viewport
- Background: dark with slight transparency and backdrop blur when scrolled
- Active section indicated by accent color underline or dot
- Smooth scroll to target section on click
- Mobile: hamburger menu expands to full-screen overlay with large touch targets

**Scroll Behavior**:
- Intersection Observer API to detect active section
- Update active state when section enters viewport (threshold: 50%)
- Smooth scroll with `scroll-behavior: smooth` or JS-based easing

### Hero Section Component

**Layout**:
```
┌─────────────────────────────────────────────┐
│                                             │
│         [Waterwheel subtle visual]          │
│                                             │
│     Building thoughtful digital products    │
│        for mission-driven organizations     │
│                                             │
│   We blend strategy, design, and full-stack │
│   development to create products that matter│
│                                             │
│   [Request a consultation] [See our work]   │
│                                             │
└─────────────────────────────────────────────┘
```

**Props Interface**:
```typescript
interface HeroProps {
  headline: string;
  subheadline: string;
  primaryCTA: CTAButton;
  secondaryCTA: CTAButton;
}

interface CTAButton {
  label: string;
  href: string;
  variant: 'primary' | 'secondary';
}
```

**Waterwheel Visual Concept**:
- Subtle animated SVG or CSS-based circular flow pattern
- Positioned as background element, low opacity
- Represents continuous flow and iteration
- Animation: slow rotation (60s duration) or gentle pulsing
- Should not distract from text content

**Typography**:
- Headline: Large (48-64px desktop, 32-40px mobile), bold weight
- Subheadline: Medium (20-24px desktop, 16-18px mobile), regular weight
- Generous line height (1.5-1.6) for readability

### Services Section Component

**Layout**:
```
┌─────────────────────────────────────────────┐
│              What We Do                     │
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Strategy │  │  Dev     │  │ Data/AI  │   │
│  │ & UX     │  │          │  │          │   │
│  │          │  │          │  │          │   │
│  │ • Item   │  │ • Item   │  │ • Item   │   │
│  │ • Item   │  │ • Item   │  │ • Item   │   │
│  │ • Item   │  │ • Item   │  │ • Item   │   │
│  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────┘
```

**Props Interface**:
```typescript
interface ServicesProps {
  services: ServiceBucket[];
}

interface ServiceBucket {
  title: string;
  description: string;
  deliverables: string[];
  icon?: string; // emoji or icon identifier
}
```

**Service Bucket Content**:

1. **Product Strategy & UX**
   - Description: "We help you define the right product, design intuitive experiences, and validate ideas with real users."
   - Deliverables:
     - User research and persona development
     - Information architecture and user flows
     - Wireframes and interactive prototypes
     - Visual design and brand identity
     - Usability testing and iteration

2. **Web & Mobile Development**
   - Description: "We build fast, reliable, and beautiful applications using modern frameworks and best practices."
   - Deliverables:
     - Responsive web applications (React, Next.js, Vue)
     - Mobile apps (React Native, Progressive Web Apps)
     - API design and backend development
     - Database architecture and optimization
     - Deployment and DevOps setup

3. **Data & AI Integration**
   - Description: "We integrate intelligent features that make your product smarter and more valuable to users."
   - Deliverables:
     - Data pipeline design and implementation
     - Machine learning model integration
     - Natural language processing features
     - Recommendation systems
     - Analytics and insights dashboards

**Visual Design**:
- Cards with rounded corners (12-16px border radius)
- Soft shadow for depth
- Equal width columns on desktop (33% each)
- Stack vertically on mobile
- Icon/emoji at top of each card (optional, subtle)

### Portfolio Section Component

**Layout (Desktop)**:
```
┌─────────────────────────────────────────────┐
│                Our Work                     │
│                                             │
│  ┌────────┐  ┌────────┐  ┌────────┐         │
│  │ TapIn  │  │ Nimbly │  │Chapters│         │
│  │        │  │        │  │        │         │
│  └────────┘  └────────┘  └────────┘         │
│                                             │
│  ┌────────┐  ┌────────┐  ┌────────┐         │
│  │ fLOKr  │  │ Makana │  │RiseUp  │         │
│  │        │  │        │  │        │         │
│  └────────┘  └────────┘  └────────┘         │
└─────────────────────────────────────────────┘
```

**Props Interface**:
```typescript
interface PortfolioProps {
  projects: Project[];
}

interface Project {
  name: string;
  tagline: string;
  type: 'Fintech' | 'Community' | 'Education' | 'Access Control' | 'Food Security';
  stack: string[];
  outcomes: string[];
  demoUrl: string;
  codeUrl: string;
  icon?: string;
}
```

**Project Data**:

1. **TapIn**
   - Tagline: "Community access control and digital keys"
   - Type: Access Control
   - Stack: React Native, Node.js, PostgreSQL
   - Outcomes: ["Secure keyless entry system", "Real-time access management"]
   - Demo: https://tapin-demo.netlify.app
   - Code: https://github.com/sakialabs/tapin

2. **Nimbly**
   - Tagline: "Agile project management for small teams"
   - Type: Community
   - Stack: React, Next.js, Supabase
   - Outcomes: ["Simplified sprint planning", "Team collaboration tools"]
   - Demo: https://nimbly-demo.netlify.app
   - Code: https://github.com/sakialabs/nimbly

3. **Chapters**
   - Tagline: "Interactive learning platform for educators"
   - Type: Education
   - Stack: React, Firebase, TailwindCSS
   - Outcomes: ["Engaging course creation", "Student progress tracking"]
   - Demo: https://chapters-demo.netlify.app
   - Code: https://github.com/sakialabs/chapters

4. **fLOKr**
   - Tagline: "Community coordination and event management"
   - Type: Community
   - Stack: Vue.js, Node.js, MongoDB
   - Outcomes: ["Streamlined event planning", "Member engagement tools"]
   - Demo: https://flokr.netlify.app
   - Code: https://github.com/sakialabs/flokr

5. **Makana**
   - Tagline: "Gift registry and wishlist platform"
   - Type: Community
   - Stack: React, Express, PostgreSQL
   - Outcomes: ["Social gifting experience", "Group contribution features"]
   - Demo: https://makana-demo.netlify.app
   - Code: https://github.com/sakialabs/makana

6. **RiseUp**
   - Tagline: "Financial wellness and savings tools"
   - Type: Fintech
   - Stack: React Native, Node.js, Plaid API
   - Outcomes: ["Automated savings goals", "Financial health insights"]
   - Demo: https://riseup-demo.netlify.app
   - Code: https://github.com/sakialabs/riseup

7. **Takia**
   - Tagline: "Food security and meal planning"
   - Type: Food Security
   - Stack: React, Next.js, Airtable
   - Outcomes: ["Nutrition tracking", "Budget-friendly meal plans"]
   - Demo: https://takia-demo.netlify.app
   - Code: https://github.com/sakialabs/takia

8. **sNDa**
   - Tagline: "Multilingual content management system"
   - Type: Community
   - Stack: React, i18n, Contentful
   - Outcomes: ["Seamless translation workflow", "Multi-language support"]
   - Demo: https://snda.netlify.app/en
   - Code: https://github.com/sakialabs/snda

**Card Design**:
- Rounded corners (12px)
- Soft shadow on hover (elevation increase)
- Project icon/emoji at top (subtle, 32-40px)
- Project name (bold, 20-24px)
- Tagline (regular, 14-16px, muted color)
- Type badge (small pill, accent color)
- Stack tags (small pills, neutral color)
- Outcomes as bullet points (14px, 2 max)
- Links at bottom: [View Demo] [View Code]
- Hover state: slight scale (1.02) and shadow increase

**Responsive Behavior**:
- Desktop (>1024px): 3 columns
- Tablet (768-1024px): 2 columns
- Mobile (<768px): 1 column

### Packages Section Component

**Layout**:
```
┌─────────────────────────────────────────────┐
│           How We Work Together              │
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Launch   │  │  Scale   │  │ Partner  │   │
│  │          │  │          │  │          │   │
│  │ For...   │  │ For...   │  │ For...   │   │
│  │ Scope... │  │ Scope... │  │ Scope... │   │
│  │ Timeline │  │ Timeline │  │ Timeline │   │
│  │          │  │          │  │          │   │
│  │ [CTA]    │  │ [CTA]    │  │ [CTA]    │   │
│  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────┘
```

**Props Interface**:
```typescript
interface PackagesProps {
  tiers: EngagementTier[];
}

interface EngagementTier {
  name: string;
  idealFor: string;
  scopeExamples: string[];
  timeline: string;
  collaborationStyle: string;
  cta: CTAButton;
}
```

**Tier Content**:

1. **Launch**
   - Ideal For: "Startups and founders validating a new product idea"
   - Scope Examples:
     - MVP development (4-8 weeks)
     - Landing page and brand identity
     - User research and prototype
   - Timeline: "4-12 weeks"
   - Collaboration: "Weekly check-ins, async communication, rapid iteration"
   - CTA: "Start a project"

2. **Scale**
   - Ideal For: "Growing companies expanding their product capabilities"
   - Scope Examples:
     - Feature development and optimization
     - Mobile app development
     - Data integration and analytics
   - Timeline: "3-6 months"
   - Collaboration: "Embedded team member, daily standups, sprint-based delivery"
   - CTA: "Discuss your needs"

3. **Partner**
   - Ideal For: "Organizations seeking ongoing product development support"
   - Scope Examples:
     - Continuous product development
     - Technical leadership and architecture
     - Full-stack team augmentation
   - Timeline: "6+ months"
   - Collaboration: "Dedicated team, strategic planning, long-term roadmap"
   - CTA: "Explore partnership"

**Visual Design**:
- Equal width cards
- Slightly taller than service cards
- Accent border on hover
- CTA button at bottom of each card
- Consistent padding and spacing

### Differentiators Section Component

**Layout**:
```
┌─────────────────────────────────────────────┐
│              Why Sakia Labs                 │
│                                             │
│  ┌────────────────────────────────────────┐ │
│  │ 🔓 Open Source & Transparent          │ │
│  │ We build in public and contribute...   │ │
│  │ [GitHub: 50+ repos, 1000+ commits]     │ │
│  └────────────────────────────────────────┘ │
│                                             │
│  ┌────────────────────────────────────────┐ │
│  │ 🎨 Design-Led Development             │ │
│  │ Every project starts with UX...        │ │
│  └────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

**Props Interface**:
```typescript
interface DifferentiatorsProps {
  differentiators: Differentiator[];
}

interface Differentiator {
  title: string;
  description: string;
  supportingSignal?: string;
  icon?: string;
}
```

**Differentiator Content**:

1. **Open Source & Transparent**
   - Description: "We build in public and contribute to the open source community. All our portfolio projects are open source, and we believe in transparent, collaborative development."
   - Supporting Signal: "50+ public repositories, 1000+ commits, active community contributions"
   - Icon: 🔓

2. **Design-Led Development**
   - Description: "Every project starts with UX research and design thinking. We don't just write code—we solve problems through thoughtful design and user-centered development."
   - Supporting Signal: "UX research, prototyping, and visual design included in every engagement"
   - Icon: 🎨

3. **Mission-Driven Focus**
   - Description: "We specialize in products that create real community impact—from food security to financial wellness to education. We understand mission-driven organizations because we are one."
   - Supporting Signal: "8+ mission-driven products launched, serving thousands of users"
   - Icon: 🌱

4. **Full-Stack Capability**
   - Description: "From initial concept to production deployment, we handle the entire product lifecycle. Strategy, design, frontend, backend, data, AI, and DevOps—all under one roof."
   - Supporting Signal: "React, React Native, Node.js, Python, PostgreSQL, MongoDB, AWS, Vercel"
   - Icon: ⚡

**Visual Design**:
- Horizontal cards (full width or 2-column on desktop)
- Icon on left, content on right
- Supporting signal in smaller, muted text
- Generous padding
- Subtle background color difference from main background

### Testimonials Section Component

**Layout**:
```
┌─────────────────────────────────────────────┐
│           What Clients Say                  │
│                                             │
│  ┌────────────────────────────────────────┐ │
│  │ "Quote about results and experience"   │ │
│  │                                        │ │
│  │ — Name, Role at Company                │ │
│  │   [Metric: 50% increase in engagement] │ │
│  └────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

**Props Interface**:
```typescript
interface TestimonialsProps {
  testimonials: Testimonial[];
}

interface Testimonial {
  quote: string;
  clientName: string;
  clientRole: string;
  clientCompany: string;
  metric?: string;
}
```

**Sample Testimonials**:

1. **Small Business Client**
   - Quote: "Sakia Labs transformed our vague idea into a working product in just 8 weeks. Their design-first approach meant we launched with something users actually wanted to use."
   - Name: "Sarah Chen"
   - Role: "Founder"
   - Company: "LocalHarvest Co-op"
   - Metric: "300+ active users in first month"

2. **Mission-Driven Organization**
   - Quote: "Working with Sakia Labs felt like having an in-house product team. They understood our mission and built technology that amplified our community impact."
   - Name: "Marcus Johnson"
   - Role: "Executive Director"
   - Company: "Community Food Alliance"
   - Metric: "2x increase in meal distribution efficiency"

3. **Startup Founder**
   - Quote: "The team's full-stack expertise meant we didn't need to coordinate multiple vendors. From UX research to deployment, they handled everything with professionalism and care."
   - Name: "Priya Patel"
   - Role: "CEO"
   - Company: "FinWell"
   - Metric: "Raised seed round 2 months after launch"

**Visual Design**:
- Large quote marks or subtle quote styling
- Quote text: 18-20px, italic or regular
- Client info: smaller, bold name, regular role/company
- Metric: accent color, slightly larger, positioned prominently
- Cards with subtle background
- Carousel or grid layout (3 visible on desktop, 1 on mobile)

### Contact Section Component

**Layout**:
```
┌─────────────────────────────────────────────┐
│          Let's Build Something              │
│                                             │
│  ┌────────────────────────────────────────┐ │
│  │ Name:     [________________]           │ │
│  │ Email:    [________________]           │ │
│  │ Company:  [________________] (optional)│ │
│  │ Message:  [________________]           │ │
│  │           [________________]           │ │
│  │           [________________]           │ │
│  │                                        │ │
│  │           [Send Message]               │ │
│  └────────────────────────────────────────┘ │
│                                             │
│  Or reach out directly:                     │
│  📧 sakia.labs@hey.com                      │
│  💼 LinkedIn: /company/sakia-labs           │
│                                             │
│  We typically respond within 24 hours.      │
│  Your information is never shared.          │
└─────────────────────────────────────────────┘
```

**Props Interface**:
```typescript
interface ContactFormProps {
  onSubmit: (data: ContactFormData) => Promise<void>;
}

interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  message: string;
}

interface ContactFormState {
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
}
```

**Form Validation Rules**:
- Name: Required, min 2 characters, max 100 characters
- Email: Required, valid email format
- Company: Optional, max 100 characters
- Message: Required, min 10 characters, max 1000 characters

**Form States**:
1. **Default**: All fields empty, submit button enabled
2. **Validation Error**: Field-specific error messages below inputs
3. **Submitting**: Submit button shows loading spinner, form disabled
4. **Success**: Form replaced with success message and confirmation
5. **Server Error**: Error message displayed, form remains editable

**Success Message**:
```
✓ Thanks for reaching out!

We've received your message and will respond within 24 hours.
In the meantime, check out our GitHub to see what we're building.

[Back to Home]
```

**Error Messages**:
- Name required: "Please enter your name"
- Email required: "Please enter your email address"
- Email invalid: "Please enter a valid email address"
- Message required: "Please tell us about your project"
- Message too short: "Please provide more details (at least 10 characters)"
- Server error: "Something went wrong. Please try emailing us directly at sakia.labs@hey.com"

**Visual Design**:
- Clean, spacious form layout
- Input fields with subtle borders, focus state with accent color
- Labels above inputs
- Error messages in red below inputs
- Submit button: primary style, full width on mobile
- Alternative contact methods below form
- Privacy reassurance in small, muted text

### Button Component

**Variants**:

1. **Primary Button**
   - Background: Accent color (e.g., blue, green)
   - Text: White or high contrast
   - Padding: 12px 24px (medium), 16px 32px (large)
   - Border radius: 8px
   - Hover: Slightly darker background, subtle scale (1.02)
   - Active: Even darker, scale (0.98)
   - Disabled: Reduced opacity (0.5), no hover effects

2. **Secondary Button**
   - Background: Transparent
   - Border: 2px solid accent color
   - Text: Accent color
   - Padding: 12px 24px (medium), 16px 32px (large)
   - Border radius: 8px
   - Hover: Background fills with accent color, text becomes white
   - Active: Slightly darker fill
   - Disabled: Reduced opacity (0.5), no hover effects

3. **Text Button**
   - Background: Transparent
   - Text: Accent color
   - Padding: 8px 16px
   - Hover: Underline or slight background tint
   - Active: Darker text color

**Props Interface**:
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'text';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  href?: string;
  children: React.ReactNode;
}
```

**Loading State**:
- Spinner icon replaces or appears next to text
- Button remains disabled during loading
- Maintains button dimensions (no layout shift)

### Card Component

**Base Card Styles**:
- Background: Slightly lighter than page background (dark theme)
- Border radius: 12px
- Padding: 24px (mobile), 32px (desktop)
- Shadow: Subtle (0 4px 6px rgba(0,0,0,0.1))
- Hover shadow: Elevated (0 8px 16px rgba(0,0,0,0.15))
- Transition: All properties 200ms ease

**Card Variants**:

1. **Service Card**
   - Icon/emoji at top
   - Title (h3)
   - Description paragraph
   - Bulleted list of deliverables
   - Equal height in grid

2. **Project Card**
   - Icon/emoji at top
   - Project name (h3)
   - Tagline
   - Type badge
   - Stack tags
   - Outcomes list
   - Action links at bottom
   - Hover: Scale and shadow increase

3. **Package Card**
   - Title (h3)
   - "Ideal for" description
   - Scope examples list
   - Timeline
   - Collaboration style
   - CTA button at bottom
   - Hover: Border accent color

4. **Testimonial Card**
   - Quote text (larger)
   - Client name and role
   - Optional metric
   - Subtle background differentiation

**Props Interface**:
```typescript
interface CardProps {
  variant?: 'service' | 'project' | 'package' | 'testimonial' | 'default';
  hoverable?: boolean;
  children: React.ReactNode;
  className?: string;
}
```

### Footer Component

**Layout**:
```
┌─────────────────────────────────────────────┐
│  Sakia Labs                                 │
│  Building thoughtful digital products       │
│                                             │
│  [GitHub] [LinkedIn] [Twitter]              │
│                                             │
│  Privacy Policy | Terms of Service          │
│                                             │
│  © 2024 Sakia Labs. All rights reserved.    │
└─────────────────────────────────────────────┘
```

**Props Interface**:
```typescript
interface FooterProps {
  socialLinks: SocialLink[];
  legalLinks: LegalLink[];
}

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

interface LegalLink {
  label: string;
  url: string;
}
```

**Content**:
- Logo and tagline
- Social links: GitHub, LinkedIn, Twitter (if applicable)
- Legal links: Privacy Policy, Terms of Service
- Copyright notice
- Optional: Newsletter signup (future enhancement)

**Visual Design**:
- Dark background (darker than main content)
- Muted text color
- Generous padding (64px top/bottom)
- Centered content
- Social icons: subtle hover effect
- Links: underline on hover

## Data Models

### Project Model

```typescript
interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  type: ProjectType;
  stack: Technology[];
  outcomes: string[];
  demoUrl: string;
  codeUrl: string;
  icon?: string;
  featured: boolean;
  order: number;
}

enum ProjectType {
  Fintech = 'Fintech',
  Community = 'Community',
  Education = 'Education',
  AccessControl = 'Access Control',
  FoodSecurity = 'Food Security'
}

interface Technology {
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'infrastructure' | 'other';
}
```

### Service Model

```typescript
interface Service {
  id: string;
  title: string;
  description: string;
  deliverables: string[];
  icon?: string;
  order: number;
}
```

### Engagement Tier Model

```typescript
interface EngagementTier {
  id: string;
  name: string;
  idealFor: string;
  scopeExamples: string[];
  timeline: string;
  collaborationStyle: string;
  cta: {
    label: string;
    href: string;
  };
  order: number;
}
```

### Testimonial Model

```typescript
interface Testimonial {
  id: string;
  quote: string;
  clientName: string;
  clientRole: string;
  clientCompany: string;
  metric?: string;
  order: number;
  featured: boolean;
}
```

### Contact Form Submission Model

```typescript
interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  company?: string;
  message: string;
  submittedAt: Date;
  ipAddress?: string;
  userAgent?: string;
  status: 'pending' | 'responded' | 'spam';
}
```

### Analytics Event Model

```typescript
interface AnalyticsEvent {
  eventName: string;
  eventCategory: 'navigation' | 'cta' | 'form' | 'external_link';
  eventLabel?: string;
  eventValue?: number;
  timestamp: Date;
  sessionId: string;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property Reflection

After analyzing all acceptance criteria, I've identified several areas where properties can be consolidated:

**Redundancy Analysis**:
1. Properties about "all cards have rounded corners" (11.1) and "all cards have shadows" (11.2) can be combined into one comprehensive card styling property
2. Properties about form field validation (8.2, 18.1, 18.2) are related but test different aspects - keep separate
3. Properties about button states (10.2, 10.3, 10.4) test different states - keep separate
4. Properties about accessibility (14.1, 14.2, 14.4, 14.5, 14.6) test different aspects - keep separate
5. Properties about responsive images (13.4, 13.5, 17.4) can be combined into one comprehensive image optimization property
6. Properties about navigation link behavior (1.3, 9.4) are similar but apply to different contexts - combine into one
7. Properties about content field presence (3.2, 3.3, 4.2, 5.2, 6.2, 7.1) test similar patterns - keep separate as they apply to different components

**Consolidated Properties**:
- Card styling: Combine rounded corners and shadows into single property
- Image optimization: Combine lazy loading, modern formats, and responsive attributes
- Navigation scroll behavior: Combine desktop and mobile scroll behavior
- Analytics tracking: Combine CTA clicks and portfolio link clicks into event tracking property

### Correctness Properties

Property 1: Navigation scroll behavior
*For any* navigation link (desktop or mobile), clicking it should smoothly scroll to the corresponding section and update the active section indicator
**Validates: Requirements 1.3, 9.4**

Property 2: Service bucket completeness
*For any* service bucket displayed, it must include both a description field and a deliverables list containing 3 to 5 items
**Validates: Requirements 3.2, 3.3**

Property 3: Project card completeness
*For any* project card displayed, it must include project name, descriptor, type, stack, outcomes, demo link, and code link
**Validates: Requirements 4.2, 4.3**

Property 4: Card component styling consistency
*For any* card component (service, project, package, testimonial), it must have rounded corners (border-radius ≥ 12px) and box-shadow applied
**Validates: Requirements 11.1, 11.2, 11.4**

Property 5: Engagement tier completeness
*For any* engagement tier displayed, it must include ideal client profile, scope examples, timeline, collaboration style, and a CTA button
**Validates: Requirements 5.2, 5.3**

Property 6: Differentiator completeness
*For any* differentiator displayed, it must include a title and explanation text (1-2 sentences)
**Validates: Requirements 6.2**

Property 7: Testimonial completeness
*For any* testimonial displayed, it must include client name, role, company, and quote text
**Validates: Requirements 7.1**

Property 8: Required form field validation
*For any* contact form submission with empty required fields (name, email, or message), validation must fail and display field-specific error messages
**Validates: Requirements 8.2, 18.1**

Property 9: Email format validation
*For any* contact form submission with invalid email format, validation must fail and display an error message indicating correct format
**Validates: Requirements 18.2**

Property 10: Form data persistence on validation error
*For any* form validation error, the form must retain all user-entered data
**Validates: Requirements 18.3**

Property 11: Button variant styling
*For any* button component, its visual style must differ based on variant (primary vs secondary) with distinct background, border, and text colors
**Validates: Requirements 10.1**

Property 12: Button hover states
*For any* button component, hovering must trigger a visual change (background color, scale, or shadow)
**Validates: Requirements 10.2**

Property 13: Button active states
*For any* button component, clicking must trigger an active/pressed state with visual feedback
**Validates: Requirements 10.3**

Property 14: Button disabled states
*For any* disabled button, opacity must be reduced (≤ 0.5) and hover effects must be disabled
**Validates: Requirements 10.4**

Property 15: Portfolio project demo links
*For any* portfolio project, a demo link must be present and accessible
**Validates: Requirements 12.4**

Property 16: Image optimization
*For any* image on the site, it must use modern formats (WebP or AVIF with fallbacks), implement lazy loading if below the fold, and include responsive attributes (srcset/sizes)
**Validates: Requirements 13.4, 13.5, 17.4**

Property 17: Color contrast accessibility
*For any* text element, the color contrast ratio must meet WCAG standards (≥ 4.5:1 for normal text, ≥ 3:1 for large text)
**Validates: Requirements 14.1**

Property 18: Keyboard focus indicators
*For any* interactive element, keyboard focus must display a visible focus indicator
**Validates: Requirements 14.2**

Property 19: ARIA labels for interactive components
*For any* interactive component that lacks clear text labels, appropriate ARIA labels must be present
**Validates: Requirements 14.4**

Property 20: Image alt text
*For any* image element, descriptive alt text must be present
**Validates: Requirements 14.5**

Property 21: Keyboard navigation support
*For any* interactive feature, keyboard-only navigation must be fully functional
**Validates: Requirements 14.6**

Property 22: Heading hierarchy
*For any* page section, heading elements must follow proper hierarchical order (h1 → h2 → h3, no skipping levels)
**Validates: Requirements 15.3**

Property 23: Reduced motion preference
*For any* animation or transition, the prefers-reduced-motion media query must be respected
**Validates: Requirements 16.4**

Property 24: Spacing scale consistency
*For any* spacing value (padding, margin, gap), it must conform to the defined spacing scale (multiples of 8px)
**Validates: Requirements 16.5**

Property 25: Responsive image adaptation
*For any* image, it must adapt to different screen sizes and pixel densities using appropriate srcset and sizes attributes
**Validates: Requirements 17.4**

Property 26: Touch target minimum size
*For any* interactive element on mobile viewports (<768px), the touch target must be at least 44x44 pixels
**Validates: Requirements 17.5**

Property 27: No horizontal scroll
*For any* viewport width, the page must not trigger horizontal scrolling
**Validates: Requirements 17.6**

Property 28: Image loading placeholders
*For any* image that is loading, a placeholder background must be displayed to prevent layout shift
**Validates: Requirements 19.2**

Property 29: External link visual feedback
*For any* external link click, visual feedback must be provided to indicate the action is processing
**Validates: Requirements 19.5**

Property 30: Analytics event tracking
*For any* CTA button click or portfolio project link click, an analytics event must be tracked
**Validates: Requirements 20.2, 20.4**


## Error Handling

### Form Submission Errors

**Client-Side Validation Errors**:
- Display inline error messages below each invalid field
- Maintain red border on invalid fields
- Preserve all user-entered data
- Disable submit button until errors are resolved
- Error messages must be specific and actionable

**Server-Side Errors**:
- Network timeout (>30s): "Request timed out. Please check your connection and try again."
- 500 Server Error: "Something went wrong on our end. Please try emailing us directly at sakia.labs@hey.com"
- 400 Bad Request: "Please check your information and try again."
- Rate limiting: "Too many requests. Please wait a moment and try again."

**Error Recovery**:
- Provide alternative contact methods (email, LinkedIn) in error messages
- Log errors to monitoring service (Sentry or similar)
- Never lose user-entered form data
- Allow retry without page refresh

### Navigation Errors

**Broken Anchor Links**:
- Fallback to smooth scroll to top if section ID not found
- Log warning to console for debugging

**External Link Failures**:
- Portfolio demo links: Open in new tab, no error handling needed (external sites)
- Social links: Open in new tab, no error handling needed
- GitHub links: Open in new tab, no error handling needed

### Image Loading Errors

**Failed Image Loads**:
- Display fallback background color matching card background
- Show alt text in place of image
- Log error for monitoring
- No broken image icons visible to users

**Slow Image Loading**:
- Display placeholder with subtle loading animation
- Implement progressive image loading (blur-up technique)
- Timeout after 10s and show fallback

### Analytics Errors

**Analytics Script Failure**:
- Fail silently, do not block page functionality
- Log error to console
- Site must function fully without analytics

**Event Tracking Failures**:
- Fail silently, do not interrupt user actions
- Queue events and retry on next successful connection

### Performance Degradation

**Slow Network Conditions**:
- Prioritize above-the-fold content
- Defer non-critical resources
- Show loading states for async content
- Implement service worker for offline capability (future enhancement)

**JavaScript Errors**:
- Implement error boundaries in React components
- Display fallback UI for crashed components
- Log errors to monitoring service
- Ensure critical content (text, links) accessible without JS

## Testing Strategy

### Unit Testing

**Component Testing** (React Testing Library + Jest):
- Test each component in isolation
- Focus on user interactions and accessibility
- Test edge cases and error states
- Mock external dependencies

**Test Coverage Goals**:
- Components: 80% coverage minimum
- Utility functions: 90% coverage minimum
- Form validation logic: 100% coverage

**Example Unit Tests**:
1. Navigation component renders all required links
2. Hero section displays primary and secondary CTAs
3. Contact form validates email format correctly
4. Button component applies correct variant styles
5. Project card displays all required fields
6. Form submission shows success message on success
7. Form submission shows error message on failure
8. Mobile menu opens and closes correctly

### Property-Based Testing

**Testing Library**: fast-check (JavaScript property-based testing library)

**Configuration**:
- Minimum 100 iterations per property test
- Seed-based reproducibility for failed tests
- Shrinking enabled to find minimal failing cases

**Property Test Examples**:

1. **Property 2: Service bucket completeness**
```javascript
// Feature: sakia-labs-website-redesign, Property 2
fc.assert(
  fc.property(
    fc.record({
      title: fc.string(),
      description: fc.string(),
      deliverables: fc.array(fc.string(), { minLength: 3, maxLength: 5 })
    }),
    (serviceBucket) => {
      const rendered = render(<ServiceCard {...serviceBucket} />);
      expect(rendered.getByText(serviceBucket.description)).toBeInTheDocument();
      expect(rendered.getAllByRole('listitem')).toHaveLength(serviceBucket.deliverables.length);
      expect(serviceBucket.deliverables.length).toBeGreaterThanOrEqual(3);
      expect(serviceBucket.deliverables.length).toBeLessThanOrEqual(5);
    }
  ),
  { numRuns: 100 }
);
```

2. **Property 8: Required form field validation**
```javascript
// Feature: sakia-labs-website-redesign, Property 8
fc.assert(
  fc.property(
    fc.record({
      name: fc.constant(''),
      email: fc.oneof(fc.constant(''), fc.emailAddress()),
      message: fc.oneof(fc.constant(''), fc.string())
    }).filter(data => !data.name || !data.email || !data.message),
    (formData) => {
      const { getByLabelText, getByText, getByRole } = render(<ContactForm />);
      
      fireEvent.change(getByLabelText(/name/i), { target: { value: formData.name } });
      fireEvent.change(getByLabelText(/email/i), { target: { value: formData.email } });
      fireEvent.change(getByLabelText(/message/i), { target: { value: formData.message } });
      fireEvent.click(getByRole('button', { name: /send/i }));
      
      // Should show at least one error message
      const errors = document.querySelectorAll('[role="alert"]');
      expect(errors.length).toBeGreaterThan(0);
    }
  ),
  { numRuns: 100 }
);
```

3. **Property 17: Color contrast accessibility**
```javascript
// Feature: sakia-labs-website-redesign, Property 17
fc.assert(
  fc.property(
    fc.constantFrom('p', 'span', 'a', 'button', 'h1', 'h2', 'h3'),
    (elementType) => {
      const { container } = render(React.createElement(elementType, {}, 'Test text'));
      const element = container.firstChild;
      const styles = window.getComputedStyle(element);
      const contrast = calculateContrastRatio(styles.color, styles.backgroundColor);
      
      const fontSize = parseFloat(styles.fontSize);
      const isLargeText = fontSize >= 18 || (fontSize >= 14 && styles.fontWeight >= 700);
      const minContrast = isLargeText ? 3 : 4.5;
      
      expect(contrast).toBeGreaterThanOrEqual(minContrast);
    }
  ),
  { numRuns: 100 }
);
```


4. **Property 16: Image optimization**
```javascript
// Feature: sakia-labs-website-redesign, Property 16
fc.assert(
  fc.property(
    fc.record({
      src: fc.webUrl(),
      alt: fc.string(),
      belowFold: fc.boolean()
    }),
    (imageProps) => {
      const { container } = render(<OptimizedImage {...imageProps} />);
      const img = container.querySelector('img');
      
      // Check for modern format support
      expect(img.srcset || img.src).toMatch(/\.(webp|avif)/);
      
      // Check for lazy loading if below fold
      if (imageProps.belowFold) {
        expect(img.loading).toBe('lazy');
      }
      
      // Check for responsive attributes
      expect(img.srcset || img.sizes).toBeDefined();
    }
  ),
  { numRuns: 100 }
);
```

5. **Property 27: No horizontal scroll**
```javascript
// Feature: sakia-labs-website-redesign, Property 27
fc.assert(
  fc.property(
    fc.integer({ min: 320, max: 2560 }),
    (viewportWidth) => {
      // Set viewport width
      global.innerWidth = viewportWidth;
      window.dispatchEvent(new Event('resize'));
      
      const { container } = render(<App />);
      const body = document.body;
      const html = document.documentElement;
      
      const scrollWidth = Math.max(
        body.scrollWidth,
        html.scrollWidth
      );
      const clientWidth = Math.max(
        body.clientWidth,
        html.clientWidth
      );
      
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    }
  ),
  { numRuns: 100 }
);
```

### Integration Testing

**End-to-End Testing** (Playwright or Cypress):
- Test complete user journeys
- Test across different browsers (Chrome, Firefox, Safari)
- Test responsive behavior at key breakpoints
- Test form submission flow
- Test navigation and scrolling behavior

**Critical User Journeys**:
1. Visitor lands on hero → clicks "See our work" → views portfolio → clicks demo link
2. Visitor lands on hero → clicks "Request consultation" → fills form → submits successfully
3. Visitor navigates through all sections using nav bar → reaches contact form
4. Mobile visitor opens hamburger menu → navigates to section → menu closes
5. Visitor with keyboard navigates entire site using Tab key

### Visual Regression Testing

**Tool**: Percy or Chromatic

**Test Scenarios**:
- Homepage at desktop, tablet, mobile breakpoints
- All component states (default, hover, active, disabled, error)
- Dark theme consistency across all sections
- Form validation error states
- Loading states

### Accessibility Testing

**Automated Testing**:
- axe-core integration in unit tests
- Lighthouse CI in build pipeline
- Pa11y for automated accessibility audits

**Manual Testing**:
- Screen reader testing (NVDA, JAWS, VoiceOver)
- Keyboard-only navigation
- High contrast mode
- Zoom to 200% (text must remain readable)

### Performance Testing

**Tools**:
- Lighthouse CI (automated performance audits)
- WebPageTest (real-world performance testing)
- Chrome DevTools Performance panel

**Metrics to Monitor**:
- Largest Contentful Paint (LCP) < 2.5s
- First Input Delay (FID) < 100ms
- Cumulative Layout Shift (CLS) < 0.1
- Time to Interactive (TTI) < 3.5s
- Total Blocking Time (TBT) < 200ms

**Performance Budget**:
- Total page weight: < 1MB
- JavaScript bundle: < 200KB (gzipped)
- CSS bundle: < 50KB (gzipped)
- Images: WebP/AVIF with appropriate compression
- Fonts: Subset and preload critical fonts

### Testing Workflow

**Development**:
1. Write unit tests alongside component development
2. Run tests locally before committing
3. Use test coverage reports to identify gaps

**Pre-Commit**:
1. Run linter (ESLint)
2. Run formatter (Prettier)
3. Run unit tests
4. Run accessibility checks

**CI/CD Pipeline**:
1. Run all unit tests
2. Run property-based tests
3. Run integration tests
4. Run Lighthouse CI
5. Run visual regression tests
6. Deploy to preview environment
7. Run E2E tests on preview
8. Deploy to production if all tests pass

**Post-Deployment**:
1. Monitor Core Web Vitals in production
2. Monitor error rates (Sentry)
3. Monitor analytics for conversion tracking
4. A/B test CTA variations (future enhancement)

### Test Data Management

**Mock Data**:
- Create realistic mock data for projects, testimonials, services
- Store in JSON files for easy updates
- Use same mock data across unit and integration tests

**Test Fixtures**:
- Valid form submissions
- Invalid form submissions (various error cases)
- Different viewport sizes
- Different user agents (mobile, desktop, tablet)

### Continuous Improvement

**Metrics to Track**:
- Test coverage percentage
- Test execution time
- Flaky test rate
- Bug escape rate (bugs found in production)
- Performance regression rate

**Review Cadence**:
- Weekly: Review failed tests and flaky tests
- Monthly: Review test coverage and identify gaps
- Quarterly: Review testing strategy and tools

## Deployment and Infrastructure

### Hosting Configuration

**Platform**: Vercel

**Environment Variables**:
- `NEXT_PUBLIC_ANALYTICS_ID`: Analytics tracking ID
- `SENDGRID_API_KEY`: Email service API key (server-side only)
- `CONTACT_EMAIL`: Destination email for form submissions
- `NEXT_PUBLIC_SITE_URL`: Canonical site URL

**Build Configuration**:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "nodeVersion": "18.x"
}
```

### Domain Configuration

**Primary Domain**: sakia.vercel.app (or custom domain)
**SSL**: Automatic via Vercel
**DNS**: Configured for apex and www subdomain

### Performance Optimizations

**Next.js Configuration**:
- Image optimization enabled
- Automatic static optimization
- Incremental static regeneration (if needed for future blog)
- Compression enabled (gzip/brotli)

**CDN Configuration**:
- Static assets served from edge network
- Cache headers configured appropriately
- Immutable assets with long cache times

### Monitoring and Analytics

**Error Monitoring**: Sentry
- Track JavaScript errors
- Track API errors
- Track performance issues
- Alert on error rate spikes

**Analytics**: Plausible or Fathom
- Privacy-respecting, no cookies
- Track page views
- Track custom events (CTA clicks, form submissions)
- Track conversion funnels

**Performance Monitoring**: Vercel Analytics
- Real User Monitoring (RUM)
- Core Web Vitals tracking
- Geographic performance breakdown

### Security

**Headers**:
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' analytics.domain.com
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

**Form Protection**:
- CSRF token validation
- Rate limiting (max 5 submissions per IP per hour)
- Honeypot field for spam prevention
- Email validation and sanitization

**Dependencies**:
- Regular security audits (npm audit)
- Automated dependency updates (Dependabot)
- Review security advisories

## Future Enhancements

### Phase 2 Features

1. **Blog/Insights Section**
   - Technical articles and case studies
   - Markdown-based content management
   - RSS feed
   - Social sharing

2. **Interactive Portfolio Filtering**
   - Filter by project type
   - Filter by technology stack
   - Search functionality

3. **Client Portal**
   - Project status dashboard
   - Document sharing
   - Communication hub

4. **Newsletter Signup**
   - Email capture in footer
   - Integration with email service
   - Welcome email sequence

5. **Testimonial Carousel**
   - Auto-rotating testimonials
   - Swipe gestures on mobile
   - Pagination dots

### Technical Debt and Improvements

1. **Progressive Web App (PWA)**
   - Service worker for offline capability
   - Add to home screen prompt
   - Push notifications for blog updates

2. **Internationalization (i18n)**
   - Multi-language support
   - Language switcher
   - Localized content

3. **Advanced Analytics**
   - Heatmaps (Hotjar or similar)
   - Session recordings
   - Conversion funnel analysis
   - A/B testing framework

4. **Performance Optimizations**
   - Implement route prefetching
   - Optimize font loading strategy
   - Implement resource hints (preconnect, dns-prefetch)
   - Consider edge rendering for dynamic content

## Conclusion

This design provides a comprehensive blueprint for transforming the Sakia Labs website into a high-credibility, client-winning studio site. The architecture emphasizes performance, accessibility, and conversion optimization while maintaining a minimal, dark aesthetic that reflects the studio's design sensibility.

The component-based approach ensures maintainability and scalability, while the comprehensive testing strategy ensures quality and correctness. The property-based testing approach validates universal properties across all inputs, complementing traditional unit tests for comprehensive coverage.

Implementation should follow the task breakdown in the tasks.md document, with incremental delivery and continuous validation through automated testing.
