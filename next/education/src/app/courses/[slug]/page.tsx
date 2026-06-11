import { notFound } from 'next/navigation';
import { courses, authors } from 'content';
import Image from 'next/image';
import { Metadata } from 'next';

import { MDXContent } from '@/components/mdx-components';
import { Icons } from '@/components/ui/Icons';
import { Badge } from '@/components/ui/badge';
import { cn, getAssetPath } from '@/lib/utils';
import { DemoLink } from '@/components/ui/demo-link';
import { CourseLayout } from '@/components/course-layout';
import { buttonVariants } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface CoursePageProps {
  params: {
    slug: string;
  };
}

async function getCourseFromParams(params: CoursePageProps['params']) {
  const slug = params?.slug;
  const course = courses.find((course) => course.slug === slug);

  if (!course) {
    return null;
  }

  const instructor = authors.find(
    (author) => author.id === course.instructorId
  );

  return {
    ...course,
    instructor,
  };
}

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  const course = await getCourseFromParams(params);

  if (!course) {
    return {};
  }

  return {
    title: course.title,
    description: course.description,
  };
}

export async function generateStaticParams(): Promise<
  CoursePageProps['params'][]
> {
  return courses.map((course) => ({
    slug: course.slug,
  }));
}

export default async function CoursePage({ params }: CoursePageProps) {
  const course = await getCourseFromParams(params);

  if (!course) {
    notFound();
  }

  return (
    <CourseLayout
      sidebar={
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-6 space-y-2">
            <p className="text-3xl font-bold">${course.price}</p>
            <p className="text-sm text-muted-foreground">Lifetime Access</p>
          </div>
          <div className="space-y-4">
            <DemoLink
              href="/enroll"
              className={cn(buttonVariants({ size: 'lg' }), 'w-full')}
            >
              Enroll Now
            </DemoLink>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Icons.check className="h-4 w-4 text-primary" />
                <span>Full access to all modules</span>
              </div>
              <div className="flex items-center gap-2">
                <Icons.check className="h-4 w-4 text-primary" />
                <span>Certificate of completion</span>
              </div>
              <div className="flex items-center gap-2">
                <Icons.check className="h-4 w-4 text-primary" />
                <span>Instructor support</span>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{course.category}</Badge>
            <Badge variant="outline">{course.level}</Badge>
          </div>
          <h1 className="font-serif text-4xl font-bold lg:text-5xl">
            {course.title}
          </h1>
          <p className="text-xl text-muted-foreground">{course.description}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            {course.instructor && (
              <div className="flex items-center gap-2">
                <div className="relative h-10 w-10 overflow-hidden rounded-full border">
                  <Image
                    src={getAssetPath(course.instructor.image)}
                    alt={course.instructor.name}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <div>
                  <p className="font-medium leading-none">
                    {course.instructor.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {course.instructor.role}
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-1 text-muted-foreground">
              <Icons.clock className="h-4 w-4" />
              <span>{course.duration}</span>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted">
          <Image
            src={getAssetPath(course.image)}
            alt={course.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 800px, 1000px"
          />
        </div>

        {/* Description / Content */}
        <div className="prose prose-slate max-w-none dark:prose-invert">
          <MDXContent code={course.content} />
        </div>

        {/* Curriculum */}
        <div className="space-y-4">
          <h2 className="font-serif text-2xl font-bold">Syllabus</h2>
          <Accordion type="single" collapsible className="w-full">
            {course.syllabus.map((section: any, index: number) => (
              <AccordionItem key={section.id} value={section.id}>
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-4">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-bold">
                      {index + 1}
                    </span>
                    <span>{section.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pl-10">
                    {section.lessons.map((lesson: any) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <Icons.play className="h-4 w-4 text-muted-foreground" />
                          <span>{lesson.title}</span>
                        </div>
                        {lesson.duration && (
                          <span className="text-xs text-muted-foreground">
                            {lesson.duration}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </CourseLayout>
  );
}
