'use client';

import BottomNav from '@/components/app/BottomNav';
import FocusTimer from '@/components/app/FocusTimer';

export default function FocusPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <header className="bg-white border-b border-slate-100 px-4 py-4 safe-top sticky top-0 z-30">
        <h1 className="text-lg font-bold text-slate-900 font-display">Focus Timer</h1>
        <p className="text-[11px] text-slate-500">Deep work, no distractions</p>
      </header>
      <main className="max-w-xl mx-auto px-4 pt-8">
        <FocusTimer />
      </main>
      <BottomNav />
    </div>
  );
}
