import client1 from "@/public/avatars/client1.jpg";
import client2 from "@/public/avatars/client2.jpg";
import member1 from "@/public/avatars/member1.jpg";
import member2 from "@/public/avatars/member2.jpg";


export const links = [
  {
    name: "Home",
    hash: "#home",
  },
  {
    name: "Packages",
    hash: "#packages",
  },
  {
    name: "About Us",
    hash: "#about-us",
  },
  {
    name: "Work",
    hash: "#work",
  },
  {
    name: "Reviews",
    hash: "#reviews",
  },
  {
    name: "Contact Us",
    hash: "#contact-us",
  },
] as const;

export const packageData = [
  {
    title: "Starter",
    description: "For teams launching a first version with clear scope and limited risk. Focused on shipping something reliable, understandable, and easy to build on.",
    price: "Starting from $2,500",
    duration: "Typically 4-6 weeks",
    features: [
      "Validated scope and production-ready foundation",
      "Clear, maintainable UI/UX aligned with your goals",
      "Basic SEO and performance best practices",
      "Mobile-friendly implementation",
      "Contact and lead capture integration",
      "1 month post-launch support to address early issues"
    ]
  },
  {
    title: "Growth",
    description: "For teams adding complexity, data, and real operational requirements. Designed to support growth without accumulating fragile systems or technical debt.",
    price: "Starting from $5,000",
    duration: "Typically 8-10 weeks",
    features: [
      "Systems hardened for scale and operational complexity",
      "Custom backend development aligned with your product requirements",
      "Database design focused on reliability and future growth",
      "Secure user authentication and access control",
      "API integrations with third-party services",
      "3 months post-launch support for stabilization and iteration"
    ]
  },
  {
    title: "Enterprise",
    description: "For organizations where reliability, security, and coordination matter more than speed alone. Built to support complex workflows, multiple stakeholders, and long-term ownership.",
    price: "Starting from $10,000",
    duration: "Typically 12+ weeks",
    features: [
      "Long-term ownership, security review, and coordination",
      "Advanced data analytics and reporting",
      "Third-party integrations across internal and external systems",
      "Performance optimization for scale and reliability",
      "Security review and compliance considerations",
      "6 months premium support and collaboration"
    ]
  }
];

export const expertiseAreas = [
  {
    title: "Product Strategy & UX",
    description: "We define product requirements, design user interfaces, and validate assumptions through prototyping and testing. Scoped collaboratively based on your product stage.",
    services: [
      "User research and persona development",
      "Information architecture and user flows",
      "Wireframes and interactive prototypes",
      "Visual design and brand identity",
      "Usability testing and iteration"
    ],
    technologies: [
      "Figma", "Adobe XD", "Sketch", "InVision", "Miro", "UserTesting", 
      "Hotjar", "Google Analytics"
    ]
  },
  {
    title: "Web & Mobile Development",
    description: "We build responsive web applications and mobile products using modern frameworks. Adjusted based on complexity and technical requirements.",
    services: [
      "Responsive web applications (React, Next.js, Vue)",
      "Mobile apps (React Native, Progressive Web Apps)",
      "API design and backend development",
      "Database architecture and optimization",
      "Deployment and DevOps setup"
    ],
    technologies: [
      "React", "Next.js", "Vue.js", "React Native", "Node.js", "Express", 
      "PostgreSQL", "MongoDB", "Firebase", "Vercel", "AWS", "Docker"
    ]
  },
  {
    title: "Data & AI Integration",
    description: "We integrate data pipelines, machine learning models, and intelligent features into production systems. Scoped collaboratively based on your data maturity.",
    services: [
      "Data pipeline design and implementation",
      "Machine learning model integration",
      "Natural language processing features",
      "Recommendation systems",
      "Analytics and insights dashboards"
    ],
    technologies: [
      "Python", "PyTorch", "TensorFlow", "Scikit-learn", "OpenAI API", 
      "Hugging Face", "Pandas", "NumPy"
    ]
  },
  {
    title: "Growth & Marketing",
    description: "We optimize site performance, implement analytics, and set up conversion tracking. Adjusted based on your growth stage and channels.",
    services: [
      "SEO optimization and content strategy",
      "Conversion rate optimization (CRO)",
      "Email marketing automation",
      "Social media integration",
      "Analytics and performance tracking"
    ],
    technologies: [
      "Google Analytics", "SEMrush", "Mailchimp", "HubSpot", "Mixpanel",
      "Hotjar", "Optimizely", "Segment"
    ]
  },
];

