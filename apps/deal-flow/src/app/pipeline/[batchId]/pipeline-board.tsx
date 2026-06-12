'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRealtimeBatch, useRealtimeCompanies, useRealtimePipelineEvents } from '@/lib/use-realtime';
import type { Batch, Company } from '@/lib/types';
import type { PipelineEvent } from '@/lib/pipeline-events';

function formatDuration(seconds: number | null): string {
  if (!seconds) return '—';
  if (seconds < 60) return `${Math.round(seconds)}s`;
  return `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`;
}

const PHASE_BADGE_STYLES: Record<string, string> = {
  pending: 'bg-[var(--bg-surface)] text-[var(--text-muted)] ring-1 ring-[var(--border-subtle)]',
  running: 'bg-[var(--accent)]/20 text-[var(--accent)] animate-pulse-glow',
  complete: 'bg-[var(--green)]/20 text-[var(--green)]',
  no_data: 'bg-amber-500/20 text-amber-400',
  failed: 'bg-[var(--red)]/20 text-[var(--red)]',
};

const PHASE_KEYS = ['linkedin', 'companies_house', 'web_search', 'financial', 'community', 'tech_product'] as const;
const PHASE_LETTERS: Record<string, string> = { linkedin: 'Li', companies_house: 'CH', web_search: 'WS', financial: 'Fn', community: 'Co', tech_product: 'Tp' };
const PHASE_LABELS: Record<string, string> = { linkedin: 'LinkedIn', companies_house: 'Companies House', web_search: 'Web Search', financial: 'Financial', community: 'Community', tech_product: 'Tech & Product' };

type PhaseStatus = { status: 'pending' | 'complete' | 'no_data' | 'failed'; fields_found: number; error?: string };

function derivePhaseStatuses(companyId: string, events: PipelineEvent[]): Record<string, PhaseStatus> {
  const result: Record<string, PhaseStatus> = {};
  for (const key of PHASE_KEYS) {
    result[key] = { status: 'pending', fields_found: 0 };
  }

  for (const event of events) {
    if (event.company_id !== companyId || !event.phase) continue;
    if (event.event_type === 'company.phase_completed') {
      result[event.phase] = {
        status: 'complete',
        fields_found: (event.payload?.fields_found as number) || 0,
      };
    } else if (event.event_type === 'company.phase_no_data') {
      result[event.phase] = {
        status: 'no_data',
        fields_found: 0,
      };
    } else if (event.event_type === 'company.phase_failed') {
      result[event.phase] = {
        status: 'failed',
        fields_found: 0,
        error: (event.payload?.error as string) || undefined,
      };
    }
  }

  return result;
}

