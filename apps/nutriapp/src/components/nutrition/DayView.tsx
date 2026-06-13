'use client';
// src/components/nutrition/DayView.tsx
// Main daily tracking screen showing:
// - Day summary ring + macros
// - Meal logs grouped by type
// - Frequent meals suggestions
// - Add meal button

import { useState, useEffect, useCallback } from 'react';
import { AddMealLogModal } from './AddMealLogModal';
import { FrequentMeals } from './FrequentMeals';
import { ConfidenceDot } from './ConfidenceDot';
import type { MealLog, DaySummary, MealType } from '@/types/nutrition';
import { MEAL_TYPE_LABELS, MEAL_TYPE_ICONS } from '@/types/nutrition';

interface DayViewProps {
  date: string; // YYYY-MM-DD
}

const MEAL_ORDER: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

export function DayView({ date }: DayViewProps) {
  const [logs, setLogs] = useState<MealLog[]>([]);
  const [summary, setSummary] = useState<DaySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [logsRes, summaryRes] = await Promise.all([
        fetch(`/api/meal-logs?date=${date}`),
        fetch(`/api/day-summary/${date}`),
      ]);
      const logsData = await logsRes.json();
      const summaryData = await summaryRes.json();
      if (!logsRes.ok) throw new Error(logsData.error ?? 'No se pudo cargar el diario');
      if (!summaryRes.ok) throw new Error(summaryData.error ?? 'No se pudo cargar el resumen');
      setLogs(logsData.logs ?? []);
      setSummary(summaryData);
    } catch (e) {
      setLogs([]);
      setSummary(null);
      setError(e instanceof Error ? e.message : 'No se pudo cargar el diario');
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => { loadData(); }, [loadData]);

  async function handleDelete(id: string) {
    setDeletingId(id);
    await fetch(`/api/meal-logs/${id}`, { method: 'DELETE' });
    setDeletingId(null);
    loadData();
  }

  function groupByMealType(logs: MealLog[]): Record<MealType, MealLog[]> {
    return MEAL_ORDER.reduce((acc, t) => {
      acc[t] = logs.filter((l) => l.meal_type === t);
      return acc;
    }, {} as Record<MealType, MealLog[]>);
  }

  const grouped = groupByMealType(logs);
  const kcalGoal = 2000; // TODO: pull from user profile (Phase 1 integration)
  const pct = summary ? Math.min(100, (summary.total_kcal / kcalGoal) * 100) : 0;
  const radius = 46;
  const circ = 2 * Math.PI * radius;
  const dash = circ - (pct / 100) * circ;

  const reliabilityColor: Record<string, string> = {
    RELIABLE: '#22c55e',
    PARTIAL: '#f59e0b',
    UNRELIABLE: '#ef4444',
  };

  return (
    <div className="day-view">
      {loading && (
        <div className="state-card">Cargando diario...</div>
      )}

      {error && (
        <div className="state-card state-card--error">
          {error}
        </div>
      )}
      {/* ── Header ring ── */}
      <div className="summary-card">
        <svg className="ring" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} className="ring__bg" />
          <circle
            cx="50" cy="50" r={radius}
            className="ring__fill"
            strokeDasharray={`${circ}`}
            strokeDashoffset={dash}
            transform="rotate(-90 50 50)"
          />
          <text x="50" y="46" className="ring__kcal" textAnchor="middle">
            {summary ? Math.round(summary.total_kcal) : '—'}
          </text>
          <text x="50" y="58" className="ring__label" textAnchor="middle">kcal</text>
        </svg>

        <div className="macros">
          {[
            { label: 'Proteína', val: summary?.total_protein_g, unit: 'g', color: '#3b82f6' },
            { label: 'Carbos', val: summary?.total_carbs_g, unit: 'g', color: '#f59e0b' },
            { label: 'Grasas', val: summary?.total_fat_g, unit: 'g', color: '#ef4444' },
            { label: 'Fibra', val: summary?.total_fiber_g, unit: 'g', color: '#22c55e' },
          ].map((m) => (
            <div className="macro" key={m.label}>
              <span className="macro__val" style={{ color: m.color }}>
                {m.val != null ? `${m.val.toFixed(1)}${m.unit}` : '—'}
              </span>
              <span className="macro__label">{m.label}</span>
            </div>
          ))}
        </div>

        {summary?.reliability && summary.reliability !== 'RELIABLE' && (
          <div
            className="reliability-badge"
            style={{ background: `${reliabilityColor[summary.reliability]}20`, color: reliabilityColor[summary.reliability] }}
          >
            {summary.reliability === 'PARTIAL'
              ? '⚠️ Datos parcialmente confiables'
              : '⚠️ Muchas estimaciones en el registro de hoy'}
          </div>
        )}
      </div>

      {/* ── Frequent meals ── */}
      <FrequentMeals date={date} onApplied={loadData} />

      {/* ── Meals by type ── */}
      {MEAL_ORDER.map((type) => (
        <div className="meal-section" key={type}>
          <div className="meal-section__header">
            <span className="meal-section__icon">{MEAL_TYPE_ICONS[type]}</span>
            <span className="meal-section__title">{MEAL_TYPE_LABELS[type]}</span>
            <span className="meal-section__kcal">
              {grouped[type].reduce((s, l) => s + (l.kcal ?? 0), 0).toFixed(0)} kcal
            </span>
          </div>

          {grouped[type].length === 0 ? (
            <p className="meal-section__empty">Sin registros</p>
          ) : (
            <ul className="meal-list">
              {grouped[type].map((log) => (
                <li className="meal-item" key={log.id}>
                  <ConfidenceDot level={log.confidence} />
                  <div className="meal-item__info">
                    <span className="meal-item__name">
                      {log.food?.name ?? log.recipe?.name ?? 'Alimento'}
                    </span>
                    <span className="meal-item__details">
                      {log.grams}g · {log.kcal?.toFixed(0)} kcal
                    </span>
                  </div>
                  <button
                    className="meal-item__delete"
                    onClick={() => handleDelete(log.id)}
                    disabled={deletingId === log.id}
                    aria-label="Eliminar"
                  >
                    {deletingId === log.id ? '…' : '✕'}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}

      {/* ── Add button ── */}
      <button className="fab" onClick={() => setShowAddModal(true)} aria-label="Agregar comida">
        +
      </button>

      {showAddModal && (
        <AddMealLogModal
          date={date}
          onSaved={() => { setShowAddModal(false); loadData(); }}
          onClose={() => setShowAddModal(false)}
        />
      )}

      <style jsx>{`
        .day-view { padding: 1rem; display: flex; flex-direction: column; gap: 1rem; padding-bottom: 5rem; }
        .state-card {
          padding: 0.875rem 1rem;
          background: var(--surface2, #f8fafc);
          color: var(--muted, #64748b);
          border: 1px solid var(--border, #e2e8f0);
          border-radius: 0.875rem;
          font-size: 0.875rem;
        }
        .state-card--error {
          color: var(--error, #ef4444);
          border-color: color-mix(in srgb, var(--error, #ef4444) 35%, var(--border, #e2e8f0));
          background: color-mix(in srgb, var(--error, #ef4444) 10%, var(--surface2, #f8fafc));
        }
        .summary-card {
          display: flex; flex-direction: column; align-items: center; gap: 1rem;
          padding: 1.5rem; background: var(--surface, #fff);
          border-radius: 1.25rem;
          box-shadow: 0 2px 16px rgba(0,0,0,0.06);
        }
        .ring { width: 120px; height: 120px; }
        .ring__bg { fill: none; stroke: var(--border, #e2e8f0); stroke-width: 8; }
        .ring__fill {
          fill: none; stroke: var(--accent, #6366f1); stroke-width: 8;
          stroke-linecap: round; transition: stroke-dashoffset 0.5s ease;
        }
        .ring__kcal { font-size: 18px; font-weight: 700; fill: var(--text, #0f172a); }
        .ring__label { font-size: 10px; fill: var(--muted, #64748b); }
        .macros { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; width: 100%; }
        .macro { display: flex; flex-direction: column; align-items: center; }
        .macro__val { font-size: 1rem; font-weight: 700; }
        .macro__label { font-size: 0.65rem; color: var(--muted, #64748b); text-align: center; }
        .reliability-badge {
          width: 100%; text-align: center; padding: 0.5rem 1rem;
          border-radius: 0.625rem; font-size: 0.8rem; font-weight: 500;
        }
        .meal-section {
          background: var(--surface, #fff); border-radius: 1.125rem;
          overflow: hidden; box-shadow: 0 1px 8px rgba(0,0,0,0.05);
        }
        .meal-section__header {
          display: flex; align-items: center; gap: 0.5rem;
          padding: 0.875rem 1rem;
          border-bottom: 1px solid var(--border, #e2e8f0);
        }
        .meal-section__icon { font-size: 1.125rem; }
        .meal-section__title { font-weight: 600; font-size: 0.9rem; flex: 1; }
        .meal-section__kcal { font-size: 0.8rem; color: var(--muted, #64748b); font-weight: 500; }
        .meal-section__empty { padding: 0.75rem 1rem; font-size: 0.85rem; color: var(--muted, #64748b); margin: 0; }
        .meal-list { margin: 0; padding: 0; list-style: none; }
        .meal-item {
          display: flex; align-items: center; gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid var(--border, #f1f5f9);
        }
        .meal-item:last-child { border-bottom: none; }
        .meal-item__info { flex: 1; display: flex; flex-direction: column; }
        .meal-item__name { font-size: 0.875rem; font-weight: 500; }
        .meal-item__details { font-size: 0.75rem; color: var(--muted, #64748b); }
        .meal-item__delete {
          background: none; border: none; color: var(--muted, #94a3b8);
          cursor: pointer; font-size: 0.875rem; padding: 0.25rem;
        }
        .fab {
          position: fixed; bottom: 1.5rem; right: 1.5rem;
          width: 3.5rem; height: 3.5rem; border-radius: 50%;
          background: var(--accent, #6366f1); color: #fff;
          border: none; font-size: 1.75rem; line-height: 1;
          box-shadow: 0 4px 16px rgba(99,102,241,0.4);
          cursor: pointer; transition: transform 0.15s, box-shadow 0.15s;
          display: flex; align-items: center; justify-content: center;
        }
        .fab:hover { transform: scale(1.08); box-shadow: 0 6px 20px rgba(99,102,241,0.5); }
      `}</style>
    </div>
  );
}
