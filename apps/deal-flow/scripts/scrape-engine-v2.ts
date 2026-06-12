#!/usr/bin/env npx tsx
/**
 * Deal Flow Scraping Engine V2 — Parallel Per-Source Agents
 *
 * Instead of one Claude process doing all 6 phases sequentially,
 * V2 spawns 3 focused agents per company in parallel:
 *   - identity-agent: LinkedIn API + Companies House API + website (2 min)
 *   - research-agent: Web search for funding, revenue, growth, leadership (3 min)
 *   - signals-agent: G2, Capterra, Reddit, HN, Product Hunt, GitHub (2 min)
 *
 * After all agents complete, runs consolidation (backfill summary fields,
 * emit phase events). If critical fields are missing, spawns a gap-fill agent.
 *
 * Global semaphore limits total concurrent Claude processes to MAX_AGENTS (default 4).
 *
 * ADR: docs/adr/002-v2-scraper-constraints.md
 *
 * Usage:
 *   npx tsx scripts/scrape-engine-v2.ts --company <id>   # Single company
 *   npx tsx scripts/scrape-engine-v2.ts --batch <id>     # Full batch
 *   npx tsx scripts/scrape-engine-v2.ts                  # Poll for pending batches
 */

import { createClient } from '@supabase/supabase-js';
import { spawn } from 'child_process';
import { readFileSync, writeFileSync, appendFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

// ─── Config ──────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY. Set it in .env.local or environment.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const JARVIS_ROOT = resolve(REPO_ROOT, '..', '..');
const PROMPTS_DIR = resolve(__dirname, 'prompts');

const MODEL = process.env.SCRAPE_MODEL || 'sonnet';
const CLAUDE_BIN = process.env.CLAUDE_BIN || (process.platform === 'linux' ? '/usr/bin/claude' : '/path/to/claude');
const MAX_RETRIES = parseInt(process.env.MAX_SCRAPE_RETRIES || '2', 10);
const BATCH_CONCURRENCY = parseInt(process.env.BATCH_CONCURRENCY || '2', 10); // companies at a time
const MAX_AGENTS = parseInt(process.env.MAX_AGENTS || '4', 10); // global Claude process cap
const STAGGER_DELAY_MS = parseInt(process.env.SCRAPE_STAGGER_MS || '2000', 10);

// Per-agent config
const AGENT_CONFIG = {
  identity: { timeout: 2 * 60 * 1000, budget: '0.50', promptFile: 'identity-agent.md' },
  research: { timeout: 3 * 60 * 1000, budget: '1.00', promptFile: 'research-agent.md' },
  signals:  { timeout: 2 * 60 * 1000, budget: '0.50', promptFile: 'signals-agent.md' },
  gapfill:  { timeout: 90 * 1000,     budget: '0.30', promptFile: 'gapfill-agent.md' },
} as const;

type AgentType = keyof typeof AGENT_CONFIG;

const SCRAPE_SOURCES = ['linkedin', 'companies_house', 'web_search', 'financial', 'community', 'tech_product'] as const;

// Critical fields for gap-fill check
const CRITICAL_FIELDS = ['sub_industry', 'employee_growth_pct', 'is_saas', 'ownership_status'] as const;
const HIGH_PRIORITY_FIELDS = ['employee_count', 'funding_total', 'revenue_estimate', 'ceo_name', 'location_city', 'location_country'] as const;

// ─── Types ───────────────────────────────────────────────────────────
interface Company {
  id: string;
  batch_id: string;
  user_id: string;
  name: string;
  linkedin_url: string | null;
  website: string | null;
  scrape_status: string;
  scrape_started_at: string | null;
  rescrape_reason: string | null;
  retry_count: number;
}

interface AgentResult {
  agentType: AgentType;
  succeeded: boolean;
  errorType: string | null;
  outputChars: number;
  outputTail: string;
}

// ─── Logging ─────────────────────────────────────────────────────────
const LOGS_DIR = resolve(__dirname, 'logs');
if (!existsSync(LOGS_DIR)) mkdirSync(LOGS_DIR, { recursive: true });

const RUN_ID = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const RUN_LOG_PATH = resolve(LOGS_DIR, `v2-run-${RUN_ID}.log`);

function log(msg: string) {
  const line = `[${new Date().toISOString().slice(11, 19)}] ${msg}`;
  console.log(line);
  appendFileSync(RUN_LOG_PATH, line + '\n');
}

function saveAgentOutput(companyName: string, companyId: string, agentType: string, output: string, suffix = '') {
  const safeName = companyName.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30);
  const filename = `v2-${agentType}-${safeName}-${companyId.slice(0, 8)}${suffix}.log`;
  const filepath = resolve(LOGS_DIR, filename);
  writeFileSync(filepath, output);
  return filepath;
}

