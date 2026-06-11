'use client';

import * as React from 'react';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ProfileHeader } from '@/components/auth/ProfileHeader';
import { PersonalDetails } from '@/components/auth/PersonalDetails';
import { LearningProfile } from '@/components/auth/LearningProfile';
import { AchievementsList } from '@/components/auth/AchievementsList';
import { InstructorCourses } from '@/components/auth/InstructorCourses';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/Icons';
import { useDemoModal } from '@/hooks/useDemoModal';

import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { showModal } = useDemoModal();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSettings = () => {
    showModal({
      triggerType: 'feature',
      title: 'Account Settings',
      description:
        'This would allow you to manage your password, notification preferences, and account security.',
    });
  };

  if (!user) return null;

  return (
    <ProtectedRoute>
      <div className="container py-10 sm:py-16">
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Your Profile
              </h2>
              <p className="text-muted-foreground">
                Manage your account settings and track your progress.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSettings}>
                <Icons.settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Button variant="destructive" size="sm" onClick={handleLogout}>
                <Icons.logout className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>

          <ProfileHeader user={user} />

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-1">
              <PersonalDetails user={user} />
              <AchievementsList user={user} />
            </div>
            <div className="space-y-8 lg:col-span-2">
              {user.role === 'instructor' ? (
                <InstructorCourses user={user} />
              ) : (
                <LearningProfile user={user} />
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
