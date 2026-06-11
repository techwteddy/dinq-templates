'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Course } from '@/types';
import { DemoLink } from '@/components/ui/demo-link';
import { buttonVariants } from '@/components/ui/button';
import { cn, getAssetPath } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PLACEHOLDER_IMAGES } from '@/lib/placeholder-images';

interface CourseCardProps {
  course: Course;
  layout?: 'grid' | 'list';
  priority?: boolean;
}

export function CourseCard({
  course,
  layout = 'grid',
  priority = false,
}: CourseCardProps) {
  const [imgSrc, setImgSrc] = useState(getAssetPath(course.image));

  if (layout === 'list') {
    return (
      <Card className="group flex flex-col overflow-hidden transition-all hover:shadow-lg sm:flex-row">
        <div className="relative aspect-video w-full overflow-hidden sm:w-72">
          <Image
            src={imgSrc}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, 288px"
            priority={priority}
            onError={() => setImgSrc(PLACEHOLDER_IMAGES.courses.default)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent transition-opacity group-hover:from-black/40" />
        </div>
        <div className="flex flex-1 flex-col">
          <CardContent className="flex-1 p-4">
            <div className="mb-2 flex items-start justify-between">
              <Badge variant="secondary">{course.category}</Badge>
              <span className="text-sm font-medium text-muted-foreground">
                {course.level}
              </span>
            </div>
            <h3 className="mb-2 font-serif text-xl font-bold">
              {course.title}
            </h3>
            <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
              {course.description}
            </p>
            <div className="flex items-center text-sm font-medium">
              <span>{course.duration}</span>
              <span className="mx-2">•</span>
              <span>${course.price}</span>
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between p-4 pt-0">
            <Link
              href={`/courses/${course.slug}`}
              className="text-sm font-bold hover:underline"
            >
              View Course
            </Link>
            <DemoLink
              href="/enroll"
              className={cn(buttonVariants({ size: 'sm' }))}
            >
              Enroll Now
            </DemoLink>
          </CardFooter>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={imgSrc}
            alt={course.title}
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
        <div className="mb-2 flex items-start justify-between">
          <Badge variant="secondary">{course.category}</Badge>
          <span className="text-sm font-medium text-muted-foreground">
            {course.level}
          </span>
        </div>
        <h3 className="mb-2 line-clamp-1 font-serif text-xl font-bold">
          {course.title}
        </h3>
        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
          {course.description}
        </p>
        <div className="flex items-center text-sm font-medium">
          <span>{course.duration}</span>
          <span className="mx-2">•</span>
          <span>${course.price}</span>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <Link
          href={`/courses/${course.slug}`}
          className="text-sm font-bold hover:underline"
        >
          View Course
        </Link>
        <DemoLink href="/enroll" className={cn(buttonVariants({ size: 'sm' }))}>
          Enroll Now
        </DemoLink>
      </CardFooter>
    </Card>
  );
}
