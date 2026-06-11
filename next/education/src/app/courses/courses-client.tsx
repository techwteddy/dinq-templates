'use client';

import { courses } from 'content';
import { CourseCard } from '@/components/course-card';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { CourseFilters } from '@/components/course-filters';
import { CourseViewToggle } from '@/components/course-view-toggle';
import { filterCourses, paginateCourses } from '@/lib/course-utils';
import { useSearchParams } from 'next/navigation';

const COURSES_PER_PAGE = 6;

export default function CoursesClient() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const view = (searchParams.get('view') as 'grid' | 'list') || 'grid';

  const categoryParams = searchParams.getAll('category');
  const levelParams = searchParams.getAll('level');
  const priceParam = searchParams.get('price');

  // Extract unique categories and levels for filters
  const categories = Array.from(new Set(courses.map((c) => c.category))).sort();
  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  // Filter courses
  const filteredCourses = filterCourses(courses, {
    category: categoryParams.length > 0 ? categoryParams : undefined,
    level: levelParams.length > 0 ? levelParams : undefined,
    price: priceParam || undefined,
  });

  const totalPages = Math.ceil(filteredCourses.length / COURSES_PER_PAGE);

  const paginatedCourses = paginateCourses(
    filteredCourses,
    currentPage,
    COURSES_PER_PAGE
  );

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page > 1) {
      params.set('page', page.toString());
    } else {
      params.delete('page');
    }
    const queryString = params.toString();
    return queryString ? `/courses?${queryString}` : '/courses';
  };

  return (
    <div className="container py-8 md:py-12 lg:py-24">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="inline-block font-serif text-4xl leading-tight lg:text-5xl">
            Courses
          </h1>
          <p className="text-xl text-muted-foreground">
            Explore our wide range of educational programs and courses.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <CourseViewToggle />
        </div>
      </div>
      <hr className="my-8" />
      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="w-full md:w-64">
          <CourseFilters categories={categories} levels={levels} />
        </aside>
        <div className="flex-1">
          {paginatedCourses?.length ? (
            <>
              <div
                className={cn(
                  'grid gap-6',
                  view === 'grid'
                    ? 'sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'
                    : 'grid-cols-1'
                )}
              >
                {paginatedCourses.map((course) => (
                  <CourseCard key={course.id} course={course} layout={view} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  {currentPage > 1 && (
                    <Link
                      href={createPageUrl(currentPage - 1)}
                      className={cn(buttonVariants({ variant: 'outline' }))}
                    >
                      Previous
                    </Link>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Link
                        key={page}
                        href={createPageUrl(page)}
                        className={cn(
                          buttonVariants({
                            variant:
                              page === currentPage ? 'default' : 'outline',
                          })
                        )}
                      >
                        {page}
                      </Link>
                    )
                  )}
                  {currentPage < totalPages && (
                    <Link
                      href={createPageUrl(currentPage + 1)}
                      className={cn(buttonVariants({ variant: 'outline' }))}
                    >
                      Next
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed text-center">
              <p className="text-muted-foreground">
                No courses found matching your filters.
              </p>
              <Link
                href="/courses"
                className={cn(buttonVariants({ variant: 'link' }))}
              >
                Clear all filters
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
