'use client';
/**
 * src/components/barcode/BarcodeFlow.tsx
 * Flujo completo: botón → escáner → resultado OFF → override manual → confirmar.
 */

import { useState } from 'react';
import dynamic from 'next/dynamic';

const BarcodeScanner = dynamic(() => import('./BarcodeScanner'), { ssr: false });

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface OFFProduct {
  id: string;
  name: string;
  brand?: string;
  barcode: string;
  kcal_per_100g: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  serving_size_g?: number;
  confidence_level: number;
  has_missing_macros?: boolean;
}

export interface BarcodeFlowProps {
  /** Callback cuando el usuario confirma un producto */
  onConfirm: (product: OFFProduct, amountG: number) => void;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function BarcodeFlow({ onConfirm }: BarcodeFlowProps) {
  const [showScanner, setShowScanner] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [product, setProduct]         = useState<OFFProduct | null>(null);
  const [error, setError]             = useState('');
  const [amount, setAmount]           = useState('');
  const [overrides, setOverrides]     = useState<Partial<OFFProduct>>({});
  const [showOverride, setShowOverride] = useState(false);

  // ─── Buscar producto en OFF ───────────────────────────────────────────────

  async function handleDetected(barcode: string) {
    setShowScanner(false);
    setLoading(true);
    setError('');
    setProduct(null);

    try {
      const res = await fetch(`/api/off/${barcode}`);
      if (!res.ok) {
        const body = await res.json();
        setError(body.error ?? 'Producto no encontrado');
        return;
      }
      const data = await res.json();
      const p = data.product as OFFProduct;
      setProduct(p);
      // Si la porción está disponible, pre-llenar la cantidad
      if (p.serving_size_g) setAmount(String(p.serving_size_g));
    } catch {
      setError('Error de red al consultar Open Food Facts');
    } finally {
      setLoading(false);
    }
  }

  // ─── Override manual ──────────────────────────────────────────────────────

  async function saveOverride() {
    if (!product) return;
    try {
      const res = await fetch(`/api/off/${product.barcode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(overrides),
      });
      if (res.ok) {
        const data = await res.json();
        setProduct(data.product);
        setShowOverride(false);
        setOverrides({});
      }
    } catch {
      // silenciar — el producto local sigue siendo usable
    }
  }

  // ─── Confirmar y añadir al diario ─────────────────────────────────────────

  function handleConfirm() {
    if (!product || !amount) return;
    onConfirm({ ...product, ...overrides }, parseFloat(amount));
    // Reset
    setProduct(null);
    setAmount('');
    setOverrides({});
  }

  const effectiveProduct = product ? { ...product, ...overrides } : null;

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      {/* Botón principal */}
      <button
        className="btn-barcode"
        onClick={() => { setShowScanner(true); setError(''); setProduct(null); }}
      >
        <span className="barcode-icon">▦</span>
        Escanear producto
      </button>

      {/* Escáner de cámara */}
      {showScanner && (
        <BarcodeScanner
          onDetected={handleDetected}
          onClose={() => setShowScanner(false)}
        />
      )}

      {/* Loading */}
      {loading && (
        <div className="off-loading">
          <span className="spinner" />
          Buscando en Open Food Facts…
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="off-error">
          <p>{error}</p>
          <button onClick={() => setShowScanner(true)}>Volver a escanear</button>
        </div>
      )}

      {/* Resultado */}
      {effectiveProduct && !loading && (
        <div className="off-card">
          {/* Cabecera del producto */}
          <div className="off-card-header">
            <div>
              <h3 className="off-product-name">{effectiveProduct.name}</h3>
              {effectiveProduct.brand && (
                <span className="off-brand">{effectiveProduct.brand}</span>
              )}
              <span className="off-barcode-tag">{effectiveProduct.barcode}</span>
            </div>
            <ConfidenceBadge level={effectiveProduct.confidence_level} />
          </div>

          {/* Alerta si datos incompletos */}
          {product?.has_missing_macros && (
            <div className="off-warning">
              ⚠ Datos nutricionales incompletos en Open Food Facts.
              Puedes <button onClick={() => setShowOverride(t => !t)}>corregirlos manualmente</button>.
            </div>
          )}

          {/* Macros por 100 g */}
          <div className="off-macros">
            <MacroCell label="Calorías" value={effectiveProduct.kcal_per_100g} unit="kcal" />
            <MacroCell label="Proteínas" value={effectiveProduct.protein_g} unit="g" />
            <MacroCell label="Carbos"   value={effectiveProduct.carbs_g}   unit="g" />
            <MacroCell label="Grasas"   value={effectiveProduct.fat_g}     unit="g" />
            <MacroCell label="Fibra"    value={effectiveProduct.fiber_g}   unit="g" />
          </div>

          {/* Formulario de override manual */}
          {showOverride && (
            <div className="off-override">
              <h4>Corrección manual (por 100 g)</h4>
              {(['kcal_per_100g','protein_g','carbs_g','fat_g','fiber_g'] as const).map(key => (
                <label key={key} className="override-row">
                  <span>{LABELS[key]}</span>
                  <input
                    type="number" min="0" step="0.1"
                    defaultValue={(effectiveProduct as unknown as Record<string, number>)[key]}
                    onChange={e => setOverrides(o => ({ ...o, [key]: parseFloat(e.target.value) || 0 }))}
                  />
                </label>
              ))}
              <button className="btn-save-override" onClick={saveOverride}>Guardar corrección</button>
            </div>
          )}

          {/* Cantidad y confirmar */}
          <div className="off-amount-row">
            <label htmlFor="off-amount">Cantidad (g)</label>
            <input
              id="off-amount"
              type="number" min="1" step="1"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder={effectiveProduct.serving_size_g
                ? `Por defecto: ${effectiveProduct.serving_size_g} g`
                : 'ej. 100'}
            />
          </div>
          <button
            className="btn-add-entry"
            onClick={handleConfirm}
            disabled={!amount || parseFloat(amount) <= 0}
          >
            Añadir al diario
          </button>
        </div>
      )}

      <style jsx>{`
        .btn-barcode {
          display: flex; align-items: center; gap: 8px;
          background: #18181b; border: 1px solid #27272a;
          color: #a1a1aa; border-radius: 10px; padding: 10px 16px;
          cursor: pointer; font-size: 14px; font-weight: 500;
          transition: background .15s, color .15s;
        }
        .btn-barcode:hover { background: #27272a; color: #fff; }
        .barcode-icon { font-size: 18px; }

        .off-loading {
          display: flex; align-items: center; gap: 10px;
          color: #71717a; font-size: 14px; padding: 12px 0;
        }
        .spinner {
          width: 16px; height: 16px; border-radius: 50%;
          border: 2px solid #27272a; border-top-color: #4ade80;
          animation: spin .7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .off-error {
          background: #1c1010; border: 1px solid #7f1d1d;
          border-radius: 10px; padding: 12px 16px; color: #fca5a5; font-size: 14px;
        }
        .off-error button {
          margin-top: 6px; background: none; border: none;
          color: #f87171; text-decoration: underline; cursor: pointer; font-size: 13px;
        }

        .off-card {
          background: #18181b; border: 1px solid #27272a;
          border-radius: 14px; padding: 16px; display: flex;
          flex-direction: column; gap: 14px;
        }
        .off-card-header {
          display: flex; justify-content: space-between; align-items: flex-start;
        }
        .off-product-name { font-size: 17px; font-weight: 700; color: #f4f4f5; margin: 0 0 4px; }
        .off-brand { font-size: 13px; color: #71717a; margin-right: 8px; }
        .off-barcode-tag {
          font-size: 11px; background: #27272a; color: #a1a1aa;
          border-radius: 4px; padding: 2px 6px;
        }

        .off-warning {
          background: #1c1500; border: 1px solid #78350f;
          border-radius: 8px; padding: 10px 12px;
          color: #fbbf24; font-size: 13px;
        }
        .off-warning button {
          background: none; border: none; color: #f59e0b;
          text-decoration: underline; cursor: pointer;
        }

        .off-macros {
          display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px;
        }

        .off-override {
          background: #111; border: 1px dashed #27272a;
          border-radius: 10px; padding: 14px; display: flex; flex-direction: column; gap: 10px;
        }
        .off-override h4 { margin: 0; color: #a1a1aa; font-size: 13px; }
        .override-row {
          display: flex; justify-content: space-between; align-items: center;
          color: #71717a; font-size: 13px;
        }
        .override-row input {
          width: 90px; background: #18181b; border: 1px solid #27272a;
          border-radius: 6px; padding: 4px 8px; color: #f4f4f5; font-size: 13px;
        }
        .btn-save-override {
          align-self: flex-end; background: #27272a; border: none;
          color: #a1a1aa; border-radius: 8px; padding: 6px 16px;
          cursor: pointer; font-size: 13px; font-weight: 500;
          transition: background .15s;
        }
        .btn-save-override:hover { background: #3f3f46; }

        .off-amount-row {
          display: flex; align-items: center; gap: 12px; color: #a1a1aa; font-size: 14px;
        }
        .off-amount-row input {
          flex: 1; background: #111; border: 1px solid #27272a;
          border-radius: 8px; padding: 8px 12px; color: #f4f4f5; font-size: 15px;
        }

        .btn-add-entry {
          width: 100%; background: #4ade80; color: #000;
          border: none; border-radius: 10px; padding: 12px;
          font-weight: 700; font-size: 15px; cursor: pointer;
          transition: background .15s;
        }
        .btn-add-entry:hover:not(:disabled) { background: #86efac; }
        .btn-add-entry:disabled { opacity: .4; cursor: not-allowed; }
      `}</style>
    </>
  );
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function MacroCell({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div style={{
      background: '#111', borderRadius: 8, padding: '8px 6px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
    }}>
      <span style={{ fontSize: 11, color: '#71717a' }}>{label}</span>
      <span style={{ fontSize: 15, fontWeight: 700, color: '#f4f4f5' }}>
        {value?.toFixed(1)}
      </span>
      <span style={{ fontSize: 10, color: '#52525b' }}>{unit}/100g</span>
    </div>
  );
}

const CONFIDENCE_COLORS: Record<number, string> = {
  5: '#4ade80', 4: '#86efac', 3: '#fbbf24', 2: '#f97316', 1: '#f87171',
};
const CONFIDENCE_LABELS: Record<number, string> = {
  5: 'Alta', 4: 'Buena', 3: 'Media', 2: 'Baja', 1: 'Muy baja',
};

function ConfidenceBadge({ level }: { level: number }) {
  const color = CONFIDENCE_COLORS[level] ?? '#71717a';
  return (
    <div style={{
      background: `${color}22`, border: `1px solid ${color}44`,
      borderRadius: 6, padding: '3px 8px',
      color, fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap',
    }}>
      ● {CONFIDENCE_LABELS[level] ?? '?'} fiabilidad
    </div>
  );
}

const LABELS: Record<string, string> = {
  kcal_per_100g: 'Calorías',
  protein_g:     'Proteínas (g)',
  carbs_g:       'Carbos (g)',
  fat_g:         'Grasas (g)',
  fiber_g:       'Fibra (g)',
};
