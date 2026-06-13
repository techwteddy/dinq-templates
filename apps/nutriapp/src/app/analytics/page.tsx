'use client';
/**
 * src/app/(app)/analytics/page.tsx
 * Página principal de analíticas.
 */

import { useState, useEffect, useCallback } from 'react';
import { format, addWeeks, subWeeks, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import WeekChart from '@/components/analytics/WeekChart';
import MonthChart from '@/components/analytics/MonthChart';
import type { WeekAnalytics, MonthAnalytics } from '@/lib/analytics';
import { buildDRIEntries, DEFAULT_DRI } from '@/lib/analytics';

type Tab = 'week' | 'month';

export default function AnalyticsPage() {
  const [tab, setTab] = useState<Tab>('week');
  const [refDate, setRefDate] = useState(new Date());
  const [weekData, setWeekData]   = useState<WeekAnalytics | null>(null);
  const [monthData, setMonthData] = useState<MonthAnalytics | null>(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    const dateStr = format(refDate, 'yyyy-MM-dd');
    try {
      if (tab === 'week') {
        const res = await fetch(`/api/analytics/week?date=${dateStr}`);
        if (!res.ok) throw new Error(await res.text());
        setWeekData(await res.json());
      } else {
        const res = await fetch(`/api/analytics/month?date=${dateStr}`);
        if (!res.ok) throw new Error(await res.text());
        setMonthData(await res.json());
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  }, [tab, refDate]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Navegación de período
  function prev() {
    setRefDate(d => tab === 'week' ? subWeeks(d, 1) : subMonths(d, 1));
  }
  function next() {
    const now = new Date();
    setRefDate(d => {
      const next = tab === 'week' ? addWeeks(d, 1) : addMonths(d, 1);
      return next > now ? now : next;
    });
  }

  // DRI promedio semanal
  const weekDRI = weekData
    ? buildDRIEntries(
        {
          total_calcium_mg:    weekData.avg_calcium_mg,
          total_iron_mg:       weekData.avg_iron_mg,
          total_potassium_mg:  weekData.avg_potassium_mg,
          total_vitamin_d_mcg: weekData.avg_vitamin_d_mcg,
          total_fiber_g:       weekData.avg_fiber_g,
          total_sodium_mg:     0,
        },
        {
          kcal: weekData.goal_kcal,
          protein_g: 0, carbs_g: 0, fat_g: 0,
          ...DEFAULT_DRI,
        }
      )
    : undefined;

  const periodLabel = tab === 'week'
    ? weekData
      ? `${format(new Date(weekData.week_start), 'd MMM', { locale: es })} – ${format(new Date(weekData.week_end), 'd MMM yyyy', { locale: es })}`
      : format(refDate, "'Semana del' d 'de' MMMM yyyy", { locale: es })
    : format(refDate, 'MMMM yyyy', { locale: es });

  return (
    <main className="analytics-page">
      {/* ── Tabs ── */}
      <div className="tabs">
        {(['week', 'month'] as Tab[]).map(t => (
          <button
            key={t}
            className={`tab ${tab === t ? 'active' : ''}`}
            onClick={() => { setTab(t); }}
          >
            {t === 'week' ? 'Semana' : 'Mes'}
          </button>
        ))}
      </div>

      {/* ── Navegador de período ── */}
      <div className="period-nav">
        <button className="nav-arrow" onClick={prev} aria-label="Anterior">‹</button>
        <span className="period-label">{periodLabel}</span>
        <button className="nav-arrow" onClick={next} aria-label="Siguiente">›</button>
      </div>

      {/* ── Contenido ── */}
      <div className="analytics-content">
        {loading && (
          <div className="analytics-loading">
            <span className="spinner" />
            <span>Cargando datos…</span>
          </div>
        )}
        {error && !loading && (
          <div className="analytics-error">
            <p>{error}</p>
            <button onClick={fetchData}>Reintentar</button>
          </div>
        )}
        {!loading && !error && tab === 'week' && weekData && (
          <WeekChart data={weekData} dri={weekDRI} />
        )}
        {!loading && !error && tab === 'month' && monthData && (
          <MonthChart data={monthData} />
        )}
      </div>

      <style jsx>{`
        .analytics-page {
          padding: 16px; max-width: 600px; margin: 0 auto;
          display: flex; flex-direction: column; gap: 16px;
        }
        .tabs {
          display: flex; background: #111; border-radius: 10px;
          padding: 4px; gap: 4px;
        }
        .tab {
          flex: 1; background: none; border: none;
          color: #71717a; font-size: 14px; font-weight: 600;
          padding: 8px; border-radius: 7px; cursor: pointer;
          transition: background .15s, color .15s;
        }
        .tab.active { background: #18181b; color: #f4f4f5; }

        .period-nav {
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px;
        }
        .nav-arrow {
          background: #18181b; border: 1px solid #27272a;
          color: #a1a1aa; font-size: 22px; border-radius: 8px;
          padding: 4px 14px; cursor: pointer; line-height: 1;
          transition: background .15s, color .15s;
        }
        .nav-arrow:hover { background: #27272a; color: #fff; }
        .period-label {
          font-size: 15px; font-weight: 600; color: #f4f4f5;
          text-align: center; flex: 1; text-transform: capitalize;
        }

        .analytics-content { min-height: 300px; }
        .analytics-loading, .analytics-error {
          display: flex; flex-direction: column;
          align-items: center; gap: 12px; padding: 48px 0;
          color: #71717a; font-size: 14px;
        }
        .analytics-error { color: #f87171; }
        .analytics-error button {
          background: #27272a; border: none; color: #a1a1aa;
          border-radius: 8px; padding: 8px 20px; cursor: pointer;
        }
        .spinner {
          width: 24px; height: 24px; border-radius: 50%;
          border: 2px solid #27272a; border-top-color: #4ade80;
          animation: spin .7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </main>
  );
}
