"use client";

import { NewsCategoryTabs } from "@/components/news/news-category-tabs";
import { NewsPostCard } from "@/components/news/news-post-card";
import { useLocale } from "@/components/i18n/locale-provider";
import type { Post } from "@/lib/types/post";

export function NewsPageView({
  posts,
  activeTabId,
}: {
  posts: Post[];
  activeTabId: string;
}) {
  const { t } = useLocale();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          {t.news.kicker}
        </p>
        <h1 className="mt-2 text-keep-words font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {t.news.title}
        </h1>
        <p className="mt-3 whitespace-pre-line text-keep-words text-muted-foreground">{t.news.description}</p>
      </header>

      <div className="mt-10">
        <NewsCategoryTabs activeTabId={activeTabId} />
      </div>

      {posts.length === 0 ? (
        <p className="mt-12 text-center text-muted-foreground">
          {t.news.emptyCategory}
        </p>
      ) : (
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <li key={post.id}>
              <NewsPostCard post={post} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
