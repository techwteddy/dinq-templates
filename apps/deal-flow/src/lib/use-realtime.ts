'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Batch, Company, HeartbeatRow } from '@/lib/types';
import type { PipelineEvent } from '@/lib/pipeline-events';

export function useRealtimeBatch(batchId: string, initial: Batch) {
  const [batch, setBatch] = useState<Batch>(initial);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`batch-${batchId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'df_batches',
        filter: `id=eq.${batchId}`,
      }, (payload) => {
        setBatch(payload.new as Batch);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [batchId]);

  return batch;
}

export function useRealtimeCompanies(batchId: string, initial: Company[]) {
  const [companies, setCompanies] = useState<Company[]>(initial);

  const updateCompany = useCallback((updated: Company) => {
    setCompanies(prev => {
      const idx = prev.findIndex(c => c.id === updated.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updated;
        return next;
      }
      return [...prev, updated];
    });
  }, []);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`companies-${batchId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'df_companies',
        filter: `batch_id=eq.${batchId}`,
      }, (payload) => {
        if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
          updateCompany(payload.new as Company);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [batchId, updateCompany]);

  return companies;
}

export function useRealtimeHeartbeat(initial: HeartbeatRow | null) {
  const [heartbeat, setHeartbeat] = useState<HeartbeatRow | null>(initial);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel('scraper-heartbeat')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'df_scraper_heartbeat',
      }, (payload) => {
        if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
          setHeartbeat(payload.new as HeartbeatRow);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return heartbeat;
}

export function useRealtimePipelineEvents(batchId: string, initial: PipelineEvent[]) {
  const [events, setEvents] = useState<PipelineEvent[]>(initial);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`pipeline-events-${batchId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'df_pipeline_events',
        filter: `batch_id=eq.${batchId}`,
      }, (payload) => {
        setEvents(prev => [...prev, payload.new as PipelineEvent]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [batchId]);

  return events;
}

/** Global variant — subscribes to ALL pipeline events (for the monitor page). */
export function useRealtimeAllPipelineEvents(initial: PipelineEvent[]) {
  const [events, setEvents] = useState<PipelineEvent[]>(initial);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel('pipeline-events-all')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'df_pipeline_events',
      }, (payload) => {
        setEvents(prev => [payload.new as PipelineEvent, ...prev]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return events;
}