// ─── Global Semaphore ────────────────────────────────────────────────
// Limits total concurrent Claude processes across all companies.
// ADR 002: Max 4 concurrent Claude processes.

class Semaphore {
  private current = 0;
  private queue: (() => void)[] = [];

  constructor(private max: number) {}

  async acquire(): Promise<void> {
    if (this.current < this.max) {
      this.current++;
      return;
    }
    return new Promise<void>(resolve => this.queue.push(resolve));
  }

  release(): void {
    this.current--;
    if (this.queue.length > 0) {
      this.current++;
      this.queue.shift()!();
    }
  }

  get active(): number { return this.current; }
}

const globalSemaphore = new Semaphore(MAX_AGENTS);

// ─── Bail-Out Flag ──────────────────────────────────────────────────
// Shared across all agents. Set on out_of_usage errors.
let bailOut = false;

// ─── Async Claude Execution ─────────────────────────────────────────
interface ClaudeExecResult { stdout: string; code: number | null; signal: string | null; killed: boolean; }

function execClaudeAsync(prompt: string, cwd: string, timeoutMs: number, budget: string): Promise<ClaudeExecResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(CLAUDE_BIN, [
      '-p',
      '--dangerously-skip-permissions',
      '--model', MODEL,
      '--max-budget-usd', budget,
      '--no-session-persistence',
    ], {
      cwd,
      env: { ...process.env, CLAUDECODE: '', CLAUDE_CODE_ENTRYPOINT: 'cli' },
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';
    let killed = false;

    child.stdout.on('data', (chunk: Buffer) => { stdout += chunk.toString(); });
    child.stderr.on('data', (chunk: Buffer) => { stderr += chunk.toString(); });

    child.stdin.write(prompt);
    child.stdin.end();

    // Hard timeout — SIGTERM then SIGKILL after 10s
    const timer = setTimeout(() => {
      killed = true;
      child.kill('SIGTERM');
      setTimeout(() => {
        try { child.kill('SIGKILL'); } catch { /* already dead */ }
      }, 10_000);
    }, timeoutMs);

    child.on('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });

    child.on('close', (code, signal) => {
      clearTimeout(timer);
      if (code === 0) {
        resolve({ stdout, code, signal, killed: false });
      } else {
        const err = new Error(`${stderr || `Claude exited with code ${code}`}`);
        (err as any).stdout = stdout;
        (err as any).stderr = stderr;
        (err as any).killed = killed;
        (err as any).signal = signal;
        reject(err);
      }
    });
  });
}

// ─── Pipeline Events ─────────────────────────────────────────────────

async function emitEvent(
  companyId: string,
  batchId: string,
  eventType: string,
  payload: Record<string, unknown> = {},
  options: { actor?: string; phase?: string; runId?: string } = {}
): Promise<string> {
  const { data, error } = await supabase.rpc('emit_pipeline_event', {
    p_company_id: companyId,
    p_batch_id: batchId,
    p_event_type: eventType,
    p_actor: options.actor || 'engine-v2',
    p_payload: payload,
    p_phase: options.phase || null,
    p_run_id: options.runId || null,
  });

  if (error) {
    log(`  WARNING: emitEvent(${eventType}) failed: ${error.message}`);
    return '';
  }
  return data as string;
}

async function emitBatchEvent(
  batchId: string,
  eventType: string,
  payload: Record<string, unknown> = {}
): Promise<void> {
  const { error } = await supabase.rpc('emit_batch_event', {
    p_batch_id: batchId,
    p_event_type: eventType,
    p_actor: 'engine-v2',
    p_payload: payload,
  });
  if (error) log(`  WARNING: emitBatchEvent(${eventType}) failed: ${error.message}`);
}

// ─── Phase Event Emission ────────────────────────────────────────────

// Maps each scrape source to the agent responsible for it
const SOURCE_TO_AGENT: Record<string, AgentType> = {
  linkedin: 'identity',
  companies_house: 'identity',
  web_search: 'research',
  financial: 'research',
  community: 'signals',
  tech_product: 'signals',
};

