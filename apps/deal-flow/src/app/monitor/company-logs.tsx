'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Batch, Company } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import { EventTimeline } from '@/components/event-timeline';

function formatDuration(seconds: number | null): string {
  if (!seconds) return '—';
  if (seconds < 60) return `${Math.round(seconds)}s`;
  return `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`;
}

export default function CompanyLogs({ batches }: { batches: Batch[] }) {
  const [selectedBatchId, setSelectedBatchId] = useState<string>(batches[0]?.id || '');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Load companies when batch changes
  useEffect(() => {
    if (!selectedBatchId) return;
    setLoading(true);
    const supabase = createClient();
    supabase
      .from('df_companies')
      .select('id, batch_id, user_id, name, scrape_status, completeness_score, retry_count, scrape_duration_seconds, scrape_started_at, scrape_completed_at')
      .eq('batch_id', selectedBatchId)
      .order('name', { ascending: true })
      .then(({ data }) => {
        setCompanies((data as Company[]) || []);
        setSelectedCompanyId('');
        setLoading(false);
      });
  }, [selectedBatchId]);

  const selectedCompany = companies.find((c) => c.id === selectedCompanyId);

  return (
    <div className="space-y-6">
      {/* Selectors */}
      <div className="card p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider block mb-2">
            Batch
          </label>
          <select
            value={selectedBatchId}
            onChange={(e) => setSelectedBatchId(e.target.value)}
            className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-bright)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          >
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.total_companies} companies)
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider block mb-2">
            Company
          </label>
          <select
            value={selectedCompanyId}
            onChange={(e) => setSelectedCompanyId(e.target.value)}
            className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-bright)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            disabled={companies.length === 0}
          >
            <option value="">Select a company...</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — {c.scrape_status} — {c.completeness_score}%
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && (
        <div className="text-xs text-[var(--text-muted)] text-center py-4">Loading...</div>
      )}

      {selectedCompany && !loading && (
        <>
          {/* Company header */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <Link
                  href={`/companies/${selectedCompany.id}`}
                  className="text-lg font-bold text-[var(--text-bright)] hover:text-[var(--accent)] transition-colors"
                >
                  {selectedCompany.name}
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    selectedCompany.scrape_status === 'scraped'
                      ? 'text-[var(--green)] bg-[var(--green)]/10'
                      : selectedCompany.scrape_status === 'failed'
                      ? 'text-[var(--red)] bg-[var(--red)]/10'
                      : selectedCompany.scrape_status === 'scraping'
                      ? 'text-[var(--accent)] bg-[var(--accent)]/10'
                      : 'text-[var(--text-muted)] bg-[var(--bg-surface)]'
                  }`}
                >
                  {selectedCompany.scrape_status}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-6 text-xs text-[var(--text-secondary)]">
              <span>
                Completeness:{' '}
                <span className="font-mono text-[var(--text-bright)]">
                  {selectedCompany.completeness_score}%
                </span>
              </span>
              <span>
                Retries: <span className="font-mono text-[var(--text-bright)]">{selectedCompany.retry_count}</span>
              </span>
              <span>
                Duration: <span className="font-mono text-[var(--text-bright)]">{formatDuration(selectedCompany.scrape_duration_seconds)}</span>
              </span>
            </div>
          </div>

          {/* Event timeline */}
          <div className="card p-4">
            <h3 className="text-xs font-semibold text-[var(--text-bright)] uppercase tracking-wider mb-3">
              Event History
            </h3>
            <div className="max-h-[60vh] overflow-y-auto">
              <EventTimeline companyId={selectedCompanyId} limit={200} />
            </div>
          </div>
        </>
      )}

      {!selectedCompanyId && !loading && (
        <div className="card p-12 text-center">
          <p className="text-sm text-[var(--text-muted)]">Select a company to view its event history.</p>
        </div>
      )}
    </div>
  );
}
