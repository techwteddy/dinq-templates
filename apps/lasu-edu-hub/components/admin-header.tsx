'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface AdminHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Array<{ label: string; href: string }>;
}

export function AdminHeader({ title, description, breadcrumbs }: AdminHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await supabase.auth.signOut();
      router.push('/admin/login');
    }
  };

  const getBreadcrumbs = () => {
    if (breadcrumbs) return breadcrumbs;

    const segments = pathname.split('/').filter(Boolean);
    const crumbs = [{ label: 'Dashboard', href: '/admin/dashboard' }];

    if (segments.length > 2) {
      const pageType = segments[1];
      crumbs.push({
        label: pageType.charAt(0).toUpperCase() + pageType.slice(1),
        href: `/admin/${pageType}`,
      });
    }

    return crumbs;
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Top with Logout Button */}
        <div className="flex items-center justify-between mb-6">
          <div />
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-destructive text-white font-medium text-sm hover:bg-destructive/90 transition transform hover:scale-105 active:scale-95"
          >
            Logout
          </button>
        </div>

        {/* Text Breadcrumbs Only - No Buttons */}
        <div className="flex items-center gap-2 mb-4 text-sm">
          <Link
            href="/"
            className="text-slate-400 hover:text-white transition"
          >
            Home
          </Link>
          <span className="text-slate-600">/</span>
          <Link
            href="/admin/dashboard"
            className="text-slate-400 hover:text-white transition"
          >
            Dashboard
          </Link>
          {getBreadcrumbs().map((crumb, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-slate-600">/</span>
              <Link
                href={crumb.href}
                className="text-slate-400 hover:text-white transition"
              >
                {crumb.label}
              </Link>
            </div>
          ))}
        </div>

        {/* Title and Description */}
        <div>
          <h1 className="text-3xl font-bold text-white">{title}</h1>
          {description && <p className="text-slate-400 mt-1">{description}</p>}
        </div>
      </div>
    </header>
  );
}
