import { expect, test, describe, mock, afterEach } from 'bun:test';
import { render, cleanup, within, fireEvent } from '@testing-library/react';
import * as React from 'react';
import { CourseCard } from '../components/course-card';
import { BlogCard } from '../components/blog-card';
import { FacultyCard } from '../components/faculty-card';
import { DemoProvider } from '../components/demo-provider';
import { Course, Instructor } from '@/types';
import { PLACEHOLDER_IMAGES } from '@/lib/placeholder-images';

afterEach(() => {
  cleanup();
});

const TEST_ID = 'next-image';

// Mock Next.js components
mock.module('next/image', () => ({
  default: ({ src, alt, className, onError }: any) => (
    <img
      src={src}
      alt={alt}
      className={className}
      data-testid={TEST_ID}
      onError={onError}
    />
  ),
}));

mock.module('next/link', () => ({
  default: ({ children, href, className }: any) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

const mockCourse: Course = {
  id: '1',
  title: 'Introduction to Web Development',
  slug: 'intro-web-dev',
  description: 'Learn the basics of web development.',
  image: '/images/courses/course-cs101.jpg',
  category: 'Computer Science',
  level: 'Beginner',
  duration: '20 hours',
  price: 0,
  instructorId: 'fac001',
  syllabus: [],
  published: true,
};

const mockPost: any = {
  title: '5 Study Techniques',
  slug: '5-study-techniques',
  description: 'Boost your learning efficiency.',
  date: '2026-01-24',
  image: '/images/blog/5-study-techniques.jpg',
  authorId: 'fac003',
  categoryId: 'student-success',
  tags: ['productivity'],
  author: {
    id: 'fac003',
    name: 'Dr. Sarah Johnson',
    role: 'Cognitive Scientist',
    image: '/images/faculty/faculty-3.jpg',
  },
};

const mockInstructor: Instructor = {
  id: 'fac005',
  name: 'Dr. Amira Patel',
  role: 'HCI Specialist',
  department: 'Computer Science',
  bio: 'Focuses on Human-Computer Interaction.',
  image: '/images/faculty/faculty-1.jpg',
};

describe('Image Rendering', () => {
  test('CourseCard renders course image correctly', () => {
    const { container } = render(
      <DemoProvider>
        <CourseCard course={mockCourse} />
      </DemoProvider>
    );

    const img = within(container).getByTestId(TEST_ID);
    expect(img.getAttribute('src')).toBe(mockCourse.image);
    expect(img.getAttribute('alt')).toBe(mockCourse.title);
  });

  test('CourseCard uses fallback image on error', () => {
    const { container } = render(
      <DemoProvider>
        <CourseCard course={{ ...mockCourse, image: '/non-existent.jpg' }} />
      </DemoProvider>
    );

    const img = within(container).getByTestId(TEST_ID);
    fireEvent.error(img);
    expect(img.getAttribute('src')).toBe(PLACEHOLDER_IMAGES.courses.default);
  });

  test('BlogCard renders cover and author images correctly', () => {
    const { container } = render(
      <DemoProvider>
        <BlogCard post={mockPost} />
      </DemoProvider>
    );

    const images = within(container).getAllByTestId(TEST_ID);
    expect(images[0].getAttribute('src')).toBe(mockPost.image);
    expect(images[1].getAttribute('src')).toBe(mockPost.author.image);
  });

  test('FacultyCard renders instructor image correctly', () => {
    const { container } = render(<FacultyCard instructor={mockInstructor} />);

    const img = within(container).getByTestId(TEST_ID);
    expect(img.getAttribute('src')).toBe(mockInstructor.image);
    expect(img.getAttribute('alt')).toBe(mockInstructor.name);
  });

  test('FacultyCard uses fallback image on error', () => {
    const { container } = render(
      <FacultyCard
        instructor={{ ...mockInstructor, image: '/non-existent.jpg' }}
      />
    );

    const img = within(container).getByTestId(TEST_ID);
    fireEvent.error(img);
    expect(img.getAttribute('src')).toBe(
      PLACEHOLDER_IMAGES.profiles.fallback.faculty
    );
  });
});