async function emitPhaseEvents(companyId: string, batchId: string, runId: string, agentResults: AgentResult[]): Promise<void> {
  for (const source of SCRAPE_SOURCES) {
    const { count } = await supabase
      .from('df_data_points')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId)
      .eq('source', source);

    const fieldsFound = count || 0;
    if (fieldsFound > 0) {
      await emitEvent(companyId, batchId, 'company.phase_completed', { fields_found: fieldsFound }, { phase: source, runId });
    } else {
      // Distinguish: did the responsible agent error, or did it just find nothing?
      const responsibleAgent = SOURCE_TO_AGENT[source];
      const agentResult = agentResults.find(r => r.agentType === responsibleAgent);
      const agentErrored = agentResult ? agentResult.errorType !== null && !agentResult.succeeded : false;

      if (agentErrored) {
        await emitEvent(companyId, batchId, 'company.phase_failed', { error: agentResult!.errorType || 'Agent error' }, { phase: source, runId });
      } else {
        await emitEvent(companyId, batchId, 'company.phase_no_data', { error: 'No data found for this source' }, { phase: source, runId });
      }
    }
  }
}

// ─── Heartbeat ──────────────────────────────────────────────────────

async function updateHeartbeat(fields: Record<string, unknown>) {
  const host = process.env.SCRAPER_HOST || (process.platform === 'linux' ? 'vps' : 'local');

  let chromeCdpUp = false;
  try {
    const resp = await fetch('http://127.0.0.1:9222/json/version', { signal: AbortSignal.timeout(2000) });
    chromeCdpUp = resp.ok;
  } catch { /* not running */ }

  await supabase.from('df_scraper_heartbeat').upsert({
    scraper_host: host,
    chrome_cdp_up: chromeCdpUp,
    updated_at: new Date().toISOString(),
    ...fields,
  } as any, { onConflict: 'scraper_host' });
}

// ─── Prompt Builder ─────────────────────────────────────────────────

function buildAgentPrompt(agentType: AgentType, company: Company, extra?: string): string {
  const config = AGENT_CONFIG[agentType];
  let template = readFileSync(resolve(PROMPTS_DIR, config.promptFile), 'utf-8');

  const linkedinUrl = company.linkedin_url || `https://www.linkedin.com/company/${company.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  const companyNameEncoded = encodeURIComponent(company.name);
  const companyNameLower = company.name.toLowerCase().replace(/[^a-z0-9]/g, '');

  const rapidApiKey = process.env.RAPIDAPI_KEY || '';
  const companiesHouseApiKey = process.env.COMPANIES_HOUSE_API_KEY || '';
  const githubToken = process.env.GITHUB_TOKEN || '';
  const producthuntToken = process.env.PRODUCTHUNT_TOKEN || '';

  template = template.replace(/\{\{COMPANY_NAME\}\}/g, company.name);
  template = template.replace(/\{\{COMPANY_ID\}\}/g, company.id);
  template = template.replace(/\{\{BATCH_ID\}\}/g, company.batch_id);
  template = template.replace(/\{\{LINKEDIN_URL\}\}/g, linkedinUrl);
  template = template.replace(/\{\{COMPANY_NAME_ENCODED\}\}/g, companyNameEncoded);
  template = template.replace(/\{\{COMPANY_NAME_LOWER\}\}/g, companyNameLower);
  template = template.replace(/\{\{RAPIDAPI_KEY\}\}/g, rapidApiKey);
  template = template.replace(/\{\{COMPANIES_HOUSE_API_KEY\}\}/g, companiesHouseApiKey);
  template = template.replace(/\{\{GITHUB_TOKEN\}\}/g, githubToken);
  template = template.replace(/\{\{PRODUCTHUNT_TOKEN\}\}/g, producthuntToken);

  if (extra) {
    template = template.replace(/\{\{MISSING_FIELDS\}\}/g, extra);
  }

  if (company.rescrape_reason) {
    template += `\n\n## User Feedback for Rescrape\n${company.rescrape_reason}\nPay special attention to these issues.\n`;
  }

  return template;
}

// ─── Run Single Agent ───────────────────────────────────────────────

