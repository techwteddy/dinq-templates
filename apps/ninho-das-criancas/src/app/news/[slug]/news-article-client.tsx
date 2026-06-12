"use client";

import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

import { useLocale } from "@/components/i18n/locale-provider";
import { useTranslatedText } from "@/components/i18n/use-translated-text";
import { NewsPostCard } from "@/components/news/news-post-card";
import { buttonVariants } from "@/components/ui/button";
import { KO_CATEGORY_TO_TAB_ID } from "@/lib/constants/news-category-ko-mapping";
import type { Post } from "@/lib/types/post";
import { cn } from "@/lib/utils";

function formatDate(iso: string | null, localeTag: string) {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat(localeTag, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

export function NewsArticleClient({
  post,
  related,
}: {
  post: Post;
  related: Post[];
}) {
  const { locale, t } = useLocale();
  const wantPt = locale === "pt";
  const dateLocale = wantPt ? "pt-BR" : "ko";
  const na = t.newsArticle;

  const { text: titleDisplay, loading: titleLoading } = useTranslatedText(
    post.title,
    wantPt
  );
  const { text: bodyDisplay, loading: bodyLoading } = useTranslatedText(
    post.content ?? "",
    wantPt && Boolean(post.content?.trim())
  );

  const categoryTabId = post.category
    ? KO_CATEGORY_TO_TAB_ID[post.category]
    : undefined;
  const categoryLabel =
    categoryTabId != null
      ? (t.news.tabLabels[categoryTabId] ?? post.category)
      : post.category;

  const heroAlt = wantPt
    ? `${titleDisplay} — ${na.heroImageAltSuffix}`
    : `${post.title} ${na.heroImageAltSuffix}`;

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <header>
        {post.category ? (
          <p className="text-sm font-medium text-primary">{categoryLabel}</p>
        ) : null}
        <h1 className="mt-2 font-heading text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
          {titleDisplay}
          {titleLoading ? (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({na.translating})
            </span>
          ) : null}
        </h1>
        <time
          className="mt-3 block text-sm text-muted-foreground"
          dateTime={post.published_at ?? undefined}
        >
          {formatDate(post.published_at, dateLocale)}
        </time>
      </header>

      {post.thumbnail_url ? (
        <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl ring-1 ring-foreground/10">
          <Image
            src={post.thumbnail_url}
            alt={heroAlt}
            fill
            priority
            className="object-cover"
            sizes="(min-width: 768px) 720px, 100vw"
          />
        </div>
      ) : null}

      <div className="prose prose-neutral prose-lg mt-10 max-w-none font-sans prose-headings:font-heading prose-a:text-primary prose-img:rounded-xl">
        {bodyLoading && wantPt && post.content?.trim() ? (
          <p className="text-sm text-muted-foreground not-prose">{na.translating}</p>
        ) : null}
        <ReactMarkdown
          components={{
            img: ({ src, alt }) => {
              if (!src || typeof src !== "string") return null;
              return (
                <span className="not-prose relative my-8 block aspect-video w-full overflow-hidden rounded-xl ring-1 ring-border/60">
                  <Image
                    src={src}
                    alt={
                      typeof alt === "string" && alt.trim()
                        ? alt
                        : na.inlineImageAlt
                    }
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 720px, 100vw"
                  />
                </span>
              );
            },
          }}
        >
          {bodyDisplay}
        </ReactMarkdown>
      </div>

      {post.images?.length ? (
        <section className="mt-12" aria-labelledby="more-images">
          <h2
            id="more-images"
            className="font-heading text-lg font-semibold text-foreground"
          >
            {na.moreImagesHeading}
          </h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {post.images.map((url, i) => (
              <li
                key={`${url}-${i}`}
                className="relative aspect-[4/3] overflow-hidden rounded-xl ring-1 ring-border/60"
              >
                <Image
                  src={url}
                  alt={`${titleDisplay} — ${na.extraImageAltSuffix} ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(min-width: 640px) 50vw, 100vw"
                />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section
        className="mt-16 border-t border-border/70 pt-12"
        aria-labelledby="related"
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <h2
            id="related"
            className="font-heading text-xl font-semibold text-foreground"
          >
            {na.relatedHeading}
          </h2>
          <Link
            href="/news"
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            {na.backToList}
          </Link>
        </div>
        {related.length ? (
          <ul className="mt-8 grid gap-6 sm:grid-cols-2">
            {related.map((p) => (
              <li key={p.id}>
                <NewsPostCard post={p} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 text-sm text-muted-foreground">{na.relatedEmpty}</p>
        )}
      </section>

      <div className="mt-14 rounded-2xl border border-primary/20 bg-muted/30 p-8 text-center">
        <p className="font-heading text-lg font-semibold text-foreground">
          {na.ctaTitle}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">{na.ctaBody}</p>
        <Link
          href="/donate"
          className={cn(
            buttonVariants({ size: "lg" }),
            "mt-6 inline-flex shadow-glow-sm transition-shadow hover:shadow-glow"
          )}
        >
          {na.donateButton}
        </Link>
      </div>
    </article>
  );
}
