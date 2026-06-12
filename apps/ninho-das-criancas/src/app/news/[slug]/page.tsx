import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NewsArticleClient } from "@/app/news/[slug]/news-article-client";
import { listRelatedPosts, getPublishedPostBySlug } from "@/lib/data/posts";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPublishedPostBySlug(params.slug);
  if (!post) {
    return { title: "찾을 수 없음" };
  }
  return {
    title: post.title,
    description: post.summary ?? undefined,
    openGraph: post.thumbnail_url
      ? { images: [{ url: post.thumbnail_url, alt: post.title }] }
      : undefined,
  };
}

export default async function NewsArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPublishedPostBySlug(params.slug);
  if (!post) notFound();

  const related = await listRelatedPosts(
    post.slug,
    post.category ?? null,
    2
  );

  return <NewsArticleClient post={post} related={related} />;
}
