import type { Metadata } from "next";

import { NewsPageView } from "@/app/news/news-page-view";
import {
  NEWS_CATEGORY_TABS,
  tabIdToDbCategory,
} from "@/lib/constants/news-categories";
import { listPublishedPosts } from "@/lib/data/posts";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "뉴스",
  description:
    "어린이 둥지의 일상, 행사, 후원 소식, 기도 제목, 변화 이야기를 카테고리별로 확인하세요.",
};

type SearchParams = { tab?: string };

export default async function NewsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const tabRaw = searchParams.tab?.trim();
  const tabId = tabRaw && tabRaw.length > 0 ? tabRaw : "all";
  const activeTabId = NEWS_CATEGORY_TABS.some((t) => t.id === tabId)
    ? tabId
    : "all";

  const category = tabIdToDbCategory(activeTabId);
  const posts = await listPublishedPosts({ category });

  return <NewsPageView posts={posts} activeTabId={activeTabId} />;
}
