import { User } from '@/types';
import { MOCK_USERS } from './mock-auth-data';

const AUTH_STORAGE_KEY = 'eduplatform_auth_user';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock authentication service that simulates network delays and uses localStorage for persistence
 */
export const authService = {
  /**
   * Simulates a login request
   */
  async login(email: string, _password?: string): Promise<User> {
    await sleep(800); // Simulate network delay

    // In this mock implementation, any user in MOCK_USERS can log in with any password
    const user = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      throw new Error(
        'Invalid email or password. Hint: use student@example.com or instructor@example.com'
      );
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    }

    return user;
  },

  /**
   * Simulates a signup request
   */
  async signup(data: Partial<User> & { password?: string }): Promise<User> {
    await sleep(800);

    const newUser: User = {
      id: `user-${Math.random().toString(36).substring(2, 11)}`,
      name: data.name || 'New User',
      email: data.email || '',
      role: data.role || 'student',
      image:
        data.image ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name || 'default'}`,
      bio: data.bio || '',
      enrolledCourses: [],
      teachingCourses:
        data.role === 'instructor'
          ? ['art110-history', 'cs101-programming']
          : undefined,
      courseProgress:
        data.role === 'student'
          ? [
              {
                courseId: 'art110',
                courseTitle: 'Introduction to Art History',
                progress: 25,
                lastAccessed: new Date().toISOString(),
              },
              {
                courseId: 'cs101',
                courseTitle: 'Introduction to Computer Science',
                progress: 10,
                lastAccessed: new Date().toISOString(),
              },
            ]
          : [],
      achievements: [
        {
          id: 'welcome',
          title: 'Welcome Aboard',
          description: 'Joined the EduPlatform community.',
          icon: 'Award',
          earnedAt: new Date().toISOString(),
        },
      ],
      studentCount: data.role === 'instructor' ? 0 : undefined,
      rating: data.role === 'instructor' ? 5.0 : undefined,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    }

    return newUser;
  },

  /**
   * Simulates a social login request (Google/Apple)
   */
  async socialLogin(provider: 'google' | 'apple'): Promise<User> {
    await sleep(800);

    const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);
    const mockUser: User = {
      id: `${provider}-${Math.random().toString(36).substring(2, 11)}`,
      name: `${providerName} User`,
      email: `user@${provider}.com`,
      role: 'student', // Default to student for social login
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider}`,
      bio: `Signed up via ${providerName}`,
      enrolledCourses: [],
      courseProgress: [],
      achievements: [
        {
          id: 'welcome',
          title: 'Welcome Aboard',
          description: 'Joined the EduPlatform community.',
          icon: 'Award',
          earnedAt: new Date().toISOString(),
        },
      ],
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mockUser));
    }

    return mockUser;
  },

  /**
   * Simulates a logout request
   */
  async logout(): Promise<void> {
    await sleep(300);
    this.clearStorage();
  },

  /**
   * Simulates a profile update
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    await sleep(500);
    const currentUser = this.getCurrentUser();

    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    const updatedUser = { ...currentUser, ...data };

    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
    }

    return updatedUser;
  },

  /**
   * Retrieves the currently logged in user from storage
   */
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;

    // Check sessionStorage first, then localStorage
    const storedUser =
      sessionStorage.getItem(AUTH_STORAGE_KEY) ||
      localStorage.getItem(AUTH_STORAGE_KEY);
    if (!storedUser) return null;

    try {
      return JSON.parse(storedUser) as User;
    } catch (e) {
      console.error('Failed to parse stored user', e);
      return null;
    }
  },

  /**
   * Clears user from both storage types
   */
  clearStorage(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  },

  /**
   * Checks if a user is currently authenticated
   */
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  },
};
