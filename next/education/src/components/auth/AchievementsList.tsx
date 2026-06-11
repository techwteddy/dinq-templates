'use client';

import * as React from 'react';
import { User } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/ui/Icons';

interface AchievementsListProps {
  user: User;
}

export const AchievementsList: React.FC<AchievementsListProps> = ({ user }) => {
  const achievements = user.achievements || [];

  if (achievements.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Achievements & Badges</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
            <Icons.award className="h-8 w-8" />
          </div>
          <p className="text-lg font-medium">No achievements yet</p>
          <p className="text-muted-foreground">
            Complete courses and participate in the community to earn badges.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Achievements & Badges</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        {achievements.map((achievement) => {
          // Map icon string to actual icon component
          const IconComponent =
            (Icons as any)[achievement.icon.toLowerCase()] || Icons.award;

          return (
            <div key={achievement.id} className="flex gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <IconComponent className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold">{achievement.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {achievement.description}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Earned: {new Date(achievement.earnedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
