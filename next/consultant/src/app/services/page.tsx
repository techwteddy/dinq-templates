import type { Metadata } from "next";
import React from "react";
import { SITE_URL, buildBreadcrumbs, buildGraphScript } from "@/lib/schema";

export const metadata: Metadata = {
  title: "AI Services | Famous Sheamus | Global Fractional CTO",
  description: "Scale your revenue, not chaos. Discover our fractional CTO and AI automation services available for high-growth businesses and enterprises worldwide.",
  alternates: {
    canonical: '/services',
  },
};

import { TopNav } from "@/components/TopNav";
import { ContactBadge } from "@/components/ContactBadge";
import { services } from "#site/content";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { TrustStack } from "@/components/TrustStack";

export default function ServicesPage() {
  // Sort by defined order
  const sortedServices = [...services].sort((a, b) => (a.order || 99) - (b.order || 99));

  // Split into Featured (Top) and Standard (Grid)
  const featuredServices = sortedServices.filter(s => s.isFeatured);
  const standardServices = sortedServices.filter(s => !s.isFeatured);

  const servicesNodes = [
    {
      "@type": "ItemList",
      "@id": `${SITE_URL}/services/#list`,
      "name": "Famous Sheamus Consulting Services",
      "description": "Comprehensive AI automation and Fractional CTO services for revenue scaling.",
      "provider": { "@id": `${SITE_URL}/#organization` },
      "itemListElement": sortedServices.map((service, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Service",
          "@id": `${SITE_URL}${service.permalink}/#service`,
          "name": service.title,
          "description": service.description,
          "url": `${SITE_URL}${service.permalink}`
        }
      }))
    },
    buildBreadcrumbs([
      { name: "Home", url: SITE_URL },
      { name: "Services", url: `${SITE_URL}/services` }
    ])
  ];

  return (
    <main className="relative min-h-screen pt-32 pb-24 bg-canvas">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: buildGraphScript(servicesNodes) }}
      />
      <TopNav />
      <ContactBadge />

      <div className="container relative mx-auto px-6 max-w-5xl">
        <header className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Scale Revenue, <span className="text-accent underline decoration-4 underline-offset-8">Not Chaos</span>
          </h1>
          <p className="text-xl text-zinc-500">
            Fractional CTO infrastructure that decouples growth from headcount.
          </p>
        </header>

        {/* FEATURED SECTION: Spans full 2-column width */}
        <section className="space-y-8 mb-12">
          {featuredServices.map((service) => (
            <ServiceCard key={service.slug} service={service} isFeatured={true} />
          ))}
        </section>

        {/* GRID SECTION: 2 Columns for standard services */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {standardServices.map((service) => (
            <ServiceCard key={service.slug} service={service} isFeatured={false} />
          ))}
        </section>

        {/* Global Trust Stack */}
        <section className="mt-24">
          <TrustStack />
        </section>
      </div>
    </main>
  );
}

// Reusable Card Component to keep code clean
type Service = (typeof services)[0];
function ServiceCard({ service, isFeatured }: { service: Service; isFeatured: boolean }) {
  const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>>)[service.icon || "Bot"] || LucideIcons.Bot;

  return (
    <Link
      href={service.permalink}
      className={`group relative flex flex-col justify-between rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/75 dark:bg-zinc-950/60 p-8 backdrop-blur-md transition-all hover:border-accent/50 hover:shadow-xl ${isFeatured ? "md:flex-row md:items-center gap-8 border-accent/20 ring-1 ring-accent/5" : ""
        }`}
    >
      <div className={isFeatured ? "md:max-w-2xl" : ""}>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 mb-6">
          <IconComponent className="h-6 w-6 text-accent" />
        </div>

        <h3 className={`font-bold group-hover:text-accent transition-colors mb-3 ${isFeatured ? "text-3xl" : "text-xl"
          }`}>
          {service.title}
        </h3>

        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
          {service.description}
        </p>

        <div className="inline-flex items-center gap-2 text-sm font-semibold text-accent">
          View Solution <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>

      {isFeatured && (
        <div className="hidden md:block opacity-10 group-hover:opacity-20 transition-opacity">
          <IconComponent size={120} strokeWidth={1} className="text-accent" />
        </div>
      )}
    </Link>
  );
}