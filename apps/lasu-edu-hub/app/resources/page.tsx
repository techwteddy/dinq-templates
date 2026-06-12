'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/navigation';
import { ResourcesContent } from '@/components/resources-content';
import { ModuleLoading } from '@/components/module-loading';
import { getResources, getCourses, Resource, Course } from '@/lib/storage';

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resourcesData, coursesData] = await Promise.all([
          getResources(),
          getCourses(),
        ]);
        setResources(resourcesData);
        setCourses(coursesData);
      } catch (error) {
        console.error('[v0] Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <section className="bg-primary text-primary-foreground py-12">
          <div className="max-w-6xl mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">Resources</h1>
            <p className="text-lg opacity-90">
              Access course materials, videos, and educational content
            </p>
          </div>
        </section>
        <div className="py-20 flex items-center justify-center min-h-[60vh]">
          <ModuleLoading moduleType="resources" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Resources</h1>
          <p className="text-lg opacity-90">
            Access course materials, videos, and educational content
          </p>
        </div>
      </section>

      {/* Content */}
      <ResourcesContent initialResources={resources} initialCourses={courses} />

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="opacity-80">
            &copy; 2024 LASU STESSA. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
