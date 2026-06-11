'use client';

import * as React from 'react';
import Link from 'next/link';
import { User } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/Icons';

interface InstructorCoursesProps {
  user: User;
}

export const InstructorCourses: React.FC<InstructorCoursesProps> = ({
  user,
}) => {
  const courses = user.teachingCourses || [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Teaching Dashboard</CardTitle>
        <Button size="sm" asChild>
          <Link href="/instructor/courses/new">
            <Icons.play className="mr-2 h-4 w-4" />
            New Course
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border bg-muted/50 p-4 text-center">
            <p className="text-2xl font-bold">{user.studentCount || 0}</p>
            <p className="text-xs text-muted-foreground">Total Students</p>
          </div>
          <div className="rounded-lg border bg-muted/50 p-4 text-center">
            <p className="text-2xl font-bold">{courses.length}</p>
            <p className="text-xs text-muted-foreground">Active Courses</p>
          </div>
          <div className="rounded-lg border bg-muted/50 p-4 text-center">
            <p className="text-2xl font-bold">{user.rating || 0}</p>
            <p className="text-xs text-muted-foreground">Avg Rating</p>
          </div>
          <div className="rounded-lg border bg-muted/50 p-4 text-center">
            <p className="text-2xl font-bold">$12.4k</p>
            <p className="text-xs text-muted-foreground">Total Revenue</p>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold">Your Courses</h4>
          {courses.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              You haven&apos;t created any courses yet.
            </p>
          ) : (
            <div className="grid gap-3">
              {courses.map((courseId) => (
                <div
                  key={courseId}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <span className="font-medium capitalize">
                    {courseId.replace(/-/g, ' ')}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/courses/${courseId}`}>View</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/instructor/courses/${courseId}/edit`}>
                        Edit
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
