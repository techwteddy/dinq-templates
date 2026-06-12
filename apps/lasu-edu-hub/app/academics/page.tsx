'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/navigation';
import { ModuleLoading } from '@/components/module-loading';
import { getCourses, Course } from '@/lib/storage';
import Link from 'next/link';

export default function AcademicsPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses();
        setCourses(data);
      } catch (error) {
        console.error('[v0] Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(
    course =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Academics</h1>
          <p className="text-lg opacity-90">
            Browse our comprehensive course catalog
          </p>
        </div>
      </section>

      {/* Search and Content */}
      <section className="py-12 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          {/* Search Bar */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search courses by title, code, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-slate-700 rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Course Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20 min-h-[60vh]">
              <ModuleLoading moduleType="academics" />
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Link key={course.id} href={`/resources?course=${course.id}`}>
                  <div className="resource-card cursor-pointer h-full">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-primary flex-1">{course.code}</h3>
                    </div>
                    <h2 className="text-lg font-semibold mb-2">{course.title}</h2>
                    <p className="text-sm text-foreground/60 mb-3">{course.department}</p>
                    <p className="text-foreground/80 text-sm mb-4">{course.description}</p>
                    <button className="text-primary font-semibold hover:text-accent transition">
                      View Resources →
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-foreground/60">No courses found matching your search.</p>
            </div>
          )}

          {/* Total Count */}
          <div className="mt-8 text-center text-foreground/60">
            <p>Showing {filteredCourses.length} of {courses.length} courses</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="opacity-80">
            &copy; 2026 LASU STE. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
