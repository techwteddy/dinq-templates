'use client';
// src/components/nutrition/AddMealLogModal.tsx
// Modal to add a new meal log entry.
// Flow: select meal type → search food or recipe → enter grams → save

import { useState } from 'react';
import { FoodSearch } from './FoodSearch';
import BarcodeFlow from '@/components/barcode/BarcodeFlow';
import type { FoodMaster, MealType } from '@/types/nutrition';
import { MEAL_TYPE_LABELS, MEAL_TYPE_ICONS } from '@/types/nutrition';

interface AddMealLogModalProps {
  date: string;          // YYYY-MM-DD
  onSaved: () => void;
  onClose: () => void;
}

const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

export function AddMealLogModal({ date, onSaved, onClose }: AddMealLogModalProps) {
  const [step, setStep] = useState<'type' | 'food' | 'grams'>('type');
  const [mealType, setMealType] = useState<MealType>('breakfast');
  const [selectedFood, setSelectedFood] = useState<FoodMaster | null>(null);
  const [grams, setGrams] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleFoodSelect(food: FoodMaster) {
    setSelectedFood(food);
    setStep('grams');
  }

  function handleBarcodeConfirm(
    product: {
      id: string;
      name: string;
      barcode: string;
      kcal_per_100g: number;
      protein_g: number;
      carbs_g: number;
      fat_g: number;
      fiber_g: number;
    },
    amountG: number
  ) {
    setSelectedFood({
      id: product.id,
      external_id: product.barcode,
      source: 'OFF',
      name: product.name,
      category: null,
      kcal: product.kcal_per_100g,
      protein_g: product.protein_g,
      carbs_g: product.carbs_g,
      fat_g: product.fat_g,
      fiber_g: product.fiber_g,
      sugar_g: null,
      sodium_mg: null,
      calcium_mg: null,
      iron_mg: null,
      potassium_mg: null,
      vitamin_c_mg: null,
      vitamin_d_mcg: null,
      vitamin_b12_mcg: null,
      folate_mcg: null,
      magnesium_mg: null,
      zinc_mg: null,
      created_at: '',
      updated_at: '',
    });
    setGrams(String(amountG));
    setStep('grams');
  }

  const preview = selectedFood && grams
    ? {
        kcal: ((selectedFood.kcal * Number(grams)) / 100).toFixed(0),
        protein: ((selectedFood.protein_g * Number(grams)) / 100).toFixed(1),
        carbs: ((selectedFood.carbs_g * Number(grams)) / 100).toFixed(1),
        fat: ((selectedFood.fat_g * Number(grams)) / 100).toFixed(1),
      }
    : null;

  async function handleSave() {
    if (!selectedFood || !grams || Number(grams) <= 0) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/meal-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meal_date: date,
          meal_type: mealType,
          food_id: selectedFood.id,
          grams: Number(grams),
          notes: notes || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Error guardando');
      }

      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal__close" onClick={onClose} aria-label="Cerrar">✕</button>
        <h2 className="modal__title">Agregar comida</h2>

        {/* Step 1: Meal type */}
        {step === 'type' && (
          <div className="step">
            <p className="step__label">¿Cuál comida?</p>
            <div className="meal-types">
              {MEAL_TYPES.map((t) => (
                <button
                  key={t}
                  className={`meal-type-btn ${mealType === t ? 'meal-type-btn--active' : ''}`}
                  onClick={() => setMealType(t)}
                >
                  <span className="meal-type-btn__icon">{MEAL_TYPE_ICONS[t]}</span>
                  <span>{MEAL_TYPE_LABELS[t]}</span>
                </button>
              ))}
            </div>
            <button className="btn btn--primary" onClick={() => setStep('food')}>
              Continuar →
            </button>
          </div>
        )}

        {/* Step 2: Food search */}
        {step === 'food' && (
          <div className="step">
            <p className="step__label">
              {MEAL_TYPE_ICONS[mealType]} {MEAL_TYPE_LABELS[mealType]} — Busca un alimento
            </p>
            <FoodSearch onSelect={handleFoodSelect} />
            <BarcodeFlow onConfirm={handleBarcodeConfirm} />
            <button className="btn btn--ghost" onClick={() => setStep('type')}>← Atrás</button>
          </div>
        )}

        {/* Step 3: Grams */}
        {step === 'grams' && selectedFood && (
          <div className="step">
            <p className="step__food-name">{selectedFood.name}</p>
            <label className="step__label" htmlFor="grams-input">Gramos consumidos</label>
            <input
              id="grams-input"
              className="grams-input"
              type="number"
              min="1"
              max="5000"
              step="1"
              value={grams}
              onChange={(e) => setGrams(e.target.value)}
              placeholder="ej. 150"
              autoFocus
            />

            {preview && (
              <div className="preview">
                <div className="preview__item">
                  <span>{preview.kcal}</span><small>kcal</small>
                </div>
                <div className="preview__item">
                  <span>{preview.protein}g</span><small>proteína</small>
                </div>
                <div className="preview__item">
                  <span>{preview.carbs}g</span><small>carbos</small>
                </div>
                <div className="preview__item">
                  <span>{preview.fat}g</span><small>grasas</small>
                </div>
              </div>
            )}

            <textarea
              className="notes-input"
              placeholder="Notas opcionales…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />

            {error && <p className="error-msg">{error}</p>}

            <div className="step__actions">
              <button className="btn btn--ghost" onClick={() => setStep('food')}>← Atrás</button>
              <button
                className="btn btn--primary"
                onClick={handleSave}
                disabled={!grams || Number(grams) <= 0 || loading}
              >
                {loading ? 'Guardando…' : 'Guardar'}
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed; inset: 0; z-index: 100;
          background: rgba(0,0,0,0.5);
          display: flex; align-items: flex-end;
        }
        .modal {
          position: relative;
          width: 100%; max-height: 90vh; overflow-y: auto;
          background: var(--surface, #fff);
          border-radius: 1.25rem 1.25rem 0 0;
          padding: 1.5rem 1.25rem 2rem;
        }
        .modal__close {
          position: absolute; top: 1rem; right: 1rem;
          background: none; border: none; font-size: 1.125rem;
          color: var(--muted, #64748b); cursor: pointer; padding: 0.25rem;
        }
        .modal__title { font-size: 1.25rem; font-weight: 700; margin: 0 0 1.25rem; }
        .step { display: flex; flex-direction: column; gap: 1rem; }
        .step__label { font-size: 0.875rem; font-weight: 500; color: var(--muted, #64748b); margin: 0; }
        .step__food-name { font-size: 1rem; font-weight: 600; margin: 0; }
        .step__actions { display: flex; gap: 0.75rem; justify-content: flex-end; }
        .meal-types { display: grid; grid-template-columns: 1fr 1fr; gap: 0.625rem; }
        .meal-type-btn {
          display: flex; flex-direction: column; align-items: center;
          gap: 0.25rem; padding: 0.875rem 0.5rem;
          border: 1.5px solid var(--border, #e2e8f0);
          border-radius: 0.875rem; background: var(--surface, #fff);
          font-size: 0.875rem; cursor: pointer; transition: all 0.15s;
        }
        .meal-type-btn--active {
          border-color: var(--accent, #6366f1);
          background: color-mix(in srgb, var(--accent, #6366f1) 10%, transparent);
          color: var(--accent, #6366f1); font-weight: 600;
        }
        .meal-type-btn__icon { font-size: 1.5rem; }
        .grams-input {
          width: 100%; padding: 0.875rem 1rem;
          border: 1.5px solid var(--border, #e2e8f0); border-radius: 0.75rem;
          font-size: 1.5rem; font-weight: 600; text-align: center;
          background: var(--surface, #fff); color: var(--text, #0f172a);
          outline: none;
        }
        .grams-input:focus { border-color: var(--accent, #6366f1); }
        .preview {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 0.5rem; padding: 1rem;
          background: var(--surface2, #f8fafc);
          border-radius: 0.875rem;
        }
        .preview__item {
          display: flex; flex-direction: column; align-items: center; gap: 0.125rem;
        }
        .preview__item span { font-size: 1.125rem; font-weight: 700; }
        .preview__item small { font-size: 0.7rem; color: var(--muted, #64748b); }
        .notes-input {
          width: 100%; padding: 0.75rem 1rem;
          border: 1.5px solid var(--border, #e2e8f0); border-radius: 0.75rem;
          font-size: 0.875rem; resize: none;
          background: var(--surface, #fff); color: var(--text, #0f172a);
          outline: none;
        }
        .error-msg { color: var(--error, #ef4444); font-size: 0.875rem; margin: 0; }
        .btn {
          padding: 0.75rem 1.5rem; border-radius: 0.75rem;
          font-size: 0.9rem; font-weight: 600; cursor: pointer;
          border: none; transition: opacity 0.15s;
        }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn--primary {
          background: var(--accent, #6366f1); color: #fff; flex: 1;
        }
        .btn--ghost {
          background: transparent; color: var(--muted, #64748b);
          border: 1.5px solid var(--border, #e2e8f0);
        }
      `}</style>
    </div>
  );
}
