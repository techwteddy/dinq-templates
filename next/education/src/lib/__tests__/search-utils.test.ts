import { describe, it, expect } from 'bun:test';
import {
  getFilteredCourses,
  getFilteredPosts,
  getFilteredAuthors,
} from '../search-utils';

describe('search-utils', () => {
  describe('getFilteredCourses', () => {
    const mockCourses = [
      { id: '1', title: 'Published Course', published: true },
      { id: '2', title: 'Unpublished Course', published: false },
      { id: '3', title: 'Default Published Course' }, // published: undefined/default
    ] as any[];

    it('should return only published courses', () => {
      const results = getFilteredCourses(mockCourses);
      expect(results).toHaveLength(2);
      expect(results.map((c) => c.id)).toContain('1');
      expect(results.map((c) => c.id)).toContain('3');
      expect(results.map((c) => c.id)).not.toContain('2');
    });

    it('should handle empty input', () => {
      const results = getFilteredCourses([]);
      expect(results).toEqual([]);
    });
  });

  describe('getFilteredPosts', () => {
    it('should return all posts (for now)', () => {
      const mockPosts = [{ title: 'Post 1' }, { title: 'Post 2' }] as any[];
      const results = getFilteredPosts(mockPosts);
      expect(results).toHaveLength(2);
      expect(results).toEqual(mockPosts);
    });
  });

  describe('getFilteredAuthors', () => {
    it('should return all authors', () => {
      const mockAuthors = [{ name: 'Author 1' }, { name: 'Author 2' }] as any[];
      const results = getFilteredAuthors(mockAuthors);
      expect(results).toHaveLength(2);
      expect(results).toEqual(mockAuthors);
    });
  });
});
