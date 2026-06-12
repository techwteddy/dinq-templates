"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { useLocale } from "@/components/i18n/locale-provider";
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

const listVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function StoriesPreviewCards({ posts }: { posts: Post[] }) {
  const reduce = useReducedMotion();
  const { locale } = useLocale();
  const dateLocale = locale === "pt" ? "pt-BR" : "ko";

  return (
    <motion.ul
      className="mt-10 grid gap-6 md:grid-cols-3"
      variants={reduce ? undefined : listVariants}
      initial={reduce ? false : "hidden"}
      whileInView={reduce ? undefined : "show"}
      viewport={{ once: true, margin: "-40px" }}
    >
      {posts.map((post) => (
        <motion.li key={post.id} variants={reduce ? undefined : itemVariants}>
          <Link
            href={`/news/${post.slug}`}
            className="group block overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm ring-1 ring-foreground/5 transition-shadow hover:shadow-md"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              {post.thumbnail_url ? (
                <Image
                  src={post.thumbnail_url}
                  alt={
                    locale === "pt"
                      ? `${post.title} — miniatura`
                      : `${post.title} 썸네일`
                  }
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  sizes="(min-width: 768px) 33vw, 100vw"
                />
              ) : (
                <div className="absolute inset-0 bg-muted" aria-hidden />
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              {post.category ? (
                <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-0.5 text-xs font-medium text-foreground ring-1 ring-border/80">
                  {post.category}
                </span>
              ) : null}
            </div>
            <div className="p-5">
              <time
                className="text-xs text-muted-foreground"
                dateTime={post.published_at ?? undefined}
              >
                {formatDate(post.published_at, dateLocale)}
              </time>
              <h3 className="mt-2 font-heading text-lg font-semibold leading-snug text-foreground group-hover:text-primary">
                {post.title}
              </h3>
              {post.summary ? (
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {post.summary}
                </p>
              ) : null}
            </div>
          </Link>
        </motion.li>
      ))}
    </motion.ul>
  );
}
