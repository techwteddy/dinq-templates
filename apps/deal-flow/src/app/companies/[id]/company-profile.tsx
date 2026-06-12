'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Company, DataPoint } from '@/lib/types';
import type { PipelineEvent } from '@/lib/pipeline-events';
import { exportCompanyCSV } from '@/lib/export-csv';
import { EventTimeline } from '@/components/event-timeline';

const SOURCE_COLORS: Record<string, string> = {
  linkedin: 'bg-blue-500/20 text-blue-400',
  companies_house: 'bg-emerald-500/20 text-emerald-400',
  web_search: 'bg-amber-500/20 text-amber-400',
  financial: 'bg-purple-500/20 text-purple-400',
  community: 'bg-orange-500/20 text-orange-400',
  tech_product: 'bg-cyan-500/20 text-cyan-400',
  ai_scoring: 'bg-violet-500/20 text-violet-400',
  manual: 'bg-gray-500/20 text-gray-400',
};

const CATEGORY_LABELS: Record<string, string> = {
  identity: 'Identity',
  location: 'Location & Contact',
  size: 'Size & Headcount',
  leadership: 'Leadership',
  financials: 'Financials',
  digital: 'Digital Presence',
  market: 'Market Context',
  corporate: 'Corporate Structure',
};

function SourceBadge({ source, sourceUrl }: { source: string; sourceUrl?: string | null }) {
  const badge = (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${SOURCE_COLORS[source] || SOURCE_COLORS.manual} ${sourceUrl ? 'cursor-pointer hover:brightness-125 transition-all' : ''}`}>
      {source.replace(/_/g, ' ')}
      {sourceUrl && (
        <svg className="h-2.5 w-2.5 opacity-60" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
      )}
    </span>
  );

  if (sourceUrl) {
    return (
      <a href={sourceUrl} target="_blank" rel="noopener noreferrer" title={sourceUrl}>
        {badge}
      </a>
    );
  }
  return badge;
}

function findSourceForMetric(dataPoints: DataPoint[], fieldPatterns: string[]): { url: string | null; source: string | null } {
  for (const pattern of fieldPatterns) {
    const dp = dataPoints.find(d =>
      d.field_name.toLowerCase().includes(pattern.toLowerCase()) && d.source_url
    );
    if (dp) return { url: dp.source_url, source: dp.source };
  }
  for (const pattern of fieldPatterns) {
    const dp = dataPoints.find(d => d.field_name.toLowerCase().includes(pattern.toLowerCase()));
    if (dp) return { url: dp.source_url, source: dp.source };
  }
  return { url: null, source: null };
}

// ─── Scrape Phases (matches pipeline table style) ────────────────────

const PHASE_KEYS = ['linkedin', 'companies_house', 'web_search', 'financial', 'community', 'tech_product'] as const;
const PHASE_LABELS: Record<string, string> = { linkedin: 'LinkedIn', companies_house: 'Companies House', web_search: 'Web Search', financial: 'Financial Sources', community: 'Community & Social', tech_product: 'Tech & Product' };
const PHASE_LETTERS: Record<string, string> = { linkedin: 'Li', companies_house: 'CH', web_search: 'WS', financial: 'Fn', community: 'Co', tech_product: 'Tp' };

const PHASE_BADGE_STYLES: Record<string, string> = {
  pending: 'bg-[var(--bg-surface)] text-[var(--text-muted)] ring-1 ring-[var(--border-subtle)]',
  complete: 'bg-[var(--green)]/20 text-[var(--green)]',
  failed: 'bg-[var(--red)]/20 text-[var(--red)]',
};

type PhaseStatus = { status: 'pending' | 'complete' | 'failed'; fields_found: number; error?: string };

function derivePhaseStatuses(events: PipelineEvent[], dataPoints: DataPoint[]): Record<string, PhaseStatus> {
  const result: Record<string, PhaseStatus> = {};
  for (const key of PHASE_KEYS) {
    result[key] = { status: 'pending', fields_found: 0 };
  }

  // Derive from pipeline events
  for (const event of events) {
    if (!event.phase) continue;
    if (event.event_type === 'company.phase_completed') {
      result[event.phase] = {
        status: 'complete',
        fields_found: (event.payload?.fields_found as number) || 0,
      };
    } else if (event.event_type === 'company.phase_failed') {
      result[event.phase] = {
        status: 'failed',
        fields_found: 0,
        error: (event.payload?.error as string) || undefined,
      };
    }
  }

  // If no events exist, derive from data points (legacy data)
  if (events.length === 0 && dataPoints.length > 0) {
    const sourceCounts: Record<string, number> = {};
    for (const dp of dataPoints) {
      sourceCounts[dp.source] = (sourceCounts[dp.source] || 0) + 1;
    }
    for (const key of PHASE_KEYS) {
      if (sourceCounts[key] && sourceCounts[key] > 0) {
        result[key] = { status: 'complete', fields_found: sourceCounts[key] };
      }
    }
  }

  return result;
}

function PhaseIndicatorDetail({ phase, phaseKey }: { phase: PhaseStatus; phaseKey: string }) {
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

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all hover:brightness-125 hover:scale-[1.02] cursor-pointer ${PHASE_BADGE_STYLES[phase.status]}`}
      >
        <span className={`inline-flex items-center justify-center h-5 w-6 rounded text-[8px] font-bold ${PHASE_BADGE_STYLES[phase.status]}`}>
          {PHASE_LETTERS[phaseKey]}
        </span>
        <span>{PHASE_LABELS[phaseKey]}</span>
        {phase.status === 'complete' && phase.fields_found > 0 && (
          <span className="opacity-60">({phase.fields_found})</span>
        )}
      </button>
      {open && (
        <div className="absolute z-50 top-full left-1/2 -translate-x-1/2 mt-3 w-72 rounded-xl border border-[var(--border-medium)] bg-[#16161F] shadow-2xl p-4 text-left">
          <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[8px] border-l-transparent border-r-transparent border-b-[#16161F]" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-[var(--text-bright)]">{PHASE_LABELS[phaseKey]}</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              phase.status === 'complete' ? 'text-[var(--green)] bg-[var(--green)]/10' :
              phase.status === 'failed' ? 'text-[var(--red)] bg-[var(--red)]/10' :
              'text-[var(--text-muted)] bg-[var(--bg-surface)]'
            }`}>
              {phase.status === 'complete' ? 'Completed' : phase.status === 'failed' ? 'Failed' : 'Not scraped'}
            </span>
          </div>
          {phase.status === 'complete' && phase.fields_found > 0 && (
            <p className="text-xs text-[var(--text-secondary)]">
              {phase.fields_found} data point{phase.fields_found !== 1 ? 's' : ''} extracted from this source.
            </p>
          )}
          {phase.status === 'failed' && (
            <div className="mt-2 rounded-lg bg-[var(--red)]/10 px-3 py-2.5">
              <p className="text-xs text-[var(--red)] font-semibold mb-1">Why it failed</p>
              <p className="text-xs text-[var(--text-secondary)] break-words leading-relaxed">
                {phase.error || 'No error details available. The scraper may have timed out or the source was unreachable.'}
              </p>
            </div>
          )}
          {phase.status === 'pending' && (
            <p className="text-xs text-[var(--text-muted)] mt-1">
              This source was not scraped. The scraper may have timed out before reaching it, or it wasn&apos;t applicable for this company.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function ScrapePhases({ phaseStatuses }: { phaseStatuses: Record<string, PhaseStatus> }) {
  const completedCount = PHASE_KEYS.filter(k => phaseStatuses[k]?.status === 'complete').length;
  const failedCount = PHASE_KEYS.filter(k => phaseStatuses[k]?.status === 'failed').length;

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Scrape Sources</h3>
        <div className="flex items-center gap-3 text-[10px]">
          {completedCount > 0 && (
            <span className="text-[var(--green)]">{completedCount} completed</span>
          )}
          {failedCount > 0 && (
            <span className="text-[var(--red)]">{failedCount} failed</span>
          )}
          {PHASE_KEYS.length - completedCount - failedCount > 0 && (
            <span className="text-[var(--text-muted)]">{PHASE_KEYS.length - completedCount - failedCount} not scraped</span>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {PHASE_KEYS.map(key => (
          <PhaseIndicatorDetail key={key} phaseKey={key} phase={phaseStatuses[key] || { status: 'pending', fields_found: 0 }} />
        ))}
      </div>
    </div>
  );
}

// ─── Critical Fields ─────────────────────────────────────────────────
const GENERIC_INDUSTRIES = new Set([
  'technology', 'software', 'it', 'information technology', 'software development',
  'saas', 'internet', 'computer software', 'tech', 'digital', 'services',
]);

const CRITICAL_FIELDS: {
  key: string;
  label: string;
  priority: 'high' | 'medium';
  check: (c: Company) => boolean;
}[] = [
  { key: 'sub_industry', label: 'Sub-Industry', priority: 'high', check: (c) => !!c.sub_industry && !GENERIC_INDUSTRIES.has(c.sub_industry.toLowerCase().trim()) },
  { key: 'employee_growth_pct', label: 'Employee Growth %', priority: 'high', check: (c) => c.employee_growth_pct != null },
  { key: 'is_saas', label: 'SaaS Status', priority: 'high', check: (c) => c.is_saas != null },
  { key: 'ownership_status', label: 'Ownership Status', priority: 'high', check: (c) => !!c.ownership_status },
  { key: 'revenue_estimate', label: 'Revenue / ARR', priority: 'high', check: (c) => !!c.revenue_estimate },
  { key: 'employee_count', label: 'Employee Count', priority: 'medium', check: (c) => !!c.employee_count },
  { key: 'funding_total', label: 'Funding History', priority: 'medium', check: (c) => !!c.funding_total },
  { key: 'investors', label: 'Investors', priority: 'medium', check: (c) => !!c.investors },
  { key: 'location_country', label: 'Country', priority: 'medium', check: (c) => !!c.location_country },
];

const RANKING_COLORS: Record<string, string> = {
  'Great': 'bg-emerald-500 text-white',
  'Good': 'bg-green-500 text-white',
  'High Ok': 'bg-amber-500 text-white',
  'Ok': 'bg-gray-500 text-white',
  'Small & Interesting': 'bg-teal-500 text-white',
  'Poor': 'bg-red-500 text-white',
};

function DealQualification({ company }: { company: Company }) {
  return (
    <div className="card p-4">
      <h3 className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-3">Deal Qualification</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className={`rounded-lg px-3 py-2 text-xs ${company.is_saas === true ? 'bg-emerald-500/10 text-emerald-400' : company.is_saas === false ? 'bg-red-500/10 text-red-400' : 'bg-[var(--bg-surface)] text-[var(--text-muted)]'}`}>
          <div className="text-[10px] opacity-70 uppercase">SaaS</div>
          <div className="font-medium mt-0.5">{company.is_saas === true ? 'Yes' : company.is_saas === false ? 'No' : '—'}</div>
        </div>
        <div className={`rounded-lg px-3 py-2 text-xs ${company.ownership_status === 'private' ? 'bg-emerald-500/10 text-emerald-400' : company.ownership_status ? 'bg-red-500/10 text-red-400' : 'bg-[var(--bg-surface)] text-[var(--text-muted)]'}`}>
          <div className="text-[10px] opacity-70 uppercase">Ownership</div>
          <div className="font-medium mt-0.5 capitalize">{company.ownership_status || '—'}</div>
        </div>
        <div className="rounded-lg px-3 py-2 text-xs bg-[var(--bg-surface)]">
          <div className="text-[10px] text-[var(--text-muted)] opacity-70 uppercase">Location</div>
          <div className="font-medium mt-0.5 text-[var(--text-secondary)]">
            {[company.location_city, company.location_country].filter(Boolean).join(', ') || '—'}
          </div>
        </div>
        <div className="rounded-lg px-3 py-2 text-xs bg-[var(--bg-surface)]">
          <div className="text-[10px] text-[var(--text-muted)] opacity-70 uppercase">Last Funding</div>
          <div className="font-medium mt-0.5 text-[var(--text-secondary)]">
            {company.last_funding_amount || '—'}
            {company.last_funding_date && <span className="text-[var(--text-muted)] ml-1">({company.last_funding_date})</span>}
          </div>
        </div>
      </div>
      {company.investors && (
        <div className="mt-3 text-xs">
          <span className="text-[var(--text-muted)]">Investors: </span>
          <span className="text-[var(--text-secondary)]">{company.investors}</span>
        </div>
      )}
      {company.ranking && (
        <div className="mt-3 flex items-center gap-2">
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${RANKING_COLORS[company.ranking] || 'bg-gray-500 text-white'}`}>
            {company.ranking}
          </span>
          {company.score_composite != null && (
            <span className="text-xs text-[var(--text-muted)] font-mono">{company.score_composite.toFixed(1)}/5.0</span>
          )}
        </div>
      )}
      {company.ai_brief && (
        <div className="mt-3 text-xs text-[var(--text-secondary)] italic border-l-2 border-[var(--accent)] pl-3">
          {company.ai_brief}
        </div>
      )}
    </div>
  );
}

