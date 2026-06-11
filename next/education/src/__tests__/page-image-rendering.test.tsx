import { expect, test, describe, mock, afterEach } from 'bun:test';
import { render, cleanup, within } from '@testing-library/react';
import * as React from 'react';
import Home from '../app/page';
import AboutPage from '../app/about/page';
import { DemoProvider } from '../components/demo-provider';

afterEach(() => {
  cleanup();
});

const TEST_ID = 'next-image';

// Mock Next.js components
mock.module('next/image', () => ({
  default: ({ src, alt, className }: any) => (
    <img src={src} alt={alt} className={className} data-testid={TEST_ID} />
  ),
}));

mock.module('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

// Mock child components that might need complex providers or have their own tests
mock.module('@/components/featured-courses', () => ({
  FeaturedCourses: () => <div data-testid="featured-courses" />,
}));

mock.module('@/components/features', () => ({
  Features: () => <div data-testid="features" />,
}));

describe('Page Image Rendering', () => {
  test('Home page renders hero image correctly', () => {
    const { container } = render(
      <DemoProvider>
        <Home />
      </DemoProvider>
    );

    const images = within(container).getAllByTestId(TEST_ID);
    const heroImage = images.find(
      (img) => img.getAttribute('src') === '/images/hero-home.jpg'
    );
    expect(heroImage).toBeTruthy();
    expect(heroImage?.getAttribute('alt')).toBe('Education Platform Hero');
  });

  test('About page renders hero and content images correctly', () => {
    const { container } = render(
      <DemoProvider>
        <AboutPage />
      </DemoProvider>
    );

    const images = within(container).getAllByTestId(TEST_ID);

    const heroImage = images.find(
      (img) => img.getAttribute('src') === '/images/hero-about.jpg'
    );
    expect(heroImage).toBeTruthy();
    expect(heroImage?.getAttribute('alt')).toBe('About Our Platform');

    const missionImage = images.find(
      (img) => img.getAttribute('src') === '/images/courses/course-bus350.jpg'
    );
    expect(missionImage).toBeTruthy();
    expect(missionImage?.getAttribute('alt')).toBe('Our Library');

    const visionImage = images.find(
      (img) => img.getAttribute('src') === '/images/courses/course-edu101.jpg'
    );
    expect(visionImage).toBeTruthy();
    expect(visionImage?.getAttribute('alt')).toBe('Our Classroom');
  });
});
