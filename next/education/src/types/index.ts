import { Author } from 'content';

export interface Instructor extends Omit<Author, 'socials'> {
  socials?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
}

export type { Course, Lesson, SyllabusSection } from './course';
export type { Post, BlogPost, Category } from './blog';
export type {
  User,
  UserRole,
  CourseProgress,
  Achievement,
  AuthState,
} from './auth';
export * from './api';
