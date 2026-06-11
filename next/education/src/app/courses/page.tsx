import { Suspense } from 'react';
import CoursesClient from './courses-client';

export const metadata = {
  title: 'Courses',
  description: 'Explore our wide range of educational programs and courses.',
};

export default function CoursesPage() {
  return (
    <Suspense
      fallback={
        <div className="container py-8 md:py-12 lg:py-24">
          <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
            <div className="flex-1 space-y-4">
              <div className="h-10 w-48 animate-pulse rounded-md bg-muted" />
              <div className="h-6 w-96 animate-pulse rounded-md bg-muted" />
            </div>
          </div>
          <hr className="my-8" />
          <div className="flex flex-col gap-8 md:flex-row">
            <aside className="w-full md:w-64">
              <div className="h-[400px] w-full animate-pulse rounded-lg bg-muted" />
            </aside>
            <div className="flex-1">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[400px] animate-pulse rounded-xl bg-muted"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      }
    >
      <CoursesClient />
    </Suspense>
  );
}
