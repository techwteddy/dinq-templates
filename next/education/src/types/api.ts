import { Course, BlogPost, Instructor } from '@/types';

export interface Repository<T> {
  getAll(): Promise<T[]>;
  getBySlug(slug: string): Promise<T | null>;
  getById(id: string): Promise<T | null>;
}

export interface CourseRepository extends Repository<Course> {
  getByCategory(category: string): Promise<Course[]>;
  getFeatured(): Promise<Course[]>;
}

export interface BlogRepository extends Repository<BlogPost> {
  getByCategory(categorySlug: string): Promise<BlogPost[]>;
  getRecent(limit?: number): Promise<BlogPost[]>;
}

export interface InstructorRepository extends Repository<Instructor> {}
