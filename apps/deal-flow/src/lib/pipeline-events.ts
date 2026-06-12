/**
 * Pipeline Events — Event-first state management for the scraping pipeline.
 *
 * All state transitions go through emitEvent(). This calls the Postgres
 * function emit_pipeline_event() which atomically:
 *   1. Inserts the event row into df_pipeline_events
 *   2. Updates df_companies.scrape_status (if the event type triggers a transition)
 *
 * Direct UPDATEs to scrape_status are blocked by a database trigger.
 *
 * Usage (Next.js API routes):
 *   import { emitEvent, emitBatchEvent } from '@/lib/pipeline-events';
 *   const supabase = getAdminClient();
 *   await emitEvent(supabase, { companyId, batchId, eventType: 'company.retry_requested', actor: 'user', payload: { mode } });
 *
 * Usage (scrape-engine.ts — raw supabase client):
 *   import { emitEventRaw } from './path-or-inline'; // see createEmitter()
 */

import type { SupabaseClient } from '@supabase/supabase-js';

// ─── Event Types ─────────────────────────────────────────────────────

export type PipelineEventType =
  // Batch lifecycle
  | 'batch.created'
  | 'batch.started'
  | 'batch.completed'
  | 'batch.paused'
  // Company lifecycle
  | 'company.queued'
  | 'company.scrape_started'
  | 'company.scrape_completed'
  | 'company.scrape_failed'
  | 'company.retry_requested'
  | 'company.retry_auto'
  | 'company.rescrape_requested'
  | 'company.skipped'
  | 'company.data_backfilled'
  // Phase lifecycle
  | 'company.phase_started'
  | 'company.phase_completed'
  | 'company.phase_no_data'
  | 'company.phase_failed';

export type EventActor = 'system' | 'user' | 'scraper';

export type ScrapingPhase =
  | 'linkedin'
  | 'companies_house'
  | 'web_search'
  | 'financial'
  | 'community'
  | 'tech_product';

export interface PipelineEvent {
  id: string;
  company_id: string | null;
  batch_id: string | null;
  phase: ScrapingPhase | null;
  event_type: PipelineEventType;
  actor: EventActor;
  payload: Record<string, unknown>;
  run_id: string | null;
  created_at: string;
  company_name?: string;
}

// ─── Emit Event (for Next.js API routes using admin client) ──────────

export interface EmitEventParams {
  companyId: string;
  batchId: string;
  eventType: PipelineEventType;
  actor?: EventActor;
  payload?: Record<string, unknown>;
  phase?: ScrapingPhase;
  runId?: string;
}

export async function emitEvent(
  supabase: SupabaseClient,
  params: EmitEventParams
): Promise<string> {
  const { data, error } = await (supabase as any).rpc('emit_pipeline_event', {
    p_company_id: params.companyId,
    p_batch_id: params.batchId,
    p_event_type: params.eventType,
    p_actor: params.actor || 'system',
    p_payload: params.payload || {},
    p_phase: params.phase || null,
    p_run_id: params.runId || null,
  });

  if (error) {
    throw new Error(`emitEvent failed (${params.eventType}): ${error.message}`);
  }

  return data as string;
}

// ─── Emit Batch Event ────────────────────────────────────────────────

export interface EmitBatchEventParams {
  batchId: string;
  eventType: 'batch.created' | 'batch.started' | 'batch.completed' | 'batch.paused';
  actor?: EventActor;
  payload?: Record<string, unknown>;
}

export async function emitBatchEvent(
  supabase: SupabaseClient,
  params: EmitBatchEventParams
): Promise<string> {
  const { data, error } = await (supabase as any).rpc('emit_batch_event', {
    p_batch_id: params.batchId,
    p_event_type: params.eventType,
    p_actor: params.actor || 'system',
    p_payload: params.payload || {},
  });

  if (error) {
    throw new Error(`emitBatchEvent failed (${params.eventType}): ${error.message}`);
  }

  return data as string;
}

// ─── Bulk Emit (for phase events after scrape) ───────────────────────

export async function emitEvents(
  supabase: SupabaseClient,
  events: EmitEventParams[]
): Promise<void> {
  // Sequential RPC calls — Supabase doesn't support batch RPC.
  // For phase events (~6 per company), this is fine.
  for (const event of events) {
    await emitEvent(supabase, event);
  }
}

// ─── Query Helpers ───────────────────────────────────────────────────

export async function getCompanyEvents(
  supabase: SupabaseClient,
  companyId: string,
  limit = 50
): Promise<PipelineEvent[]> {
  const { data, error } = await supabase
    .from('df_pipeline_events')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: true })
    .limit(limit);

  if (error) throw new Error(`getCompanyEvents failed: ${error.message}`);
  return (data || []) as PipelineEvent[];
}

export async function getBatchEvents(
  supabase: SupabaseClient,
  batchId: string,
  limit = 200
): Promise<PipelineEvent[]> {
  const { data, error } = await supabase
    .from('df_pipeline_events')
    .select('*')
    .eq('batch_id', batchId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(`getBatchEvents failed: ${error.message}`);
  return (data || []) as PipelineEvent[];
}
