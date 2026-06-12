"use client";

import Link from "next/link";

import { useLocale } from "@/components/i18n/locale-provider";
import { NEWS_CATEGORY_TABS } from "@/lib/constants/news-categories";
import { cn } from "@/lib/utils";

type Props = {
  activeTabId: string;
};

export function NewsCategoryTabs({ activeTabId }: Props) {
  const { t } = useLocale();

  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="tablist"
      aria-label={t.news.tabsAria}
    >
      {NEWS_CATEGORY_TABS.map((tab) => {
        const href = tab.id === "all" ? "/news" : `/news?tab=${tab.id}`;
        const active = activeTabId === tab.id;
        const label = t.news.tabLabels[tab.id] ?? tab.label;

        return (
          <Link
            key={tab.id}
            href={href}
            scroll={false}
            role="tab"
            aria-selected={active}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/80 text-foreground/80 hover:bg-muted hover:text-foreground"
            )}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
