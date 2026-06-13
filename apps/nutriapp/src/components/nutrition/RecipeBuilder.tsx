'use client';
// src/components/nutrition/RecipeBuilder.tsx
// Form to create or edit a recipe.
// Ingredient list: search food → set grams → add to list.

import { useState } from 'react';
import { FoodSearch } from './FoodSearch';
import type { FoodMaster } from '@/types/nutrition';

interface IngredientRow {
  food: FoodMaster;
  grams: number;
}

interface RecipeBuilderProps {
  onSaved?: () => void;
  onCancel?: () => void;
}

function computePreview(ingredients: IngredientRow[]) {
  return ingredients.reduce(
    (acc, { food, grams }) => {
      const f = grams / 100;
      acc.kcal += food.kcal * f;
      acc.protein += food.protein_g * f;
      acc.carbs += food.carbs_g * f;
      acc.fat += food.fat_g * f;
      return acc;
    },
    { kcal: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

export function RecipeBuilder({ onSaved, onCancel }: RecipeBuilderProps) {
  const [name, setName] = useState('');
  const [servings, setServings] = useState(1);
  const [notes, setNotes] = useState('');
  const [ingredients, setIngredients] = useState<IngredientRow[]>([]);
  const [pendingFood, setPendingFood] = useState<FoodMaster | null>(null);
  const [pendingGrams, setPendingGrams] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function addIngredient() {
    if (!pendingFood || !pendingGrams || Number(pendingGrams) <= 0) return;
    setIngredients((prev) => [...prev, { food: pendingFood, grams: Number(pendingGrams) }]);
    setPendingFood(null);
    setPendingGrams('');
  }

  function removeIngredient(idx: number) {
    setIngredients((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSave() {
    if (!name.trim() || ingredients.length === 0) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          servings,
          notes: notes || undefined,
          ingredients: ingredients.map((i) => ({ food_id: i.food.id, grams: i.grams })),
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? 'Error guardando receta');
      }
      onSaved?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido');
    } finally {
      setSaving(false);
    }
  }

  const preview = computePreview(ingredients);
  const perServing = {
    kcal: (preview.kcal / servings).toFixed(0),
    protein: (preview.protein / servings).toFixed(1),
    carbs: (preview.carbs / servings).toFixed(1),
    fat: (preview.fat / servings).toFixed(1),
  };

  return (
    <div className="builder">
      <h2 className="builder__title">Nueva receta</h2>

      {/* Name & servings */}
      <div className="field">
        <label className="field__label">Nombre</label>
        <input
          className="field__input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ej. Avena con frutas"
        />
      </div>

      <div className="row">
        <div className="field" style={{ flex: 1 }}>
          <label className="field__label">Porciones</label>
          <input
            className="field__input"
            type="number" min="1" step="1"
            value={servings}
            onChange={(e) => setServings(Number(e.target.value))}
          />
        </div>
        <div className="field" style={{ flex: 2 }}>
          <label className="field__label">Notas</label>
          <input
            className="field__input"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Opcional…"
          />
        </div>
      </div>

      {/* Ingredient adder */}
      <div className="field">
        <label className="field__label">Agregar ingrediente</label>
        <FoodSearch
          onSelect={setPendingFood}
          placeholder="Buscar alimento…"
        />
        {pendingFood && (
          <div className="pending-row">
            <span className="pending-row__name">{pendingFood.name}</span>
            <input
              className="pending-row__grams"
              type="number" min="1" placeholder="g"
              value={pendingGrams}
              onChange={(e) => setPendingGrams(e.target.value)}
            />
            <button
              className="btn btn--sm btn--primary"
              onClick={addIngredient}
              disabled={!pendingGrams || Number(pendingGrams) <= 0}
            >
              Agregar
            </button>
          </div>
        )}
      </div>

      {/* Ingredient list */}
      {ingredients.length > 0 && (
        <ul className="ing-list">
          {ingredients.map((ing, i) => (
            <li key={i} className="ing-item">
              <span className="ing-item__name">{ing.food.name}</span>
              <span className="ing-item__grams">{ing.grams}g</span>
              <span className="ing-item__kcal">
                {((ing.food.kcal * ing.grams) / 100).toFixed(0)} kcal
              </span>
              <button className="ing-item__remove" onClick={() => removeIngredient(i)}>✕</button>
            </li>
          ))}
        </ul>
      )}

      {/* Preview */}
      {ingredients.length > 0 && (
        <div className="preview-box">
          <p className="preview-box__title">Por porción ({servings} porción{servings !== 1 ? 'es' : ''})</p>
          <div className="preview-grid">
            {[
              ['kcal', perServing.kcal],
              ['proteína', `${perServing.protein}g`],
              ['carbos', `${perServing.carbs}g`],
              ['grasas', `${perServing.fat}g`],
            ].map(([label, val]) => (
              <div key={label} className="preview-cell">
                <span>{val}</span><small>{label}</small>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <p className="error-msg">{error}</p>}

      <div className="actions">
        {onCancel && <button className="btn btn--ghost" onClick={onCancel}>Cancelar</button>}
        <button
          className="btn btn--primary"
          onClick={handleSave}
          disabled={!name.trim() || ingredients.length === 0 || saving}
        >
          {saving ? 'Guardando…' : 'Guardar receta'}
        </button>
      </div>

      <style jsx>{`
        .builder { display: flex; flex-direction: column; gap: 1rem; }
        .builder__title { font-size: 1.25rem; font-weight: 700; margin: 0; }
        .field { display: flex; flex-direction: column; gap: 0.375rem; }
        .field__label { font-size: 0.8rem; font-weight: 600; color: var(--muted, #64748b); text-transform: uppercase; letter-spacing: 0.04em; }
        .field__input {
          padding: 0.7rem 1rem; border: 1.5px solid var(--border, #e2e8f0);
          border-radius: 0.75rem; font-size: 0.9rem; width: 100%;
          background: var(--surface, #fff); color: var(--text, #0f172a); outline: none;
        }
        .field__input:focus { border-color: var(--accent, #6366f1); }
        .row { display: flex; gap: 0.75rem; }
        .pending-row {
          display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem;
          padding: 0.625rem; background: var(--surface2, #f8fafc); border-radius: 0.75rem;
        }
        .pending-row__name { flex: 1; font-size: 0.85rem; font-weight: 500; }
        .pending-row__grams {
          width: 4rem; padding: 0.375rem 0.5rem; text-align: center;
          border: 1.5px solid var(--border, #e2e8f0); border-radius: 0.5rem;
          font-size: 0.9rem; background: var(--surface, #fff); outline: none;
        }
        .ing-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.25rem; }
        .ing-item {
          display: flex; align-items: center; gap: 0.5rem;
          padding: 0.625rem 0.875rem; background: var(--surface2, #f8fafc); border-radius: 0.75rem;
        }
        .ing-item__name { flex: 1; font-size: 0.85rem; font-weight: 500; }
        .ing-item__grams, .ing-item__kcal { font-size: 0.8rem; color: var(--muted, #64748b); }
        .ing-item__remove { background: none; border: none; cursor: pointer; color: var(--muted, #94a3b8); font-size: 0.875rem; }
        .preview-box {
          padding: 1rem; background: var(--surface2, #f8fafc); border-radius: 0.875rem;
        }
        .preview-box__title { font-size: 0.75rem; font-weight: 600; color: var(--muted, #64748b); margin: 0 0 0.625rem; text-transform: uppercase; letter-spacing: 0.04em; }
        .preview-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; }
        .preview-cell { display: flex; flex-direction: column; align-items: center; }
        .preview-cell span { font-size: 1rem; font-weight: 700; }
        .preview-cell small { font-size: 0.7rem; color: var(--muted, #64748b); }
        .error-msg { color: var(--error, #ef4444); font-size: 0.875rem; margin: 0; }
        .actions { display: flex; gap: 0.75rem; justify-content: flex-end; }
        .btn {
          padding: 0.75rem 1.5rem; border-radius: 0.75rem;
          font-size: 0.9rem; font-weight: 600; cursor: pointer; border: none; transition: opacity 0.15s;
        }
        .btn--sm { padding: 0.5rem 0.875rem; font-size: 0.85rem; }
        .btn--primary { background: var(--accent, #6366f1); color: #fff; }
        .btn--ghost { background: transparent; color: var(--muted, #64748b); border: 1.5px solid var(--border, #e2e8f0); }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
    </div>
  );
}
