import { Metadata } from "next";
import { notFound } from "next/navigation";
import { pages } from "#site/content";
import { MDXContent } from "@/components/mdx-content";
import { TopNav } from "@/components/TopNav";
import { ContactBadge } from "@/components/ContactBadge";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = pages.find((p) => p.slug.split("/").pop() === params.slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: page.permalink,
    },
  };
}

export async function generateStaticParams() {
  return pages.map((p) => ({
    slug: p.slug.split("/").pop(),
  }));
}

export default function StandalonePage({ params }: PageProps) {
  const page = pages.find((p) => p.slug.split("/").pop() === params.slug);

  if (!page || !page.published) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-32 pb-48 px-4 overflow-hidden relative">
      <TopNav />
      <ContactBadge />
      <article className="max-w-3xl md:max-w-4xl xl:max-w-5xl mx-auto p-5 sm:p-8 md:p-12 lg:p-14 xl:p-16 rounded-3xl bg-white/75 dark:bg-zinc-950/60 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 shadow-xl shadow-zinc-200/5 dark:shadow-none animate-in fade-in slide-in-from-bottom-8 duration-700 relative z-10">
        <header className="mb-12 border-b border-black/10 dark:border-white/10 pb-8 relative">
          <div className="absolute -left-16 -top-16 w-32 h-32 bg-primary/20 rounded-full blur-[60px]" />
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 relative z-10">{page.title}</h1>
          <p className="text-xl text-foreground/70">{page.description}</p>
        </header>

        <div className="prose prose-lg xl:prose-xl dark:prose-invert prose-headings:font-bold prose-a:text-primary max-w-none">
          <MDXContent code={page.body} />
        </div>
      </article>
    </main>
  );
}
