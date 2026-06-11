'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Post, Author } from 'content';
import { cn, formatDate, getAssetPath } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PLACEHOLDER_IMAGES } from '@/lib/placeholder-images';

interface BlogCardProps {
  post: Post & { author?: Author };
  className?: string;
  priority?: boolean;
}

export function BlogCard({ post, className, priority = false }: BlogCardProps) {
  const [imgSrc, setImgSrc] = useState(getAssetPath(post.image));
  const [authorImgSrc, setAuthorImgSrc] = useState(
    post.author?.image ? getAssetPath(post.author.image) : undefined
  );

  return (
    <Card
      className={cn(
        'group overflow-hidden transition-all hover:shadow-lg',
        className
      )}
    >
      <Link href={`/blog/${post.slug}`} className="block">
        <CardHeader className="p-0">
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={imgSrc}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={priority}
              onError={() => setImgSrc(PLACEHOLDER_IMAGES.courses.default)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent transition-opacity group-hover:from-black/40" />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <Badge variant="secondary" className="capitalize">
              {post.categoryId.replace(/-/g, ' ')}
            </Badge>
            <time
              dateTime={post.date}
              className="text-xs text-muted-foreground"
            >
              {formatDate(post.date)}
            </time>
          </div>
          <h3 className="mb-2 line-clamp-2 font-serif text-xl font-bold transition-colors group-hover:text-primary">
            {post.title}
          </h3>
          <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
            {post.description}
          </p>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0">
        {post.author && (
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-8 overflow-hidden rounded-full">
              <Image
                src={
                  authorImgSrc || PLACEHOLDER_IMAGES.profiles.fallback.faculty
                }
                alt={post.author.name}
                fill
                className="object-cover"
                onError={() =>
                  setAuthorImgSrc(PLACEHOLDER_IMAGES.profiles.fallback.faculty)
                }
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium">{post.author.name}</span>
              <span className="text-[10px] text-muted-foreground">
                {post.author.role}
              </span>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
