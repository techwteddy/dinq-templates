'use client';

import { useState, useMemo } from 'react';
import type { Batch } from '@/lib/types';
import type { PipelineEvent } from '@/lib/pipeline-events';
import { EventTimeline } from '@/components/event-timeline';

function formatDuration(seconds: number | null): string {
  if (!seconds) return '—';
  if (seconds < 60) return `${Math.round(seconds)}s`;
  return `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`;
}

const EVENT_COLORS: Record<string, string> = {
  'company.scrape_completed': 'var(--green)',
  'company.scrape_failed': 'var(--red)',
  'company.retry_requested': 'var(--amber)',
  'company.retry_auto': 'var(--amber)',
  'company.rescrape_requested': 'var(--accent)',
};

export default function BatchLogs({
  batches,
  events,
}: {
  batches: Batch[];
  events: PipelineEvent[];
}) {
  const [selectedBatchId, setSelectedBatchId] = useState<string>(batches[0]?.id || '');

  const selectedBatch = batches.find((b) => b.id === selectedBatchId);

  // Filter events for selected batch
  const batchEvents = useMemo(
    () => events.filter((e) => e.batch_id === selectedBatchId),
    [events, selectedBatchId]
  );

  // Compute stats from events
  const stats = useMemo(() => {
    const completed = batchEvents.filter((e) => e.event_type === 'company.scrape_completed');
    const failed = batchEvents.filter((e) => e.event_type === 'company.scrape_failed');
    const retries = batchEvents.filter((e) =>
      e.event_type === 'company.retry_requested' || e.event_type === 'company.retry_auto'
    );
    const rescrapes = batchEvents.filter((e) => e.event_type === 'company.rescrape_requested');

    // Avg completeness from completed events
    const completenessValues = completed
      .map((e) => (e.payload?.completeness as number) || 0)
      .filter(Boolean);
    const avgCompleteness =
      completenessValues.length > 0
        ? Math.round(completenessValues.reduce((a, b) => a + b, 0) / completenessValues.length)
        : 0;

    // Avg duration from completed events
    const durationValues = completed
      .map((e) => (e.payload?.duration_s as number) || 0)
      .filter(Boolean);
    const avgDuration =
      durationValues.length > 0
        ? durationValues.reduce((a, b) => a + b, 0) / durationValues.length
        : 0;

    const totalFinished = completed.length + failed.length;
    const errorRate = totalFinished > 0 ? Math.round((failed.length / totalFinished) * 100) : 0;

    return {
      completed: completed.length,
      failed: failed.length,
      retries: retries.length,
      rescrapes: rescrapes.length,
      avgCompleteness,
      avgDuration,
      errorRate,
      totalEvents: batchEvents.length,
    };
  }, [batchEvents]);

  // Error type breakdown from failed events
  const errorTypes = useMemo(() => {
    const types: Record<string, number> = {};
    for (const e of batchEvents) {
      if (e.event_type === 'company.scrape_failed' && e.payload?.error_type) {
        const t = String(e.payload.error_type);
        types[t] = (types[t] || 0) + 1;
      }
    }
    return types;
  }, [batchEvents]);

  const maxErrorCount = Math.max(...Object.values(errorTypes), 1);

  const ERROR_COLORS: Record<string, string> = {
    timeout: 'var(--amber)',
    budget_exceeded: 'var(--accent)',
    claude_error: 'var(--red)',
    no_data: 'var(--text-muted)',
  };

  return (
    <div className="space-y-6">
      {/* Batch selector */}
      <div className="card p-4">
        <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider block mb-2">
          Select Batch
        </label>
        <select
          value={selectedBatchId}
          onChange={(e) => setSelectedBatchId(e.target.value)}
          className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-bright)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
        >
          {batches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name} — {b.total_companies} companies — {b.status}
              {' '}({new Date(b.created_at).toLocaleDateString()})
            </option>
          ))}
        </select>
      </div>

      {selectedBatch && (
        <>
          {/* Stats cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <StatCard label="Companies" value={`${selectedBatch.scraped_count}/${selectedBatch.total_companies}`} />
            <StatCard label="Completed" value={stats.completed.toString()} sub={`${stats.failed} failed`} />
            <StatCard label="Avg Completeness" value={`${stats.avgCompleteness}%`} color={stats.avgCompleteness >= 70 ? 'var(--green)' : stats.avgCompleteness >= 40 ? 'var(--amber)' : 'var(--red)'} />
            <StatCard label="Avg Duration" value={formatDuration(stats.avgDuration)} />
            <StatCard label="Error Rate" value={`${stats.errorRate}%`} color={stats.errorRate <= 10 ? 'var(--green)' : stats.errorRate <= 30 ? 'var(--amber)' : 'var(--red)'} />
            <StatCard label="Retries" value={`${stats.retries}`} sub={`${stats.rescrapes} rescrapes`} />
          </div>

          {/* Error breakdown */}
          {Object.keys(errorTypes).length > 0 && (
            <div className="card p-4">
              <h3 className="text-xs font-semibold text-[var(--text-bright)] uppercase tracking-wider mb-3">
                Error Breakdown
              </h3>
              <div className="space-y-2">
                {Object.entries(errorTypes)
                  .sort((a, b) => b[1] - a[1])
                  .map(([type, count]) => (
                    <div key={type} className="flex items-center gap-3">
                      <span className="text-xs text-[var(--text-secondary)] w-28 shrink-0">{type}</span>
                      <div className="flex-1 h-4 bg-[var(--bg-surface)] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${(count / maxErrorCount) * 100}%`,
                            backgroundColor: ERROR_COLORS[type] || 'var(--text-muted)',
                            opacity: 0.7,
                          }}
                        />
                      </div>
                      <span className="text-xs text-[var(--text-muted)] font-mono w-8 text-right">{count}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Event timeline */}
          <div className="card p-4">
            <h3 className="text-xs font-semibold text-[var(--text-bright)] uppercase tracking-wider mb-3">
              Batch Event Timeline ({stats.totalEvents} events)
            </h3>
            <div className="max-h-[50vh] overflow-y-auto">
              <EventTimeline batchId={selectedBatchId} limit={200} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="card p-4">
      <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">{label}</p>
      <p className="text-lg font-bold font-mono" style={{ color: color || 'var(--text-bright)' }}>
        {value}
      </p>
      {sub && <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{sub}</p>}
    </div>
  );
}
