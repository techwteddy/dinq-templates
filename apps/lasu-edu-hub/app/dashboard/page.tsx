'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Navigation } from '@/components/navigation';
import { PremiumFooter } from '@/components/premium-footer';
import Image from 'next/image';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [savedResources, setSavedResources] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('courses');
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) return;

        setUser(authUser);

        // Get enrolled courses
        const { data: courses } = await supabase
          .from('enrollments')
          .select('*, course:courses(*)')
          .eq('student_id', authUser.id);

        if (courses) {
          setEnrolledCourses(courses);
        }

        // Get saved resources
        const { data: resources } = await supabase
          .from('saved_resources')
          .select('*')
          .eq('student_id', authUser.id);

        if (resources) {
          setSavedResources(resources);
        }
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [supabase]);

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
            <p className="text-foreground/60">Loading your dashboard...</p>
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
          <div className="flex items-center gap-8">
            <div className="flex-1 space-y-4 animate-fade-in-up">
              <h1 className="text-4xl sm:text-5xl font-bold text-primary">
                Welcome back, {user?.email?.split('@')[0]}!
              </h1>
              <p className="text-xl text-foreground/70">
                Track your courses, save resources, and manage your academic journey
              </p>
            </div>
            <div className="hidden lg:block w-32 h-32 rounded-full bg-gradient-to-br from-accent to-secondary opacity-20 animate-float-x" />
          </div>
        </div>
      </section>

      {/* Main Dashboard Content */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b-2 border-accent/20 overflow-x-auto">
            {[
              { id: 'courses', label: 'My Courses', icon: '📚' },
              { id: 'saved', label: 'Saved Resources', icon: '⭐' },
              { id: 'profile', label: 'My Profile', icon: '👤' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-bold whitespace-nowrap transition-all duration-300 border-b-4 ${activeTab === tab.id
                    ? 'border-accent text-accent bg-accent/10'
                    : 'border-transparent text-foreground/60 hover:text-accent'
                  }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-primary">
                  Enrolled Courses ({enrolledCourses.length})
                </h2>
              </div>

              {enrolledCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enrolledCourses.map((enrollment: any) => (
                    <div
                      key={enrollment.id}
                      className="group p-6 rounded-xl bg-white border-2 border-accent/20 hover:border-accent transition-all duration-300 hover:shadow-xl hover:scale-105 transform cursor-pointer"
                    >
                      {enrollment.course?.image_url && (
                        <div className="relative h-40 mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-accent/20 to-secondary/20">
                          <Image
                            src={enrollment.course.image_url}
                            alt={enrollment.course.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-primary mb-2">
                        {enrollment.course?.title}
                      </h3>
                      <p className="text-sm text-foreground/60 mb-4">
                        {enrollment.course?.code}
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-foreground/70">Status:</span>
                          <span className="px-3 py-1 rounded-full bg-accent/20 text-accent font-bold">
                            {enrollment.status}
                          </span>
                        </div>
                        {enrollment.grade && (
                          <div className="flex justify-between">
                            <span className="text-foreground/70">Grade:</span>
                            <span className="font-bold text-primary">{enrollment.grade}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-accent/5 rounded-xl border-2 border-accent/20">
                  <div className="text-6xl mb-4">📚</div>
                  <p className="text-xl text-foreground/70">No courses enrolled yet</p>
                  <p className="text-sm text-foreground/50 mt-2">Enroll in courses to see them here</p>
                </div>
              )}
            </div>
          )}

          {/* Saved Resources Tab */}
          {activeTab === 'saved' && (
            <div className="space-y-6 animate-fade-in-up">
              <h2 className="text-2xl font-bold text-primary">
                Saved Resources ({savedResources.length})
              </h2>

              {savedResources.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {savedResources.map((resource: any) => (
                    <div
                      key={resource.id}
                      className="p-6 rounded-xl bg-white border-2 border-accent/20 hover:border-accent transition-all duration-300"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <span className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-bold mb-2">
                            {resource.resource_type}
                          </span>
                          <p className="text-sm text-foreground/70 mt-2">
                            Saved on {new Date(resource.saved_at).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          className="text-accent text-2xl hover:scale-110 transition-transform"
                          title="Remove from saved"
                        >
                          ⭐
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-accent/5 rounded-xl border-2 border-accent/20">
                  <div className="text-6xl mb-4">⭐</div>
                  <p className="text-xl text-foreground/70">No saved resources yet</p>
                  <p className="text-sm text-foreground/50 mt-2">Save courses and resources to access them later</p>
                </div>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-fade-in-up">
              <h2 className="text-2xl font-bold text-primary mb-8">My Profile</h2>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-2xl border-2 border-accent/20 p-8 text-center hover:shadow-xl transition-all">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent to-secondary mx-auto mb-6 flex items-center justify-center text-4xl">
                      👤
                    </div>
                    <h3 className="text-2xl font-bold text-primary mb-2">
                      {user?.email?.split('@')[0]}
                    </h3>
                    <p className="text-foreground/70 mb-4">{user?.email}</p>
                  </div>
                </div>

                {/* Profile Stats */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-white rounded-2xl border-2 border-accent/20 p-6 hover:shadow-lg transition-all">
                    <h4 className="font-bold text-primary mb-4">Academic Summary</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-accent/10 rounded-lg">
                        <p className="text-3xl font-bold text-accent">{enrolledCourses.length}</p>
                        <p className="text-sm text-foreground/70">Courses Enrolled</p>
                      </div>
                      <div className="p-4 bg-secondary/10 rounded-lg">
                        <p className="text-3xl font-bold text-secondary">{savedResources.length}</p>
                        <p className="text-sm text-foreground/70">Saved Resources</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border-2 border-accent/20 p-6 hover:shadow-lg transition-all">
                    <h4 className="font-bold text-primary mb-4">Account Information</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-foreground/70">Email:</span>
                        <span className="font-bold">{user?.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground/70">Member Since:</span>
                        <span className="font-bold">{new Date(user?.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground/70">Account Type:</span>
                        <span className="font-bold px-3 py-1 rounded-full bg-accent/20 text-accent">Student</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <PremiumFooter />
    </div>
  );
}
