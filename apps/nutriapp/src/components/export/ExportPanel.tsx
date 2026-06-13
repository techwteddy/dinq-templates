'use client';
/**
 * src/components/export/ExportPanel.tsx
 * Panel para exportar datos del diario en CSV o JSON.
 */

import { useState } from 'react';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';

type ExportFormat = 'csv' | 'json';

const today    = new Date();
const todayStr = format(today, 'yyyy-MM-dd');

const PRESETS = [
  { label: 'Últimos 7 días',  from: format(subDays(today, 6), 'yyyy-MM-dd'), to: todayStr },
  { label: 'Últimos 30 días', from: format(subDays(today, 29), 'yyyy-MM-dd'), to: todayStr },
  { label: 'Este mes',        from: format(startOfMonth(today), 'yyyy-MM-dd'), to: format(endOfMonth(today), 'yyyy-MM-dd') },
];

export default function ExportPanel() {
  const [from, setFrom]   = useState(format(subDays(today, 29), 'yyyy-MM-dd'));
  const [to, setTo]       = useState(todayStr);
  const [fmt, setFmt]     = useState<ExportFormat>('json');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function applyPreset(p: typeof PRESETS[0]) {
    setFrom(p.from);
    setTo(p.to);
  }

  async function handleExport() {
    if (!from || !to || from > to) {
      setError('Rango de fechas inválido');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const url = `/api/export?from=${from}&to=${to}&format=${fmt}`;
      const res = await fetch(url);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? 'Error al generar la exportación');
        return;
      }
      // Trigger descarga del archivo en el navegador
      const blob     = await res.blob();
      const filename = res.headers.get('Content-Disposition')
        ?.match(/filename="(.+)"/)?.[1] ?? `export.${fmt}`;
      const link = document.createElement('a');
      link.href  = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch {
      setError('Error de red');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="export-panel">
      <h2 className="export-title">Exportar datos</h2>
      <p className="export-desc">
        Descarga tu diario en el rango de fechas elegido. Los datos incluyen
        todas las entradas, recetas y resúmenes diarios.
      </p>

      {/* Presets */}
      <div className="preset-row">
        {PRESETS.map(p => (
          <button key={p.label} className="btn-preset" onClick={() => applyPreset(p)}>
            {p.label}
          </button>
        ))}
      </div>

      {/* Fechas */}
      <div className="date-row">
        <label className="date-field">
          <span>Desde</span>
          <input type="date" value={from} max={to} onChange={e => setFrom(e.target.value)} />
        </label>
        <span className="date-sep">→</span>
        <label className="date-field">
          <span>Hasta</span>
          <input type="date" value={to} min={from} max={todayStr} onChange={e => setTo(e.target.value)} />
        </label>
      </div>

      {/* Formato */}
      <div className="format-row">
        <span className="format-label">Formato</span>
        <div className="format-options">
          {(['json', 'csv'] as ExportFormat[]).map(f => (
            <button
              key={f}
              className={`btn-format ${fmt === f ? 'active' : ''}`}
              onClick={() => setFmt(f)}
            >
              {f.toUpperCase()}
              <span className="format-hint">
                {f === 'json' ? '— estructurado' : '— tabular / Excel'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && <p className="export-error">{error}</p>}

      {/* Botón */}
      <button className="btn-export" onClick={handleExport} disabled={loading}>
        {loading ? (
          <><span className="spinner" /> Generando…</>
        ) : (
          <>⬇ Descargar {fmt.toUpperCase()}</>
        )}
      </button>

      <p className="export-privacy">
        🔒 La exportación incluye únicamente tus datos personales y se genera
        en el servidor de forma segura.
      </p>

      <style jsx>{`
        .export-panel {
          background: #18181b; border: 1px solid #27272a;
          border-radius: 16px; padding: 24px;
          display: flex; flex-direction: column; gap: 18px;
          max-width: 480px; margin: 0 auto;
        }
        .export-title { font-size: 20px; font-weight: 700; color: #f4f4f5; margin: 0; }
        .export-desc  { font-size: 13px; color: #71717a; margin: 0; line-height: 1.6; }

        .preset-row { display: flex; gap: 8px; flex-wrap: wrap; }
        .btn-preset {
          background: #111; border: 1px solid #27272a; color: #a1a1aa;
          border-radius: 8px; padding: 6px 12px; font-size: 12px;
          cursor: pointer; transition: background .15s, color .15s;
        }
        .btn-preset:hover { background: #27272a; color: #f4f4f5; }

        .date-row {
          display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
        }
        .date-field {
          display: flex; flex-direction: column; gap: 4px;
          font-size: 12px; color: #71717a;
        }
        .date-field input {
          background: #111; border: 1px solid #27272a; border-radius: 8px;
          padding: 7px 10px; color: #f4f4f5; font-size: 14px;
        }
        .date-sep { color: #52525b; font-size: 18px; margin-top: 18px; }

        .format-row { display: flex; flex-direction: column; gap: 8px; }
        .format-label { font-size: 12px; color: '#71717a'; font-weight: 600;
          text-transform: uppercase; letter-spacing: .04em; }
        .format-options { display: flex; gap: 8px; }
        .btn-format {
          flex: 1; background: #111; border: 1px solid #27272a; color: #71717a;
          border-radius: 10px; padding: 10px 14px; cursor: pointer;
          font-size: 14px; font-weight: 600;
          display: flex; flex-direction: column; align-items: center; gap: 2px;
          transition: border-color .15s, color .15s;
        }
        .btn-format.active { border-color: #4ade80; color: #4ade80; background: #0d2318; }
        .format-hint { font-size: 11px; font-weight: 400; color: #52525b; }

        .export-error { color: #f87171; font-size: 13px; margin: 0; }

        .btn-export {
          width: 100%; background: #4ade80; color: #000;
          border: none; border-radius: 10px; padding: 13px;
          font-weight: 700; font-size: 15px; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: background .15s;
        }
        .btn-export:hover:not(:disabled) { background: #86efac; }
        .btn-export:disabled { opacity: .5; cursor: not-allowed; }
        .spinner {
          width: 16px; height: 16px; border-radius: 50%;
          border: 2px solid #00000040; border-top-color: #000;
          animation: spin .7s linear infinite; display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .export-privacy { font-size: 11px; color: '#52525b'; margin: 0; text-align: center; }
      `}</style>
    </div>
  );
}
