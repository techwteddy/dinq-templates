'use client';
// src/app/diary/page.tsx
// Daily diary page — date picker + DayView

import { useRouter } from 'next/navigation';
import { DayView } from '@/components/nutrition/DayView';

interface DiaryPageProps {
  searchParams: { date?: string };
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default function DiaryPage({ searchParams }: DiaryPageProps) {
  const router = useRouter();
  const date = searchParams.date ?? todayIso();

  return (
    <main>
      <header className="diary-header">
        <h1 className="diary-header__title">Diario</h1>
        <input
          type="date"
          defaultValue={date}
          className="diary-header__date"
          onChange={(e) => router.push(`/diary?date=${e.target.value}`)}
        />
      </header>
      <DayView date={date} />

      <style jsx>{`
        .diary-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1rem 1.25rem 0;
        }
        .diary-header__title { font-size: 1.375rem; font-weight: 700; margin: 0; }
        .diary-header__date {
          border: 1.5px solid var(--border, #e2e8f0); border-radius: 0.625rem;
          padding: 0.4rem 0.75rem; font-size: 0.875rem;
          background: var(--surface, #fff); color: var(--text, #0f172a);
        }
      `}</style>
    </main>
  );
}
