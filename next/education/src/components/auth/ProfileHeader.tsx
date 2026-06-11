'use client';

import * as React from 'react';
import Image from 'next/image';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/ui/Icons';
import { useDemoModal } from '@/hooks/useDemoModal';

interface ProfileHeaderProps {
  user: User;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  const { showModal } = useDemoModal();

  const handleEditPhoto = () => {
    showModal({
      triggerType: 'feature',
      title: 'Edit Profile Photo',
      description:
        'In a real application, this would open a file uploader or camera interface to change your profile picture.',
    });
  };

  const handleEditProfile = () => {
    showModal({
      triggerType: 'form',
      title: 'Edit Profile',
      description:
        'This would open a form to update your name, bio, and other personal information.',
    });
  };

  return (
    <div className="relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="relative h-24 w-24 flex-shrink-0 self-center sm:h-32 sm:w-32">
          <Image
            src={
              user.image ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`
            }
            alt={user.name}
            fill
            className="rounded-full object-cover"
          />
          <button
            onClick={handleEditPhoto}
            className="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-primary-foreground shadow-lg hover:bg-primary/90"
            aria-label="Edit profile photo"
          >
            <Icons.camera className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-1 flex-col gap-2 text-center sm:text-left">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">{user.name}</h1>
              <div className="mt-1 flex flex-wrap justify-center gap-2 sm:justify-start">
                <Badge variant="secondary" className="capitalize">
                  {user.role}
                </Badge>
                {user.role === 'instructor' && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Icons.star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{user.rating} Instructor Rating</span>
                  </div>
                )}
              </div>
            </div>
            <Button
              onClick={handleEditProfile}
              variant="outline"
              size="sm"
              className="hidden sm:flex"
            >
              <Icons.user className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>
          <p className="mt-2 text-muted-foreground">
            {user.bio || 'No bio provided. Tell us a bit about yourself!'}
          </p>
          <Button
            onClick={handleEditProfile}
            variant="outline"
            size="sm"
            className="w-full sm:hidden"
          >
            <Icons.user className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  );
};
