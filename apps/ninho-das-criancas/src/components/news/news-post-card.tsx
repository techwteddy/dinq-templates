"use client";

import Image from "next/image";
import Link from "next/link";

import { useLocale } from "@/components/i18n/locale-provider";
import { useTranslatedText } from "@/components/i18n/use-translated-text";
import { KO_CATEGORY_TO_TAB_ID } from "@/lib/constants/news-category-ko-mapping";
import type { Post } from "@/lib/types/post";

function formatDate(iso: string | null, localeTag: string) {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat(localeTag, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

export function NewsPostCard({ post }: { post: Post }) {
  const { locale, t } = useLocale();
  const wantPt = locale === "pt";
  const dateLocale = wantPt ? "pt-BR" : "ko";

  const { text: titleDisplay, loading: titleLoading } = useTranslatedText(
    post.title,
    wantPt
  );
  const { text: summaryDisplay } = useTranslatedText(
    post.summary ?? "",
    wantPt && Boolean(post.summary?.trim())
  );

  const categoryTabId = post.category
    ? KO_CATEGORY_TO_TAB_ID[post.category]
    : undefined;
  const categoryLabel =
    categoryTabId != null
      ? (t.news.tabLabels[categoryTabId] ?? post.category)
      : post.category;

  const cardAlt = wantPt
    ? `${titleDisplay} — capa`
    : `${post.title} 대표 이미지`;

  return (
    <article>
      <Link
        href={`/news/${post.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm ring-1 ring-foreground/5 transition-shadow hover:shadow-md"
      >
        <div className="relative aspect-[16/10] shrink-0 overflow-hidden">
          {post.thumbnail_url ? (
            <Image
              src={post.thumbnail_url}
              alt={cardAlt}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-muted" aria-hidden />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
          {post.category ? (
            <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-0.5 text-xs font-medium text-foreground ring-1 ring-border/80">
              {categoryLabel}
            </span>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col p-5">
          <time
            className="text-xs text-muted-foreground"
            dateTime={post.published_at ?? undefined}
          >
            {formatDate(post.published_at, dateLocale)}
          </time>
          <h2 className="mt-2 font-heading text-lg font-semibold leading-snug text-foreground group-hover:text-primary">
            {titleDisplay}
            {titleLoading ? (
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                ({t.newsArticle.translating})
              </span>
            ) : null}
          </h2>
          {post.summary ? (
            <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
              {summaryDisplay}
            </p>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