async function runAgent(agentType: AgentType, company: Company, extra?: string): Promise<AgentResult> {
  const config = AGENT_CONFIG[agentType];
  const prompt = buildAgentPrompt(agentType, company, extra);

  // Pre-flight: check bail-out before acquiring semaphore
  if (bailOut) {
    return { agentType, succeeded: false, errorType: 'bail_out', outputChars: 0, outputTail: '' };
  }

  // Acquire semaphore slot (blocks if at capacity)
  await globalSemaphore.acquire();

  // Stagger: small delay to avoid burst pressure
  if (STAGGER_DELAY_MS > 0) {
    await new Promise(r => setTimeout(r, STAGGER_DELAY_MS));
  }

  log(`  [${agentType}] Starting (budget: $${config.budget}, timeout: ${config.timeout / 1000}s, active agents: ${globalSemaphore.active}/${MAX_AGENTS})`);

  try {
    const result = await execClaudeAsync(prompt, JARVIS_ROOT, config.timeout, config.budget);

    const lines = result.stdout.trim().split('\n');
    const tail = lines.slice(-40).join('\n').slice(-4000);
    saveAgentOutput(company.name, company.id, agentType, result.stdout);
    log(`  [${agentType}] Done (${result.stdout.length} chars)`);

    return { agentType, succeeded: true, errorType: null, outputChars: result.stdout.length, outputTail: tail };

  } catch (err: unknown) {
    const errObj = err as { message?: string; stdout?: string; killed?: boolean; signal?: string };
    const msg = errObj.message || String(err);
    const wasTimeout = errObj.killed || errObj.signal === 'SIGTERM';
    const isBudgetExceeded = msg.includes('Exceeded USD budget');
    const isOutOfUsage = msg.includes('out of') && msg.includes('usage');

    const errorType = wasTimeout ? 'timeout' : isBudgetExceeded ? 'budget_exceeded' : isOutOfUsage ? 'out_of_usage' : 'claude_error';

    log(`  [${agentType}] ${errorType}: ${msg.slice(0, 200)}`);

    // Save partial output
    const partialOutput = errObj.stdout || '';
    if (partialOutput.length > 0) {
      saveAgentOutput(company.name, company.id, agentType, partialOutput, '-FAILED');
    }

    // Signal global bail-out on usage exhaustion
    if (isOutOfUsage) {
      bailOut = true;
    }

    // Timeout/budget agents may still have written data — check data points
    const hasPartialData = partialOutput.length > 500; // heuristic: >500 chars means some work was done

    return {
      agentType,
      succeeded: hasPartialData && (wasTimeout || isBudgetExceeded), // partial success if timed out but wrote data
      errorType,
      outputChars: partialOutput.length,
      outputTail: partialOutput.slice(-4000),
    };

  } finally {
    globalSemaphore.release();
  }
}

// ─── Completeness Score ─────────────────────────────────────────────

async function calculateCompleteness(companyId: string): Promise<number> {
  const { data: dps } = await supabase
    .from('df_data_points')
    .select('category')
    .eq('company_id', companyId);

  if (!dps || dps.length === 0) return 0;

  const counts: Record<string, number> = {};
  for (const dp of dps) {
    counts[dp.category] = (counts[dp.category] || 0) + 1;
  }

  const dimensions = [
    { category: 'identity', expected: 5, weight: 0.15 },
    { category: 'location', expected: 3, weight: 0.10 },
    { category: 'size', expected: 4, weight: 0.15 },
    { category: 'leadership', expected: 3, weight: 0.10 },
    { category: 'corporate', expected: 4, weight: 0.05 },
    { category: 'financials', expected: 4, weight: 0.20 },
    { category: 'digital', expected: 5, weight: 0.05 },
    { category: 'market', expected: 6, weight: 0.20 },
  ];

  let score = 0;
  for (const dim of dimensions) {
    const found = counts[dim.category] || 0;
    score += Math.min(1, found / dim.expected) * dim.weight;
  }

  return Math.min(100, Math.round(score * 100));
}

// ─── Backfill Summary Fields ────────────────────────────────────────

