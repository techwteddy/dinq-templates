import * as React from 'react';

interface CourseLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

/**
 * Responsive layout for the Course Page.
 * Features a sticky sidebar on desktop and stack on mobile.
 */
export function CourseLayout({ children, sidebar }: CourseLayoutProps) {
  return (
    <article className="container relative py-6 lg:py-10">
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1 space-y-8">{children}</div>
        <aside className="lg:w-[350px]">
          <div className="sticky top-20">{sidebar}</div>
        </aside>
      </div>
    </article>
  );
}