export const valuesData = [
  {
    title: "Careful Execution",
    description: "We test thoroughly, document clearly, and maintain code that others can understand and extend.",
    icon: "💖",
  },
  {
    title: "Direct Communication",
    description: "We provide regular updates, clear timelines, and honest assessments of what's working and what needs adjustment.",
    icon: "🤝",
  },
  {
    title: "Reliable Delivery",
    description: "We scope projects realistically, deliver incrementally, and support systems through launch and stabilization.",
    icon: "🎯",
  },
  {
    title: "Sustainable Design",
    description: "We build systems that can scale, use stable technologies, and create documentation for future maintenance.",
    icon: "🌱",
  },
] as const;

export const teamData = [
  {
    name: "Salih",
    role: "Founder & Technical Director",
    image: member1,
  },
  {
    name: "Ahmed",
    role: "Co-founder & Creative Director",
    image: member2,
  },
] as const;

export const projectsData = [
  {
    title: "Seshio",
    description: "AI-powered study workspace for complex material. Lets learners upload documents, organize them into notebooks, and ask questions grounded in their own content. Generates quizzes, summaries, and flashcards to support repeated study sessions.",
    tags: ["Next.js", "FastAPI", "PostgreSQL"],
    imageUrl: "/projects/Seshio.png",
    link: "https://seshio.netlify.app",
  },
  {
    title: "RezGenie",
    description: "AI-powered resume feedback tool for job seekers. Provides structure, clarity, and improvement suggestions while preserving authentic voice. Helps users strengthen resumes without generic corporate language.",
    tags: ["Next.js", "FastAPI", "PostgreSQL"],
    imageUrl: "/projects/RezGenie.png",
    link: "https://rezgenie.netlify.app",
  },
  {
    title: "sNAKr",
    description: "Shared household inventory platform. Tracks fridge and pantry items across households using fuzzy stock states and receipt ingestion, then builds restock lists to reduce surprise shortages and waste.",
    tags: ["Next.js", "FastAPI", "PostgreSQL"],
    imageUrl: "/projects/sNAKr.png",
    link: "https://snakr-demo.netlify.app",
  },
  {
    title: "Nimbly",
    description: "Grocery savings aggregator for budget-conscious shoppers. Surfaces personalized deals and clearance items from nearby stores in a simple interface. Helps users reduce grocery costs without complex coupon management.",
    tags: ["Next.js", "FastAPI", "PostgreSQL"],
    imageUrl: "/projects/Nimbly.png",
    link: "https://nimbly-demo.netlify.app",
  },
  {
    title: "fLOKr",
    description: "Resource coordination platform for community organizations. Connects people to local resources, mentorship, and mutual aid networks. Designed for newcomers, community groups, and grassroots organizations managing referrals and support networks.",
    tags: ["Next.js", "FastAPI", "PostgreSQL"],
    imageUrl: "/projects/fLOKr.png",
    link: "https://flokr.netlify.app",
  },
  {
    title: "RiseUp",
    description: "Event discovery platform for grassroots organizing. Helps people find local events, initiatives, and causes through chronological feeds instead of algorithmic ranking. Built for organizers and activists coordinating local action.",
    tags: ["Next.js", "FastAPI", "PostgreSQL"],
    imageUrl: "/projects/RiseUp.png",
    link: "https://riseup-demo.netlify.app",
  },
  {
    title: "Chapters",
    description: "Rate-limited social platform for writers and readers. Users share one post per day, designed to reduce content overload and encourage more thoughtful engagement. Built for communities seeking alternatives to high-frequency social feeds.",
    tags: ["Next.js", "FastAPI", "PostgreSQL"],
    imageUrl: "/projects/Chapters.png",
    link: "https://chapters-demo.netlify.app",
  },
  {
    title: "Makana",
    description: "Practice tracking platform for personal development. Focuses on clarity and consistency without gamification. Built for individuals and small groups tracking habits, reflections, and progress over time.",
    tags: ["Next.js", "FastAPI", "PostgreSQL"],
    imageUrl: "/projects/Makana.png",
    link: "https://makana-demo.netlify.app",
  },
    {
    title: "TapIn",
    description: "Digital access control for multi-tenant buildings. Replaces physical keys with secure wallet-based passes. Tenants unlock doors using Apple Wallet or Google Wallet, while property managers control access from a centralized dashboard.",
    tags: ["Next.js", "Django", "PostgreSQL"],
    imageUrl: "/projects/TapIn.png",
    link: "https://tapin-demo.netlify.app",
  },
  {
    title: "Takia",
    description: "Operations platform for community kitchens. Manages food sourcing, volunteer coordination, and distribution for shared kitchen initiatives. Designed for community-led food security programs and zero-waste kitchen operations.",
    tags: ["Next.js", "FastAPI", "PostgreSQL"],
    imageUrl: "/projects/Takia.png",
    link: "https://takia-demo.netlify.app",
  },
  {
    title: "sNDa",
    description: "Support and gifting platform for children and communities. Combines shared wishlists, group contributions, and coordinated follow-up so families, volunteers, and organizations can see what’s needed and what’s been delivered.",
    tags: ["Next.js", "Django", "PostgreSQL"],
    imageUrl: "/projects/sNDa.png",
    link: "https://snda.netlify.app/en",
  },
  {
    title: "Deeshak",
    description: "Streaming radio platform for Sudanese communities abroad. Hosts live radio, scheduled shows, and recorded segments in a low-bandwidth, mobile-friendly interface. Built for diaspora groups that need a simple, reliable way to broadcast culture and community updates.",
    tags: ["Next.js", "FastAPI", "PostgreSQL"],
    imageUrl: "/projects/Deeshak.png",
    link: "https://deeshak.netlify.app",
  },
] as const;