async function backfillSummaryFields(companyId: string, batchId: string): Promise<void> {
  const { data: dps } = await supabase
    .from('df_data_points')
    .select('field_name, field_value, category, source')
    .eq('company_id', companyId)
    .order('scraped_at', { ascending: false });

  if (!dps || dps.length === 0) return;

  const fieldMap: Record<string, { patterns: string[]; allowedCategories?: string[]; transform?: (v: string) => unknown }> = {
    website: { patterns: ['website', 'company url', 'homepage'], allowedCategories: ['identity', 'digital'] },
    industry: { patterns: ['industry (linkedin)', 'industry', 'sector'], allowedCategories: ['identity', 'market'] },
    sub_industry: { patterns: ['sub industry (final)', 'sub industry (derived)', 'sub_industry', 'sub industry', 'niche', 'vertical', 'g2 category', 'capterra category'], allowedCategories: ['identity', 'market'] },
    hq_location: { patterns: ['headquarters', 'hq', 'head office', 'location'], allowedCategories: ['identity', 'location', 'corporate'] },
    employee_count: { patterns: ['employee count range', 'company size', 'employee count', 'headcount', 'employees', 'total employees'], allowedCategories: ['headcount', 'identity', 'corporate', 'size'] },
    employee_growth_pct: { patterns: ['employee growth % (1yr)', 'employee growth', 'headcount growth', 'yoy growth', '1 year growth', '1y growth'], allowedCategories: ['headcount', 'market', 'size'], transform: (v) => { const n = parseFloat(v); return isNaN(n) ? null : n; } },
    revenue_estimate: { patterns: ['revenue', 'arr', 'annual revenue', 'turnover'], allowedCategories: ['financial', 'financials'] },
    funding_total: { patterns: ['funding total', 'total raised', 'total funding', 'funding'], allowedCategories: ['financial', 'financials'] },
    ceo_name: { patterns: ['ceo', 'chief executive', 'managing director'], allowedCategories: ['leadership'] },
    description: { patterns: ['description', 'overview', 'about'], allowedCategories: ['identity', 'corporate'] },
    founded_year: { patterns: ['founded year', 'founded', 'incorporation date', 'established'], allowedCategories: ['identity', 'corporate'], transform: (v) => { const n = parseInt(v); return (n >= 1800 && n <= 2030) ? n : null; } },
    ownership_status: { patterns: ['ownership status', 'ownership', 'company status', 'acquisition status'], allowedCategories: ['identity', 'corporate'], transform: (v) => { const lower = v.toLowerCase(); if (lower.includes('acquired')) return 'acquired'; if (lower.includes('subsidiary')) return 'subsidiary'; if (lower.includes('public') || lower.includes('listed')) return 'public'; if (lower.includes('private')) return 'private'; return v; } },
    is_saas: { patterns: ['is saas', 'saas status', 'saas screener', 'business model'], allowedCategories: ['identity', 'market'], transform: (v) => { const lower = v.toLowerCase(); return lower === 'true' || lower === 'yes' || lower.includes('saas'); } },
    last_funding_date: { patterns: ['last funding date', 'latest round date', 'most recent funding', 'last round date'], allowedCategories: ['financial', 'financials'] },
    last_funding_amount: { patterns: ['last funding amount', 'latest round amount', 'most recent round', 'last round'], allowedCategories: ['financial', 'financials'] },
    headcount_growth_6m: { patterns: ['employee growth % (6mo)', '6 month growth', '6m growth', 'headcount growth 6m', '6-month growth'], allowedCategories: ['headcount', 'size', 'market'], transform: (v) => { const n = parseFloat(v); return isNaN(n) ? null : n; } },
    investors: { patterns: ['investors', 'key investors', 'investor list', 'backed by', 'funded by'], allowedCategories: ['financial', 'financials'] },
    location_city: { patterns: ['city', 'hq city', 'headquarters city'], allowedCategories: ['location', 'identity'] },
    location_country: { patterns: ['country', 'hq country', 'headquarters country'], allowedCategories: ['location', 'identity'] },
  };

  const updates: Record<string, unknown> = {};

  for (const [field, config] of Object.entries(fieldMap)) {
    const eligible = config.allowedCategories
      ? dps.filter(dp => config.allowedCategories!.includes(dp.category?.toLowerCase() ?? ''))
      : dps;

    let bestDp = null;
    for (const pattern of config.patterns) {
      bestDp = eligible.find(dp => dp.field_name.toLowerCase() === pattern.toLowerCase() && dp.field_value);
      if (bestDp) break;
      bestDp = eligible.find(dp => dp.field_name.toLowerCase().includes(pattern.toLowerCase()) && dp.field_value);
      if (bestDp) break;
    }

    if (bestDp?.field_value) {
      const value = config.transform ? config.transform(bestDp.field_value) : bestDp.field_value;
      if (value != null) updates[field] = value;
    }
  }

  if (Object.keys(updates).length > 0) {
    const { data: current } = await supabase.from('df_companies').select('*').eq('id', companyId).single();
    if (current) {
      const nullUpdates: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(updates)) {
        if (current[k] == null || current[k] === '') {
          nullUpdates[k] = v;
        }
      }
      if (Object.keys(nullUpdates).length > 0) {
        await supabase.from('df_companies').update(nullUpdates).eq('id', companyId);
        log(`  Backfilled ${Object.keys(nullUpdates).length} fields: ${Object.keys(nullUpdates).join(', ')}`);
        await emitEvent(companyId, batchId, 'company.data_backfilled', { fields: Object.keys(nullUpdates) });
      }
    }
  }
}

// ─── Gap-Fill Check ─────────────────────────────────────────────────

