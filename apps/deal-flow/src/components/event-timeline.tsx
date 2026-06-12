'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { PipelineEvent } from '@/lib/pipeline-events';

// ─── Event Display Config ────────────────────────────────────────────

const EVENT_CONFIG: Record<string, {
  icon: string;
  label: string;
  color: string;
  bgColor: string;
}> = {
  'company.queued': {
    icon: '+',
    label: 'Queued',
    color: 'text-[var(--text-muted)]',
    bgColor: 'bg-[var(--bg-surface)]',
  },
  'company.scrape_started': {
    icon: '>',
    label: 'Scrape started',
    color: 'text-[var(--accent)]',
    bgColor: 'bg-[var(--accent)]/20',
  },
  'company.phase_completed': {
    icon: 'v',
    label: 'Phase completed',
    color: 'text-[var(--green)]',
    bgColor: 'bg-[var(--green)]/20',
  },
  'company.phase_failed': {
    icon: 'x',
    label: 'Phase failed',
    color: 'text-[var(--red)]',
    bgColor: 'bg-[var(--red)]/20',
  },
  'company.scrape_completed': {
    icon: 'V',
    label: 'Completed',
    color: 'text-[var(--green)]',
    bgColor: 'bg-[var(--green)]/20',
  },
  'company.scrape_failed': {
    icon: 'X',
    label: 'Failed',
    color: 'text-[var(--red)]',
    bgColor: 'bg-[var(--red)]/20',
  },
  'company.retry_requested': {
    icon: 'R',
    label: 'Retry requested',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
  },
  'company.retry_auto': {
    icon: 'A',
    label: 'Auto-retry',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
  },
  'company.rescrape_requested': {
    icon: 'S',
    label: 'Rescrape requested',
    color: 'text-violet-400',
    bgColor: 'bg-violet-500/20',
  },
  'company.skipped': {
    icon: '—',
    label: 'Skipped',
    color: 'text-zinc-400',
    bgColor: 'bg-zinc-500/20',
  },
  'company.data_backfilled': {
    icon: 'B',
    label: 'Data backfilled',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/20',
  },
  'batch.created': {
    icon: '+',
    label: 'Batch created',
    color: 'text-[var(--text-muted)]',
    bgColor: 'bg-[var(--bg-surface)]',
  },
  'batch.started': {
    icon: '>',
    label: 'Batch started',
    color: 'text-[var(--accent)]',
    bgColor: 'bg-[var(--accent)]/20',
  },
  'batch.completed': {
    icon: 'V',
    label: 'Batch completed',
    color: 'text-[var(--green)]',
    bgColor: 'bg-[var(--green)]/20',
  },
  'batch.paused': {
    icon: '!',
    label: 'Batch paused',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
  },
};

const PHASE_LABELS: Record<string, string> = {
  linkedin: 'LinkedIn',
  companies_house: 'Companies House',
  web_search: 'Web Search',
  financial: 'Financial',
  community: 'Community',
  tech_product: 'Tech & Product',
};

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

