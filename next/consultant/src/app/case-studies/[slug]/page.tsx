import { Metadata } from "next";
import { notFound } from "next/navigation";
import { caseStudies } from "#site/content";
import { MDXContent } from "@/components/mdx-content";
import { TopNav } from "@/components/TopNav";
import { ContactBadge } from "@/components/ContactBadge";
import { SITE_URL, buildBreadcrumbs, buildGraphScript, getCaseStudyTopics } from "@/lib/schema";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Target, Zap, Workflow, Linkedin } from "lucide-react";
import ZoomableImage from "@/components/ZoomableImage";
import React from "react";

interface CaseStudyPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const cs = caseStudies.find((c) => c.slug.split("/").pop() === params.slug);
  if (!cs) return {};

  return {
    title: `${cs.title} | Case Study`,
    description: cs.description,
    alternates: {
      canonical: cs.permalink,
    },
    openGraph: {
      title: cs.title,
      description: cs.description,
      type: "article",
      url: `${SITE_URL}${cs.permalink}`,
      images: [{ url: cs.logoPath || `${SITE_URL}/images/og-main.png` }],
    },
  };
}

export async function generateStaticParams() {
  return caseStudies.map((cs) => ({
    slug: cs.slug.split("/").pop(),
  }));
}

export default function CaseStudyPage({ params }: CaseStudyPageProps) {
  const cs = caseStudies.find((c) => c.slug.split("/").pop() === params.slug);

  if (!cs) {
    notFound();
  }

  const bareSlug = cs.slug.split("/").pop() ?? "";
  const { about: csAbout, mentions: csMentions } = getCaseStudyTopics(bareSlug);

  const schemaNodes = [
    {
      "@type": "CaseStudy",
      "@id": `${SITE_URL}${cs.permalink}/#casestudy`,
      "name": cs.title,
      "description": cs.description,
      "url": `${SITE_URL}${cs.permalink}`,
      "about": csAbout,
      "mentions": csMentions,
      "author": { "@id": `${SITE_URL}/#sheamus` },
      "publisher": { "@id": `${SITE_URL}/#organization` },
      "maintainer": { "@id": `${SITE_URL}/#sheamus` }
    },
    buildBreadcrumbs([
      { name: "Home", url: SITE_URL },
      { name: "Case Studies", url: `${SITE_URL}/case-studies` },
      { name: cs.title, url: `${SITE_URL}${cs.permalink}` }
    ])
  ];

  return (
    <main 
      className="min-h-screen pt-32 pb-48 px-4 bg-canvas relative"
      style={{ 
        '--brand-color': cs.brandColor, 
        '--accent-color': cs.accentColor 
      } as React.CSSProperties}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: buildGraphScript(schemaNodes) }}
      />
      <TopNav />
      <ContactBadge />

      <div className="max-w-6xl mx-auto">
        <Link 
          href="/case-studies" 
          className="inline-flex items-center gap-2 text-sm font-semibold mb-12 hover:opacity-70 transition-opacity"
          style={{ color: 'var(--brand-color)' }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Case Studies
        </Link>

        <header className="mb-20">
          <div className="flex items-center gap-4 mb-6">
             <span 
               className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border"
               style={{ borderColor: 'var(--brand-color)', color: 'var(--brand-color)', backgroundColor: `${cs.brandColor}10` }}
             >
                {cs.companyName}
             </span>
             <span className="h-px flex-grow bg-border/50" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">
            {cs.title}
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
            {cs.description}
          </p>
        </header>

        {/* Hero Section: Image & Role */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <div className="md:col-span-2 flex flex-col gap-8">
            {cs.heroImage && (
              <div className="relative w-full overflow-hidden rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/75 dark:bg-zinc-950/60 backdrop-blur-md p-4 md:p-8">
                <ZoomableImage 
                  src={cs.heroImage} 
                  alt={`${cs.companyName} Project Architecture`}
                  width={1200}
                  height={800}
                  className="w-full h-auto rounded-lg shadow-sm"
                />
              </div>
            )}
            <div className="rounded-2xl bg-white/75 dark:bg-zinc-950/60 border border-zinc-200/50 dark:border-zinc-800/50 p-6 backdrop-blur-md">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">My Role</h3>
              <p className="text-xl font-bold">{cs.roleTitle || "Fractional CTO & Lead Architect"}</p>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {cs.roleDescription || "Architected the end-to-end automation engine, oversaw API integrations, and established zero-retention data protocols."}
              </p>
            </div>
          </div>
          <div className="space-y-4">
             {cs.stats?.map((stat: string, i: number) => (
               <div key={i} className="p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/75 dark:bg-zinc-950/60 backdrop-blur-md">
                  <p className="text-lg font-bold" style={{ color: 'var(--brand-color)' }}>{stat}</p>
               </div>
             ))}
             {cs.clientReference && (
               <div className="p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/75 dark:bg-zinc-950/60 backdrop-blur-md">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">Client Reference</h4>
                  <div className="flex items-center gap-4">
                    {cs.clientReference.image && (
                      <div className="h-12 w-12 rounded-full overflow-hidden border border-border flex-shrink-0">
                        <img 
                          src={cs.clientReference.image} 
                          alt={cs.clientReference.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-bold truncate">{cs.clientReference.name}</p>
                      <p className="text-xs text-zinc-500 truncate">{cs.clientReference.title}</p>
                      {cs.clientReference.linkedin && (
                        <Link 
                          href={cs.clientReference.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider mt-2 text-zinc-400 hover:text-blue-500 transition-colors"
                        >
                          <Linkedin className="h-3 w-3" />
                          LinkedIn Profile
                        </Link>
                      )}
                    </div>
                  </div>
               </div>
             )}
          </div>
        </div>

        {/* Three Pillars Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          <div className="space-y-4 p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/75 dark:bg-zinc-950/60 backdrop-blur-md">
            <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center">
              <Target className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="text-xl font-bold">The Challenge</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Operational drag caused by manual processes and missed leads during rapid expansion.
            </p>
          </div>
          <div className="space-y-4 p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/75 dark:bg-zinc-950/60 backdrop-blur-md">
            <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Zap className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold">The Approach</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Digital transformation via agnostic AI implementation and custom-built n8n workflows.
            </p>
          </div>
          <div className="space-y-4 p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/75 dark:bg-zinc-950/60 backdrop-blur-md">
            <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="text-xl font-bold">The Result</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Scaled revenue while maintaining static headcount through automated logic engines.
            </p>
          </div>
        </section>

        {/* Schematic Section */}
        {cs.showTechnicalSchematic && (
          <section className="mb-24">
             <div className="rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/75 dark:bg-zinc-950/60 p-8 md:p-12 backdrop-blur-md">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Workflow className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold">Technical Logic Engine</h3>
                </div>
                
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-zinc-50 dark:bg-zinc-950">
                   <div className="h-full w-full flex flex-col items-center justify-center text-center p-12">
                      <div className="h-20 w-20 mb-6 opacity-20">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                          <path d="M3 3h18v18H3z" />
                          <path d="M3 12h18" />
                          <path d="M12 3v18" />
                        </svg>
                      </div>
                      <p className="text-zinc-500 max-w-sm">
                        Technical Architecture Schematic for {cs.companyName} is currently under verification.
                      </p>
                   </div>
                </div>
                <p className="mt-6 text-sm text-center text-zinc-500 italic">
                  Proprietary architecture designed and deployed by Famous Sheamus Consulting.
                </p>
             </div>
          </section>
        )}

        <article className="prose prose-lg dark:prose-invert prose-headings:font-bold max-w-4xl mx-auto p-5 sm:p-8 md:p-12 lg:p-16 rounded-3xl bg-white/75 dark:bg-zinc-950/60 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 shadow-xl shadow-zinc-200/5 dark:shadow-none mt-12 relative z-10">
          <MDXContent code={cs.body} />
        </article>
      </div>
    </main>
  );
}