async function checkAndFillGaps(company: Company, runId: string): Promise<AgentResult | null> {
  const { data: row } = await supabase.from('df_companies').select('*').eq('id', company.id).single();
  if (!row) return null;

  const missing: string[] = [];

  for (const field of CRITICAL_FIELDS) {
    if (row[field] == null || row[field] === '') {
      missing.push(`- **${field}**: NOT FOUND — this is a gate-blocking field`);
    }
  }

  for (const field of HIGH_PRIORITY_FIELDS) {
    if (row[field] == null || row[field] === '') {
      missing.push(`- **${field}**: NOT FOUND — high priority scoring input`);
    }
  }

  // Only run gap-fill if critical fields are missing
  const criticalMissing = CRITICAL_FIELDS.filter(f => row[f] == null || row[f] === '');
  if (criticalMissing.length === 0) {
    log(`  No critical field gaps — skipping gap-fill agent`);
    return null;
  }

  log(`  ${criticalMissing.length} critical fields missing: ${criticalMissing.join(', ')} — spawning gap-fill agent`);

  const missingFieldsText = missing.join('\n');
  return runAgent('gapfill', company, missingFieldsText);
}

// ─── Scrape Company (V2 — Parallel Agents) ──────────────────────────

interface ScrapeResult {
  succeeded: boolean;
  errorType: string | null;
  runId: string;
  agentResults: AgentResult[];
  dataPointCount: number;
}

async function scrapeCompany(company: Company): Promise<ScrapeResult> {
  const attempt = (company.retry_count || 0) + 1;
  const runId = randomUUID();

  log(`\n${'═'.repeat(60)}`);
  log(`Scraping: ${company.name} (${company.id}) [attempt ${attempt}/${MAX_RETRIES + 1}]`);
  log(`  Strategy: 3 parallel agents (identity + research + signals)`);

  // Update heartbeat
  await updateHeartbeat({ status: 'scraping', company_id: company.id, company_name: company.name, batch_id: company.batch_id });

  // Emit scrape_started
  await emitEvent(company.id, company.batch_id, 'company.scrape_started', {
    attempt,
    model: MODEL,
    engine: 'v2',
    company_name: company.name,
    linkedin_url: company.linkedin_url,
  }, { runId });

  await supabase.from('df_companies').update({
    scrape_started_at: new Date().toISOString(),
  }).eq('id', company.id);

  // ── Launch 3 agents in parallel ──
  const agentStart = Date.now();

  const [identityResult, researchResult, signalsResult] = await Promise.all([
    runAgent('identity', company),
    runAgent('research', company),
    runAgent('signals', company),
  ]);

  const agentDuration = Math.round((Date.now() - agentStart) / 1000);
  log(`  All agents done in ${agentDuration}s`);
  log(`    identity: ${identityResult.succeeded ? 'OK' : `FAILED (${identityResult.errorType})`} (${identityResult.outputChars} chars)`);
  log(`    research: ${researchResult.succeeded ? 'OK' : `FAILED (${researchResult.errorType})`} (${researchResult.outputChars} chars)`);
  log(`    signals:  ${signalsResult.succeeded ? 'OK' : `FAILED (${signalsResult.errorType})`} (${signalsResult.outputChars} chars)`);

  const agentResults: AgentResult[] = [identityResult, researchResult, signalsResult];

  // ── Consolidation: backfill summary fields ──
  log(`  Running consolidation...`);
  await backfillSummaryFields(company.id, company.batch_id);

  // ── Gap-fill: check for critical missing fields ──
  if (!bailOut) {
    const gapResult = await checkAndFillGaps(company, runId);
    if (gapResult) {
      agentResults.push(gapResult);
      // Re-run backfill after gap-fill
      await backfillSummaryFields(company.id, company.batch_id);
    }
  }

  // ── Emit phase events ──
  await emitPhaseEvents(company.id, company.batch_id, runId, agentResults);

  // ── Verify data was written ──
  const { count: dataPointCount } = await supabase
    .from('df_data_points')
    .select('*', { count: 'exact', head: true })
    .eq('company_id', company.id);

  const hasData = (dataPointCount || 0) > 0;

  // ── Calculate completeness ──
  const score = await calculateCompleteness(company.id);
  await supabase.from('df_companies').update({ completeness_score: score }).eq('id', company.id);
  log(`  Completeness: ${score}% (${dataPointCount || 0} data points)`);

  // At least one agent must have succeeded and produced data
  const anyAgentSucceeded = agentResults.some(r => r.succeeded);
  const succeeded = hasData && anyAgentSucceeded;

  // Determine error type if failed
  let errorType: string | null = null;
  if (!succeeded) {
    if (agentResults.some(r => r.errorType === 'out_of_usage')) errorType = 'out_of_usage';
    else if (!hasData) errorType = 'no_data';
    else errorType = 'all_agents_failed';
  }

  return { succeeded, errorType, runId, agentResults, dataPointCount: dataPointCount || 0 };
}

