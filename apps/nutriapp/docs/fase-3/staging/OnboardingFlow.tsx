'use client';
/**
 * src/components/onboarding/OnboardingFlow.tsx
 * Onboarding refinado de Fase 3.
 * 4 pasos: Bienvenida → Filosofía → Cómo funciona → Peso histórico (opcional).
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface WeightEntry {
  date: string;
  weight_kg: string;
}

// ─── Contenido de los pasos ───────────────────────────────────────────────────

const STEPS = [
  {
    id: 'welcome',
    title: 'Tu espacio personal de nutrición',
    emoji: '🥦',
    content: `Esta app es tuya y solo tuya. Sin publicidad, sin tracking externo,
sin compartir tus datos con nadie. Todo se guarda en tu base de datos personal.`,
    highlights: [
      { icon: '🔒', label: 'Privacidad total', desc: 'Sin SDKs de anuncios ni analytics intrusiva.' },
      { icon: '📤', label: 'Exporta siempre', desc: 'Tus datos son tuyos. Descárgalos cuando quieras en CSV o JSON.' },
      { icon: '🌐', label: 'Sin stores', desc: 'App web que funciona desde el navegador, instalable como PWA.' },
    ],
  },
  {
    id: 'philosophy',
    title: 'Precisión sobre estimaciones',
    emoji: '⚖️',
    content: `La mayoría de apps nutricionales sacrifican precisión por comodidad.
Esta app hace lo contrario: registra en gramos con datos oficiales del USDA (FoodData Central).`,
    highlights: [
      { icon: '⚖️', label: 'En gramos siempre', desc: 'Pesa lo que comes. Nada de "1 puñado" o "1 cucharada grande".' },
      { icon: '🏛️', label: 'Datos FDC/USDA', desc: 'Base oficial con más de 300.000 alimentos verificados.' },
      { icon: '📊', label: 'Niveles de fiabilidad', desc: 'Cada entrada tiene un indicador de confianza para que sepas cuánto fiarte del resumen del día.' },
    ],
  },
  {
    id: 'features',
    title: 'Lo que puedes hacer',
    emoji: '🚀',
    content: '',
    highlights: [
      { icon: '📓', label: 'Diario de comidas', desc: 'Registra alimentos en 4 momentos: desayuno, almuerzo, cena y snacks.' },
      { icon: '🍳', label: 'Recetas propias', desc: 'Crea recetas con ingredientes y la app calcula los macros totales y por porción.' },
      { icon: '⭐', label: 'Comidas frecuentes', desc: 'Guarda las combinaciones que repites para añadirlas con un toque.' },
      { icon: '▦', label: 'Escáner de barras', desc: 'Escanea productos envasados y los datos nutricionales se rellenan solos desde Open Food Facts.' },
      { icon: '📈', label: 'Analíticas', desc: 'Gráficos semanales y mensuales de calorías, macros, peso y micronutrientes vs DRI.' },
    ],
  },
  {
    id: 'weight',
    title: 'Importar peso histórico',
    emoji: '📉',
    content: `Si llevas tiempo registrando tu peso en otra app o en una hoja de cálculo,
puedes importar esos datos aquí. Es opcional — puedes saltarlo y empezar desde hoy.`,
    highlights: [],
  },
];

// ─── Componente principal ─────────────────────────────────────────────────────

interface OnboardingFlowProps {
  onComplete: () => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep]           = useState(0);
  const [weightRows, setWeightRows] = useState<WeightEntry[]>([{ date: '', weight_kg: '' }]);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState('');
  const router = useRouter();

  const current = STEPS[step];
  const isLast  = step === STEPS.length - 1;

  // ─── Importar peso ─────────────────────────────────────────────────────────

  async function handleImportWeight() {
    const valid = weightRows.filter(r => r.date && r.weight_kg && parseFloat(r.weight_kg) > 0);
    if (valid.length === 0) { onComplete(); return; }

    setImporting(true);
    setImportError('');
    try {
      const res = await fetch('/api/weight-logs/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries: valid.map(r => ({ logged_at: r.date, weight_kg: parseFloat(r.weight_kg) })) }),
      });
      if (!res.ok) throw new Error('Error al guardar los registros de peso');
      onComplete();
    } catch (e: unknown) {
      setImportError(e instanceof Error ? e.message : 'Error desconocido');
    } finally {
      setImporting(false);
    }
  }

  function addWeightRow() {
    setWeightRows(r => [...r, { date: '', weight_kg: '' }]);
  }

  function updateRow(i: number, field: keyof WeightEntry, val: string) {
    setWeightRows(rows => rows.map((r, idx) => idx === i ? { ...r, [field]: val } : r));
  }

  function removeRow(i: number) {
    setWeightRows(rows => rows.length > 1 ? rows.filter((_, idx) => idx !== i) : rows);
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="ob-root">
      {/* Indicador de pasos */}
      <div className="ob-steps">
        {STEPS.map((s, i) => (
          <div
            key={s.id}
            className={`ob-step-dot ${i < step ? 'done' : i === step ? 'active' : 'future'}`}
          />
        ))}
      </div>

      {/* Emoji */}
      <div className="ob-emoji">{current.emoji}</div>

      {/* Título */}
      <h1 className="ob-title">{current.title}</h1>

      {/* Descripción */}
      {current.content && (
        <p className="ob-desc">{current.content}</p>
      )}

      {/* Highlights */}
      {current.highlights.length > 0 && (
        <ul className="ob-highlights">
          {current.highlights.map(h => (
            <li key={h.label} className="ob-highlight">
              <span className="ob-hi-icon">{h.icon}</span>
              <div>
                <strong>{h.label}</strong>
                <p>{h.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Paso de peso histórico */}
      {current.id === 'weight' && (
        <div className="ob-weight-import">
          <p className="ob-weight-hint">Formato: fecha (YYYY-MM-DD) y peso en kg.</p>

          {weightRows.map((row, i) => (
            <div key={i} className="ob-weight-row">
              <input
                type="date"
                value={row.date}
                onChange={e => updateRow(i, 'date', e.target.value)}
                className="ob-input"
              />
              <input
                type="number" min="20" max="300" step="0.1"
                placeholder="kg"
                value={row.weight_kg}
                onChange={e => updateRow(i, 'weight_kg', e.target.value)}
                className="ob-input ob-input-weight"
              />
              <button className="ob-remove-row" onClick={() => removeRow(i)} title="Eliminar">✕</button>
            </div>
          ))}

          <button className="ob-add-row" onClick={addWeightRow}>+ Añadir fila</button>

          {importError && <p className="ob-import-error">{importError}</p>}
        </div>
      )}

      {/* Acciones */}
      <div className="ob-actions">
        {step > 0 && (
          <button className="btn-back" onClick={() => setStep(s => s - 1)}>
            Atrás
          </button>
        )}

        {!isLast ? (
          <button className="btn-next" onClick={() => setStep(s => s + 1)}>
            Continuar
          </button>
        ) : (
          <>
            <button
              className="btn-skip"
              onClick={onComplete}
              disabled={importing}
            >
              Saltar e ir al inicio
            </button>
            <button
              className="btn-next"
              onClick={handleImportWeight}
              disabled={importing}
            >
              {importing ? 'Guardando…' : 'Guardar y comenzar'}
            </button>
          </>
        )}
      </div>

      <style jsx>{`
        .ob-root {
          min-height: 100svh;
          background: #09090b;
          display: flex; flex-direction: column; align-items: center;
          padding: 32px 20px 40px; gap: 20px;
          max-width: 480px; margin: 0 auto;
        }

        /* Dots */
        .ob-steps { display: flex; gap: 6px; }
        .ob-step-dot {
          width: 8px; height: 8px; border-radius: 50%;
          transition: background .3s, transform .3s;
        }
        .ob-step-dot.done   { background: #4ade8088; }
        .ob-step-dot.active { background: #4ade80; transform: scale(1.3); }
        .ob-step-dot.future { background: #27272a; }

        /* Emoji */
        .ob-emoji { font-size: 56px; line-height: 1; margin-top: 8px; }

        /* Title */
        .ob-title {
          font-size: 24px; font-weight: 800; color: #f4f4f5;
          text-align: center; margin: 0;
        }

        /* Desc */
        .ob-desc {
          font-size: 14px; color: '#71717a'; line-height: 1.7;
          text-align: center; margin: 0;
          white-space: pre-line;
        }

        /* Highlights */
        .ob-highlights {
          list-style: none; padding: 0; margin: 0;
          display: flex; flex-direction: column; gap: 12px;
          width: 100%;
        }
        .ob-highlight {
          display: flex; align-items: flex-start; gap: 12px;
          background: #18181b; border: 1px solid #27272a;
          border-radius: 12px; padding: 12px 14px;
        }
        .ob-hi-icon { font-size: 22px; flex-shrink: 0; margin-top: 2px; }
        .ob-highlight strong { font-size: 14px; color: #f4f4f5; }
        .ob-highlight p { font-size: 12px; color: '#71717a'; margin: 4px 0 0; line-height: 1.5; }

        /* Weight import */
        .ob-weight-import {
          width: 100%; display: flex; flex-direction: column; gap: 10px;
        }
        .ob-weight-hint { font-size: 12px; color: '#71717a'; margin: 0; }
        .ob-weight-row {
          display: flex; gap: 8px; align-items: center;
        }
        .ob-input {
          background: #18181b; border: 1px solid #27272a; border-radius: 8px;
          padding: 8px 10px; color: '#f4f4f5'; font-size: 14px; flex: 1;
        }
        .ob-input-weight { max-width: 80px; }
        .ob-remove-row {
          background: none; border: none; color: '#71717a'; cursor: pointer;
          font-size: 14px; padding: 4px;
        }
        .ob-add-row {
          align-self: flex-start; background: none; border: 1px dashed #27272a;
          color: '#71717a'; border-radius: 8px; padding: 6px 14px;
          cursor: pointer; font-size: 13px; transition: border-color .15s;
        }
        .ob-add-row:hover { border-color: '#52525b'; color: '#a1a1aa'; }
        .ob-import-error { color: '#f87171'; font-size: 13px; margin: 0; }

        /* Actions */
        .ob-actions {
          width: 100%; margin-top: auto;
          display: flex; flex-direction: column; gap: 8px;
        }
        .btn-next {
          width: 100%; background: #4ade80; color: #000;
          border: none; border-radius: 12px; padding: 14px;
          font-weight: 700; font-size: 16px; cursor: pointer;
          transition: background .15s;
        }
        .btn-next:hover:not(:disabled) { background: #86efac; }
        .btn-next:disabled { opacity: .5; cursor: not-allowed; }
        .btn-back, .btn-skip {
          width: 100%; background: none; border: 1px solid #27272a;
          color: '#71717a'; border-radius: 12px; padding: 12px;
          font-size: 14px; cursor: pointer; transition: border-color .15s, color .15s;
        }
        .btn-back:hover, .btn-skip:hover { border-color: '#52525b'; color: '#a1a1aa'; }
        .btn-skip:disabled { opacity: .4; cursor: not-allowed; }
      `}</style>
    </div>
  );
}
