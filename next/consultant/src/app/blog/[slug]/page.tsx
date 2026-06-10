import { notFound } from "next/navigation";
import { blogs } from "#site/content";
import { MDXContent } from "@/components/mdx-content";
import { TopNav } from "@/components/TopNav";
import { ContactBadge } from "@/components/ContactBadge";
import { SITE_URL, buildBreadcrumbs, buildGraphScript, getArticleTopics } from "@/lib/schema";

interface BlogPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return blogs.map((blog) => ({
    slug: blog.slug.split("/").pop(),
  }));
}

export async function generateMetadata({ params }: BlogPageProps) {
  const blog = blogs.find((blog) => blog.slug.split("/").pop() === params.slug);
  if (!blog) return {};

  return {
    alternates: {
      canonical: blog.permalink,
    },
    title: blog.title,
    description: blog.description,
    openGraph: {
      title: blog.title,
      description: blog.description,
      type: "article",
      url: `https://famoussheamus.com${blog.permalink}`,
      publishedTime: blog.date,
      authors: ["Sheamus"],
      images: [
        {
          url: `https://famoussheamus.com/images/og-main.png`, // Fallback or dynamic image if available
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.description,
    },
  };
}

export default function BlogPage({ params }: BlogPageProps) {
  // Find the blog using the slug
  const blog = blogs.find((blog) => blog.slug.split("/").pop() === params.slug);

  if (!blog || !blog.published) {
    notFound();
  }

  // Derive the bare slug (e.g. "ai-roi-blueprint-no-new-software") for topic lookup
  const bareSlug = blog.slug.split("/").pop() ?? "";
  const { about: articleAbout, mentions: articleMentions } = getArticleTopics(bareSlug);

  // Build consolidated @graph schema — author/publisher reference by @id, no entity duplication
  const blogNodes = [
    {
      "@type": "BlogPosting",
      "@id": `${SITE_URL}${blog.permalink}/#article`,
      "headline": blog.title,
      "description": blog.description,
      "datePublished": blog.date,
      "author": { "@id": `${SITE_URL}/#sheamus` },
      "publisher": { "@id": `${SITE_URL}/#organization` },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${SITE_URL}${blog.permalink}`
      },
      "isPartOf": { "@id": `${SITE_URL}/#website` },
      "about": articleAbout,
      "mentions": articleMentions,
      "inLanguage": "en-US"
    },
    buildBreadcrumbs([
      { name: "Home", url: SITE_URL },
      { name: "Blog", url: `${SITE_URL}/blog` },
      { name: blog.title, url: `${SITE_URL}${blog.permalink}` }
    ])
  ];

  return (
    <main className="min-h-screen pt-32 pb-48 px-4 overflow-hidden relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: buildGraphScript(blogNodes) }}
      />
      <TopNav />
      <ContactBadge />
      <article className="max-w-3xl md:max-w-4xl xl:max-w-5xl mx-auto p-5 sm:p-8 md:p-12 lg:p-14 xl:p-16 rounded-3xl bg-white/75 dark:bg-zinc-950/60 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 shadow-xl shadow-zinc-200/5 dark:shadow-none animate-in fade-in slide-in-from-bottom-8 duration-700 relative z-10">
        <header className="mb-12 border-b border-black/10 dark:border-white/10 pb-8 relative">
          <div className="absolute -left-16 -top-16 w-32 h-32 bg-primary/20 rounded-full blur-[60px]" />

          <p className="text-primary font-semibold mb-2">
            {new Date(blog.date).toLocaleDateString()}
          </p>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 relative z-10">
            {blog.title}
          </h1>

          {/* Updated TL;DR Box using 'description' */}
          <div className="relative border-2 border-dashed border-teal-600 p-6 rounded-xl bg-white/50 dark:bg-zinc-900/50 mb-8 shadow-sm">
            <span className="absolute -top-3 -right-3 bg-blue-600 text-white text-xs px-2 py-1 rounded rotate-12 font-bold shadow-md uppercase tracking-wider">
              TL;DR
            </span>
            <p className="text-gray-700 dark:text-gray-300 italic font-medium leading-relaxed">
              {blog.description} {/* Changed from blog.summary to match your new config */}
            </p>
          </div>
        </header>

        <div className="prose prose-lg xl:prose-xl dark:prose-invert prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl prose-a:text-primary max-w-none">
          <MDXContent code={blog.body} />
        </div>
      </article>
    </main>
  );
}