import { expect, test, describe, mock, afterEach } from 'bun:test';
import { render, cleanup, within } from '@testing-library/react';
import * as React from 'react';
import { CourseCard } from '../course-card';
import { DemoProvider } from '../demo-provider';
import { Course } from '@/types';

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

const TEST_COURSE_TITLE = 'Test Course';

const mockCourse: Course = {
  id: '1',
  title: TEST_COURSE_TITLE,
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

describe('CourseCard', () => {
  test('renders course information correctly in grid layout', () => {
    render(
      <DemoProvider>
        <CourseCard course={mockCourse} />
      </DemoProvider>
    );
    const screen = within(document.body);

    expect(screen.getByText(TEST_COURSE_TITLE)).toBeTruthy();
    expect(screen.getByText('Development')).toBeTruthy();
    expect(screen.getByText('Beginner')).toBeTruthy();
    expect(screen.getByText('10 hours')).toBeTruthy();
    expect(screen.getByText('$99')).toBeTruthy();
  });

  test('renders course information correctly in list layout', () => {
    render(
      <DemoProvider>
        <CourseCard course={mockCourse} layout="list" />
      </DemoProvider>
    );
    const screen = within(document.body);

    expect(screen.getByText(TEST_COURSE_TITLE)).toBeTruthy();
    expect(screen.getByText('A test description')).toBeTruthy();
    expect(screen.getByText('Development')).toBeTruthy();
    expect(screen.getByText('Beginner')).toBeTruthy();
    expect(screen.getByText('10 hours')).toBeTruthy();
    expect(screen.getByText('$99')).toBeTruthy();
  });

  test('contains a link to the course details page', () => {
    render(
      <DemoProvider>
        <CourseCard course={mockCourse} />
      </DemoProvider>
    );
    const screen = within(document.body);
    const link = screen.getByRole('link', { name: /view course/i });
    expect(link.getAttribute('href')).toBe('/courses/test-course');
  });
});