function EventDetail({ event }: { event: PipelineEvent }) {
  const payload = event.payload || {};
  const parts: string[] = [];

  if (event.phase) {
    parts.push(PHASE_LABELS[event.phase] || event.phase);
  }

  if (payload.fields_found) {
    parts.push(`${payload.fields_found} fields`);
  }
  if (payload.completeness) {
    parts.push(`${payload.completeness}%`);
  }
  if (payload.data_points) {
    parts.push(`${payload.data_points} data points`);
  }
  if (payload.duration_s) {
    const s = payload.duration_s as number;
    parts.push(s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`);
  }
  if (payload.attempt && (payload.attempt as number) > 1) {
    parts.push(`attempt ${payload.attempt}`);
  }
  if (payload.error_type) {
    parts.push(String(payload.error_type));
  }
  if (payload.error && !payload.error_type) {
    parts.push(String(payload.error).slice(0, 80));
  }
  if (payload.reason && typeof payload.reason === 'string') {
    parts.push(payload.reason.slice(0, 80));
  }
  if (payload.mode) {
    parts.push(`mode: ${payload.mode}`);
  }

  if (parts.length === 0) return null;

  return (
    <span className="text-[10px] text-[var(--text-muted)] ml-1">
      {' — '}{parts.join(' | ')}
    </span>
  );
}

// ─── Timeline Component ─────────────────────────────────────────────

interface EventTimelineProps {
  companyId?: string;
  batchId?: string;
  limit?: number;
  realtime?: boolean;
}

export function EventTimeline({ companyId, batchId, limit = 50, realtime = true }: EventTimelineProps) {
  const [events, setEvents] = useState<PipelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchEvents() {
      let query = supabase
        .from('df_pipeline_events')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(limit);

      if (companyId) {
        query = query.eq('company_id', companyId);
      } else if (batchId) {
        query = query.eq('batch_id', batchId);
      }

      const { data } = await query;
      setEvents((data || []) as PipelineEvent[]);
      setLoading(false);
    }

    fetchEvents();

    if (!realtime) return;

    // Subscribe to new events
    const channel = supabase
      .channel(`events-${companyId || batchId || 'all'}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'df_pipeline_events',
        ...(companyId ? { filter: `company_id=eq.${companyId}` } : {}),
        ...(batchId && !companyId ? { filter: `batch_id=eq.${batchId}` } : {}),
      }, (payload) => {
        setEvents(prev => [...prev, payload.new as PipelineEvent]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [companyId, batchId, limit, realtime, supabase]);

  if (loading) {
    return (
      <div className="text-[var(--text-muted)] text-xs py-4 text-center animate-pulse">
        Loading events...
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-[var(--text-muted)] text-xs py-4 text-center">
        No events recorded yet
      </div>
    );
  }

  // Group events by date
  const grouped: Record<string, PipelineEvent[]> = {};
  for (const event of events) {
    const date = formatDate(event.created_at);
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(event);
  }

  return (
    <div className="space-y-3">
      {Object.entries(grouped).map(([date, dateEvents]) => (
        <div key={date}>
          <div className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
            {date}
          </div>
          <div className="relative pl-4 border-l border-[var(--border-subtle)]">
            {dateEvents.map((event) => {
              const config = EVENT_CONFIG[event.event_type] || {
                icon: '?',
                label: event.event_type,
                color: 'text-[var(--text-muted)]',
                bgColor: 'bg-[var(--bg-surface)]',
              };

              const isPhaseEvent = event.event_type.includes('phase');

              return (
                <div key={event.id} className={`relative flex items-start gap-2 ${isPhaseEvent ? 'py-0.5 pl-3' : 'py-1'}`}>
                  {/* Timeline dot */}
                  <div className={`absolute -left-[calc(1rem+3px)] flex items-center justify-center ${isPhaseEvent ? 'w-1.5 h-1.5 mt-1.5' : 'w-2.5 h-2.5 mt-1'} rounded-full ${config.bgColor} ring-2 ring-[var(--bg-base)]`} />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-medium ${config.color}`}>
                        {isPhaseEvent && event.phase
                          ? `${PHASE_LABELS[event.phase] || event.phase}`
                          : config.label}
                      </span>
                      {isPhaseEvent && (
                        <span className={`text-[10px] ${config.color}`}>
                          {event.event_type === 'company.phase_completed' ? 'done' : 'failed'}
                        </span>
                      )}
                      <EventDetail event={event} />
                      {event.actor === 'user' && (
                        <span className="text-[9px] bg-violet-500/20 text-violet-400 rounded px-1 py-0.5">
                          user
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Timestamp */}
                  <span className="text-[10px] text-[var(--text-muted)] tabular-nums shrink-0">
                    {formatTime(event.created_at)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Compact version for inline use ──────────────────────────────────

export function EventTimelineCompact({ companyId, limit = 10 }: { companyId: string; limit?: number }) {
  const [events, setEvents] = useState<PipelineEvent[]>([]);
  const supabase = createClient();

  useEffect(() => {
    supabase
      .from('df_pipeline_events')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .limit(limit)
      .then(({ data }) => setEvents((data || []).reverse() as PipelineEvent[]));
  }, [companyId, limit, supabase]);

  if (events.length === 0) return null;

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {events.map((event, i) => {
        const config = EVENT_CONFIG[event.event_type];
        if (!config) return null;
        return (
          <span
            key={event.id}
            title={`${config.label} — ${formatTime(event.created_at)}`}
            className={`inline-flex items-center justify-center w-4 h-4 rounded-sm text-[8px] font-bold ${config.bgColor} ${config.color}`}
          >
            {config.icon}
          </span>
        );
      })}
    </div>
  );
}
