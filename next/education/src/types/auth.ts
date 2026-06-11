export type UserRole = 'student' | 'instructor' | 'admin';

export interface CourseProgress {
  courseId: string;
  courseTitle: string;
  progress: number; // 0-100
  lastAccessed: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string;
  bio?: string;
  enrolledCourses?: string[];
  teachingCourses?: string[];
  courseProgress?: CourseProgress[];
  achievements?: Achievement[];
  // for instructors
  studentCount?: number;
  rating?: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
