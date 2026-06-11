import { Instructor } from './instructor';

export interface Lesson {
  id: string;
  title: string;
  duration?: string;
}

export interface SyllabusSection {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription?: string;
  price: number;
  image: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  instructorId: string;
  instructor?: Instructor;
  published: boolean;
  syllabus: SyllabusSection[];
  duration: string;
  rating?: number;
  enrolledCount?: number;
}
