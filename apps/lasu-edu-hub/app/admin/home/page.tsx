'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function AdminHome() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminName, setAdminName] = useState('Admin');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/admin/login');
          return;
        }

        // Extract admin name from email
        const name = session.user.email?.split('@')[0] || 'Admin';
        setAdminName(name.charAt(0).toUpperCase() + name.slice(1));
        setIsAuthenticated(true);
        setLoading(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/admin/login');
      }
    };

    checkAuth();
  }, [router, supabase.auth]);

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-block p-6 rounded-full bg-accent/20 animate-pulse">
            <svg className="w-12 h-12 text-accent animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <p className="text-foreground/60">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await supabase.auth.signOut();
      router.push('/admin/login');
    }
  };

  const adminSections = [
    { title: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
    { title: 'News Management', href: '/admin/news', icon: '📰' },
    { title: 'Resources', href: '/admin/resources', icon: '📚' },
    { title: 'FAQ Management', href: '/admin/faq', icon: '❓' },
    { title: 'Faculty Management', href: '/admin/faculty', icon: '👨‍🏫' },
    { title: 'Event Management', href: '/admin/events', icon: '🎯' },
    { title: 'Course Management', href: '/admin/courses', icon: '📖' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">Admin Dashboard Home</h1>
              <p className="text-sm text-gray-600">Welcome back, {adminName}!</p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard" className="px-3 py-2 rounded-lg text-primary hover:bg-accent/10 transition-colors font-medium">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-destructive text-white font-medium text-sm hover:bg-destructive/90 transition transform hover:scale-105 active:scale-95"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-2">Welcome back, {adminName}!</h2>
          <p className="text-gray-600">Manage your content, resources, and administrative tasks from here.</p>
        </div>

        {/* Quick Access Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {adminSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group p-6 rounded-xl bg-white border-2 border-gray-200 hover:border-accent hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{section.icon}</div>
                <svg className="w-5 h-5 text-accent opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-primary group-hover:text-accent transition-colors">{section.title}</h3>
              <p className="text-sm text-gray-600 mt-1">Manage your {section.title.toLowerCase()}</p>
            </Link>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-8">
          <h3 className="text-xl font-bold text-primary mb-6">Quick Overview</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">7</div>
              <p className="text-sm text-gray-600 mt-2">Management Areas</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">∞</div>
              <p className="text-sm text-gray-600 mt-2">Content Capacity</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">100%</div>
              <p className="text-sm text-gray-600 mt-2">Control</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">24/7</div>
              <p className="text-sm text-gray-600 mt-2">Available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
