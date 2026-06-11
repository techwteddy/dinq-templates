'use client';

import * as React from 'react';
import Link from 'next/link';
import { User } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/Icons';

interface LearningProfileProps {
  user: User;
}

export const LearningProfile: React.FC<LearningProfileProps> = ({ user }) => {
  const courses = user.courseProgress || [];

  if (courses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Learning Profile</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
            <Icons.book className="h-8 w-8" />
          </div>
          <p className="text-lg font-medium">No courses enrolled yet</p>
          <p className="mb-6 text-muted-foreground">
            Start your learning journey by browsing our courses.
          </p>
          <Button asChild>
            <Link href="/courses">Browse Courses</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Learning Profile</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/courses">
            View All <Icons.chevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="grid gap-6">
        {courses.map((course) => (
          <div key={course.courseId} className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">{course.courseTitle}</h4>
              <span className="text-sm font-medium">{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Last accessed:{' '}
              {new Date(course.lastAccessed).toLocaleDateString()}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
