import { expect, test, describe } from 'bun:test';
import { filterCourses, paginateCourses } from '../course-utils';
import { Course } from '@/types';

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Course 1',
    slug: 'course-1',
    description: 'Desc 1',
    category: 'React',
    level: 'Beginner',
    price: 0,
    instructorId: 'i1',
    image: '/img1.jpg',
    published: true,
    syllabus: [],
    duration: '10h',
  },
  {
    id: '2',
    title: 'Course 2',
    slug: 'course-2',
    description: 'Desc 2',
    category: 'Next.js',
    level: 'Intermediate',
    price: 40,
    instructorId: 'i1',
    image: '/img2.jpg',
    published: true,
    syllabus: [],
    duration: '15h',
  },
  {
    id: '3',
    title: 'Course 3',
    slug: 'course-3',
    description: 'Desc 3',
    category: 'TypeScript',
    level: 'Advanced',
    price: 150,
    instructorId: 'i2',
    image: '/img3.jpg',
    published: false,
    syllabus: [],
    duration: '20h',
  },
];

describe('course-utils', () => {
  describe('filterCourses', () => {
    test('filters by category', () => {
      const result = filterCourses(mockCourses, { category: 'React' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    test('filters by multiple categories', () => {
      const result = filterCourses(mockCourses, {
        category: ['React', 'Next.js'],
      });
      expect(result).toHaveLength(2);
    });

    test('filters by level', () => {
      const result = filterCourses(mockCourses, { level: 'Intermediate' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('2');
    });

    test('filters by price: free', () => {
      const result = filterCourses(mockCourses, { price: 'free' });
      expect(result).toHaveLength(1);
      expect(result[0].price).toBe(0);
    });

    test('filters by price: under-50', () => {
      const result = filterCourses(mockCourses, { price: 'under-50' });
      expect(result).toHaveLength(2); // 0 and 40
    });

    test('returns only published courses when no filters applied', () => {
      const result = filterCourses(mockCourses, {});
      expect(result).toHaveLength(2);
      expect(result.map((c) => c.id)).not.toContain('3');
    });
  });

  describe('paginateCourses', () => {
    test('returns first page', () => {
      const result = paginateCourses(mockCourses, 1, 2);
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('2');
    });

    test('returns second page', () => {
      const result = paginateCourses(mockCourses, 2, 2);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('3');
    });
  });
});