// ─── Finish Company ──────────────────────────────────────────────────

async function finishCompany(companyId: string, result: ScrapeResult): Promise<void> {
  const { succeeded, runId, agentResults, dataPointCount } = result;
  const { data: company } = await supabase.from('df_companies').select('*').eq('id', companyId).single();
  if (!company) { log(`Company ${companyId} not found`); return; }

  const startedAt = company.scrape_started_at ? new Date(company.scrape_started_at).getTime() : Date.now();
  const durationSeconds = Math.round((Date.now() - startedAt) / 1000);
  const retryCount = company.retry_count || 0;

  // Auto-retry if failed and under limit
  if (!succeeded && retryCount < MAX_RETRIES && result.errorType !== 'out_of_usage') {
    log(`  ${company.name}: FAILED — queuing for auto-retry (attempt ${retryCount + 1}/${MAX_RETRIES})`);

    await emitEvent(companyId, company.batch_id, 'company.retry_auto', {
      attempt: retryCount + 1,
      error_type: 'auto_retry',
      company_name: company.name,
      agent_results: agentResults.map(r => ({ agent: r.agentType, ok: r.succeeded, error: r.errorType })),
    }, { runId });

    await supabase.from('df_companies').update({
      retry_count: retryCount + 1,
      scrape_completed_at: new Date().toISOString(),
      scrape_duration_seconds: durationSeconds,
    }).eq('id', companyId);

    return;
  }

  // Final status via event
  if (succeeded) {
    await emitEvent(companyId, company.batch_id, 'company.scrape_completed', {
      data_points: dataPointCount,
      completeness: company.completeness_score || 0,
      duration_s: durationSeconds,
      engine: 'v2',
      company_name: company.name,
      agent_results: agentResults.map(r => ({ agent: r.agentType, ok: r.succeeded, error: r.errorType, chars: r.outputChars })),
    }, { runId });
  } else {
    await emitEvent(companyId, company.batch_id, 'company.scrape_failed', {
      error_type: result.errorType || 'unknown',
      error: `Failed after ${retryCount + 1} attempts`,
      attempt: retryCount + 1,
      duration_s: durationSeconds,
      engine: 'v2',
      company_name: company.name,
      agent_results: agentResults.map(r => ({ agent: r.agentType, ok: r.succeeded, error: r.errorType, chars: r.outputChars })),
    }, { runId });
  }

  // Update metadata
  await supabase.from('df_companies').update({
    scrape_completed_at: new Date().toISOString(),
    scrape_duration_seconds: durationSeconds,
  }).eq('id', companyId);

  // Recalculate batch counters
  const { data: allCompanies } = await supabase
    .from('df_companies')
    .select('scrape_status, scrape_duration_seconds')
    .eq('batch_id', company.batch_id);

  if (allCompanies) {
    const finished = allCompanies.filter(c => c.scrape_status === 'scraped' || c.scrape_status === 'failed');
    const durations = finished.filter(c => c.scrape_duration_seconds).map(c => c.scrape_duration_seconds!);
    const avgSec = durations.length > 0 ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : null;

    await supabase.from('df_batches').update({
      scraped_count: finished.length,
      avg_scrape_seconds: avgSec,
      status: finished.length >= allCompanies.length ? 'complete' : 'scraping',
    }).eq('id', company.batch_id);

    log(`  ${company.name}: ${succeeded ? 'done' : 'FAILED (permanent)'} in ${durationSeconds}s. Batch: ${finished.length}/${allCompanies.length}`);
  }
}

// ─── Batch Mode ──────────────────────────────────────────────────────

interface PoolTask<T> { fn: () => Promise<T>; }

