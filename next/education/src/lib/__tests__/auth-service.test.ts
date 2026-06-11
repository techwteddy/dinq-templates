import { expect, test, describe, beforeEach, afterEach } from 'bun:test';
import { authService } from '../auth-service';
import { MOCK_USERS } from '../mock-auth-data';

const AUTH_STORAGE_KEY = 'eduplatform_auth_user';
const TEST_PASSWORD = 'password'; // pragma: allowlist secret
const ROLE_STUDENT = 'student';
const ROLE_INSTRUCTOR = 'instructor';
const UPDATED_NAME = 'Updated Name';

describe('authService', () => {
  beforeEach(() => {
    authService.clearStorage();
  });

  afterEach(() => {
    authService.clearStorage();
  });

  describe('login', () => {
    test('should login with valid credentials (student)', async () => {
      const studentEmail =
        MOCK_USERS.find((u) => u.role === ROLE_STUDENT)?.email ||
        'student@example.com';
      const user = await authService.login(studentEmail, TEST_PASSWORD);

      expect(user.email.toLowerCase()).toBe(studentEmail.toLowerCase());
      expect(authService.isAuthenticated()).toBe(true);
      expect(authService.getCurrentUser()?.id).toBe(user.id);
    });

    test('should login with valid credentials (instructor)', async () => {
      const instructorEmail =
        MOCK_USERS.find((u) => u.role === ROLE_INSTRUCTOR)?.email ||
        'instructor@example.com';
      const user = await authService.login(instructorEmail, TEST_PASSWORD);

      expect(user.email.toLowerCase()).toBe(instructorEmail.toLowerCase());
      expect(authService.isAuthenticated()).toBe(true);
      expect(authService.getCurrentUser()?.role).toBe(ROLE_INSTRUCTOR);
    });

    test('should throw error with invalid email', async () => {
      await expect(
        authService.login('nonexistent@example.com', TEST_PASSWORD)
      ).rejects.toThrow('Invalid email or password');
      expect(authService.isAuthenticated()).toBe(false);
    });
  });

  describe('signup', () => {
    test('should create a new student user', async () => {
      const signupData = {
        name: 'New Student',
        email: 'newstudent@example.com',
        role: ROLE_STUDENT as any,
      };
      const user = await authService.signup(signupData);

      expect(user.name).toBe(signupData.name);
      expect(user.email).toBe(signupData.email);
      expect(user.role).toBe(ROLE_STUDENT);
      expect(user.id).toBeDefined();
      expect(authService.isAuthenticated()).toBe(true);
    });

    test('should create a new instructor user', async () => {
      const signupData = {
        name: 'New Instructor',
        email: 'newinstructor@example.com',
        role: ROLE_INSTRUCTOR as any,
      };
      const user = await authService.signup(signupData);

      expect(user.role).toBe(ROLE_INSTRUCTOR);
      expect(user.teachingCourses).toEqual([
        'art110-history',
        'cs101-programming',
      ]);
      expect(authService.isAuthenticated()).toBe(true);
    });
  });

  describe('logout', () => {
    test('should clear storage and unauthenticate', async () => {
      await authService.login(MOCK_USERS[0].email, TEST_PASSWORD);
      expect(authService.isAuthenticated()).toBe(true);

      await authService.logout();
      expect(authService.isAuthenticated()).toBe(false);
      expect(authService.getCurrentUser()).toBeNull();
    });
  });

  describe('updateProfile', () => {
    test('should update user profile when authenticated', async () => {
      await authService.login(MOCK_USERS[0].email, TEST_PASSWORD);
      const updatedData = { name: UPDATED_NAME, bio: 'Updated Bio' };

      const updatedUser = await authService.updateProfile(updatedData);

      expect(updatedUser.name).toBe(UPDATED_NAME);
      expect(updatedUser.bio).toBe('Updated Bio');
      expect(authService.getCurrentUser()?.name).toBe(UPDATED_NAME);
    });

    test('should throw error when updating profile without authentication', async () => {
      await expect(authService.updateProfile({ name: 'Fail' })).rejects.toThrow(
        'Not authenticated'
      );
    });
  });

  describe('getCurrentUser', () => {
    test('should return null when no user is logged in', () => {
      expect(authService.getCurrentUser()).toBeNull();
    });

    test('should retrieve user from localStorage if set', async () => {
      const user = MOCK_USERS[0];
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));

      expect(authService.getCurrentUser()?.id).toBe(user.id);
    });

    test('should retrieve user from sessionStorage if set', async () => {
      const user = MOCK_USERS[0];
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));

      expect(authService.getCurrentUser()?.id).toBe(user.id);
    });
  });
});
