import { notFound } from 'next/navigation';
import { posts, authors } from 'content';
import Image from 'next/image';
import { Metadata } from 'next';
import Link from 'next/link';

import { MDXContent } from '@/components/mdx-components';
import { Badge } from '@/components/ui/badge';
import { formatDate, getAssetPath } from '@/lib/utils';
import { BlogCard } from '@/components/blog-card';

interface PostPageProps {
  params: {
    slug: string;
  };
}

async function getPostFromParams(params: PostPageProps['params']) {
  const slug = params?.slug;
  const post = posts.find((post) => post.slug === slug);

  if (!post) {
    return null;
  }

  const author = authors.find((author) => author.id === post.authorId);

  return {
    ...post,
    author,
  };
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const post = await getPostFromParams(params);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
  };
}

export async function generateStaticParams(): Promise<
  PostPageProps['params'][]
> {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostFromParams(params);

  if (!post) {
    notFound();
  }

  const relatedPosts = posts
    .filter((p) => p.categoryId === post.categoryId && p.slug !== post.slug)
    .slice(0, 3)
    .map((p) => ({
      ...p,
      author: authors.find((a) => a.id === p.authorId),
    }));

  return (
    <article className="container max-w-4xl py-8 md:py-12 lg:py-24">
      <div className="space-y-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <Badge variant="secondary" className="capitalize">
            {post.categoryId.replace(/-/g, ' ')}
          </Badge>
          <time dateTime={post.date} className="text-sm text-muted-foreground">
            {formatDate(post.date)}
          </time>
        </div>
        <h1 className="font-serif text-4xl font-bold lg:text-5xl">
          {post.title}
        </h1>
        <p className="text-xl text-muted-foreground">{post.description}</p>

        {post.author && (
          <div className="flex items-center justify-center gap-3 pt-4">
            <div className="relative h-12 w-12 overflow-hidden rounded-full border">
              <Image
                src={getAssetPath(post.author.image)}
                alt={post.author.name}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            <div className="text-left">
              <p className="font-medium">{post.author.name}</p>
              <p className="text-xs text-muted-foreground">
                {post.author.role}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="relative my-10 aspect-video overflow-hidden rounded-lg border bg-muted">
        <Image
          src={getAssetPath(post.image)}
          alt={post.title}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1024px) 100vw, 900px"
        />
      </div>

      <div className="prose prose-slate max-w-none dark:prose-invert">
        <MDXContent code={post.content} />
      </div>

      <hr className="my-12" />

      {/* Author Bio Section */}
      {post.author && (
        <section className="rounded-lg border bg-muted/50 p-6 md:p-8">
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-full border">
              <Image
                src={getAssetPath(post.author.image)}
                alt={post.author.name}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
            <div className="space-y-3 text-center md:text-left">
              <div>
                <h3 className="text-xl font-bold">{post.author.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {post.author.role}
                </p>
              </div>
              <p className="text-muted-foreground">{post.author.bio}</p>
              <Link
                href={`/faculty#${post.author.id}`}
                className="inline-block text-sm font-bold text-primary hover:underline"
              >
                View Full Profile
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="mt-16 space-y-8">
          <h2 className="font-serif text-3xl font-bold">Related Posts</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((p) => (
              <BlogCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
