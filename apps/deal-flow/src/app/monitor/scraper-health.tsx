'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { HeartbeatRow } from '@/lib/types';
import type { PipelineEvent } from '@/lib/pipeline-events';

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  'company.scrape_completed': { label: 'success', color: 'var(--green)', bg: 'var(--green)' },
  'company.scrape_failed': { label: 'failed', color: 'var(--red)', bg: 'var(--red)' },
  'company.scrape_started': { label: 'scraping', color: 'var(--accent)', bg: 'var(--accent)' },
  'company.retry_requested': { label: 'retry', color: 'var(--amber)', bg: 'var(--amber)' },
  'company.retry_auto': { label: 'retry', color: 'var(--amber)', bg: 'var(--amber)' },
  'company.rescrape_requested': { label: 'rescrape', color: 'var(--accent)', bg: 'var(--accent)' },
  'batch.started': { label: 'batch started', color: 'var(--accent)', bg: 'var(--accent)' },
  'batch.completed': { label: 'batch done', color: 'var(--green)', bg: 'var(--green)' },
  'batch.paused': { label: 'paused', color: 'var(--amber)', bg: 'var(--amber)' },
};

function formatDuration(seconds: number | null | undefined): string {
  if (seconds == null) return '—';
  const s = Number(seconds);
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

export default function ScraperHealth({
  heartbeat,
  events,
}: {
  heartbeat: HeartbeatRow | null;
  events: PipelineEvent[];
}) {
  const [now, setNow] = useState(Date.now());
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(interval);
  }, []);

  const secondsSinceLastPing = heartbeat
    ? Math.floor((now - new Date(heartbeat.updated_at).getTime()) / 1000)
    : Infinity;

  const isAlive = secondsSinceLastPing < 360;
  const isStale = secondsSinceLastPing >= 360 && secondsSinceLastPing < 900;
  const neverReported = !heartbeat;

  const healthColor = neverReported
    ? 'var(--text-muted)'
    : isAlive
    ? 'var(--green)'
    : isStale
    ? 'var(--amber)'
    : 'var(--red)';

  const healthLabel = neverReported
    ? 'Never reported'
    : isAlive
    ? 'Alive'
    : isStale
    ? 'Stale'
    : 'Dead';

  // Show scrape lifecycle events (started, completed, failed, retries)
  const scrapeEvents = events
    .filter(e =>
      e.event_type === 'company.scrape_started' ||
      e.event_type === 'company.scrape_completed' ||
      e.event_type === 'company.scrape_failed' ||
      e.event_type === 'company.retry_auto' ||
      e.event_type === 'company.retry_requested' ||
      e.event_type === 'company.rescrape_requested' ||
      e.event_type.startsWith('batch.')
    )
    .slice(0, 30);

  return (
    <div className="space-y-6">
      {/* Health indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Heartbeat */}
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-3">
            <span
              className="h-4 w-4 rounded-full shrink-0"
              style={{
                backgroundColor: healthColor,
                boxShadow: isAlive ? `0 0 12px ${healthColor}` : 'none',
                animation: isAlive ? 'pulse-glow 2s ease-in-out infinite' : 'none',
              }}
            />
            <span className="text-sm font-semibold text-[var(--text-bright)]">
              Scraper {healthLabel}
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            {heartbeat
              ? `Last ping: ${timeAgo(heartbeat.updated_at)}`
              : 'Scraper has never reported in'}
          </p>
          {heartbeat?.scraper_host && (
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Host: <span className="text-[var(--text-secondary)]">{heartbeat.scraper_host}</span>
            </p>
          )}
        </div>

        {/* Chrome CDP */}
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-3">
            <span
              className="h-4 w-4 rounded-full shrink-0"
              style={{
                backgroundColor: heartbeat?.chrome_cdp_up ? 'var(--green)' : 'var(--red)',
              }}
            />
            <span className="text-sm font-semibold text-[var(--text-bright)]">
              Chrome CDP
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            {heartbeat
              ? heartbeat.chrome_cdp_up
                ? 'Port 9222 responding'
                : 'Port 9222 not responding'
              : 'Unknown — no heartbeat'}
          </p>
        </div>

        {/* Currently scraping */}
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-3">
            {heartbeat?.status === 'scraping' ? (
              <span className="h-4 w-4 rounded-full bg-[var(--accent)] animate-pulse-glow shrink-0" />
            ) : (
              <span className="h-4 w-4 rounded-full bg-[var(--bg-surface)] shrink-0" />
            )}
            <span className="text-sm font-semibold text-[var(--text-bright)]">
              {heartbeat?.status === 'scraping' ? 'Scraping' : 'Idle'}
            </span>
          </div>
          {heartbeat?.status === 'scraping' && heartbeat.company_name ? (
            <Link
              href={`/companies/${heartbeat.company_id}`}
              className="text-xs text-[var(--accent)] hover:underline"
            >
              {heartbeat.company_name}
            </Link>
          ) : (
            <p className="text-xs text-[var(--text-muted)]">
              {heartbeat?.message || 'No active scrape'}
            </p>
          )}
        </div>
      </div>

      {/* Recent scrape activity */}
      <div className="card overflow-hidden">
        <div className="px-4 py-3 bg-[var(--bg-surface)] border-b border-[var(--border-subtle)]">
          <h3 className="text-xs font-semibold text-[var(--text-bright)] uppercase tracking-wider">
            Recent Scrape Activity
          </h3>
        </div>
        {scrapeEvents.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-[var(--text-muted)]">No scrape activity recorded yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-subtle)] max-h-[60vh] overflow-y-auto">
            {scrapeEvents.map((event) => {
              const payload = event.payload || {};
              const config = STATUS_CONFIG[event.event_type] || { label: event.event_type.split('.').pop() || '', color: 'var(--text-muted)', bg: 'var(--text-muted)' };
              const hasLog = !!payload.claude_output_tail;
              const isExpanded = expandedId === event.id;
              const isClickable = hasLog || event.event_type === 'company.scrape_completed' || event.event_type === 'company.scrape_failed';

              return (
                <div key={event.id}>
                  <div
                    className={`flex items-center gap-4 px-4 py-3 transition-colors ${
                      isClickable ? 'cursor-pointer hover:bg-[var(--bg-hover)]' : ''
                    } ${isExpanded ? 'bg-[var(--bg-hover)]' : ''}`}
                    onClick={isClickable ? () => setExpandedId(isExpanded ? null : event.id) : undefined}
                  >
                    {/* Status dot */}
                    <span
                      className={`shrink-0 h-2.5 w-2.5 rounded-full ${
                        event.event_type === 'company.scrape_started' ? 'animate-pulse-glow' : ''
                      }`}
                      style={{ backgroundColor: config.bg }}
                    />

                    {/* Company name + event label */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[var(--text-bright)] truncate">
                          {event.company_name || (payload.company_name as string) || (event.event_type.startsWith('batch.') ? 'Batch' : 'Unknown')}
                        </span>
                        <span
                          className="text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0"
                          style={{
                            color: config.color,
                            backgroundColor: `color-mix(in srgb, ${config.bg} 15%, transparent)`,
                          }}
                        >
                          {config.label}
                        </span>
                        {payload.attempt != null && Number(payload.attempt) > 1 && (
                          <span className="text-[10px] text-[var(--text-muted)]">
                            attempt {String(payload.attempt)}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[var(--text-muted)]">
                        {timeAgo(event.created_at)}
                        {event.actor === 'user' && ' · by user'}
                      </span>
                    </div>

                    {/* Stats: data points */}
                    {payload.data_points != null && (
                      <span className="text-xs text-[var(--text-secondary)] font-mono w-12 text-right">
                        {String(payload.data_points)}dp
                      </span>
                    )}

                    {/* Stats: duration */}
                    <span className="text-xs text-[var(--text-muted)] font-mono w-16 text-right">
                      {payload.duration_s != null ? formatDuration(payload.duration_s as number) : '—'}
                    </span>

                    {/* Stats: completeness */}
                    {payload.completeness != null ? (
                      <span className="text-xs font-mono w-10 text-right" style={{
                        color: Number(payload.completeness) >= 70 ? 'var(--green)' : Number(payload.completeness) >= 40 ? 'var(--amber)' : 'var(--text-muted)',
                      }}>
                        {String(payload.completeness)}%
                      </span>
                    ) : (
                      <span className="w-10" />
                    )}

                    {/* Error badge */}
                    {payload.error_type != null && (
                      <span className="text-[10px] text-[var(--red)] font-medium px-2 py-0.5 rounded-full bg-[var(--red)]/10 shrink-0">
                        {String(payload.error_type)}
                      </span>
                    )}

                    {/* Expand indicator */}
                    {isClickable && (
                      <svg
                        className={`w-3.5 h-3.5 text-[var(--text-muted)] transition-transform shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </div>

                  {/* Expanded log panel */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 bg-[var(--bg-surface)] border-t border-[var(--border-subtle)]">
                      {/* Meta row */}
                      <div className="flex flex-wrap gap-4 mb-3 text-[10px] text-[var(--text-muted)]">
                        {payload.model != null && <span>Model: <span className="text-[var(--text-secondary)]">{String(payload.model)}</span></span>}
                        {payload.budget_cap != null && <span>Budget: <span className="text-[var(--text-secondary)]">${String(payload.budget_cap)}</span></span>}
                        {payload.claude_output_chars != null && (
                          <span>Output: <span className="text-[var(--text-secondary)]">{Number(payload.claude_output_chars).toLocaleString()} chars</span></span>
                        )}
                        {payload.linkedin_url != null && (
                          <span>LinkedIn: <a href={String(payload.linkedin_url)} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">{String(payload.linkedin_url).split('/').pop()}</a></span>
                        )}
                      </div>

                      {/* Claude output log */}
                      {String(payload.claude_output_tail || '') !== '' ? (
                        <div>
                          <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1.5 font-semibold">Claude Output (tail)</p>
                          <pre className="text-[11px] leading-relaxed text-[var(--text-secondary)] bg-[var(--bg-base)] rounded-lg p-3 overflow-x-auto max-h-[300px] overflow-y-auto whitespace-pre-wrap break-words font-mono">
                            {String(payload.claude_output_tail)}
                          </pre>
                        </div>
                      ) : (
                        <p className="text-xs text-[var(--text-muted)] italic">
                          No log data available for this event. Logs will appear for scrapes run after this update.
                        </p>
                      )}

                      {/* Error details */}
                      {payload.error != null ? (
                        <div className="mt-2">
                          <p className="text-[10px] text-[var(--red)] uppercase tracking-wider mb-1 font-semibold">Error</p>
                          <p className="text-xs text-[var(--red)]/80 bg-[var(--red)]/5 rounded-lg p-2 font-mono">
                            {String(payload.error)}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
