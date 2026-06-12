'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRealtimeBatch, useRealtimeCompanies } from '@/lib/use-realtime';
import { exportBatchCSV } from '@/lib/export-csv';
import type { Batch, Company } from '@/lib/types';

function formatDuration(seconds: number | null): string {
  if (!seconds) return '—';
  if (seconds < 60) return `${Math.round(seconds)}s`;
  return `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`;
}

const GENERIC_INDUSTRIES = new Set([
  'technology', 'software', 'it', 'information technology', 'software development',
  'saas', 'internet', 'computer software', 'tech', 'digital', 'services',
]);

function countCriticalMissing(c: Company): number {
  let missing = 0;
  if (!c.sub_industry || GENERIC_INDUSTRIES.has(c.sub_industry.toLowerCase().trim())) missing++;
  if (c.employee_growth_pct == null) missing++;
  if (!c.revenue_estimate) missing++;
  if (!c.employee_count) missing++;
  if (!c.funding_total) missing++;
  if (c.is_saas == null) missing++;
  if (!c.ownership_status) missing++;
  if (!c.location_country) missing++;
  return missing;
}

const RANKING_COLORS: Record<string, string> = {
  'Great': 'bg-emerald-500 text-white',
  'Good': 'bg-green-500 text-white',
  'High Ok': 'bg-amber-500 text-white',
  'Ok': 'bg-gray-500 text-white',
  'Small & Interesting': 'bg-teal-500 text-white',
  'Poor': 'bg-red-500 text-white',
};

type SortKey = 'name' | 'industry' | 'hq_location' | 'employee_count' | 'completeness_score' | 'scrape_duration_seconds';

