'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Timer, ListChecks, Flame, User } from 'lucide-react';

const nav = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/focus', label: 'Focus', icon: Timer },
  { href: '/tasks', label: 'Tasks', icon: ListChecks },
  { href: '/habits', label: 'Habits', icon: Flame },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-slate-100 safe-bottom">
      <div className="mx-auto max-w-md">
        <ul className="flex items-center justify-around py-2">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition ${
                    active ? 'text-brand-600' : 'text-slate-400'
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${active ? 'stroke-[2.5]' : ''}`} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
