import { User } from '@/types';

export const MOCK_COURSE_PROGRESS = [
  {
    courseId: 'nextjs-basics',
    courseTitle: 'Next.js 14 Fundamentals',
    progress: 75,
    lastAccessed: '2026-01-20T10:00:00Z',
  },
  {
    courseId: 'typescript-mastery',
    courseTitle: 'TypeScript Advanced Patterns',
    progress: 30,
    lastAccessed: '2026-01-24T15:30:00Z',
  },
  {
    courseId: 'tailwind-layout-mastery',
    courseTitle: 'Mastering Tailwind CSS Layouts',
    progress: 100,
    lastAccessed: '2026-01-15T09:00:00Z',
  },
];

export const MOCK_ACHIEVEMENTS = [
  {
    id: 'ach-1',
    title: 'Fast Learner',
    description: 'Completed your first course in record time.',
    icon: 'Zap',
    earnedAt: '2026-01-10T12:00:00Z',
  },
  {
    id: 'ach-2',
    title: 'Code Ninja',
    description: 'Solved 50+ coding challenges.',
    icon: 'Shield',
    earnedAt: '2026-01-15T14:00:00Z',
  },
  {
    id: 'ach-3',
    title: 'Helper',
    description: 'Helped 10+ students in the discussion forums.',
    icon: 'Users',
    earnedAt: '2026-01-20T16:00:00Z',
  },
];

export const MOCK_USERS: User[] = [
  {
    id: 'user-student',
    name: 'Alex Student',
    email: 'student@example.com',
    role: 'student',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    bio: 'Junior web development student at EduPlatform. Passionate about Next.js and Tailwind CSS.',
    enrolledCourses: [
      'nextjs-basics',
      'typescript-mastery',
      'tailwind-layout-mastery',
    ],
    courseProgress: MOCK_COURSE_PROGRESS,
    achievements: MOCK_ACHIEVEMENTS,
  },
  {
    id: 'user-instructor',
    name: 'Dr. Sarah Smith',
    email: 'instructor@example.com',
    role: 'instructor',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    bio: 'Professor of Computer Science with 15 years of experience. Lead instructor for Advanced React and System Design.',
    teachingCourses: [
      'advanced-react',
      'system-design',
      'backend-architecture',
    ],
    studentCount: 1250,
    rating: 4.9,
    achievements: [
      {
        id: 'ach-inst-1',
        title: 'Top Rated',
        description: 'Consistently rated 4.8+ by students.',
        icon: 'Star',
        earnedAt: '2025-12-01T10:00:00Z',
      },
    ],
  },
];
