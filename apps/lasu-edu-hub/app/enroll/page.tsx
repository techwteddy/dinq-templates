'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Navigation } from '@/components/navigation';
import { PremiumFooter } from '@/components/premium-footer';
import Image from 'next/image';

export default function EnrollPage() {
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) return;

        setUser(authUser);

        // Get all courses
        const { data: courses } = await supabase
          .from('courses')
          .select('*, faculty(*)')
          .order('created_at', { ascending: false });

        if (courses) {
          setAllCourses(courses);
          setFilteredCourses(courses);
        }

        // Get user's enrolled courses
        const { data: enrollments } = await supabase
          .from('enrollments')
          .select('course_id')
          .eq('student_id', authUser.id);

        if (enrollments) {
          setEnrolledCourseIds(new Set(enrollments.map(e => e.course_id)));
        }
      } catch (error) {
        console.error('Error loading courses:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [supabase]);

  // Filter courses based on search and semester
  useEffect(() => {
    let filtered = allCourses;

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSemester !== 'all') {
      filtered = filtered.filter(course => course.semester === selectedSemester);
    }

    setFilteredCourses(filtered);
  }, [searchTerm, selectedSemester, allCourses]);

  const handleEnroll = async (courseId: string) => {
    try {
      setEnrollingId(courseId);

      const { error } = await supabase
        .from('enrollments')
        .insert([
          {
            student_id: user.id,
            course_id: courseId,
            status: 'enrolled',
          }
        ]);

      if (error) throw error;

      setEnrolledCourseIds(prev => new Set([...prev, courseId]));
    } catch (error) {
      console.error('Error enrolling:', error);
      alert('Failed to enroll in course');
    } finally {
      setEnrollingId(null);
    }
  };

  const handleUnenroll = async (courseId: string) => {
    try {
      setEnrollingId(courseId);

      const { error } = await supabase
        .from('enrollments')
        .delete()
        .eq('student_id', user.id)
        .eq('course_id', courseId);

      if (error) throw error;

      setEnrolledCourseIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(courseId);
        return newSet;
      });
    } catch (error) {
      console.error('Error unenrolling:', error);
      alert('Failed to unenroll from course');
    } finally {
      setEnrollingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="inline-block p-6 rounded-full bg-accent/20 animate-pulse">
              <svg className="w-12 h-12 text-accent animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <p className="text-foreground/60">Loading courses...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4 animate-fade-in-up">
            Browse Courses
          </h1>
          <p className="text-xl text-foreground/70 animate-fade-in-up">
            Explore and enroll in available courses for your academic journey
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white border-b border-accent/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search courses by title or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-accent/20 focus:border-accent outline-none transition"
                />
              </div>
            </div>

            {/* Semester Filter */}
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="px-4 py-2 rounded-lg border-2 border-accent/20 focus:border-accent outline-none transition"
            >
              <option value="all">All Semesters</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
              <option value="3">Semester 3</option>
              <option value="4">Semester 4</option>
            </select>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course: any) => (
                <div
                  key={course.id}
                  className="group rounded-2xl bg-white border-2 border-accent/20 overflow-hidden hover:border-accent hover:shadow-2xl transition-all duration-300 hover:scale-105 transform cursor-pointer animate-fade-in-up"
                >
                  {course.image_url && (
                    <div className="relative h-48 bg-gradient-to-br from-accent/20 to-secondary/20 overflow-hidden">
                      <Image
                        src={course.image_url}
                        alt={course.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <span className="px-3 py-1 rounded-full text-sm font-bold bg-accent/20 text-accent">
                        {course.code}
                      </span>
                      {course.faculty && (
                        <span className="text-sm text-foreground/60">{course.credits} Credits</span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-primary mb-2 line-clamp-2">
                      {course.title}
                    </h3>

                    <p className="text-sm text-foreground/70 mb-4 line-clamp-2">
                      {course.description || 'No description available'}
                    </p>

                    {course.faculty && (
                      <div className="mb-4 p-3 bg-secondary/10 rounded-lg">
                        <p className="text-xs text-foreground/60">Instructor</p>
                        <p className="font-bold text-secondary">{course.faculty.name}</p>
                      </div>
                    )}

                    <div className="flex gap-2 pt-4 border-t border-accent/20">
                      <button
                        onClick={() => {
                          if (enrolledCourseIds.has(course.id)) {
                            handleUnenroll(course.id);
                          } else {
                            handleEnroll(course.id);
                          }
                        }}
                        disabled={enrollingId === course.id}
                        className={`flex-1 py-2 px-4 rounded-lg font-bold transition-all transform hover:scale-105 active:scale-95 ${
                          enrolledCourseIds.has(course.id)
                            ? 'bg-destructive/20 text-destructive hover:bg-destructive/30'
                            : 'bg-accent text-accent-foreground hover:bg-accent/90'
                        } ${enrollingId === course.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {enrollingId === course.id ? (
                          <span className="inline-block animate-spin">⏳</span>
                        ) : enrolledCourseIds.has(course.id) ? (
                          'Enrolled ✓'
                        ) : (
                          'Enroll'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-accent/5 rounded-2xl border-2 border-accent/20">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-2xl font-bold text-primary mb-2">No courses found</p>
              <p className="text-foreground/70">Try adjusting your search filters</p>
            </div>
          )}
        </div>
      </section>

      <PremiumFooter />
    </div>
  );
}
