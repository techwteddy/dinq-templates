import type { Metadata } from "next";
import React from "react";
import { caseStudies } from "#site/content";
import { TopNav } from "@/components/TopNav";
import { ContactBadge } from "@/components/ContactBadge";
import { SITE_URL, buildBreadcrumbs, buildGraphScript } from "@/lib/schema";
import { CaseStudyCard } from "./CaseStudyCard";

export const metadata: Metadata = {
  title: "Case Studies | Famous Sheamus | Fractional CTO & AI Architect",
  description: "Proof of Work. Explore metric-driven success stories of AI implementation and digital transformation for high-growth enterprises.",
  alternates: {
    canonical: '/case-studies',
  },
};

export default function CaseStudiesPage() {
  const sortedCaseStudies = [...caseStudies].sort((a) => (a.published ? 0 : 1));

  const schemaNodes = [
    {
      "@type": "ItemList",
      "@id": `${SITE_URL}/case-studies/#list`,
      "name": "Famous Sheamus Case Studies",
      "description": "Metric-driven case studies on AI automation and CTO strategy.",
      "itemListElement": sortedCaseStudies.map((cs, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "CreativeWork",
          "@id": `${SITE_URL}${cs.permalink}/#casestudy`,
          "name": cs.title,
          "description": cs.description,
          "url": `${SITE_URL}${cs.permalink}`
        }
      }))
    },
    buildBreadcrumbs([
      { name: "Home", url: SITE_URL },
      { name: "Case Studies", url: `${SITE_URL}/case-studies` }
    ])
  ];

  return (
    <main className="relative min-h-screen pt-32 pb-24 bg-canvas">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: buildGraphScript(schemaNodes) }}
      />
      <TopNav />
      <ContactBadge />

      <div className="container relative mx-auto px-6 max-w-7xl">
        <header className="mb-16 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Proof of <span className="text-accent underline decoration-4 underline-offset-8">Work</span>
          </h1>
          <p className="text-xl text-zinc-500">
            Metric-driven architectures that scale revenue and eliminate operational drag.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {sortedCaseStudies.map((cs) => (
            <CaseStudyCard key={cs.slug} cs={cs} />
          ))}
        </section>
      </div>
    </main>
  );
}