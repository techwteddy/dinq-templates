'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import BottomNav from '@/components/app/BottomNav';
import AiInsightCard from '@/components/app/AiInsightCard';
import { LogOut, Zap, Timer, ListChecks, Flame, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ tasks: 0, habits: 0, focusMin: 0 });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    // Load quick stats from local cache or fetch
    Promise.all([
      fetch('/api/tasks').then((r) => (r.ok ? r.json() : { data: [] })),
      fetch('/api/habits').then((r) => (r.ok ? r.json() : { data: [] })),
      fetch('/api/focus').then((r) => (r.ok ? r.json() : { data: [] })),
    ]).then(([tasksRes, habitsRes, focusRes]) => {
      const tasks = tasksRes.data || [];
      const habits = habitsRes.data || [];
      const sessions = focusRes.data || [];
      const today = new Date().toISOString().slice(0, 10);
      const todayFocus = sessions
        .filter((s: any) => s.started_at.startsWith(today))
        .reduce((acc: number, s: any) => acc + (s.duration_seconds || 0), 0);

      setStats({
        tasks: tasks.filter((t: any) => t.status !== 'done').length,
        habits: habits.filter((h: any) => h.streak > 0).length,
        focusMin: Math.round(todayFocus / 60),
      });
    });
  }, []);

  const signOut = async () => {
    await createClient().auth.signOut();
    location.href = '/';
  };

  const quickActions = [
    { label: 'Start Focus', href: '/focus', icon: Timer, color: 'bg-brand-50 text-brand-600', desc: '25m pomodoro' },
    { label: 'Add Task', href: '/tasks', icon: ListChecks, color: 'bg-blue-50 text-blue-600', desc: 'Quick capture' },
    { label: 'Check Habits', href: '/habits', icon: Flame, color: 'bg-rose-50 text-rose-600', desc: 'Keep streaks alive' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <header className="bg-white border-b border-slate-100 px-4 py-4 flex items-center justify-between sticky top-0 z-30 safe-top">
        <div>
          <h1 className="text-lg font-bold text-slate-900 font-display">FocusFlow</h1>
          <p className="text-[11px] text-slate-500">{user?.email || 'Loading…'}</p>
        </div>
        <button
          onClick={signOut}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition"
          aria-label="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </header>

      <main className="max-w-xl mx-auto px-4 pt-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Tasks', value: stats.tasks, unit: 'open' },
            { label: 'Habits', value: stats.habits, unit: 'active' },
            { label: 'Focus', value: stats.focusMin, unit: 'min today' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-slate-100 bg-white p-3 text-center shadow-sm">
              <p className="text-2xl font-bold text-slate-900">{s.value}</p>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide mt-0.5">
                {s.label}
              </p>
              <p className="text-[10px] text-slate-400">{s.unit}</p>
            </div>
          ))}
        </div>

        {/* AI Insights */}
        <AiInsightCard />

        {/* Quick Actions */}
        <div>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Quick Actions</h2>
          <div className="space-y-2">
            {quickActions.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-sm active:scale-[0.99] transition"
              >
                <div className={`rounded-lg p-2 ${a.color}`}>
                  <a.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{a.label}</p>
                  <p className="text-[11px] text-slate-500">{a.desc}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300" />
              </Link>
            ))}
          </div>
        </div>

        {/* Motivation */}
        <div className="rounded-xl bg-brand-950 p-4 text-white">
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold">Daily Spark</p>
              <p className="text-xs text-brand-100 mt-1 leading-relaxed">
                Small steps done consistently beat giant leaps done rarely. Your 25-minute focus block
                is enough to move the needle today.
              </p>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
