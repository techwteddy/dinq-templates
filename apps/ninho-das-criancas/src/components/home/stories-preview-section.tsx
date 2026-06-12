"use client";

import Link from "next/link";

import { useLocale } from "@/components/i18n/locale-provider";
import { StoriesPreviewCards } from "@/components/home/stories-preview-cards";
import { SectionReveal } from "@/components/home/section-reveal";
import type { StoriesHeadingCopy } from "@/lib/data/home-page-content";
import type { Post } from "@/lib/types/post";

export function StoriesPreviewSection({
  posts,
  heading,
}: {
  posts: Post[];
  heading: StoriesHeadingCopy;
}) {
  const { t } = useLocale();

  return (
    <SectionReveal className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {heading.storiesKicker}
          </p>
          <h2 className="mt-3 text-keep-words font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {heading.storiesTitle}
          </h2>
          <p className="mt-2 max-w-[44ch] text-keep-words text-muted-foreground whitespace-pre-line">
            {heading.storiesSubtitle}
          </p>
        </div>
        <Link
          href="/news"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          {t.stories.viewAllNews}
        </Link>
      </div>

      <StoriesPreviewCards posts={posts} />
    </SectionReveal>
  );
}