export const differentiators = [
  {
    id: "speed",
    icon: "⚡",
    title: "Efficient Delivery",
    description: "We scope clearly, work in focused sprints, and deliver production-ready systems in weeks, not months.",
    supportingSignal: "Most projects complete in 4-8 weeks",
  },
  {
    id: "transparent",
    icon: "🔍",
    title: "Clear Process",
    description: "We provide weekly updates, share work-in-progress demos, and document decisions so you understand what we're building and why.",
    supportingSignal: "Weekly progress updates included",
  },
  {
    id: "technical",
    icon: "🛠️",
    title: "Production Quality",
    description: "We use proven frameworks, write tests for critical paths, and follow practices that ensure maintainable systems.",
    supportingSignal: "Test coverage on core functionality",
  },
  {
    id: "partnership",
    icon: "🚀",
    title: "Ongoing Support",
    description: "We stay involved through launch, provide documentation for handoff, and offer maintenance support.",
    supportingSignal: "Post-launch support included",
  },
] as const;

export const reviewsData = [
  {
    name: "Osman Malik",
    organization: "Radio Deeshak",
    comment: "I'm very satisfied with the work Sakia Labs delivered. They exceeded my expectations on both quality and timeline, and I'd recommend them to anyone looking for a reliable tech partner.",
    rating: 5,
    date: "2024-05-14",
    avatarUrl: client1,
  },
  {
    name: "Nabeel Musa",
    organization: "Nabeel Barber Shop",
    comment: "Great experience working with the Sakia Labs team. They were professional throughout, kept me informed at every step, and delivered the project on time.",
    rating: 4.5,
    date: "2023-08-02",
    avatarUrl: client2,
  },
] as const;
