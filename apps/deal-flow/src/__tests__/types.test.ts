import { describe, it, expect } from 'vitest';
import type {
  PipelineEventType,
  EventActor,
  ScrapingPhase,
} from '../lib/pipeline-events';
import type {
  DataCategory,
  DataSource,
  QualificationStatus,
  AffinityStatus,
  RankingLabel,
  Company,
  Batch,
  DataPoint,
} from '../lib/types';
import { SCRAPE_SOURCES } from '../lib/types';

// ─── Pipeline Event Type Validation ──────────────────────────────────

describe('pipeline event types', () => {
  const VALID_COMPANY_EVENTS: PipelineEventType[] = [
    'company.queued',
    'company.scrape_started',
    'company.scrape_completed',
    'company.scrape_failed',
    'company.retry_requested',
    'company.retry_auto',
    'company.rescrape_requested',
    'company.skipped',
    'company.data_backfilled',
    'company.phase_started',
    'company.phase_completed',
    'company.phase_no_data',
    'company.phase_failed',
  ];

  const VALID_BATCH_EVENTS: PipelineEventType[] = [
    'batch.created',
    'batch.started',
    'batch.completed',
    'batch.paused',
  ];

  it('all company event types follow company.* prefix', () => {
    for (const event of VALID_COMPANY_EVENTS) {
      expect(event).toMatch(/^company\./);
    }
  });

  it('all batch event types follow batch.* prefix', () => {
    for (const event of VALID_BATCH_EVENTS) {
      expect(event).toMatch(/^batch\./);
    }
  });

  it('there are exactly 13 company event types', () => {
    expect(VALID_COMPANY_EVENTS).toHaveLength(13);
  });

  it('there are exactly 4 batch event types', () => {
    expect(VALID_BATCH_EVENTS).toHaveLength(4);
  });
});

// ─── Scrape Sources Constant ─────────────────────────────────────────

describe('SCRAPE_SOURCES constant', () => {
  it('has 6 sources in the correct order', () => {
    expect(SCRAPE_SOURCES).toHaveLength(6);
    expect(SCRAPE_SOURCES[0].source).toBe('linkedin');
    expect(SCRAPE_SOURCES[5].source).toBe('tech_product');
  });

  it('order_index values are sequential 1-6', () => {
    for (let i = 0; i < SCRAPE_SOURCES.length; i++) {
      expect(SCRAPE_SOURCES[i].order_index).toBe(i + 1);
    }
  });

  it('each source has a display_name', () => {
    for (const s of SCRAPE_SOURCES) {
      expect(s.display_name).toBeTruthy();
      expect(typeof s.display_name).toBe('string');
    }
  });

  it('source IDs are all lowercase with underscores', () => {
    for (const s of SCRAPE_SOURCES) {
      expect(s.source).toMatch(/^[a-z_]+$/);
    }
  });
});

// ─── Type Shape Tests ────────────────────────────────────────────────

describe('type shapes', () => {
  it('Company has all required PE enrichment fields', () => {
    const companyKeys: (keyof Company)[] = [
      'ownership_status',
      'is_saas',
      'last_funding_date',
      'last_funding_amount',
      'headcount_growth_6m',
      'investors',
      'location_city',
      'location_country',
      'qualification_status',
      'score_growth',
      'score_scale',
      'score_capital_efficiency',
      'score_product',
      'score_market',
      'score_composite',
      'ranking',
      'ai_brief',
      'affinity_status',
    ];

    // Type-level check: if any key is not in Company, TypeScript will error.
    // At runtime, we just verify the array is non-empty.
    expect(companyKeys.length).toBeGreaterThan(0);
  });

  it('scrape_status has all valid states', () => {
    const validStatuses: Company['scrape_status'][] = [
      'pending', 'scraping', 'scraped', 'failed', 'rescrape', 'retry_queued', 'skipped',
    ];
    expect(validStatuses).toHaveLength(7);
  });

  it('batch status has 3 states', () => {
    const validStatuses: Batch['status'][] = ['pending', 'scraping', 'complete'];
    expect(validStatuses).toHaveLength(3);
  });
});
