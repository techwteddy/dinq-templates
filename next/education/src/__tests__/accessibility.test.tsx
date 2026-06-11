import { expect, test, describe, mock, afterEach } from 'bun:test';
import { render, cleanup } from '@testing-library/react';
import * as React from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { CourseCard } from '../components/course-card';
import { ContactForm } from '../components/contact/ContactForm';
import { SiteHeader } from '../components/site-header';
import { SiteFooter } from '../components/site-footer';
import { DemoProvider } from '../components/demo-provider';
import { AuthProvider } from '../context/AuthContext';
import { CourseFilters } from '../components/course-filters';
import { Course } from '@/types';

// Add jest-axe types to Bun's expect
declare module 'bun:test' {
  interface Matchers<T> {
    toHaveNoViolations(): void;
  }
}

afterEach(() => {
  cleanup();
});

// Mock Next.js components
/* eslint-disable @next/next/no-img-element */
mock.module('next/image', () => ({
  default: ({ src, alt, className }: any) => (
    <img src={src} alt={alt} className={className} />
  ),
}));

mock.module('next/link', () => ({
  default: ({ children, href, className }: any) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

// Mock next/navigation
mock.module('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: mock(() => {}),
    replace: mock(() => {}),
    prefetch: mock(() => {}),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next-themes
mock.module('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: mock(() => {}),
  }),
}));

// Mock toast
mock.module('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: mock(() => {}),
  }),
}));

// @ts-ignore
expect.extend(toHaveNoViolations);

const mockCourse: Course = {
  id: '1',
  title: 'Test Course',
  slug: 'test-course',
  description: 'A test description',
  image: '/test.jpg',
  category: 'Development',
  level: 'Beginner',
  duration: '10 hours',
  price: 99,
  instructorId: 'inst-1',
  syllabus: [],
  published: true,
};

describe('Accessibility Audit', () => {
  test('CourseCard should have no accessibility violations', async () => {
    const { container } = render(
      <DemoProvider>
        <CourseCard course={mockCourse} />
      </DemoProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('ContactForm should have no accessibility violations', async () => {
    const { container } = render(<ContactForm />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('SiteHeader should have no accessibility violations', async () => {
    const { container } = render(
      <AuthProvider>
        <DemoProvider>
          <SiteHeader />
        </DemoProvider>
      </AuthProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('SiteFooter should have no accessibility violations', async () => {
    const { container } = render(
      <DemoProvider>
        <SiteFooter />
      </DemoProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('CourseFilters should have no accessibility violations', async () => {
    const { container } = render(
      <CourseFilters
        categories={['Development', 'Design']}
        levels={['Beginner', 'Advanced']}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