function PhaseIndicator({ phase, letter }: { phase: PhaseStatus; letter: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const statusLabel: Record<string, string> = {
    complete: 'Completed',
    no_data: 'No Data',
    failed: 'Failed',
    pending: 'Pending',
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(!open); }}
        className={`inline-flex items-center justify-center h-6 w-7 rounded text-[9px] font-bold ${PHASE_BADGE_STYLES[phase.status] || PHASE_BADGE_STYLES.pending} cursor-pointer hover:brightness-125 hover:scale-110 transition-all`}
      >
        {letter}
      </button>
      {open && (
        <div className="absolute z-50 top-full left-1/2 -translate-x-1/2 mt-3 w-72 rounded-xl border border-[var(--border-medium)] bg-[#16161F] shadow-2xl p-4 text-left">
          <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[8px] border-l-transparent border-r-transparent border-b-[#16161F]" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-[var(--text-bright)]">{PHASE_LABELS[PHASE_KEYS.find(k => PHASE_LETTERS[k] === letter) || ''] || letter}</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              phase.status === 'complete' ? 'text-[var(--green)] bg-[var(--green)]/10' :
              phase.status === 'no_data' ? 'text-amber-400 bg-amber-500/10' :
              phase.status === 'failed' ? 'text-[var(--red)] bg-[var(--red)]/10' :
              'text-[var(--text-muted)] bg-[var(--bg-surface)]'
            }`}>
              {statusLabel[phase.status] || phase.status}
            </span>
          </div>
          {phase.fields_found > 0 && (
            <p className="text-xs text-[var(--text-secondary)]">
              {phase.fields_found} field{phase.fields_found !== 1 ? 's' : ''} extracted
            </p>
          )}
          {phase.status === 'no_data' && (
            <div className="mt-3 rounded-lg bg-amber-500/10 px-3 py-2.5">
              <p className="text-xs text-amber-400 font-semibold mb-1">No data returned</p>
              <p className="text-xs text-[var(--text-secondary)] break-words leading-relaxed">
                The scraper ran successfully but found no data for this source. The company may not be listed here.
              </p>
            </div>
          )}
          {phase.status === 'failed' && (
            <div className="mt-3 rounded-lg bg-[var(--red)]/10 px-3 py-2.5">
              <p className="text-xs text-[var(--red)] font-semibold mb-1">Why it failed</p>
              <p className="text-xs text-[var(--text-secondary)] break-words leading-relaxed">
                {phase.error || 'No error details available. The scraper may have timed out or the source was unreachable.'}
              </p>
            </div>
          )}
          {phase.status === 'pending' && (
            <p className="text-xs text-[var(--text-muted)] mt-2">
              This source hasn&apos;t been scraped yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function getEffectiveStatus(company: Company): { label: string; color: string } {
  const statusColors: Record<string, string> = {
    pending: 'text-[var(--text-muted)]',
    retry_queued: 'text-amber-400',
    scraping: 'text-[var(--accent)]',
    scraped: 'text-[var(--green)]',
    failed: 'text-[var(--red)]',
    skipped: 'text-zinc-500',
    rescrape: 'text-amber-400',
  };

  if (company.scrape_status === 'retry_queued') {
    return { label: 'queued', color: statusColors.retry_queued };
  }

  return { label: company.scrape_status, color: statusColors[company.scrape_status] || '' };
}

function CompanyRow({ company, phaseStatuses }: { company: Company; phaseStatuses: Record<string, PhaseStatus> }) {
  const totalFields = Object.values(phaseStatuses).reduce((sum, p) => sum + p.fields_found, 0);
  const effectiveStatus = getEffectiveStatus(company);

  return (
    <div className={`flex items-center gap-4 px-4 py-3 border-b border-[var(--border-subtle)] transition-colors ${
      company.scrape_status === 'scraping' ? 'bg-[var(--accent-glow)]' :
      company.scrape_status === 'retry_queued' ? 'bg-amber-500/5' : 'hover:bg-[var(--bg-hover)]'
    }`}>
      {/* Name + LinkedIn */}
      <div className="flex-1 min-w-0">
        <Link href={`/companies/${company.id}`} className="text-sm font-medium text-[var(--text-bright)] hover:text-[var(--accent)] transition-colors truncate block">
          {company.name}
        </Link>
        {company.linkedin_url && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <p className="text-[10px] text-[var(--text-muted)] truncate">{company.linkedin_url}</p>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigator.clipboard.writeText(company.linkedin_url!);
                const btn = e.currentTarget;
                btn.textContent = '✓';
                btn.classList.add('text-[var(--green)]');
                setTimeout(() => { btn.innerHTML = '<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" /></svg>'; btn.classList.remove('text-[var(--green)]'); }, 1500);
              }}
              title="Copy LinkedIn URL"
              className="shrink-0 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors p-0.5"
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Phase badges */}
      <div className="flex items-center gap-1">
        {PHASE_KEYS.map(key => (
          <PhaseIndicator key={key} letter={PHASE_LETTERS[key]} phase={phaseStatuses[key]} />
        ))}
      </div>

      {/* Fields count */}
      <span className={`text-[10px] font-mono w-10 text-right ${
        totalFields === 0 ? 'text-[var(--text-muted)]' :
        totalFields < 10 ? 'text-[var(--red)]' :
        totalFields < 20 ? 'text-amber-400' :
        'text-[var(--green)]'
      }`}>
        {totalFields > 0 ? `${totalFields}f` : '—'}
      </span>

      {/* Duration */}
      <span className="text-xs text-[var(--text-muted)] w-14 text-right font-mono">
        {formatDuration(company.scrape_duration_seconds)}
      </span>

      {/* Status */}
      <span className={`text-[10px] font-medium w-16 text-right ${effectiveStatus.color}`}>
        {effectiveStatus.label}
      </span>
    </div>
  );
}

export default function PipelineBoard({
  initialBatch,
  initialCompanies,
  initialPhaseEvents,
}: {
  initialBatch: Batch;
  initialCompanies: Company[];
  initialPhaseEvents: PipelineEvent[];
}) {
  const batch = useRealtimeBatch(initialBatch.id, initialBatch);
  const companies = useRealtimeCompanies(initialBatch.id, initialCompanies);
  const phaseEvents = useRealtimePipelineEvents(initialBatch.id, initialPhaseEvents);

  const [retryLoading, setRetryLoading] = useState<string | null>(null);

  // Derive phase statuses per company from events
  const companyPhases = useMemo(() => {
    const map: Record<string, Record<string, PhaseStatus>> = {};
    for (const company of companies) {
      map[company.id] = derivePhaseStatuses(company.id, phaseEvents);
    }
    return map;
  }, [companies, phaseEvents]);

  const scrapedCount = companies.filter(c => c.scrape_status === 'scraped').length;
  const failedCount = companies.filter(c => c.scrape_status === 'failed').length;
  const retryQueuedCount = companies.filter(c => c.scrape_status === 'retry_queued').length;
  const skippedCount = companies.filter(c => c.scrape_status === 'skipped').length;
  const currentCompany = companies.find(c => c.scrape_status === 'scraping');
  const isActive = batch.status === 'scraping';

  async function handleBatchRetry(mode: 'failed' | 'all') {
    setRetryLoading(mode);
    try {
      await fetch('/api/batch-retry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchId: batch.id, mode }),
      });
    } finally {
      setRetryLoading(null);
    }
  }
  const progressPct = batch.total_companies > 0 ? (scrapedCount / batch.total_companies) * 100 : 0;

  const completedDurations = companies
    .filter(c => c.scrape_duration_seconds)
    .map(c => c.scrape_duration_seconds!);
  const avgTime = completedDurations.length > 0
    ? completedDurations.reduce((a, b) => a + b, 0) / completedDurations.length
    : null;
  const remaining = batch.total_companies - scrapedCount - failedCount - skippedCount;
  const eta = avgTime && remaining > 0 ? avgTime * remaining : null;

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      {/* Header */}
      <div className="animate-fade-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[var(--text-bright)]">{batch.name}</h1>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {batch.total_companies} companies &middot; Started {new Date(batch.created_at).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {failedCount > 0 && (
              <button
                onClick={() => handleBatchRetry('failed')}
                disabled={isActive || retryLoading !== null}
                className="rounded-lg border border-[var(--red)]/40 px-3 py-2 text-xs font-medium text-[var(--red)] hover:bg-[var(--red)]/10 disabled:opacity-50 transition-all"
              >
                {retryLoading === 'failed' ? 'Retrying...' : `Retry Failed (${failedCount})`}
              </button>
            )}
            {batch.status === 'complete' && (
              <button
                onClick={() => handleBatchRetry('all')}
                disabled={retryLoading !== null}
                className="rounded-lg border border-[var(--accent)]/40 px-3 py-2 text-xs font-medium text-[var(--accent)] hover:bg-[var(--accent)]/10 disabled:opacity-50 transition-all"
              >
                {retryLoading === 'all' ? 'Triggering...' : 'Run Scraper'}
              </button>
            )}
            <Link
              href={`/results/${batch.id}`}
              className="rounded-lg border border-[var(--border-medium)] px-4 py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-bright)] hover:bg-[var(--bg-hover)] transition-colors"
            >
              View Results
            </Link>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6 card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-[var(--text-bright)] font-mono">
                {scrapedCount}/{batch.total_companies}
              </span>
              <span className="text-xs text-[var(--text-secondary)]">scraped</span>
              {failedCount > 0 && (
                <span className="text-xs text-[var(--red)]">{failedCount} failed</span>
              )}
              {skippedCount > 0 && (
                <span className="text-xs text-zinc-500">{skippedCount} skipped</span>
              )}
              {retryQueuedCount > 0 && (
                <span className="text-xs text-amber-400">{retryQueuedCount} queued</span>
              )}
            </div>
            <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
              {avgTime && <span>Avg: {formatDuration(avgTime)}/company</span>}
              {eta && <span>ETA: {formatDuration(eta)}</span>}
            </div>
          </div>

          <div className="h-2 rounded-full bg-[var(--bg-surface)] overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {currentCompany && (
            <div className="mt-3 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[var(--accent)] animate-pulse-glow" />
              <span className="text-xs text-[var(--accent)]">
                Currently scraping: {currentCompany.name}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Phase legend */}
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] text-[var(--text-secondary)]">
        <div className="flex items-center gap-3">
          <span className="uppercase tracking-wider font-medium">Phases:</span>
          {PHASE_KEYS.map(key => (
            <span key={key} className="flex items-center gap-1.5">
              <span className="inline-flex items-center justify-center h-5 w-6 rounded text-[8px] font-bold bg-[var(--bg-surface)] text-[var(--text-muted)] ring-1 ring-[var(--border-subtle)]">{PHASE_LETTERS[key]}</span>
              {PHASE_LABELS[key]}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3 border-l border-[var(--border-subtle)] pl-4">
          <span className="flex items-center gap-1.5"><span className="inline-flex items-center justify-center h-5 w-6 rounded text-[8px] font-bold bg-[var(--green)]/20 text-[var(--green)]">Li</span> Done</span>
          <span className="flex items-center gap-1.5"><span className="inline-flex items-center justify-center h-5 w-6 rounded text-[8px] font-bold bg-amber-500/20 text-amber-400">Li</span> No Data</span>
          <span className="flex items-center gap-1.5"><span className="inline-flex items-center justify-center h-5 w-6 rounded text-[8px] font-bold bg-[var(--red)]/20 text-[var(--red)]">Li</span> Failed</span>
          <span className="flex items-center gap-1.5"><span className="inline-flex items-center justify-center h-5 w-6 rounded text-[8px] font-bold bg-[var(--accent)]/20 text-[var(--accent)] animate-pulse-glow">Li</span> Running</span>
        </div>
      </div>

      {/* Company list */}
      <div className="mt-4 card overflow-hidden animate-fade-up" style={{ animationDelay: '0.1s' }}>
        <div className="px-4 py-2.5 bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] flex items-center gap-4 text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-medium">
          <span className="flex-1">Company</span>
          <span className="w-[130px] text-center">Phases</span>
          <span className="w-10 text-right">Fields</span>
          <span className="w-14 text-right">Time</span>
          <span className="w-16 text-right">Status</span>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {companies.map(company => (
            <CompanyRow key={company.id} company={company} phaseStatuses={companyPhases[company.id] || {}} />
          ))}
        </div>
      </div>
    </main>
  );
}
