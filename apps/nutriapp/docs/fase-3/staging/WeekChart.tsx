'use client';
/**
 * src/components/analytics/WeekChart.tsx
 * Gráfico de calorías vs meta + macros para la semana.
 * Usa recharts (ya incluido en el stack).
 */

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Cell,
} from 'recharts';
import type { WeekAnalytics, DRIEntry } from '@/lib/analytics';

// ─── Props ────────────────────────────────────────────────────────────────────

interface WeekChartProps {
  data: WeekAnalytics;
  dri?: DRIEntry[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pct(val: number, goal: number) {
  if (!goal) return 0;
  return Math.round((val / goal) * 100);
}

const BAR_COLOR_OK   = '#4ade80';
const BAR_COLOR_HIGH = '#f97316';
const BAR_COLOR_NONE = '#27272a';

// ─── Componente ───────────────────────────────────────────────────────────────

export default function WeekChart({ data, dri }: WeekChartProps) {
  const chartData = data.days.map(d => ({
    label:    d.label.charAt(0).toUpperCase() + d.label.slice(1),
    kcal:     d.kcal ?? 0,
    goal:     d.goal_kcal,
    reliable: d.is_reliable,
    has_data: d.has_data,
  }));

  return (
    <div className="week-chart-root">
      {/* ── Cabecera de resumen ── */}
      <div className="week-summary-strip">
        <SummaryCell label="Prom. calorías"   value={`${Math.round(data.avg_kcal)} kcal`} />
        <SummaryCell label="Meta"             value={`${data.goal_kcal} kcal`} />
        <SummaryCell label="Días fiables"     value={`${data.reliable_days} / ${data.total_logged_days}`} />
        <SummaryCell label="Prom. proteínas"  value={`${Math.round(data.avg_protein_g)} g`} />
      </div>

      {/* ── Barra de calorías vs meta ── */}
      <section className="week-section">
        <h3 className="section-title">Calorías vs meta diaria</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ top: 10, right: 8, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: '#71717a', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
            <ReferenceLine y={data.goal_kcal} stroke="#a1a1aa" strokeDasharray="4 3" label="" />
            <Tooltip
              contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8 }}
              labelStyle={{ color: '#a1a1aa', fontSize: 12 }}
              formatter={(v: number, _: unknown, props: { payload?: { goal: number } }) => [
                `${v} kcal (${pct(v, props.payload?.goal ?? 1)}%)`,
                'Ingerido',
              ]}
            />
            <Bar dataKey="kcal" radius={[4, 4, 0, 0]} maxBarSize={40}>
              {chartData.map((d, i) => (
                <Cell
                  key={i}
                  fill={
                    !d.has_data        ? BAR_COLOR_NONE  :
                    d.kcal > d.goal * 1.1 ? BAR_COLOR_HIGH :
                    BAR_COLOR_OK
                  }
                  opacity={d.has_data ? 1 : 0.3}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <p className="chart-legend">
          <span style={{ color: BAR_COLOR_OK  }}>■</span> Dentro de meta &nbsp;
          <span style={{ color: BAR_COLOR_HIGH }}>■</span> Exceso &nbsp;
          <span style={{ color: '#a1a1aa', fontStyle: 'italic' }}>— línea = meta</span>
        </p>
      </section>

      {/* ── Macros promedio ── */}
      <section className="week-section">
        <h3 className="section-title">Macros promedio (g)</h3>
        <div className="macro-bars">
          <MacroBar label="Proteínas" value={data.avg_protein_g} color="#818cf8" />
          <MacroBar label="Carbos"    value={data.avg_carbs_g}   color="#fbbf24" />
          <MacroBar label="Grasas"    value={data.avg_fat_g}     color="#f97316" />
          <MacroBar label="Fibra"     value={data.avg_fiber_g}   color="#4ade80" />
        </div>
      </section>

      {/* ── DRI ── */}
      {dri && dri.length > 0 && (
        <section className="week-section">
          <h3 className="section-title">DRI — promedio semanal vs recomendación</h3>
          <div className="dri-list">
            {dri.map(entry => (
              <DRIRow key={entry.key} entry={entry} />
            ))}
          </div>
        </section>
      )}

      <style jsx>{`
        .week-chart-root {
          display: flex; flex-direction: column; gap: 20px;
        }
        .week-summary-strip {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;
        }
        .week-section { display: flex; flex-direction: column; gap: 10px; }
        .section-title {
          font-size: 13px; font-weight: 600; color: #71717a;
          text-transform: uppercase; letter-spacing: .04em; margin: 0;
        }
        .chart-legend { font-size: 11px; color: #52525b; margin: 2px 0 0; }

        /* Macros */
        .macro-bars { display: flex; flex-direction: column; gap: 8px; }

        /* DRI */
        .dri-list { display: flex; flex-direction: column; gap: 10px; }
      `}</style>
    </div>
  );
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function SummaryCell({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      background: '#18181b', border: '1px solid #27272a', borderRadius: 10,
      padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      <span style={{ fontSize: 11, color: '#52525b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em' }}>
        {label}
      </span>
      <span style={{ fontSize: 16, fontWeight: 700, color: '#f4f4f5' }}>{value}</span>
    </div>
  );
}

function MacroBar({ label, value, color }: { label: string; value: number; color: string }) {
  const maxG = 400; // referencia visual
  const w    = Math.min(Math.round((value / maxG) * 100), 100);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ width: 72, fontSize: 12, color: '#71717a', flexShrink: 0 }}>{label}</span>
      <div style={{
        flex: 1, height: 8, background: '#27272a', borderRadius: 4, overflow: 'hidden',
      }}>
        <div style={{
          width: `${w}%`, height: '100%', background: color, borderRadius: 4,
          transition: 'width .4s ease',
        }} />
      </div>
      <span style={{ width: 48, fontSize: 12, color: '#a1a1aa', textAlign: 'right', flexShrink: 0 }}>
        {value.toFixed(1)} g
      </span>
    </div>
  );
}

const DRI_COLORS: Record<string, string> = {
  ok: '#4ade80', low: '#fbbf24', high: '#f87171',
};

function DRIRow({ entry }: { entry: DRIEntry }) {
  const color = DRI_COLORS[entry.status];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 13, color: '#a1a1aa' }}>{entry.label}</span>
        <span style={{ fontSize: 12, color, fontWeight: 600 }}>
          {entry.intake.toFixed(1)} / {entry.target} {entry.unit}
          &nbsp;({entry.pct}%)
        </span>
      </div>
      <div style={{ height: 6, background: '#27272a', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{
          width: `${Math.min(entry.pct, 100)}%`, height: '100%',
          background: color, borderRadius: 3, transition: 'width .4s ease',
        }} />
      </div>
    </div>
  );
}

export type { DRIEntry };