async function runPool<T>(
  tasks: PoolTask<T>[],
  concurrency: number,
  shouldBail: () => boolean,
): Promise<T[]> {
  const results: T[] = [];
  let nextIdx = 0;

  async function worker(): Promise<void> {
    while (nextIdx < tasks.length) {
      if (shouldBail()) return;
      const idx = nextIdx++;
      if (idx >= tasks.length) return;
      const result = await tasks[idx].fn();
      results.push(result);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, tasks.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

async function scrapeBatch(batchId: string): Promise<void> {
  log(`\nStarting batch: ${batchId} (engine: v2, max agents: ${MAX_AGENTS}, batch concurrency: ${BATCH_CONCURRENCY})`);

  await emitBatchEvent(batchId, 'batch.started');
  await supabase.from('df_batches').update({ status: 'scraping' }).eq('id', batchId);

  const { data: companies } = await supabase
    .from('df_companies')
    .select('*')
    .eq('batch_id', batchId)
    .in('scrape_status', ['pending', 'rescrape', 'retry_queued'])
    .order('created_at', { ascending: true });

  if (!companies || companies.length === 0) {
    log('No pending companies.');
    return;
  }

  log(`${companies.length} companies to scrape`);

  interface CompanyScrapeResult { companyId: string; result: ScrapeResult; }

  const tasks: PoolTask<CompanyScrapeResult>[] = companies.map((company) => ({
    fn: async (): Promise<CompanyScrapeResult> => {
      const result = await scrapeCompany(company as Company);
      await finishCompany(company.id, result);

      if (result.errorType === 'out_of_usage') {
        log(`\nFATAL: Claude usage limit reached. Signaling bail-out.`);
        bailOut = true;
        await emitBatchEvent(batchId, 'batch.paused', { reason: 'out_of_usage' });
      }

      return { companyId: company.id, result };
    },
  }));

  await runPool(tasks, BATCH_CONCURRENCY, () => bailOut);

  if (bailOut) return;

  // ── Retry loop ──
  for (let retryPass = 1; retryPass <= MAX_RETRIES; retryPass++) {
    const { data: retries } = await supabase
      .from('df_companies')
      .select('*')
      .eq('batch_id', batchId)
      .eq('scrape_status', 'pending')
      .gt('retry_count', 0)
      .order('created_at', { ascending: true });

    if (!retries || retries.length === 0) break;

    log(`\nRetry pass ${retryPass}/${MAX_RETRIES}: ${retries.length} companies`);

    const retryTasks: PoolTask<CompanyScrapeResult>[] = retries.map((company) => ({
      fn: async (): Promise<CompanyScrapeResult> => {
        const result = await scrapeCompany(company as Company);
        await finishCompany(company.id, result);

        if (result.errorType === 'out_of_usage') {
          bailOut = true;
          await emitBatchEvent(batchId, 'batch.paused', { reason: 'out_of_usage' });
        }

        return { companyId: company.id, result };
      },
    }));

    await runPool(retryTasks, BATCH_CONCURRENCY, () => bailOut);
    if (bailOut) return;
  }

  // Final batch summary
  const { data: finalCounts } = await supabase
    .from('df_companies')
    .select('scrape_status')
    .eq('batch_id', batchId);

  if (finalCounts) {
    const succeeded = finalCounts.filter(c => c.scrape_status === 'scraped').length;
    const failed = finalCounts.filter(c => c.scrape_status === 'failed').length;
    log(`\nBatch complete. ${succeeded}/${finalCounts.length} succeeded, ${failed} failed.`);

    await emitBatchEvent(batchId, 'batch.completed', {
      success_count: succeeded,
      fail_count: failed,
      total_count: finalCounts.length,
    });
  }
}

// ─── Entry Point ─────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);

  log(`Deal Flow Scrape Engine V2 starting`);
  log(`  Model: ${MODEL}, Max agents: ${MAX_AGENTS}, Batch concurrency: ${BATCH_CONCURRENCY}`);

  await updateHeartbeat({ status: 'alive', company_id: null, company_name: null, batch_id: null, message: 'Engine V2 started' });

  if (args.includes('--company')) {
    const id = args[args.indexOf('--company') + 1];
    if (!id) { console.error('Missing company ID'); process.exit(1); }
    const { data: company } = await supabase.from('df_companies').select('*').eq('id', id).single();
    if (!company) { console.error(`Company ${id} not found`); process.exit(1); }
    const result = await scrapeCompany(company as Company);
    await finishCompany(id, result);
  } else if (args.includes('--batch')) {
    const id = args[args.indexOf('--batch') + 1];
    if (!id) { console.error('Missing batch ID'); process.exit(1); }
    await scrapeBatch(id);
  } else {
    // Poll for pending batches
    const { data: batches } = await supabase.from('df_batches').select('*').in('status', ['pending', 'scraping']).order('created_at', { ascending: true });
    if (!batches || batches.length === 0) {
      log('No pending batches.');
      return;
    }
    for (const batch of batches) {
      await scrapeBatch(batch.id);
    }
  }

  await updateHeartbeat({ status: 'idle', company_id: null, company_name: null, batch_id: null, message: 'V2 run complete' });
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
