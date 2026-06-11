'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { type DialogProps } from '@radix-ui/react-dialog';
import { courses, posts, authors } from 'content';
import {
  getFilteredCourses,
  getFilteredPosts,
  getFilteredAuthors,
} from '@/lib/search-utils';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Icons } from '@/components/ui/Icons';

export function CommandMenu({ ...props }: DialogProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          'relative h-8 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64'
        )}
        onClick={() => setOpen(true)}
        {...props}
      >
        <span className="hidden lg:inline-flex">
          Search for &apos;Computer Science&apos;...
        </span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search courses, faculty, or blog posts..." />
        <CommandList>
          <CommandEmpty>
            No academic records found matching your search.
          </CommandEmpty>
          <CommandGroup heading="Courses">
            {getFilteredCourses(courses).map((course) => (
              <CommandItem
                key={course.id}
                value={course.title}
                onSelect={() => {
                  runCommand(() => router.push(`/courses/${course.slug}`));
                }}
              >
                <Icons.book className="mr-2 h-4 w-4" />
                <span>{course.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Blog Posts">
            {getFilteredPosts(posts).map((post) => (
              <CommandItem
                key={post.slug}
                value={post.title}
                onSelect={() => {
                  runCommand(() => router.push(`/blog/${post.slug}`));
                }}
              >
                <Icons.fileText className="mr-2 h-4 w-4" />
                <span>{post.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Faculty">
            {getFilteredAuthors(authors).map((author) => (
              <CommandItem
                key={author.id}
                value={author.name}
                onSelect={() => {
                  runCommand(() => router.push(`/faculty#${author.id}`));
                }}
              >
                <Icons.user className="mr-2 h-4 w-4" />
                <span>{author.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
