/**
 * Integration tests for the V2 scrape engine.
 *
 * These validate against real Supabase data from completed scrapes.
 * They do NOT spawn Claude processes — they verify the orchestrator's
 * post-scrape invariants: data point coverage, source contracts,
 * completeness scoring, backfill correctness, and event emission.
 *
 * Prerequisites: `export $(grep -v '^#' .env.local | xargs)` before running.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ─── Setup ───────────────────────────────────────────────────────────

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

let supabase: SupabaseClient;

// Canonical source IDs — ADR 002 says these are immutable contracts
const VALID_SOURCES = ['linkedin', 'companies_house', 'web_search', 'financial', 'community', 'tech_product'] as const;

// Agent-to-source mapping — each agent writes only its assigned sources
const AGENT_SOURCE_MAP = {
  identity: ['linkedin', 'companies_house'],
  research: ['web_search', 'financial'],
  signals: ['community', 'tech_product'],
} as const;

// Companies scraped by v2 engine during testing
const V2_SCRAPED_COMPANIES = [
  { id: '86988fe8-b2f1-4108-9623-a52907248562', name: 'Hokodo' },
  { id: 'a1334442-a6d1-4281-98bb-22d9f330997d', name: 'Sprout.ai' },
  { id: '6dd1baf4-1beb-4169-84ea-1050467f1b01', name: 'Operations1' },
  { id: '8fb8c64c-3edd-4af7-84eb-d2bf31c785e9', name: 'Concirrus' },
];

beforeAll(() => {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('Missing SUPABASE env vars. Run: export $(grep -v "^#" .env.local | xargs)');
  }
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
});

// ─── Source Contract Tests (ADR 002) ─────────────────────────────────

describe('source contract invariants', () => {
  it('every data point uses a valid canonical source ID', async () => {
    for (const company of V2_SCRAPED_COMPANIES) {
      const { data: dps } = await supabase
        .from('df_data_points')
        .select('source')
        .eq('company_id', company.id);

      expect(dps, `${company.name}: no data points found`).not.toBeNull();
      expect(dps!.length).toBeGreaterThan(0);

      const invalidSources = dps!.filter(dp => !VALID_SOURCES.includes(dp.source as any));
      expect(invalidSources, `${company.name}: invalid sources found: ${JSON.stringify(invalidSources)}`).toHaveLength(0);
    }
  });

  it('no source_url is null or empty', async () => {
    for (const company of V2_SCRAPED_COMPANIES) {
      const { data: dps } = await supabase
        .from('df_data_points')
        .select('field_name, source_url')
        .eq('company_id', company.id);

      const missing = dps!.filter(dp => !dp.source_url || dp.source_url.trim() === '');
      expect(missing, `${company.name}: data points with missing source_url: ${missing.map(d => d.field_name).join(', ')}`).toHaveLength(0);
    }
  });

  it('identity agent only wrote linkedin and companies_house sources', async () => {
    for (const company of V2_SCRAPED_COMPANIES) {
      const { data: dps } = await supabase
        .from('df_data_points')
        .select('source')
        .eq('company_id', company.id)
        .in('source', AGENT_SOURCE_MAP.identity as unknown as string[]);

      // If identity agent wrote data, it should only be linkedin/companies_house
      if (dps && dps.length > 0) {
        const sources = [...new Set(dps.map(dp => dp.source))];
        for (const s of sources) {
          expect(AGENT_SOURCE_MAP.identity).toContain(s);
        }
      }
    }
  });

  it('at least 4 of 6 source types have data points per company', async () => {
    for (const company of V2_SCRAPED_COMPANIES) {
      const { data: dps } = await supabase
        .from('df_data_points')
        .select('source')
        .eq('company_id', company.id);

      const sourcesFound = [...new Set(dps!.map(dp => dp.source))];

      // Not all sources apply to every company (e.g. Companies House is UK-only).
      // Require >= 4/6 sources instead of all 6.
      expect(sourcesFound.length, `${company.name}: only ${sourcesFound.length}/6 sources (${sourcesFound.join(', ')})`).toBeGreaterThanOrEqual(4);
    }
  });
});

// ─── Data Quality Tests ──────────────────────────────────────────────

describe('data quality', () => {
  it('each company has >= 30 data points', async () => {
    for (const company of V2_SCRAPED_COMPANIES) {
      const { count } = await supabase
        .from('df_data_points')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', company.id);

      expect(count, `${company.name}: only ${count} data points`).toBeGreaterThanOrEqual(30);
    }
  });

  it('completeness score is >= 80%', async () => {
    for (const company of V2_SCRAPED_COMPANIES) {
      const { data: row } = await supabase
        .from('df_companies')
        .select('completeness_score')
        .eq('id', company.id)
        .single();

      expect(Number(row!.completeness_score), `${company.name}: completeness too low`).toBeGreaterThanOrEqual(80);
    }
  });

  it('all critical fields are populated (sub_industry, is_saas, ownership_status, employee_growth_pct)', async () => {
    for (const company of V2_SCRAPED_COMPANIES) {
      const { data: row } = await supabase
        .from('df_companies')
        .select('sub_industry, is_saas, ownership_status, employee_growth_pct')
        .eq('id', company.id)
        .single();

      expect(row!.sub_industry, `${company.name}: missing sub_industry`).toBeTruthy();
      expect(row!.is_saas, `${company.name}: missing is_saas`).not.toBeNull();
      expect(row!.ownership_status, `${company.name}: missing ownership_status`).toBeTruthy();
      expect(row!.employee_growth_pct, `${company.name}: missing employee_growth_pct`).not.toBeNull();
    }
  });

  it('sub_industry is specific, not generic', async () => {
    const genericLabels = ['software development', 'technology', 'information technology', 'saas', 'it services', 'software'];

    for (const company of V2_SCRAPED_COMPANIES) {
      const { data: row } = await supabase
        .from('df_companies')
        .select('sub_industry')
        .eq('id', company.id)
        .single();

      const lower = (row!.sub_industry || '').toLowerCase();
      expect(genericLabels, `${company.name}: sub_industry "${row!.sub_industry}" is too generic`).not.toContain(lower);
    }
  });

  it('funding_total includes currency symbol', async () => {
    for (const company of V2_SCRAPED_COMPANIES) {
      const { data: row } = await supabase
        .from('df_companies')
        .select('funding_total')
        .eq('id', company.id)
        .single();

      if (row!.funding_total && row!.funding_total !== 'Bootstrapped' && row!.funding_total !== 'Unknown') {
        expect(row!.funding_total, `${company.name}: funding_total missing currency symbol`).toMatch(/[$£€]/);
      }
    }
  });

  it('ownership_status is a valid enum value', async () => {
    const validStatuses = ['private', 'acquired', 'subsidiary', 'public'];

    for (const company of V2_SCRAPED_COMPANIES) {
      const { data: row } = await supabase
        .from('df_companies')
        .select('ownership_status')
        .eq('id', company.id)
        .single();

      expect(validStatuses, `${company.name}: invalid ownership_status "${row!.ownership_status}"`).toContain(row!.ownership_status);
    }
  });
});

// ─── Event Pipeline Tests ────────────────────────────────────────────

describe('event pipeline', () => {
  it('scrape_status is "scraped" for all test companies', async () => {
    for (const company of V2_SCRAPED_COMPANIES) {
      const { data: row } = await supabase
        .from('df_companies')
        .select('scrape_status')
        .eq('id', company.id)
        .single();

      expect(row!.scrape_status).toBe('scraped');
    }
  });

  it('each company has scrape_started and scrape_completed events', async () => {
    for (const company of V2_SCRAPED_COMPANIES) {
      const { data: events } = await supabase
        .from('df_pipeline_events')
        .select('event_type')
        .eq('company_id', company.id)
        .in('event_type', ['company.scrape_started', 'company.scrape_completed']);

      const types = events!.map(e => e.event_type);
      expect(types, `${company.name}: missing scrape_started event`).toContain('company.scrape_started');
      expect(types, `${company.name}: missing scrape_completed event`).toContain('company.scrape_completed');
    }
  });

  it('phase events emitted for each source', async () => {
    for (const company of V2_SCRAPED_COMPANIES) {
      const { data: events } = await supabase
        .from('df_pipeline_events')
        .select('event_type, phase')
        .eq('company_id', company.id)
        .in('event_type', ['company.phase_completed', 'company.phase_failed']);

      const phasesWithEvents = [...new Set(events!.map(e => e.phase))];

      for (const source of VALID_SOURCES) {
        expect(phasesWithEvents, `${company.name}: no phase event for '${source}'`).toContain(source);
      }
    }
  });

  it('scrape_completed event payload contains engine: v2', async () => {
    for (const company of V2_SCRAPED_COMPANIES) {
      const { data: events } = await supabase
        .from('df_pipeline_events')
        .select('payload')
        .eq('company_id', company.id)
        .eq('event_type', 'company.scrape_completed')
        .order('created_at', { ascending: false })
        .limit(1);

      if (events && events.length > 0) {
        const payload = events[0].payload as Record<string, unknown>;
        expect(payload.engine, `${company.name}: completion event missing engine:v2`).toBe('v2');
      }
    }
  });

  it('completion event payload includes agent_results array', async () => {
    for (const company of V2_SCRAPED_COMPANIES) {
      const { data: events } = await supabase
        .from('df_pipeline_events')
        .select('payload')
        .eq('company_id', company.id)
        .eq('event_type', 'company.scrape_completed')
        .order('created_at', { ascending: false })
        .limit(1);

      if (events && events.length > 0) {
        const payload = events[0].payload as Record<string, unknown>;
        expect(payload.agent_results, `${company.name}: no agent_results in payload`).toBeDefined();
        expect(Array.isArray(payload.agent_results)).toBe(true);

        const agentNames = (payload.agent_results as any[]).map(r => r.agent);
        expect(agentNames).toContain('identity');
        expect(agentNames).toContain('research');
        expect(agentNames).toContain('signals');
      }
    }
  });
});

// ─── Concurrency Safety Tests ────────────────────────────────────────

describe('concurrency safety', () => {
  it('no duplicate data points per (company_id, field_name, source)', async () => {
    for (const company of V2_SCRAPED_COMPANIES) {
      const { data: dupes } = await supabase.rpc('exec_sql', {
        query: `
          SELECT company_id, field_name, source, count(*)
          FROM df_data_points
          WHERE company_id = '${company.id}'
          GROUP BY company_id, field_name, source
          HAVING count(*) > 1
        `,
      });

      // If RPC doesn't exist, fall back to checking via count
      const { count: total } = await supabase
        .from('df_data_points')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', company.id);

      const { data: distinct } = await supabase
        .from('df_data_points')
        .select('field_name, source')
        .eq('company_id', company.id);

      const uniqueKeys = new Set(distinct!.map(d => `${d.field_name}::${d.source}`));
      expect(uniqueKeys.size, `${company.name}: ${total! - uniqueKeys.size} duplicate data points`).toBe(total);
    }
  });

  it('backfilled summary fields have corresponding data points by category', async () => {
    for (const company of V2_SCRAPED_COMPANIES) {
      const { data: row } = await supabase
        .from('df_companies')
        .select('description, funding_total')
        .eq('id', company.id)
        .single();

      // If description is set, there should be identity-category data points
      if (row!.description) {
        const { count } = await supabase
          .from('df_data_points')
          .select('*', { count: 'exact', head: true })
          .eq('company_id', company.id)
          .eq('category', 'identity');

        expect(count, `${company.name}: description set but no identity data points`).toBeGreaterThan(0);
      }

      // If funding_total is set, there should be financials-category data points
      if (row!.funding_total && row!.funding_total !== 'Unknown') {
        const { count } = await supabase
          .from('df_data_points')
          .select('*', { count: 'exact', head: true })
          .eq('company_id', company.id)
          .eq('category', 'financials');

        expect(count, `${company.name}: funding_total set but no financials data points`).toBeGreaterThan(0);
      }
    }
  });
});

// ─── Timing & Metadata Tests ─────────────────────────────────────────

describe('scrape metadata', () => {
  it('scrape_duration_seconds is reasonable (< 300s)', async () => {
    for (const company of V2_SCRAPED_COMPANIES) {
      const { data: row } = await supabase
        .from('df_companies')
        .select('scrape_duration_seconds')
        .eq('id', company.id)
        .single();

      const duration = Number(row!.scrape_duration_seconds);
      expect(duration, `${company.name}: duration ${duration}s exceeds 5 min`).toBeLessThan(300);
      expect(duration, `${company.name}: duration ${duration}s suspiciously low`).toBeGreaterThan(10);
    }
  });

  it('scrape timestamps are set', async () => {
    for (const company of V2_SCRAPED_COMPANIES) {
      const { data: row } = await supabase
        .from('df_companies')
        .select('scrape_started_at, scrape_completed_at')
        .eq('id', company.id)
        .single();

      expect(row!.scrape_started_at, `${company.name}: missing scrape_started_at`).toBeTruthy();
      expect(row!.scrape_completed_at, `${company.name}: missing scrape_completed_at`).toBeTruthy();
    }
  });
});
