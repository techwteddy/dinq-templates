'use client';

import { useState } from 'react';
import { useRealtimeHeartbeat, useRealtimeAllPipelineEvents } from '@/lib/use-realtime';
import type { Batch, HeartbeatRow } from '@/lib/types';
import type { PipelineEvent } from '@/lib/pipeline-events';
import ScraperHealth from './scraper-health';
import BatchLogs from './batch-logs';
import CompanyLogs from './company-logs';

const TABS = [
  { id: 'health', label: 'Scraper Health' },
  { id: 'batches', label: 'Batch Logs' },
  { id: 'companies', label: 'Company Logs' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function MonitorDashboard({
  initialHeartbeat,
  initialBatches,
  initialEvents,
}: {
  initialHeartbeat: HeartbeatRow | null;
  initialBatches: Batch[];
  initialEvents: PipelineEvent[];
}) {
  const [activeTab, setActiveTab] = useState<TabId>('health');
  const heartbeat = useRealtimeHeartbeat(initialHeartbeat);
  const events = useRealtimeAllPipelineEvents(initialEvents);

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <div className="animate-fade-up">
        <h1 className="text-xl font-bold text-[var(--text-bright)]">Monitor</h1>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          Scraper health, batch logs, and company-level diagnostics.
        </p>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex items-center gap-1 animate-fade-up" style={{ animationDelay: '0.05s' }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-[var(--accent-glow)] text-[var(--accent)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
        {activeTab === 'health' && (
          <ScraperHealth heartbeat={heartbeat} events={events} />
        )}
        {activeTab === 'batches' && (
          <BatchLogs batches={initialBatches} events={events} />
        )}
        {activeTab === 'companies' && (
          <CompanyLogs batches={initialBatches} />
        )}
      </div>
    </main>
  );
}
