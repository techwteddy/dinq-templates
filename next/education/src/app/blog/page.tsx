'use client';

import { useState } from 'react';
import { posts, authors } from 'content';
import { BlogCard } from '@/components/blog-card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  // Join posts with authors
  const postsWithAuthors = posts
    .map((post) => ({
      ...post,
      author: authors.find((author) => author.id === post.authorId),
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Extract unique categories
  const categories = [
    'all',
    ...Array.from(new Set(posts.map((post) => post.categoryId))).sort(),
  ];

  const filteredPosts =
    activeCategory === 'all'
      ? postsWithAuthors
      : postsWithAuthors.filter((post) => post.categoryId === activeCategory);

  return (
    <div className="container py-8 md:py-12 lg:py-24">
      <div className="flex flex-col items-center gap-4 text-center md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="inline-block font-serif text-4xl leading-tight lg:text-5xl">
            Academy Blog
          </h1>
          <p className="max-w-[800px] text-xl text-muted-foreground">
            Insights, trends, and success stories from our academic community.
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? 'default' : 'outline'}
            onClick={() => setActiveCategory(category)}
            className={cn('rounded-full capitalize')}
          >
            {category.replace(/-/g, ' ')}
          </Button>
        ))}
      </div>

      <hr className="my-8" />

      {filteredPosts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-lg text-muted-foreground">
            No blog posts found in this category.
          </p>
        </div>
      )}
    </div>
  );
}
