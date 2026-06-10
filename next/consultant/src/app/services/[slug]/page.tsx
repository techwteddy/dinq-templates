import { Metadata } from "next";
import { notFound } from "next/navigation";
import { services } from "#site/content";
import { SITE_URL, buildBreadcrumbs, buildGraphScript, getServiceTopics } from "@/lib/schema";

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const service = services.find((service) => service.slug.split("/").pop() === params.slug);
  if (!service) return {};

  return {
    title: service.title,
    description: service.description,
    alternates: {
      canonical: service.permalink,
    },
    openGraph: {
      title: service.title,
      description: service.description,
      type: "website",
      siteName: "Famous Sheamus Consulting",
      url: `https://famoussheamus.com${service.permalink}`,
      images: [
        {
          url: "https://famoussheamus.com/images/og-main.png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: service.title,
      description: service.description,
      images: ["https://famoussheamus.com/images/og-main.png"],
    },
  };
}

import { MDXContent } from "@/components/mdx-content";
import { TopNav } from "@/components/TopNav";
import { ContactBadge } from "@/components/ContactBadge";
interface ServicePageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug.split("/").pop(),
  }));
}

export default function ServicePage({ params }: ServicePageProps) {
  const service = services.find((service) => service.slug.split("/").pop() === params.slug);

  if (!service) {
    notFound();
  }

  const bareSlug = service.slug.split("/").pop() ?? "";
  const { about: serviceAbout, mentions: serviceMentions } = getServiceTopics(bareSlug);

  const serviceNodes = [
    {
      "@type": "Service",
      "@id": `${SITE_URL}${service.permalink}/#service`,
      "name": service.title,
      "description": service.description,
      "url": `${SITE_URL}${service.permalink}`,
      "provider": { "@id": `${SITE_URL}/#organization` },
      "areaServed": "Worldwide",
      "inLanguage": "en-US",
      "about": serviceAbout,
      "mentions": serviceMentions
    },
    buildBreadcrumbs([
      { name: "Home", url: SITE_URL },
      { name: "Services", url: `${SITE_URL}/services` },
      { name: service.title, url: `${SITE_URL}${service.permalink}` }
    ])
  ];

  return (
    <main className="min-h-screen pt-32 pb-48 px-4 overflow-hidden relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: buildGraphScript(serviceNodes) }}
      />
      <TopNav />
      <ContactBadge />
      <article className="max-w-3xl md:max-w-4xl xl:max-w-5xl mx-auto p-5 sm:p-8 md:p-12 lg:p-14 xl:p-16 rounded-3xl bg-white/75 dark:bg-zinc-950/60 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 shadow-xl shadow-zinc-200/5 dark:shadow-none animate-in fade-in slide-in-from-bottom-8 duration-700 relative z-10">
        <header className="mb-12 border-b border-black/10 dark:border-white/10 pb-8 relative">
          <div className="absolute -left-16 -top-16 w-32 h-32 bg-primary/20 rounded-full blur-[60px]" />
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 relative z-10">{service.title}</h1>
          <p className="text-xl text-foreground/70">{service.description}</p>
        </header>

        <div className="prose prose-lg xl:prose-xl dark:prose-invert prose-headings:font-bold prose-a:text-primary max-w-none">
          <MDXContent code={service.body} />
        </div>
      </article>
    </main>
  );
}
