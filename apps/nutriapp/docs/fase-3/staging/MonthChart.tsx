'use client';
/**
 * src/components/analytics/MonthChart.tsx
 * Gráfico de tendencias mensuales: calorías y peso.
 */

import {
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Legend,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import type { MonthAnalytics } from '@/lib/analytics';

// ─── Props ────────────────────────────────────────────────────────────────────

interface MonthChartProps {
  data: MonthAnalytics;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function MonthChart({ data }: MonthChartProps) {
  // Construir datos para recharts (un punto por día del mes)
  const chartData = data.days.map(d => ({
    label:     format(parseISO(d.date), 'd', { locale: es }),
    kcal:      d.kcal ?? undefined,
    weight_kg: d.weight_kg ?? undefined,
    reliable:  d.is_reliable,
  }));

  const hasWeight   = data.days.some(d => d.weight_kg !== null);
  const hasCalories = data.days.some(d => d.kcal !== null);

  const weightChangeText =
    data.weight_change_kg !== null
      ? (data.weight_change_kg >= 0 ? `+${data.weight_change_kg}` : `${data.weight_change_kg}`) + ' kg'
      : '—';

  return (
    <div className="month-chart-root">
      {/* ── Resumen ── */}
      <div className="month-summary-strip">
        <SummaryCell label="Prom. calorías"  value={`${Math.round(data.avg_kcal)} kcal`} />
        <SummaryCell label="Meta"            value={`${data.goal_kcal} kcal`} />
        <SummaryCell label="Peso promedio"   value={data.avg_weight_kg !== null ? `${data.avg_weight_kg} kg` : '—'} />
        <SummaryCell
          label="Cambio de peso"
          value={weightChangeText}
          highlight={
            data.weight_change_kg === null ? 'neutral' :
            data.weight_change_kg < 0      ? 'good' : 'warn'
          }
        />
        <SummaryCell label="Días fiables"    value={`${data.reliable_days} / ${data.total_logged_days}`} />
      </div>

      {/* ── Gráfico combinado ── */}
      {(hasCalories || hasWeight) && (
        <section className="month-section">
          <h3 className="section-title">Tendencia mensual</h3>
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: '#52525b', fontSize: 10 }}
                axisLine={false} tickLine={false}
                interval={4}
              />
              {/* Eje izquierdo: calorías */}
              <YAxis
                yAxisId="kcal"
                orientation="left"
                tick={{ fill: '#52525b', fontSize: 10 }}
                axisLine={false} tickLine={false}
                domain={['auto', 'auto']}
              />
              {/* Eje derecho: peso */}
              {hasWeight && (
                <YAxis
                  yAxisId="weight"
                  orientation="right"
                  tick={{ fill: '#52525b', fontSize: 10 }}
                  axisLine={false} tickLine={false}
                  domain={['auto', 'auto']}
                  unit=" kg"
                />
              )}
              <ReferenceLine yAxisId="kcal" y={data.goal_kcal} stroke="#a1a1aa" strokeDasharray="4 3" />
              <Tooltip
                contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8 }}
                labelStyle={{ color: '#71717a', fontSize: 11 }}
                formatter={(v: number, name: string) => [
                  name === 'kcal'      ? `${v} kcal`  :
                  name === 'weight_kg' ? `${v} kg`    : v,
                  name === 'kcal'      ? 'Calorías'   :
                  name === 'weight_kg' ? 'Peso'       : name,
                ]}
              />
              <Legend
                formatter={(value: string) => value === 'kcal' ? 'Calorías' : 'Peso (kg)'}
                wrapperStyle={{ fontSize: 12, color: '#71717a' }}
              />
              {hasCalories && (
                <Bar yAxisId="kcal" dataKey="kcal" fill="#4ade8044" stroke="#4ade80"
                  strokeWidth={1} radius={[3,3,0,0]} maxBarSize={12} />
              )}
              {hasWeight && (
                <Line yAxisId="weight" dataKey="weight_kg" stroke="#818cf8"
                  dot={{ fill: '#818cf8', r: 3 }} strokeWidth={2}
                  connectNulls type="monotone" />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </section>
      )}

      {/* ── Indicador de adherencia ── */}
      <section className="month-section">
        <h3 className="section-title">Adherencia al registro</h3>
        <div className="adherence-grid">
          {data.days.map(d => (
            <AdherenceDot key={d.date} day={d} />
          ))}
        </div>
        <p className="chart-legend">
          <span style={{ color: '#4ade80' }}>●</span> Fiable &nbsp;
          <span style={{ color: '#fbbf24' }}>●</span> Registrado &nbsp;
          <span style={{ color: '#27272a' }}>●</span> Sin datos
        </p>
      </section>

      <style jsx>{`
        .month-chart-root { display: flex; flex-direction: column; gap: 20px; }
        .month-summary-strip {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;
        }
        @media (min-width: 480px) {
          .month-summary-strip { grid-template-columns: repeat(5, 1fr); }
        }
        .month-section { display: flex; flex-direction: column; gap: 10px; }
        .section-title {
          font-size: 13px; font-weight: 600; color: #71717a;
          text-transform: uppercase; letter-spacing: .04em; margin: 0;
        }
        .chart-legend { font-size: 11px; color: '#52525b'; margin: 2px 0 0; }
        .adherence-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
        }
      `}</style>
    </div>
  );
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function SummaryCell({
  label, value, highlight,
}: {
  label: string;
  value: string;
  highlight?: 'good' | 'warn' | 'neutral';
}) {
  const color = highlight === 'good' ? '#4ade80' : highlight === 'warn' ? '#f97316' : '#f4f4f5';
  return (
    <div style={{
      background: '#18181b', border: '1px solid #27272a',
      borderRadius: 10, padding: '10px 12px',
      display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      <span style={{ fontSize: 10, color: '#52525b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em' }}>
        {label}
      </span>
      <span style={{ fontSize: 15, fontWeight: 700, color }}>{value}</span>
    </div>
  );
}

function AdherenceDot({ day }: { day: MonthAnalytics['days'][0] }) {
  const color =
    day.is_reliable ? '#4ade80' :
    day.kcal !== null ? '#fbbf24' :
    '#27272a';

  return (
    <div
      title={`${day.date}${day.kcal !== null ? ` — ${day.kcal} kcal` : ''}`}
      style={{
        width: '100%', aspectRatio: '1', borderRadius: 3,
        background: color, opacity: day.kcal !== null ? 1 : 0.4,
        cursor: 'default', transition: 'opacity .15s',
      }}
    />
  );
}