function CriticalFields({ company }: { company: Company }) {
  const results = CRITICAL_FIELDS.map(f => ({ ...f, found: f.check(company) }));
  const foundCount = results.filter(r => r.found).length;
  const missing = results.filter(r => !r.found);

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Critical Fields</h3>
        <span className={`text-xs font-medium ${foundCount === results.length ? 'text-[var(--green)]' : missing.some(m => m.priority === 'high') ? 'text-[var(--red)]' : 'text-amber-400'}`}>
          {foundCount}/{results.length} found
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {results.map(r => (
          <div key={r.key} className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs ${r.found ? 'bg-[var(--green)]/10 text-[var(--green)]' : r.priority === 'high' ? 'bg-[var(--red)]/10 text-[var(--red)]' : 'bg-amber-500/10 text-amber-400'}`}>
            <span className="text-sm">{r.found ? '✓' : '✗'}</span>
            <span>{r.label}</span>
          </div>
        ))}
      </div>
      {missing.length > 0 && (
        <p className="mt-3 text-[10px] text-[var(--text-muted)]">
          Missing: {missing.map(m => m.label).join(', ')}
          {missing.some(m => m.priority === 'high') && ' — includes high-priority fields'}
        </p>
      )}
    </div>
  );
}

// ─── Completeness Breakdown ──────────────────────────────────────────
const COMPLETENESS_DIMENSIONS = [
  { category: 'identity', label: 'Identity', expected: 5, weight: 15 },
  { category: 'location', label: 'Location', expected: 3, weight: 10 },
  { category: 'size', label: 'Headcount', expected: 4, weight: 15 },
  { category: 'leadership', label: 'Leadership', expected: 3, weight: 10 },
  { category: 'corporate', label: 'Corporate', expected: 4, weight: 5 },
  { category: 'financials', label: 'Financials', expected: 4, weight: 20 },
  { category: 'digital', label: 'Digital', expected: 3, weight: 5 },
  { category: 'market', label: 'Market', expected: 4, weight: 20 },
] as const;

function CompletenessBreakdown({ dataPoints }: { dataPoints: DataPoint[] }) {
  const counts: Record<string, number> = {};
  for (const dp of dataPoints) {
    counts[dp.category] = (counts[dp.category] || 0) + 1;
  }

  return (
    <div className="card p-4">
      <h3 className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-3">Completeness Breakdown</h3>
      <div className="space-y-2">
        {COMPLETENESS_DIMENSIONS.map(dim => {
          const found = counts[dim.category] || 0;
          const pct = Math.min(100, Math.round((found / dim.expected) * 100));
          return (
            <div key={dim.category} className="flex items-center gap-3">
              <span className="text-xs text-[var(--text-muted)] w-20 shrink-0">{dim.label}</span>
              <div className="flex-1 h-1.5 rounded-full bg-[var(--bg-surface)] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${pct >= 100 ? 'bg-[var(--green)]' : pct > 0 ? 'bg-[var(--accent)]' : ''}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-[var(--text-muted)] w-16 text-right shrink-0">
                {found}/{dim.expected} <span className="opacity-50">({dim.weight}%)</span>
              </span>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-[9px] text-[var(--text-muted)]">
        Weighted by PE screening importance. Financials + Market = 40%.
      </p>
    </div>
  );
}

function MetricCard({ label, value, sourceUrl, source, wide }: { label: string; value: string; sourceUrl?: string | null; source?: string | null; wide?: boolean }) {
  return (
    <div className={`card p-3 group relative ${wide ? 'col-span-2' : ''}`}>
      <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
        {label}
        {source && (
          <span className={`inline-flex rounded-full px-1.5 py-0 text-[8px] font-medium ${SOURCE_COLORS[source] || SOURCE_COLORS.manual}`}>
            {source.replace(/_/g, ' ')}
          </span>
        )}
      </div>
      <div className="mt-1 flex items-center gap-1.5 min-w-0">
        <span className="text-sm font-semibold text-[var(--text-bright)] truncate" title={value}>{value}</span>
        {sourceUrl && (
          <a href={sourceUrl} target="_blank" rel="noopener noreferrer" title={sourceUrl}
            className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors shrink-0">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}

function RescrapeModal({ companyId, onClose }: { companyId: string; onClose: () => void }) {
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit() {
    if (!reason.trim()) return;
    setSubmitting(true);
    await fetch('/api/rescrape', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companyId, reason: reason.trim() }),
    });
    router.refresh();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="card w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
        <h3 className="text-sm font-semibold text-[var(--text-bright)] mb-3">Rescrape Company</h3>
        <p className="text-xs text-[var(--text-muted)] mb-4">
          This will delete all existing data and re-run the scraper. Describe what needs fixing:
        </p>
        <textarea
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="e.g., Revenue is wrong, CEO outdated, these URLs are bad: ..."
          className="w-full rounded-lg border border-[var(--border-medium)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] resize-none"
          rows={4}
          autoFocus
        />
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg px-3 py-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!reason.trim() || submitting}
            className="rounded-lg bg-[var(--accent)] px-4 py-2 text-xs font-medium text-white hover:brightness-110 transition-all disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Rescrape'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CompanyProfile({
  company,
  dataPoints,
  phaseEvents,
}: {
  company: Company;
  dataPoints: DataPoint[];
  phaseEvents: PipelineEvent[];
}) {
  const [showRescrape, setShowRescrape] = useState(false);
  const isRescrapeDisabled = company.scrape_status === 'scraping' || company.scrape_status === 'rescrape';
  const phaseStatuses = derivePhaseStatuses(phaseEvents, dataPoints);
  // Group data points by category
  const grouped = dataPoints.reduce<Record<string, DataPoint[]>>((acc, dp) => {
    if (!acc[dp.category]) acc[dp.category] = [];
    acc[dp.category].push(dp);
    return acc;
  }, {});

  const categoryOrder = ['identity', 'location', 'size', 'leadership', 'corporate', 'financials', 'digital', 'market'];
  const sortedCategories = categoryOrder.filter(c => grouped[c]);

  // Find source URLs for key metrics
  const employeeSource = findSourceForMetric(dataPoints, ['employee count', 'company size', 'headcount', 'employees']);
  const revenueSource = findSourceForMetric(dataPoints, ['revenue', 'arr', 'annual revenue', 'turnover']);
  const fundingSource = findSourceForMetric(dataPoints, ['funding', 'total raised', 'series', 'investment']);
  const growthSource = findSourceForMetric(dataPoints, ['growth', 'headcount growth', 'employee growth']);
  const growth6mSource = findSourceForMetric(dataPoints, ['6 month growth', '6m growth', 'headcount growth 6m']);
  const investorsSource = findSourceForMetric(dataPoints, ['investors', 'key investors', 'backed by']);

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      {/* Back link */}
      <Link href={company.batch_id ? `/pipeline/${company.batch_id}` : '/upload'}
        className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
        &larr; Back to pipeline
      </Link>

      {/* Header */}
      <div className="mt-4 animate-fade-up">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-[var(--text-bright)]">{company.name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--text-secondary)]">
              {company.industry && <span>{company.industry}</span>}
              {company.sub_industry && (
                <span className="rounded-full bg-[var(--accent)]/10 px-2 py-0.5 text-[var(--accent)]">
                  {company.sub_industry}
                </span>
              )}
              {company.hq_location && <span className="text-[var(--text-muted)]">&middot; {company.hq_location}</span>}
              {company.founded_year && <span className="text-[var(--text-muted)]">&middot; Founded {company.founded_year}</span>}
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => exportCompanyCSV(company, dataPoints)}
              disabled={dataPoints.length === 0}
              className="rounded-lg border border-[var(--border-medium)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-bright)] hover:bg-[var(--bg-hover)] transition-colors disabled:opacity-50"
            >
              Download CSV
            </button>
            <button
              onClick={() => setShowRescrape(true)}
              disabled={isRescrapeDisabled}
              className="rounded-lg border border-amber-500/40 px-3 py-2 text-xs font-medium text-amber-400 hover:bg-amber-500/10 transition-colors disabled:opacity-50"
            >
              Rescrape
            </button>
            <div className="text-right">
              <div className="text-3xl font-bold text-[var(--accent)] font-mono">
                {Math.round(company.completeness_score)}%
              </div>
              <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Complete</div>
            </div>
          </div>
        </div>

        {/* Key metrics with sources */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <MetricCard label="Employees" value={company.employee_count || '—'} sourceUrl={employeeSource.url} source={employeeSource.source} />
          <MetricCard label="Revenue" value={company.revenue_estimate || '—'} sourceUrl={revenueSource.url} source={revenueSource.source} />
          <MetricCard label="Total Funding" value={company.funding_total || '—'} sourceUrl={fundingSource.url} source={fundingSource.source} />
          <MetricCard label="Growth (1yr)" value={company.employee_growth_pct ? `${company.employee_growth_pct}%` : '—'} sourceUrl={growthSource.url} source={growthSource.source} />
          <MetricCard label="Growth (6m)" value={company.headcount_growth_6m ? `${company.headcount_growth_6m}%` : '—'} sourceUrl={growth6mSource.url} source={growth6mSource.source} />
          <MetricCard label="Investors" value={company.investors || '—'} sourceUrl={investorsSource.url} source={investorsSource.source} wide />
        </div>
      </div>

      {/* Scrape Sources — phase status with same square badge style as pipeline table */}
      <div className="mt-6 animate-fade-up" style={{ animationDelay: '0.015s' }}>
        <ScrapePhases phaseStatuses={phaseStatuses} />
      </div>

      {/* Deal Qualification */}
      <div className="mt-6 animate-fade-up" style={{ animationDelay: '0.02s' }}>
        <DealQualification company={company} />
      </div>

      {/* Critical fields tracker */}
      {dataPoints.length > 0 && (
        <div className="mt-6 animate-fade-up" style={{ animationDelay: '0.03s' }}>
          <CriticalFields company={company} />
        </div>
      )}

      {/* Completeness breakdown */}
      {dataPoints.length > 0 && (
        <div className="mt-6 animate-fade-up" style={{ animationDelay: '0.05s' }}>
          <CompletenessBreakdown dataPoints={dataPoints} />
        </div>
      )}

      {/* Event timeline */}
      <div className="mt-6 animate-fade-up" style={{ animationDelay: '0.07s' }}>
        <div className="card p-4">
          <h3 className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-3">Scrape History</h3>
          <EventTimeline companyId={company.id} limit={100} />
        </div>
      </div>

      {/* Data points by category */}
      <div className="mt-6 space-y-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
        {sortedCategories.map(category => (
          <div key={category} className="card overflow-hidden">
            <div className="px-4 py-2.5 bg-[var(--bg-surface)] border-b border-[var(--border-subtle)]">
              <h3 className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                {CATEGORY_LABELS[category] || category}
              </h3>
            </div>
            <div className="divide-y divide-[var(--border-subtle)]">
              {grouped[category].map(dp => (
                <div key={dp.id} className="flex items-start gap-4 px-4 py-2.5">
                  <span className="text-sm text-[var(--text-secondary)] w-40 shrink-0">
                    {dp.field_name.replace(/_/g, ' ')}
                  </span>
                  <span className="text-sm text-[var(--text-primary)] flex-1 break-words" title={dp.field_value || undefined}>
                    {dp.field_value || '—'}
                  </span>
                  <SourceBadge source={dp.source} sourceUrl={dp.source_url} />
                </div>
              ))}
            </div>
          </div>
        ))}

        {dataPoints.length === 0 && (
          <div className="card p-12 text-center">
            <p className="text-sm text-[var(--text-muted)]">No data points yet. Scraping has not started.</p>
          </div>
        )}
      </div>

      {showRescrape && (
        <RescrapeModal companyId={company.id} onClose={() => setShowRescrape(false)} />
      )}
    </main>
  );
}
