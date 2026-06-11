import { expect, test, describe } from 'bun:test';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import * as React from 'react';
import { CourseCard } from '../course-card';
import { ContactForm } from '../contact/ContactForm';
import { NewsletterForm } from '../newsletter-form';
import { FacultyCard } from '../faculty-card';
import { MainNav } from '../main-nav';
import { DemoProvider } from '../demo-provider';
import { EnrollmentModal } from '../enrollment-modal';
import { DemoModal } from '../DemoModal';
import { Course, Instructor } from '@/types';

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

const mockInstructor: Instructor = {
  id: 'jane-doe',
  name: 'Jane Doe',
  role: 'Senior Instructor',
  department: 'Computer Science',
  bio: 'Expert in React and Next.js',
  image: '/authors/jane-doe.jpg',
  socials: {
    twitter: 'https://twitter.com',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
};

describe('Accessibility Audit', () => {
  test('CourseCard should have no accessibility violations', async () => {
    const { container } = render(
      <DemoProvider>
        <CourseCard course={mockCourse} />
      </DemoProvider>
    );
    const results = await axe(container);
    // @ts-ignore
    expect(results).toHaveNoViolations();
  });

  test('DemoModal should have no accessibility violations', async () => {
    const { container } = render(
      <DemoModal
        isOpen={true}
        onClose={() => {}}
        triggerType="social"
        title="Demo Title"
        description="Demo Description"
      >
        <div>Demo Content</div>
      </DemoModal>
    );
    const results = await axe(container);
    // @ts-ignore
    expect(results).toHaveNoViolations();
  });

  test('ContactForm should have no accessibility violations', async () => {
    const { container } = render(<ContactForm />);
    const results = await axe(container);
    // @ts-ignore
    expect(results).toHaveNoViolations();
  });

  test('NewsletterForm should have no accessibility violations', async () => {
    const { container } = render(<NewsletterForm />);
    const results = await axe(container);
    // @ts-ignore
    expect(results).toHaveNoViolations();
  });

  test('FacultyCard should have no accessibility violations', async () => {
    const { container } = render(<FacultyCard instructor={mockInstructor} />);
    const results = await axe(container);
    // @ts-ignore
    expect(results).toHaveNoViolations();
  });

  test('MainNav should have no accessibility violations', async () => {
    const { container } = render(
      <DemoProvider>
        <MainNav />
      </DemoProvider>
    );
    const results = await axe(container);
    // @ts-ignore
    expect(results).toHaveNoViolations();
  });

  test('EnrollmentModal should have no accessibility violations', async () => {
    const { container } = render(<EnrollmentModal course={mockCourse} />);
    const results = await axe(container);
    // @ts-ignore
    expect(results).toHaveNoViolations();
  });
});
