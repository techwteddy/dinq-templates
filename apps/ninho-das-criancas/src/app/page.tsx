import { HomePageClient } from "@/components/home/home-page-client";
import { getHomeMarketingContent } from "@/lib/data/home-page-content";
import { getLatestPublishedPosts } from "@/lib/data/posts";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "소개",
  description:
    "어린이 둥지(Ninho das Crianças) 미션, 하루의 흐름, 제공 프로그램, 최신 소식을 한눈에 만나 보세요.",
};

export default async function HomePage() {
  const posts = await getLatestPublishedPosts(3);
  const marketing = await getHomeMarketingContent();

  return <HomePageClient marketing={marketing} posts={posts} />;
}
