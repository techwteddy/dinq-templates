'use client';
// src/components/nutrition/FoodSearch.tsx
// Debounced food search box that calls /api/foods/search
// and renders results with confidence indicators.

import { useState, useCallback } from 'react';
import { getFoodDisplayName } from '@/lib/nutrition/aliases';
import type { FoodMaster } from '@/types/nutrition';

interface FoodSearchProps {
  onSelect: (food: FoodMaster) => void;
  placeholder?: string;
}

function debounce<T extends (...args: Parameters<T>) => void>(fn: T, ms: number): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  }) as T;
}

export function FoodSearch({ onSelect, placeholder = 'Buscar alimento...' }: FoodSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FoodMaster[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const fetchResults = useCallback(
    debounce(async (q: string) => {
      if (q.trim().length < 2) {
        setResults([]);
        setLoading(false);
        setOpen(false);
        setError('');
        setWarning('');
        setHasSearched(false);
        return;
      }
      setLoading(true);
      setError('');
      setWarning('');
      try {
        const res = await fetch(`/api/foods/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? 'No se pudo buscar alimentos');
        setResults(data.foods ?? []);
        setWarning(data.warning ?? '');
        setHasSearched(true);
        setOpen(true);
      } catch (e) {
        setResults([]);
        setHasSearched(true);
        setOpen(false);
        setError(e instanceof Error ? e.message : 'No se pudo buscar alimentos');
      } finally {
        setLoading(false);
      }
    }, 400),
    []
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setQuery(val);
    fetchResults(val);
  }

  function handleSelect(food: FoodMaster) {
    onSelect(food);
    setQuery(getFoodDisplayName(food.name));
    setOpen(false);
    setResults([]);
  }

  return (
    <div className="food-search">
      <div className="food-search__input-wrap">
        <input
          className="food-search__input"
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          autoComplete="off"
          onFocus={() => results.length > 0 && setOpen(true)}
        />
        {loading && <span className="food-search__spinner" aria-label="Buscando…" />}
      </div>

      {open && results.length > 0 && (
        <ul className="food-search__results" role="listbox">
          {results.map((food) => (
            <li
              key={food.id}
              className="food-search__item"
              role="option"
              onMouseDown={() => handleSelect(food)}
            >
              <span className="food-search__name">{getFoodDisplayName(food.name)}</span>
              <span className="food-search__meta">
                {food.category && <span>{food.category}</span>}
                <span className="food-search__kcal">{Math.round(food.kcal)} kcal/100g</span>
              </span>
            </li>
          ))}
        </ul>
      )}

      {open && hasSearched && !loading && !error && query.trim().length >= 2 && results.length === 0 && (
        <p className="food-search__empty">Sin resultados para "{query}".</p>
      )}

      {warning && <p className="food-search__warning">{warning}</p>}

      {error && <p className="food-search__error">{error}</p>}

      <style jsx>{`
        .food-search { position: relative; width: 100%; }
        .food-search__input-wrap { position: relative; }
        .food-search__input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1.5px solid var(--border, #e2e8f0);
          border-radius: 0.75rem;
          font-size: 1rem;
          background: var(--surface, #fff);
          color: var(--text, #0f172a);
          outline: none;
          transition: border-color 0.15s;
        }
        .food-search__input:focus { border-color: var(--accent, #6366f1); }
        .food-search__spinner {
          position: absolute; right: 0.875rem; top: 50%;
          transform: translateY(-50%);
          width: 1rem; height: 1rem;
          border: 2px solid var(--accent, #6366f1);
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin { to { transform: translateY(-50%) rotate(360deg); } }
        .food-search__results {
          position: absolute; z-index: 50;
          width: 100%; margin: 0.25rem 0 0;
          padding: 0.375rem 0;
          background: var(--surface, #fff);
          border: 1.5px solid var(--border, #e2e8f0);
          border-radius: 0.75rem;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          list-style: none;
          max-height: 18rem; overflow-y: auto;
        }
        .food-search__item {
          display: flex; flex-direction: column;
          padding: 0.625rem 1rem; cursor: pointer;
          transition: background 0.1s;
        }
        .food-search__item:hover { background: var(--hover, #f1f5f9); }
        .food-search__name { font-size: 0.9rem; font-weight: 500; color: var(--text, #0f172a); }
        .food-search__meta {
          display: flex; gap: 0.5rem; margin-top: 0.125rem;
          font-size: 0.75rem; color: var(--muted, #64748b);
        }
        .food-search__kcal { font-weight: 600; color: var(--accent, #6366f1); }
        .food-search__empty {
          margin: 0.375rem 0 0;
          color: var(--muted, #64748b);
          font-size: 0.75rem;
        }
        .food-search__warning {
          margin: 0.375rem 0 0;
          color: #f59e0b;
          font-size: 0.75rem;
        }
        .food-search__error {
          margin: 0.375rem 0 0;
          color: var(--error, #ef4444);
          font-size: 0.75rem;
        }
      `}</style>
    </div>
  );
}
