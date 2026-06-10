import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL, buildBreadcrumbs, buildGraphScript } from "@/lib/schema";

export const metadata: Metadata = {
  title: "The Automation Journal | Famous Sheamus | Global CTO",
  description: "Read the latest insights from a Global Fractional CTO on AI architecture, scaling revenue, and building resilient systems for global businesses.",
  alternates: {
    canonical: '/blog',
  },
};

import { blogs } from "#site/content";
import { TopNav } from "@/components/TopNav";
import { ContactBadge } from "@/components/ContactBadge";
import { BlogCategoryAccordion } from "@/components/BlogCategoryAccordion";

export default function BlogIndex() {
  const publishedBlogs = blogs
    .filter((blog) => blog.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Global Latest Section: Top 3
  const latestBlogs = publishedBlogs.slice(0, 3);

  // Group by category dynamically extracted from the MDX frontmatter
  const categoriesMap = new Map<string, typeof blogs>();
  publishedBlogs.forEach((blog) => {
    const cat = blog.category || "Uncategorized";
    if (!categoriesMap.has(cat)) {
      categoriesMap.set(cat, []);
    }
    categoriesMap.get(cat)!.push(blog);
  });

  const categories = Array.from(categoriesMap.entries()).map(([name, posts]) => ({
    name,
    posts,
  }));

  const blogListNodes = [
    {
      "@type": "CollectionPage",
      "@id": `${SITE_URL}/blog/#webpage`,
      "name": "The Automation Journal | Famous Sheamus",
      "url": `${SITE_URL}/blog`,
      "description": "Latest insights on AI architecture, scaling revenue, and building resilient systems.",
      "isPartOf": { "@id": `${SITE_URL}/#website` },
      "publisher": { "@id": `${SITE_URL}/#organization` },
      "inLanguage": "en-US"
    },
    buildBreadcrumbs([
      { name: "Home", url: SITE_URL },
      { name: "Blog", url: `${SITE_URL}/blog` }
    ])
  ];

  return (
    <main className="min-h-screen pt-32 pb-48 px-4 overflow-hidden relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: buildGraphScript(blogListNodes) }}
      />
      <TopNav />
      <ContactBadge />
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        <div className="text-center w-full mt-10 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground">
            The Automation <span className="text-primary italic">Journal.</span>
          </h1>
          <p className="mt-8 text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
            Latest insights into AI architecture, scaling revenue, and building resilient systems without the chaos.
          </p>
        </div>

        {/* Global Latest Section */}
        <div className="w-full mb-16 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-150 fill-mode-both">
          <h2 className="text-2xl font-semibold mb-8 text-foreground/80 border-b border-black/10 dark:border-white/10 pb-4">
            Latest Articles
          </h2>
          <div className="flex flex-col gap-8 w-full">
            {latestBlogs.map((blog) => (
              <Link
                key={blog.slug}
                href={blog.permalink}
                className="group block p-8 rounded-3xl bg-white/75 dark:bg-zinc-950/60 border border-zinc-200/50 dark:border-zinc-800/50 shadow-md hover:shadow-xl transition-all backdrop-blur-md relative overflow-hidden"
              >
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-secondary/10 blur-3xl transition-all group-hover:bg-primary/20 group-hover:blur-2xl" />
                <div className="relative z-10">
                  <p className="text-sm text-primary font-semibold mb-3 tracking-wide uppercase">{new Date(blog.date).toLocaleDateString()}</p>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors">{blog.title}</h2>
                  <p className="text-foreground/70 leading-relaxed line-clamp-2 md:line-clamp-3">{blog.description}</p>
                  <div className="mt-6 flex items-center text-sm font-medium text-primary">
                    Read Article
                    <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Interactive Category Accordion */}
        <div className="w-full animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 fill-mode-both">
          <BlogCategoryAccordion categories={categories} />
        </div>
      </div>
    </main>
  );
}
