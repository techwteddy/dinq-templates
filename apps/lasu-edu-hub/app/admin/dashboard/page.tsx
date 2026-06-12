'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { AdminOnboardingFlow } from '@/components/admin-onboarding-flow';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/admin/login');
          return;
        }

        // In a real app, check user metadata for admin status
        // For now, we'll assume if they can access this, they're admin
        setUser(session.user);
        setIsAdmin(true);

        // Check if onboarding should be shown
        const onboardingShown = localStorage.getItem('admin_onboarding_shown');
        if (onboardingShown !== 'true') {
          setShowOnboarding(true);
        }

        setLoading(false);
      } catch (error) {
        console.error('Admin check failed:', error);
        router.push('/admin/login');
      }
    };

    checkAdmin();
  }, [router, supabase.auth]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-block p-6 rounded-full bg-blue-500/20 animate-pulse">
            <svg className="w-12 h-12 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <p className="text-slate-400">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-md">
          <h1 className="text-3xl font-bold text-red-400">Access Denied</h1>
          <p className="text-slate-400">You do not have admin privileges</p>
          <Link href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const modules = [
    {
      title: 'Faculty Management',
      description: 'Add, edit, and manage faculty members',
      icon: '👨‍🏫',
      href: '/admin/faculty',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Events Management',
      description: 'Create and manage school events and seminars',
      icon: '📅',
      href: '/admin/events',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Courses Management',
      description: 'Create and manage academic courses',
      icon: '📚',
      href: '/admin/courses',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Resources Management',
      description: 'Upload and manage course materials and resources',
      icon: '📁',
      href: '/admin/resources',
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'FAQ Management',
      description: 'Create and manage frequently asked questions',
      icon: '❓',
      href: '/admin/faq',
      color: 'from-pink-500 to-pink-600'
    },
    {
      title: 'News & Announcements',
      description: 'Post news and announcements for students',
      icon: '📰',
      href: '/admin/news',
      color: 'from-cyan-500 to-cyan-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {showOnboarding && (
        <AdminOnboardingFlow onComplete={handleOnboardingComplete} />
      )}

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-slate-400 mt-1">Manage LASU STESSA Hub content</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">Logged in as:</p>
              <p className="text-white font-medium">{user?.email?.split('@')[0]}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Faculty', value: '0', icon: '👥' },
            { label: 'Courses', value: '0', icon: '📖' },
            { label: 'Events', value: '0', icon: '🎉' },
            { label: 'Active Users', value: '0', icon: '🟢' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <p className="text-slate-400 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Management Modules */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-8">Content Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, idx) => (
              <Link key={idx} href={module.href}>
                <div className="group h-full bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-xl p-8 hover:border-slate-600 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/20 cursor-pointer">
                  <div className={`text-5xl mb-4 group-hover:scale-110 transition-transform`}>{module.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{module.title}</h3>
                  <p className="text-slate-400 text-sm mb-4">{module.description}</p>
                  <div className={`inline-block px-4 py-2 rounded-lg bg-gradient-to-r ${module.color} text-white text-sm font-semibold group-hover:shadow-lg transition`}>
                    Manage →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-12 bg-slate-800/50 border border-slate-700 rounded-xl p-8">
          <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
          <div className="space-y-4">
            <p className="text-slate-400 text-center py-8">No recent activity yet</p>
          </div>
        </div>
      </main>
    </div>
  );
}
