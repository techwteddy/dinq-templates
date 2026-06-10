// src/lib/schema.ts
// Centralized JSON-LD entity definitions for AI-first SEO.
// All pages should reference these stable @id URIs instead of re-defining entities inline.

export const SITE_URL = "https://famoussheamus.com";

// ─── Core Entity: Organization ───────────────────────────────────────────────
export const organizationEntity = {
  "@type": ["Organization", "ProfessionalService"],
  "@id": `${SITE_URL}/#organization`,
  "name": "Famous Sheamus Consulting",
  "alternateName": "Famous Sheamus",
  "url": SITE_URL,
  "logo": {
    "@type": "ImageObject",
    "@id": `${SITE_URL}/#logo`,
    "url": `${SITE_URL}/images/no-text-no-bg-logo.png`,
    "contentUrl": `${SITE_URL}/images/no-text-no-bg-logo.png`,
    "caption": "Famous Sheamus Consulting",
    "license": `${SITE_URL}/about`,
    "acquireLicensePage": `${SITE_URL}/contact`,
    "copyrightNotice": "© 2026 Famous Sheamus Consulting",
    "creditText": "Famous Sheamus Consulting"
  },
  "image": { "@id": `${SITE_URL}/#logo` },
  "sameAs": [
    "https://www.linkedin.com/in/sheamus-byrne/",
    "https://x.com/famousshea",
    "https://github.com/famousshea",
    "https://www.reddit.com/user/FamousSheamusAI/",
    "https://en.wikipedia.org/wiki/Zoho_Corporation",
    "https://en.wikipedia.org/wiki/Chief_technology_officer",
    "https://en.wikipedia.org/wiki/Digital_transformation",
    "https://en.wikipedia.org/wiki/Business_process_automation"
  ],
  "description":
    "AI Implementation Consultant and Fractional CTO with Global Capability. Serving enterprises worldwide with agnostic AI implementation and automation strategy. Scale Revenue, Not Chaos.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Dallas",
    "addressRegion": "TX",
    "postalCode": "75201",
    "addressCountry": "US"
  },
  "founder": { "@id": `${SITE_URL}/#sheamus` },
  "areaServed": [
    "Worldwide",
    { "@type": "City", "name": "Dallas", "sameAs": "https://www.wikidata.org/wiki/Q16557" },
    { "@type": "City", "name": "New York City", "sameAs": "https://www.wikidata.org/wiki/Q60" },
    { "@type": "City", "name": "London", "sameAs": "https://www.wikidata.org/wiki/Q84" }
  ],
  "about": [
    { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q11660", "name": "Artificial Intelligence" },
    { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q5001911", "name": "Business Process Automation" }
  ],
  "knowsAbout": [
    { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q11660", "name": "Artificial Intelligence" },
    { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q5001911", "name": "Business Process Automation" },
    { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q130305687", "name": "n8n" },
    "Enterprise Architecture",
    "Voice AI Receptionists",
    "Process Optimization",
    "SaaS Bloat Reduction",
    "Logic Engines",
    "Zoho One Centralization",
    "Digital Transformation",
    "Workflow Automation"
  ],
  "mentions": [
    { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q130305687", "name": "n8n" },
    { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q115305900", "name": "Large Language Model" }
  ],
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "opens": "09:00",
    "closes": "18:00"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "url": `${SITE_URL}/contact`
  },
  "offers": {
    "@type": "Offer",
    "itemOffered": {
      "@type": "Service",
      "name": "Fractional CTO & Automation Strategy",
      "description":
        "High-level technology leadership and AI implementation strategy to decouple revenue growth from headcount."
    }
  }
};

// ─── Core Entity: Person (Sheamus) ───────────────────────────────────────────
export const personEntity = {
  "@type": "Person",
  "@id": `${SITE_URL}/#sheamus`,
  "name": "Sheamus",
  "jobTitle": ["Fractional CTO", "AI Architect", "Automation Strategist"],
  "url": `${SITE_URL}/about`,
  "worksFor": { "@id": `${SITE_URL}/#organization` },
  "sameAs": [
    "https://www.linkedin.com/in/sheamus-byrne/",
    "https://github.com/famousshea",
    "https://x.com/famousshea",
    "https://en.wikipedia.org/wiki/Chief_technology_officer"
  ],
  "knowsAbout": [
    { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q11660", "name": "Artificial Intelligence" },
    { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q5001911", "name": "Business Process Automation" },
    "n8n Automation",
    "Voice AI",
    "LLM Infrastructure",
    "System Architecture Design",
    "Enterprise Architecture"
  ]
};

// ─── Core Entity: WebSite ────────────────────────────────────────────────────
export const websiteEntity = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  "name": "Famous Sheamus Consulting",
  "url": SITE_URL,
  "publisher": { "@id": `${SITE_URL}/#organization` },
  "inLanguage": "en-US"
};

// ─── Wikidata Topic Reference (reusable entities) ────────────────────────────
// Every Q-ID below has been verified against the Wikidata API (2026-04-27).
const WD = {
  AI: { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q11660", "name": "Artificial Intelligence" },
  BPA: { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q5001911", "name": "Business Process Automation" },
  LLM: { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q115305900", "name": "Large Language Model" },
  n8n: { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q130305687", "name": "n8n" },
  ROI: { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q939134", "name": "Return on Investment" },
  CTO: { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q5287861", "name": "Chief Technology Officer" },
  DataIntegration: { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q386824", "name": "Data Integration" },
  CustomerService: { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q1060653", "name": "Customer Service" },
  MarketResearch: { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q913709", "name": "Market Research" },
  Marketing: { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q39809", "name": "Marketing" },
  Procurement: { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q829492", "name": "Procurement" },
  SupplyChain: { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q492886", "name": "Supply Chain Management" },
  ProjectManagement: { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q179012", "name": "Project Management" },
  PaymentSystem: { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q986008", "name": "Payment System" },
  CashFlow: { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q1047513", "name": "Cash Flow" },
  OperatingSystem: { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q9135", "name": "Operating System" },
  Linux: { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q388", "name": "Linux" },
  Windows: { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q1406", "name": "Microsoft Windows" },
  MacOS: { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q14116", "name": "macOS" },
  Innovation: { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q174165", "name": "Innovation" },
  NLP: { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q30642", "name": "Natural Language Processing" },
  Podcast: { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q20899", "name": "Podcast" },
  FinancialAnalysis: { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q1363554", "name": "Financial Analysis" },
  SaaS: { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q1254596", "name": "Software as a Service" },
  CloudComputing: { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q483639", "name": "Cloud Computing" },
  MultiAgentSystem: { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q529909", "name": "Multi-Agent System" },
  Chatbot: { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q870780", "name": "Chatbot" },
  CRM: { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q485643", "name": "Customer Relationship Management" },
  SocialMedia: { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q202833", "name": "Social Media" },
  LeadGen: { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q1583910", "name": "Lead Generation" },
  SystemArch: { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q477538", "name": "Systems Architecture" },
  GasSafe: { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q5526308", "name": "Gas Safe Register" },
  TDLR: { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q7707637", "name": "Texas Department of Licensing and Regulation" },
  NYCDOB: { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q13358874", "name": "New York City Department of Buildings" },
  RAG: { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q121362277", "name": "Retrieval-Augmented Generation" },
  Latency: { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q1771903", "name": "Latency" },
  FSM: { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q5447122", "name": "Field Service Management" },
  Zoho: { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q8063247", "name": "Zoho Corporation" },
  DigitalTransformation: { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q4252370", "name": "Digital Transformation" },
};


// ─── Per-Service Wikidata Topic Map ──────────────────────────────────────────
const serviceTopicMap: Record<string, { about: object[]; mentions: object[] }> = {
  "strategic-ai-implementation-fractional-cto": {
    about: [WD.CTO, WD.AI, WD.BPA],
    mentions: [WD.ROI, WD.Innovation, WD.ProjectManagement],
  },
  "voice-ai-receptionist": {
    about: [WD.AI, WD.CustomerService, WD.BPA],
    mentions: [WD.NLP, WD.Chatbot, WD.LeadGen, WD.ROI, WD.TDLR, WD.GasSafe, WD.NYCDOB],
  },
  "enterprise-crm-integration-real-time-data-pipelines": {
    about: [WD.CRM, WD.DataIntegration, WD.BPA],
    mentions: [WD.SaaS, WD.CloudComputing, WD.SystemArch],
  },
  "ai-chatbot-assistant-development-for-modern-business": {
    about: [WD.Chatbot, WD.AI, WD.NLP],
    mentions: [WD.CustomerService, WD.BPA, WD.MultiAgentSystem],
  },
  "end-to-end-system-architecture-design-cloud-strategy": {
    about: [WD.SystemArch, WD.CloudComputing, WD.BPA],
    mentions: [WD.DataIntegration, WD.ProjectManagement, WD.CTO],
  },
  "ai-social-media-automation-for-consistent-brand-growth": {
    about: [WD.SocialMedia, WD.AI, WD.Marketing],
    mentions: [WD.BPA, WD.Innovation, WD.ROI],
  },
  "workflow-process-analysis-cost-optimization-strategy": {
    about: [WD.BPA, WD.ROI, WD.ProjectManagement],
    mentions: [WD.FinancialAnalysis, WD.Innovation, WD.DataIntegration],
  },
  "custom-n8n-workflow-automation-for-scale-efficiency": {
    about: [WD.n8n, WD.BPA, WD.AI],
    mentions: [WD.SaaS, WD.ROI, WD.DataIntegration],
  },
  "ai-powered-lead-capture-automated-qualification-system": {
    about: [WD.LeadGen, WD.AI, WD.Marketing],
    mentions: [WD.CRM, WD.ROI, WD.CustomerService],
  },
};

/**
 * Returns grounded Wikidata `about` and `mentions` arrays for a given service slug.
 */
export function getServiceTopics(slug: string): { about: object[]; mentions: object[] } {
  return serviceTopicMap[slug] ?? {
    about: [WD.AI, WD.BPA],
    mentions: [WD.ROI, WD.n8n],
  };
}

// ─── Per-Article Wikidata Topic Map ──────────────────────────────────────────
/**
 * Maps each blog post slug to a curated set of grounded Wikidata entities.
 * Used to populate the `about` and `mentions` fields in BlogPosting schema.
 * Add new entries here as new articles are published.
 */
const articleTopicMap: Record<string, { about: object[]; mentions: object[] }> = {
  "ai-procurement-strategy-profit-gauntlet-2026": {
    about: [WD.Procurement, WD.AI, WD.BPA],
    mentions: [WD.SupplyChain, WD.ROI, WD.n8n, WD.LLM],
  },
  "ai-roi-blueprint-no-new-software": {
    about: [WD.ROI, WD.AI, WD.BPA],
    mentions: [WD.SaaS, WD.n8n, WD.LLM, WD.CloudComputing],
  },
  "automated-ai-support-channels": {
    about: [WD.CustomerService, WD.AI, WD.BPA],
    mentions: [WD.MultiAgentSystem, WD.Chatbot, WD.NLP, WD.LLM],
  },
  "generate-high-conversion-marketing-campaigns": {
    about: [WD.Marketing, WD.AI, WD.BPA],
    mentions: [WD.CRM, WD.MultiAgentSystem, WD.LLM, WD.ROI],
  },
  "how-can-ai-execute-deep-market-research": {
    about: [WD.MarketResearch, WD.AI, WD.BPA],
    mentions: [WD.LLM, WD.DataIntegration, WD.MultiAgentSystem],
  },
  "how-can-ai-replace-brainstorming": {
    about: [WD.Innovation, WD.AI, WD.MultiAgentSystem],
    mentions: [WD.LLM, WD.BPA, WD.SaaS, WD.ROI],
  },
  "how-to-turn-reports-into-podcasts": {
    about: [WD.Podcast, WD.AI, WD.FinancialAnalysis],
    mentions: [WD.NLP, WD.LLM, WD.BPA, WD.ROI],
  },
  "how-to-unify-enterprise-data": {
    about: [WD.DataIntegration, WD.AI, WD.BPA],
    mentions: [WD.CRM, WD.LLM, WD.CloudComputing, WD.NLP],
  },
  "os-strategy-for-ai-automation-roi": {
    about: [WD.OperatingSystem, WD.AI, WD.ROI],
    mentions: [WD.Linux, WD.Windows, WD.MacOS, WD.BPA, WD.CloudComputing],
  },
  "payment-orchestration-automation-no-new-software": {
    about: [WD.PaymentSystem, WD.BPA, WD.AI],
    mentions: [WD.CashFlow, WD.n8n, WD.ROI, WD.SaaS],
  },
  "what-is-a-fractional-cto": {
    about: [WD.CTO, WD.AI, WD.BPA],
    mentions: [WD.SaaS, WD.n8n, WD.ROI, WD.CloudComputing],
  },
  "why-ai-projects-fail-without-discovery": {
    about: [WD.ProjectManagement, WD.AI, WD.ROI],
    mentions: [WD.BPA, WD.LLM, WD.SaaS, WD.DataIntegration],
  },
  "the-cfos-guide-to-voice-ai-margin-traps": {
    about: [WD.AI, WD.ROI, WD.FinancialAnalysis],
    mentions: [WD.RAG, WD.Latency, WD.FSM, WD.BPA, WD.TDLR, WD.NYCDOB],
  },
};

/**
 * Returns grounded Wikidata `about` and `mentions` arrays for a given blog slug.
 * Falls back to generic AI/BPA topics if the slug is not yet mapped.
 */
export function getArticleTopics(slug: string): { about: object[]; mentions: object[] } {
  return articleTopicMap[slug] ?? {
    about: [WD.AI, WD.BPA],
    mentions: [WD.LLM, WD.n8n],
  };
}

// ─── Per-Case Study Wikidata Topic Map ───────────────────────────────────────
const caseStudyTopicMap: Record<string, { about: object[]; mentions: object[] }> = {
  "multipli": {
    about: [WD.DigitalTransformation, WD.Zoho, WD.BPA],
    mentions: [WD.CRM, WD.LeadGen, WD.ROI],
  },
};

/**
 * Returns grounded Wikidata `about` and `mentions` arrays for a given case study slug.
 */
export function getCaseStudyTopics(slug: string): { about: object[]; mentions: object[] } {
  return caseStudyTopicMap[slug] ?? {
    about: [WD.AI, WD.BPA],
    mentions: [WD.ROI, WD.SystemArch],
  };
}

// ─── Utility: Build BreadcrumbList ───────────────────────────────────────────
/**
 * Generates a BreadcrumbList schema node.
 * @param items Array of { name, url } objects representing the breadcrumb trail.
 */
export function buildBreadcrumbs(items: { name: string; url: string }[]) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${items[items.length - 1].url}/#breadcrumb`,
    "itemListElement": items.map((item, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

// ─── Utility: Build JSON-LD @graph Script String ─────────────────────────────
/**
 * Wraps an array of schema nodes into a single @graph JSON-LD string.
 * Use this to generate the `dangerouslySetInnerHTML` value for a single <script> tag.
 */
export function buildGraphScript(nodes: Record<string, unknown>[]) {
  const graph = {
    "@context": "https://schema.org",
    "@graph": nodes
  };
  return JSON.stringify(graph);
}
