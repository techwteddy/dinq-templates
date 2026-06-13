'use client';
// src/app/(app)/recipes/page.tsx
// Recipe list + create new recipe

import { useState, useEffect } from 'react';
import { RecipeBuilder } from '@/components/nutrition/RecipeBuilder';
import type { Recipe } from '@/types/nutrition';

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [showBuilder, setShowBuilder] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/recipes');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'No se pudieron cargar las recetas');
      setRecipes(data.recipes ?? []);
    } catch (e) {
      setRecipes([]);
      setError(e instanceof Error ? e.message : 'No se pudieron cargar las recetas');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <main className="recipes-page">
      <header className="page-header">
        <h1>Mis recetas</h1>
        <button className="btn btn--primary" onClick={() => setShowBuilder(true)}>
          + Nueva receta
        </button>
      </header>

      {showBuilder && (
        <div className="builder-card">
          <RecipeBuilder
            onSaved={() => { setShowBuilder(false); load(); }}
            onCancel={() => setShowBuilder(false)}
          />
        </div>
      )}

      {loading && <p className="state">Cargando recetas...</p>}

      {error && <p className="state state--error">{error}</p>}

      {recipes.length === 0 && !showBuilder && !loading && !error && (
        <p className="empty">Aún no tienes recetas. ¡Crea la primera!</p>
      )}

      <ul className="recipe-list">
        {recipes.map((r) => (
          <li key={r.id} className="recipe-card">
            <span className="recipe-card__name">{r.name}</span>
            <div className="recipe-card__meta">
              <span>{r.total_kcal?.toFixed(0)} kcal total</span>
              <span>{r.servings} porción{r.servings !== 1 ? 'es' : ''}</span>
              <span>{r.total_kcal && r.servings ? ((r.total_kcal) / r.servings).toFixed(0) : '—'} kcal/porción</span>
            </div>
          </li>
        ))}
      </ul>

      <style jsx>{`
        .recipes-page { padding: 1rem 1.25rem; display: flex; flex-direction: column; gap: 1rem; }
        .page-header { display: flex; align-items: center; justify-content: space-between; }
        .page-header h1 { font-size: 1.375rem; font-weight: 700; margin: 0; }
        .builder-card {
          padding: 1.25rem; background: var(--surface, #fff);
          border-radius: 1.125rem; box-shadow: 0 2px 16px rgba(0,0,0,0.07);
        }
        .empty { color: var(--muted, #64748b); font-size: 0.9rem; text-align: center; margin-top: 2rem; }
        .state {
          margin: 0;
          padding: 0.875rem 1rem;
          border-radius: 0.875rem;
          border: 1px solid var(--border, #e2e8f0);
          background: var(--surface2, #f8fafc);
          color: var(--muted, #64748b);
          font-size: 0.875rem;
        }
        .state--error {
          color: var(--error, #ef4444);
          border-color: color-mix(in srgb, var(--error, #ef4444) 35%, var(--border, #e2e8f0));
          background: color-mix(in srgb, var(--error, #ef4444) 10%, var(--surface2, #f8fafc));
        }
        .recipe-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.625rem; }
        .recipe-card {
          padding: 1rem 1.125rem; background: var(--surface, #fff);
          border-radius: 0.875rem; box-shadow: 0 1px 6px rgba(0,0,0,0.05);
          display: flex; flex-direction: column; gap: 0.25rem;
        }
        .recipe-card__name { font-size: 1rem; font-weight: 600; }
        .recipe-card__meta { display: flex; gap: 0.75rem; font-size: 0.75rem; color: var(--muted, #64748b); flex-wrap: wrap; }
        .btn { padding: 0.6rem 1.25rem; border-radius: 0.75rem; font-size: 0.875rem; font-weight: 600; border: none; cursor: pointer; }
        .btn--primary { background: var(--accent, #6366f1); color: #fff; }
      `}</style>
    </main>
  );
}
