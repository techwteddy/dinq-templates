export interface Batch {
  id: string;
  user_id: string;
  name: string;
  google_sheets_url: string;
  total_companies: number;
  scraped_count: number;
  status: 'pending' | 'scraping' | 'complete';
  avg_scrape_seconds: number | null;
  created_at: string;
}

export interface Company {
  id: string;
  batch_id: string;
  user_id: string;
  name: string;
  linkedin_url: string | null;
  website: string | null;
  industry: string | null;
  sub_industry: string | null;
  founded_year: number | null;
  hq_location: string | null;
  employee_count: string | null;
  employee_growth_pct: number | null;
  revenue_estimate: string | null;
  funding_total: string | null;
  ceo_name: string | null;
  description: string | null;
  completeness_score: number;
  scrape_status: 'pending' | 'scraping' | 'scraped' | 'failed' | 'rescrape' | 'retry_queued' | 'skipped';
  scrape_started_at: string | null;
  scrape_completed_at: string | null;
  scrape_duration_seconds: number | null;
  rescrape_reason: string | null;
  retry_count: number;
  created_at: string;
  // Enrichment fields
  ownership_status: string | null;       // private / acquired / subsidiary / public
  is_saas: boolean | null;               // SaaS screener result
  last_funding_date: string | null;      // Date of last funding round
  last_funding_amount: string | null;    // Amount of last funding round
  headcount_growth_6m: number | null;    // 6-month headcount growth %
  investors: string | null;              // Key investors (comma-separated)
  location_city: string | null;          // Structured city
  location_country: string | null;       // Structured country
  // Phase 2: Qualification & scoring
  qualification_status: 'pending' | 'qualified' | 'disqualified';
  disqualification_reason: string | null;
  score_growth: number | null;           // 1-5
  score_scale: number | null;            // 1-5
  score_capital_efficiency: number | null; // 1-5
  score_product: number | null;          // 1-5
  score_market: number | null;           // 1-5
  score_composite: number | null;        // Weighted average
  ranking: string | null;                // Great / Good / High Ok / Ok / Small & Interesting / Poor
  ai_brief: string | null;              // 2-3 sentence AI reasoning
  ch_business_category: string | null;   // Sector label (e.g. "Legal Tech")
  prospect_owner: string | null;         // Auto-assigned by geography
  source_of_deal: string | null;         // Batch name / search origin
  // Phase 3: Affinity CRM sync
  affinity_status: 'not_pushed' | 'pushed' | 'push_failed';
  affinity_pushed_at: string | null;
  affinity_org_id: string | null;
}

export interface DataPoint {
  id: string;
  company_id: string;
  category: string;
  field_name: string;
  field_value: string | null;
  source: string;
  source_url: string | null;
  scraped_at: string;
}

/** @deprecated Use PipelineEvent with phase events instead */
export interface ScrapeStage {
  id: string;
  company_id: string;
  source: string;
  display_name: string;
  order_index: number;
  status: 'pending' | 'running' | 'complete' | 'failed' | 'skipped';
  fields_found: number;
  started_at: string | null;
  completed_at: string | null;
  error_message: string | null;
}

export type DataCategory =
  | 'identity'
  | 'location'
  | 'size'
  | 'leadership'
  | 'financials'
  | 'digital'
  | 'market'
  | 'corporate';

export type DataSource =
  | 'linkedin'
  | 'companies_house'
  | 'web_search'
  | 'financial'
  | 'community'
  | 'tech_product'
  | 'ai_scoring'
  | 'manual';

export type QualificationStatus = 'pending' | 'qualified' | 'disqualified';
export type AffinityStatus = 'not_pushed' | 'pushed' | 'push_failed';
export type RankingLabel = 'Great' | 'Good' | 'High Ok' | 'Ok' | 'Small & Interesting' | 'Poor';

export interface ScoringConfig {
  id: string;
  user_id: string;
  dimension: 'growth' | 'scale' | 'capital_efficiency' | 'product' | 'market';
  weight: number;
  thresholds: Record<string, unknown> | null;
  updated_at: string;
}

export interface ProspectOwner {
  id: string;
  user_id: string;
  owner_name: string;
  geography_rules: string[] | null;
  is_default: boolean;
}

export interface ScrapeSnapshot {
  id: string;
  company_id: string;
  version: number;
  reason: string | null;
  completeness_score: number;
  summary_fields: Record<string, string | number | null>;
  data_points: Array<{
    category: string;
    field_name: string;
    field_value: string | null;
    source: string;
    source_url: string | null;
  }>;
  stages: Array<{
    source: string;
    status: string;
    fields_found: number;
    error_message: string | null;
  }>;
  created_at: string;
}

export interface ScrapeRun {
  id: string;
  company_id: string;
  batch_id: string;
  run_number: number;
  status: 'running' | 'success' | 'failed' | 'timeout';
  error_message: string | null;
  error_type: string | null;
  data_points_found: number;
  completeness_score: number;
  duration_seconds: number | null;
  claude_output_chars: number;
  started_at: string;
  completed_at: string | null;
  company_name?: string;
}

export interface HeartbeatRow {
  id: string;
  scraper_host: string;
  status: 'alive' | 'scraping' | 'idle';
  chrome_cdp_up: boolean;
  batch_id: string | null;
  company_id: string | null;
  company_name: string | null;
  message: string | null;
  started_at: string;
  updated_at: string;
}

export interface DataPointDiff {
  field_name: string;
  category: string;
  old_value: string | null;
  new_value: string | null;
  change: 'added' | 'removed' | 'changed';
  source: string;
}

/** @deprecated Use PipelineEvent from pipeline-events.ts instead */
export interface CompanyEvent {
  id: string;
  company_id: string;
  batch_id: string | null;
  event_type: string;
  from_status: string | null;
  to_status: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

// Re-export PipelineEvent as the canonical event type
export type { PipelineEvent, PipelineEventType, EventActor, ScrapingPhase } from './pipeline-events';

export const SCRAPE_SOURCES = [
  { source: 'linkedin', display_name: 'LinkedIn', order_index: 1 },
  { source: 'companies_house', display_name: 'Companies House', order_index: 2 },
  { source: 'web_search', display_name: 'Web Search', order_index: 3 },
  { source: 'financial', display_name: 'Financial Sources', order_index: 4 },
  { source: 'community', display_name: 'Community & Social', order_index: 5 },
  { source: 'tech_product', display_name: 'Tech & Product', order_index: 6 },
] as const;