export default function ResultsTable({
  batch: initialBatch,
  initialCompanies,
}: {
  batch: Batch;
  initialCompanies: Company[];
}) {
  const batch = useRealtimeBatch(initialBatch.id, initialBatch);
  const companies = useRealtimeCompanies(initialBatch.id, initialCompanies);
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [filterIndustry, setFilterIndustry] = useState('');
  const [filterText, setFilterText] = useState('');
  const [retryLoading, setRetryLoading] = useState(false);

  const failedCompanies = companies.filter(c => c.scrape_status === 'failed');

  async function handleRetryFailed() {
    setRetryLoading(true);
    try {
      await fetch('/api/batch-retry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchId: batch.id, mode: 'failed' }),
      });
    } finally {
      setRetryLoading(false);
    }
  }

  // Only show scraped companies in results (live-building!)
  const scrapedCompanies = companies.filter(c => c.scrape_status === 'scraped');

  const industries = useMemo(() => {
    const set = new Set(scrapedCompanies.map(c => c.industry).filter(Boolean));
    return Array.from(set).sort();
  }, [scrapedCompanies]);

  const filtered = useMemo(() => {
    let list = scrapedCompanies;
    if (filterIndustry) list = list.filter(c => c.industry === filterIndustry);
    if (filterText) list = list.filter(c => c.name.toLowerCase().includes(filterText.toLowerCase()));
    return list.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      const cmp = typeof av === 'string' ? av.localeCompare(bv as string) : (av as number) - (bv as number);
      return sortAsc ? cmp : -cmp;
    });
  }, [scrapedCompanies, sortKey, sortAsc, filterIndustry, filterText]);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  }

  function handleExportAll() {
    exportBatchCSV(filtered, `${batch.name.replace(/[^a-z0-9]/gi, '_')}_results.csv`);
  }

  function handleExportOne(c: Company) {
    exportBatchCSV([c], `${c.name.replace(/[^a-z0-9]/gi, '_')}_summary.csv`);
  }

  const avgCompleteness = scrapedCompanies.length > 0
    ? scrapedCompanies.reduce((sum, c) => sum + c.completeness_score, 0) / scrapedCompanies.length
    : 0;
  const avgTime = scrapedCompanies.filter(c => c.scrape_duration_seconds).length > 0
    ? scrapedCompanies.filter(c => c.scrape_duration_seconds).reduce((sum, c) => sum + (c.scrape_duration_seconds || 0), 0)
      / scrapedCompanies.filter(c => c.scrape_duration_seconds).length
    : null;

  const SortHeader = ({ label, field }: { label: string; field: SortKey }) => (
    <th
      onClick={() => handleSort(field)}
      className="text-left px-3 py-2 text-[var(--text-secondary)] font-medium cursor-pointer hover:text-[var(--text-bright)] select-none"
    >
      {label} {sortKey === field ? (sortAsc ? '↑' : '↓') : ''}
    </th>
  );

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <div className="animate-fade-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[var(--text-bright)]">Results: {batch.name}</h1>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {scrapedCompanies.length} of {batch.total_companies} companies enriched
              {batch.status === 'scraping' && ' — updating live...'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {failedCompanies.length > 0 && (
              <button
                onClick={handleRetryFailed}
                disabled={retryLoading || batch.status === 'scraping'}
                className="rounded-lg border border-[var(--red)]/40 px-3 py-2 text-xs font-medium text-[var(--red)] hover:bg-[var(--red)]/10 disabled:opacity-50 transition-all"
              >
                {retryLoading ? 'Retrying...' : `Retry Failed (${failedCompanies.length})`}
              </button>
            )}
            <Link
              href={`/pipeline/${batch.id}`}
              className="rounded-lg border border-[var(--border-medium)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-bright)] hover:bg-[var(--bg-hover)] transition-colors"
            >
              Pipeline
            </Link>
            <button
              onClick={handleExportAll}
              disabled={filtered.length === 0}
              className="rounded-lg bg-[var(--accent)] px-4 py-2 text-xs font-medium text-white hover:brightness-110 active:scale-[0.97] disabled:opacity-50 transition-all"
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { label: 'Scraped', value: `${scrapedCompanies.length}/${batch.total_companies}` },
            { label: 'Avg Completeness', value: `${Math.round(avgCompleteness)}%` },
            { label: 'Avg Scrape Time', value: formatDuration(avgTime) },
          ].map(s => (
            <div key={s.label} className="card p-3">
              <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">{s.label}</div>
              <div className="mt-1 text-lg font-bold text-[var(--text-bright)] font-mono">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mt-6 flex items-center gap-3">
          <input
            type="text"
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
            placeholder="Search companies..."
            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-input)] px-3 py-2 text-xs text-[var(--text-bright)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] w-60"
          />
          <select
            value={filterIndustry}
            onChange={e => setFilterIndustry(e.target.value)}
            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-input)] px-3 py-2 text-xs text-[var(--text-bright)] focus:outline-none focus:border-[var(--accent)]"
          >
            <option value="">All industries</option>
            {industries.map(i => <option key={i} value={i!}>{i}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 card overflow-hidden animate-fade-up" style={{ animationDelay: '0.1s' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-[var(--bg-surface)]">
              <tr>
                <SortHeader label="Company" field="name" />
                <SortHeader label="Industry" field="industry" />
                <th className="text-left px-3 py-2 text-[var(--text-secondary)] font-medium whitespace-nowrap">Sub-Industry</th>
                <SortHeader label="HQ" field="hq_location" />
                <th className="text-left px-3 py-2 text-[var(--text-secondary)] font-medium">City</th>
                <th className="text-left px-3 py-2 text-[var(--text-secondary)] font-medium">Country</th>
                <th className="text-left px-3 py-2 text-[var(--text-secondary)] font-medium">Founded</th>
                <th className="text-left px-3 py-2 text-[var(--text-secondary)] font-medium">SaaS</th>
                <th className="text-left px-3 py-2 text-[var(--text-secondary)] font-medium">Status</th>
                <SortHeader label="Employees" field="employee_count" />
                <th className="text-left px-3 py-2 text-[var(--text-secondary)] font-medium whitespace-nowrap">Growth (1yr)</th>
                <th className="text-left px-3 py-2 text-[var(--text-secondary)] font-medium whitespace-nowrap">Growth (6m)</th>
                <th className="text-left px-3 py-2 text-[var(--text-secondary)] font-medium">Revenue</th>
                <th className="text-left px-3 py-2 text-[var(--text-secondary)] font-medium whitespace-nowrap">Total Funding</th>
                <th className="text-left px-3 py-2 text-[var(--text-secondary)] font-medium whitespace-nowrap">Last Funding</th>
                <th className="text-left px-3 py-2 text-[var(--text-secondary)] font-medium whitespace-nowrap">Last Funding Date</th>
                <th className="text-left px-3 py-2 text-[var(--text-secondary)] font-medium">Investors</th>
                <th className="text-left px-3 py-2 text-[var(--text-secondary)] font-medium">CEO</th>
                <th className="text-left px-3 py-2 text-[var(--text-secondary)] font-medium">Website</th>
                <th className="text-left px-3 py-2 text-[var(--text-secondary)] font-medium">LinkedIn</th>
                <th className="text-left px-3 py-2 text-[var(--text-secondary)] font-medium">Ranking</th>
                <th className="text-left px-3 py-2 text-[var(--text-secondary)] font-medium whitespace-nowrap">Score</th>
                <th className="text-left px-3 py-2 text-[var(--text-secondary)] font-medium whitespace-nowrap">CH Category</th>
                <th className="text-left px-3 py-2 text-[var(--text-secondary)] font-medium">Owner</th>
                <th className="text-left px-3 py-2 text-[var(--text-secondary)] font-medium">Source</th>
                <th className="text-left px-3 py-2 text-[var(--text-secondary)] font-medium whitespace-nowrap">AI Brief</th>
                <th className="text-left px-3 py-2 text-[var(--text-secondary)] font-medium">Description</th>
                <SortHeader label="Complete" field="completeness_score" />
                <th className="text-left px-3 py-2 text-[var(--text-secondary)] font-medium">Gaps</th>
                <th className="px-3 py-2 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="border-t border-[var(--border-subtle)] hover:bg-[var(--bg-hover)] transition-colors animate-fade-in">
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <Link href={`/companies/${c.id}`} className="text-[var(--text-bright)] hover:text-[var(--accent)] font-medium transition-colors">
                      {c.name}
                    </Link>
                  </td>
                  <td className="px-3 py-2.5 text-[var(--text-secondary)]">{c.industry || '—'}</td>
                  <td className="px-3 py-2.5 text-[var(--text-secondary)] max-w-[160px] truncate" title={c.sub_industry || undefined}>
                    {c.sub_industry || '—'}
                  </td>
                  <td className="px-3 py-2.5 text-[var(--text-secondary)] whitespace-nowrap">{c.hq_location || '—'}</td>
                  <td className="px-3 py-2.5 text-[var(--text-secondary)]">{c.location_city || '—'}</td>
                  <td className="px-3 py-2.5 text-[var(--text-secondary)]">{c.location_country || '—'}</td>
                  <td className="px-3 py-2.5 text-[var(--text-secondary)]">{c.founded_year || '—'}</td>
                  <td className="px-3 py-2.5">
                    {c.is_saas === true ? <span className="text-emerald-400 text-[10px] font-medium">Yes</span> :
                     c.is_saas === false ? <span className="text-red-400 text-[10px] font-medium">No</span> :
                     <span className="text-[var(--text-muted)]">—</span>}
                  </td>
                  <td className="px-3 py-2.5">
                    {c.ownership_status ? (
                      <span className={`text-[10px] font-medium capitalize ${c.ownership_status === 'private' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {c.ownership_status}
                      </span>
                    ) : <span className="text-[var(--text-muted)]">—</span>}
                  </td>
                  <td className="px-3 py-2.5 text-[var(--text-secondary)]">{c.employee_count || '—'}</td>
                  <td className="px-3 py-2.5 text-[var(--text-secondary)] font-mono">
                    {c.employee_growth_pct != null ? `${c.employee_growth_pct}%` : '—'}
                  </td>
                  <td className="px-3 py-2.5 text-[var(--text-secondary)] font-mono">
                    {c.headcount_growth_6m != null ? `${c.headcount_growth_6m}%` : '—'}
                  </td>
                  <td className="px-3 py-2.5 text-[var(--text-secondary)]">{c.revenue_estimate || '—'}</td>
                  <td className="px-3 py-2.5 text-[var(--text-secondary)]">{c.funding_total || '—'}</td>
                  <td className="px-3 py-2.5 text-[var(--text-secondary)]">{c.last_funding_amount || '—'}</td>
                  <td className="px-3 py-2.5 text-[var(--text-secondary)] whitespace-nowrap">{c.last_funding_date || '—'}</td>
                  <td className="px-3 py-2.5 text-[var(--text-secondary)] max-w-[160px] truncate" title={c.investors || undefined}>{c.investors || '—'}</td>
                  <td className="px-3 py-2.5 text-[var(--text-secondary)]">{c.ceo_name || '—'}</td>
                  <td className="px-3 py-2.5">
                    {c.website ? (
                      <a href={c.website.startsWith('http') ? c.website : `https://${c.website}`} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline truncate block max-w-[120px]" title={c.website}>
                        {c.website.replace(/^https?:\/\/(www\.)?/, '')}
                      </a>
                    ) : <span className="text-[var(--text-muted)]">—</span>}
                  </td>
                  <td className="px-3 py-2.5">
                    {c.linkedin_url ? (
                      <a href={c.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline truncate block max-w-[120px]" title={c.linkedin_url}>
                        LinkedIn
                      </a>
                    ) : <span className="text-[var(--text-muted)]">—</span>}
                  </td>
                  <td className="px-3 py-2.5">
                    {c.ranking ? (
                      <span className={`inline-flex rounded-full px-1.5 py-0 text-[9px] font-bold whitespace-nowrap ${RANKING_COLORS[c.ranking] || 'bg-gray-500 text-white'}`}>
                        {c.ranking}
                      </span>
                    ) : <span className="text-[var(--text-muted)]">—</span>}
                  </td>
                  <td className="px-3 py-2.5 text-[var(--text-secondary)] font-mono">
                    {c.score_composite != null ? c.score_composite.toFixed(1) : '—'}
                  </td>
                  <td className="px-3 py-2.5 text-[var(--text-secondary)]">{c.ch_business_category || '—'}</td>
                  <td className="px-3 py-2.5 text-[var(--text-secondary)]">{c.prospect_owner || '—'}</td>
                  <td className="px-3 py-2.5 text-[var(--text-secondary)]">{c.source_of_deal || '—'}</td>
                  <td className="px-3 py-2.5 text-[var(--text-secondary)] max-w-[200px] truncate" title={c.ai_brief || undefined}>{c.ai_brief || '—'}</td>
                  <td className="px-3 py-2.5 text-[var(--text-secondary)] max-w-[200px] truncate" title={c.description || undefined}>{c.description || '—'}</td>
                  <td className="px-3 py-2.5">
                    <span className={`font-mono ${c.completeness_score >= 70 ? 'text-[var(--green)]' : c.completeness_score >= 40 ? 'text-[var(--amber)]' : 'text-[var(--text-muted)]'}`}>
                      {Math.round(c.completeness_score)}%
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    {(() => {
                      const gaps = countCriticalMissing(c);
                      if (gaps === 0) return <span className="text-[var(--green)] text-[10px]">✓ all</span>;
                      return <span className={`inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap ${gaps >= 3 ? 'bg-[var(--red)]/15 text-[var(--red)]' : 'bg-amber-500/15 text-amber-400'}`}>{gaps} missing</span>;
                    })()}
                  </td>
                  <td className="px-3 py-2.5">
                    <button
                      onClick={() => handleExportOne(c)}
                      title={`Download ${c.name} CSV`}
                      className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={30} className="px-3 py-12 text-center text-[var(--text-muted)]">
                    {scrapedCompanies.length === 0
                      ? 'No companies scraped yet. Results will appear here as each company finishes.'
                      : 'No companies match your filters.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
