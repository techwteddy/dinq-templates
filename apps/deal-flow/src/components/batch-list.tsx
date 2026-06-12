'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Batch } from '@/lib/types';

interface BatchListProps {
  batches: Batch[];
  batchScrapedCounts: Record<string, number>;
  batchFailedCounts: Record<string, number>;
  linkPrefix?: string;
}

export default function BatchList({ batches: initialBatches, batchScrapedCounts, batchFailedCounts, linkPrefix = '/results' }: BatchListProps) {
  const [batches, setBatches] = useState(initialBatches);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [bulkConfirm, setBulkConfirm] = useState(false);
  const router = useRouter();

  const allSelected = batches.length > 0 && selected.size === batches.length;

  function toggleSelect(batchId: string) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(batchId)) next.delete(batchId);
      else next.add(batchId);
      return next;
    });
    setBulkConfirm(false);
  }

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(batches.map(b => b.id)));
    }
    setBulkConfirm(false);
  }

  async function handleDelete(batchId: string) {
    if (confirmId !== batchId) {
      setConfirmId(batchId);
      return;
    }

    setDeletingId(batchId);
    try {
      const res = await fetch('/api/batch-delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchId }),
      });

      if (res.ok) {
        setBatches(prev => prev.filter(b => b.id !== batchId));
        setSelected(prev => { const next = new Set(prev); next.delete(batchId); return next; });
        router.refresh();
      }
    } catch {
      // Silent fail — batch stays in list
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  }

  async function handleBulkDelete() {
    if (!bulkConfirm) {
      setBulkConfirm(true);
      return;
    }

    setBulkDeleting(true);
    try {
      const res = await fetch('/api/batch-delete-bulk', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchIds: Array.from(selected) }),
      });

      if (res.ok) {
        setBatches(prev => prev.filter(b => !selected.has(b.id)));
        setSelected(new Set());
        router.refresh();
      }
    } catch {
      // Silent fail
    } finally {
      setBulkDeleting(false);
      setBulkConfirm(false);
    }
  }

  if (batches.length === 0) {
    return (
      <div className="mt-8 card p-12 text-center">
        <p className="text-sm text-[var(--text-muted)]">No results yet.</p>
        <Link href="/upload" className="mt-3 inline-block rounded-lg bg-[var(--accent)] px-4 py-2 text-xs font-medium text-white hover:brightness-110 transition-all">
          Upload Companies
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6">
      {/* Bulk actions bar */}
      <div className="flex items-center justify-between mb-3">
        <label className="flex items-center gap-2 text-xs text-[var(--text-muted)] cursor-pointer select-none">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleAll}
            className="rounded border-[var(--border)] bg-[var(--bg-surface)] text-[var(--accent)] focus:ring-[var(--accent)] focus:ring-offset-0 w-3.5 h-3.5"
          />
          Select all
        </label>

        {selected.size > 0 && (
          <button
            onClick={handleBulkDelete}
            disabled={bulkDeleting}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              bulkConfirm
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
            } disabled:opacity-50`}
          >
            {bulkDeleting ? (
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Deleting…
              </span>
            ) : bulkConfirm ? (
              `Confirm delete ${selected.size} batch${selected.size > 1 ? 'es' : ''}?`
            ) : (
              `Delete ${selected.size} batch${selected.size > 1 ? 'es' : ''}`
            )}
          </button>
        )}
      </div>

      {/* Batch list */}
      <div className="space-y-2">
        {batches.map(batch => {
          const scraped = batchScrapedCounts[batch.id] || 0;
          const failed = batchFailedCounts[batch.id] || 0;
          const isConfirming = confirmId === batch.id;
          const isDeleting = deletingId === batch.id;
          const isSelected = selected.has(batch.id);

          return (
            <div
              key={batch.id}
              className={`card flex items-center gap-3 p-4 hover:bg-[var(--bg-hover)] transition-colors ${
                isSelected ? 'ring-1 ring-[var(--accent)]/40' : ''
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleSelect(batch.id)}
                onClick={(e) => e.stopPropagation()}
                className="rounded border-[var(--border)] bg-[var(--bg-surface)] text-[var(--accent)] focus:ring-[var(--accent)] focus:ring-offset-0 w-3.5 h-3.5 shrink-0"
              />

              <Link href={`${linkPrefix}/${batch.id}`} className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text-bright)]">{batch.name}</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  {new Date(batch.created_at).toLocaleDateString()} · {batch.total_companies} companies
                </p>
              </Link>

              <div className="flex items-center gap-3 ml-4 shrink-0">
                <div className="text-right">
                  <span className="text-xs text-[var(--text-secondary)]">
                    {scraped}/{batch.total_companies} scraped
                  </span>
                  {failed > 0 && (
                    <span className="text-xs text-red-400 ml-1">({failed} failed)</span>
                  )}
                  {batch.status !== 'complete' && (
                    <span className="ml-2 inline-block rounded-full bg-[var(--accent)]/20 px-2 py-0.5 text-[10px] font-medium text-[var(--accent)]">
                      {batch.status}
                    </span>
                  )}
                  {batch.status === 'complete' && (
                    <span className="ml-2 inline-block rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                      complete
                    </span>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!isDeleting) handleDelete(batch.id);
                  }}
                  onBlur={() => {
                    if (isConfirming && !isDeleting) setConfirmId(null);
                  }}
                  disabled={isDeleting}
                  className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-all ${
                    isConfirming
                      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                      : 'text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10'
                  } disabled:opacity-50`}
                  title={isConfirming ? 'Click again to confirm' : 'Delete batch'}
                >
                  {isDeleting ? (
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : isConfirming ? (
                    'Confirm?'
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
