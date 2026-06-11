'use client';

import * as React from 'react';
import { User } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/ui/Icons';

interface PersonalDetailsProps {
  user: User;
}

export const PersonalDetails: React.FC<PersonalDetailsProps> = ({ user }) => {
  // Try to find the 'welcome' achievement to determine member since date
  const joinedDate = React.useMemo(() => {
    const welcomeAchievement = user.achievements?.find(
      (a) => a.id === 'welcome'
    );
    if (welcomeAchievement) {
      return new Date(welcomeAchievement.earnedAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });
    }
    return 'January 2024'; // Fallback
  }, [user.achievements]);

  const details = [
    {
      label: 'Email Address',
      value: user.email,
      icon: Icons.mail,
    },
    {
      label: 'Role',
      value: user.role.charAt(0).toUpperCase() + user.role.slice(1),
      icon: Icons.user,
    },
    {
      label: 'Member Since',
      value: joinedDate,
      icon: Icons.calendar,
    },
    {
      label: 'Timezone',
      value: 'Pacific Time (PT)', // Mock data
      icon: Icons.globe,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Personal Details</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        {details.map((detail, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <detail.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {detail.label}
              </p>
              <p className="text-base font-semibold">{detail.value}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
