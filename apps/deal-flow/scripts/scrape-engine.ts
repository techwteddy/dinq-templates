#!/usr/bin/env npx tsx
/**
 * Deal Flow Scraping Engine — Claude-Powered (Event-First Architecture)
 *
 * Thin orchestrator that shells out to `claude -p` for actual scraping.
 * Claude Code has Chrome Stealth, WebFetch, WebSearch, and Supabase MCP tools.
 *
 * All state transitions go through emitEvent() which calls the Postgres
 * function emit_pipeline_event(). This atomically inserts an event AND
 * updates the derived scrape_status on df_companies.
 *
 * Usage:
 *   npx tsx scripts/scrape-engine.ts --company <company_id>   # Full scrape for one company
 *   npx tsx scripts/scrape-engine.ts --batch <batch_id>       # Full scrape for all companies in batch
 *   npx tsx scripts/scrape-engine.ts                          # Poll for pending batches (cron mode)
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
const PROMPT_TEMPLATE_PATH = resolve(__dirname, 'scrape-prompt.md');

const MAX_BUDGET_PER_COMPANY = process.env.SCRAPE_BUDGET || '2.00';
const MODEL = 'sonnet';
const SCRAPE_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes hard kill — forces efficiency
const CLAUDE_BIN = process.env.CLAUDE_BIN || (process.platform === 'linux' ? '/usr/bin/claude' : '/path/to/claude');
const MAX_RETRIES = parseInt(process.env.MAX_SCRAPE_RETRIES || '3', 10);
const CONCURRENCY = parseInt(process.env.SCRAPE_CONCURRENCY || '3', 10);
const STAGGER_DELAY_MS = parseInt(process.env.SCRAPE_STAGGER_MS || '5000', 10); // delay between launching concurrent scrapes

const SCRAPE_SOURCES = ['linkedin', 'companies_house', 'web_search', 'financial', 'community', 'tech_product'] as const;

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

// ─── Logging ─────────────────────────────────────────────────────────
const LOGS_DIR = resolve(__dirname, 'logs');
if (!existsSync(LOGS_DIR)) mkdirSync(LOGS_DIR, { recursive: true });

const RUN_ID = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const RUN_LOG_PATH = resolve(LOGS_DIR, `run-${RUN_ID}.log`);

function log(msg: string) {
  const line = `[${new Date().toISOString().slice(11, 19)}] ${msg}`;
  console.log(line);
  appendFileSync(RUN_LOG_PATH, line + '\n');
}

function saveClaudeOutput(companyName: string, companyId: string, output: string, suffix = '') {
  const safeName = companyName.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40);
  const filename = `claude-${safeName}-${companyId.slice(0, 8)}${suffix}.log`;
  const filepath = resolve(LOGS_DIR, filename);
  writeFileSync(filepath, output);
  log(`  Claude output saved: logs/${filename} (${output.length} chars)`);
  return filepath;
}

// ─── Async Claude Execution ─────────────────────────────────────────
// Non-blocking spawn so multiple scrapes can run concurrently.
interface ClaudeExecResult { stdout: string; code: number | null; signal: string | null; killed: boolean; }

function execClaudeAsync(prompt: string, cwd: string, timeoutMs: number): Promise<ClaudeExecResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(CLAUDE_BIN, [
      '-p',
      '--dangerously-skip-permissions',
      '--model', MODEL,
      '--max-budget-usd', MAX_BUDGET_PER_COMPANY,
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

    // Write prompt to stdin then close
    child.stdin.write(prompt);
    child.stdin.end();

    // Timeout watchdog
    const timer = setTimeout(() => {
      killed = true;
      child.kill('SIGTERM');
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
        // Build an error-like result with partial output (matches old execSync error shape)
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

// ─── Concurrency Pool ───────────────────────────────────────────────
// Runs async tasks with a max concurrency limit and stagger delay.
// Returns when all tasks complete. Supports early bail-out via a shared flag.

interface PoolTask<T> { fn: () => Promise<T>; }

async function runPool<T>(
  tasks: PoolTask<T>[],
  concurrency: number,
  staggerMs: number,
  shouldBail: () => boolean,
): Promise<T[]> {
  const results: T[] = [];
  let nextIdx = 0;

  async function worker(): Promise<void> {
    while (nextIdx < tasks.length) {
      if (shouldBail()) return;
      const idx = nextIdx++;
      if (idx >= tasks.length) return;

      // Stagger: delay non-first launches within each worker
      if (idx > 0 && staggerMs > 0) {
        await new Promise(r => setTimeout(r, staggerMs));
      }

      const result = await tasks[idx].fn();
      results.push(result);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, tasks.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

// ─── Pipeline Events ─────────────────────────────────────────────────
// Single function for ALL state transitions. Calls Postgres RPC which
// atomically inserts event + updates derived scrape_status.

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
    p_actor: options.actor || 'system',
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
    p_actor: 'system',
    p_payload: payload,
  });

  if (error) {
    log(`  WARNING: emitBatchEvent(${eventType}) failed: ${error.message}`);
  }
}

// ─── Phase Event Emission ────────────────────────────────────────────
// After Claude finishes, check df_data_points per source to determine
// which phases succeeded/failed. Emit events for each phase.

async function emitPhaseEvents(companyId: string, batchId: string, runId: string): Promise<void> {
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
      await emitEvent(companyId, batchId, 'company.phase_failed', { error: 'No data points found' }, { phase: source, runId });
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

// ─── Build Prompt ────────────────────────────────────────────────────
function buildPrompt(company: Company): string {
  let template = readFileSync(PROMPT_TEMPLATE_PATH, 'utf-8');

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

  if (company.rescrape_reason) {
    template += `\n\n## User Feedback for Rescrape\n${company.rescrape_reason}\nPay special attention to these issues. The previous data was cleared — rescrape everything fresh.\n`;
  }

  return template;
}

// ─── Completeness Score ─────────────────────────────────────────────
async function calculateCompletenessFromData(companyId: string, totalDataPoints: number): Promise<number> {
  if (totalDataPoints === 0) return 0;

  const { data: dps } = await supabase
    .from('df_data_points')
    .select('category')
    .eq('company_id', companyId);

  if (!dps || dps.length === 0) return 0;

  const counts: Record<string, number> = {};
  for (const dp of dps) {
    counts[dp.category] = (counts[dp.category] || 0) + 1;
  }

  const dimensions: { category: string; expected: number; weight: number }[] = [
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
    const dimScore = Math.min(1, found / dim.expected);
    score += dimScore * dim.weight;
  }

  return Math.min(100, Math.round(score * 100));
}

// ─── Backfill Summary Fields from Data Points ──────────────────────
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
        log(`  Backfilled ${Object.keys(nullUpdates).length} summary fields: ${Object.keys(nullUpdates).join(', ')}`);
        await emitEvent(companyId, batchId, 'company.data_backfilled', { fields: Object.keys(nullUpdates) });
      }
    }
  }
}

// ─── Scrape Company via Claude ──────────────────────────────────────
interface ScrapeResult { succeeded: boolean; errorType: string | null; runId: string; claudeOutputTail: string; claudeOutputChars: number; dataPointCount: number; }

async function scrapeCompany(company: Company): Promise<ScrapeResult> {
  const attempt = (company.retry_count || 0) + 1;
  const runId = randomUUID();

  log(`\nScraping: ${company.name} (${company.id}) [attempt ${attempt}/${MAX_RETRIES + 1}]`);

  // Update heartbeat
  await updateHeartbeat({ status: 'scraping', company_id: company.id, company_name: company.name, batch_id: company.batch_id });

  // Emit scrape_started event (sets scrape_status = 'scraping' via Postgres function)
  await emitEvent(company.id, company.batch_id, 'company.scrape_started', {
    attempt,
    model: MODEL,
    budget_cap: MAX_BUDGET_PER_COMPANY,
    company_name: company.name,
    linkedin_url: company.linkedin_url,
  }, { runId });

  // Set metadata fields (not guarded by trigger — only scrape_status changes are guarded)
  await supabase.from('df_companies').update({
    scrape_started_at: new Date().toISOString(),
  }).eq('id', company.id);

  // Build prompt
  const prompt = buildPrompt(company);

  // Shell out to claude -p (async — non-blocking for concurrent scraping)
  let claudeSucceeded = false;
  let claudeErrorType: string | null = null;
  let claudeErrorMsg: string | null = null;
  let claudeOutputLength = 0;
  let claudeOutputTail = '';
  const scrapeStart = Date.now();

  try {
    log(`  Launching claude -p (model: ${MODEL}, budget: $${MAX_BUDGET_PER_COMPANY})`);

    const result = await execClaudeAsync(prompt, JARVIS_ROOT, SCRAPE_TIMEOUT_MS);

    const durationSec = Math.round((Date.now() - scrapeStart) / 1000);
    log(`  Claude finished in ${durationSec}s. Output: ${result.stdout.length} chars`);

    saveClaudeOutput(company.name, company.id, result.stdout);

    const lines = result.stdout.trim().split('\n');
    const tail = lines.slice(-5).join('\n');
    if (tail) log(`  Tail:\n${tail}`);

    // Capture output tail for pipeline event payload (last 40 lines, max 4KB)
    claudeOutputTail = lines.slice(-40).join('\n').slice(-4000);

    claudeSucceeded = true;
    claudeOutputLength = result.stdout.length;

  } catch (err: unknown) {
    const errObj = err as { status?: number; stderr?: string; stdout?: string; message?: string; killed?: boolean; signal?: string };
    const msg = errObj.message || String(err);
    const wasTimeout = errObj.killed || errObj.signal === 'SIGTERM';
    const isBudgetExceeded = msg.includes('Exceeded USD budget');

    const isOutOfUsage = msg.includes('out of') && msg.includes('usage');
    claudeErrorType = wasTimeout ? 'timeout' : isBudgetExceeded ? 'budget_exceeded' : isOutOfUsage ? 'out_of_usage' : 'claude_error';
    claudeErrorMsg = msg.slice(0, 500);

    log(`  Claude ${wasTimeout ? 'timed out' : isBudgetExceeded ? 'budget exceeded' : 'error'} after ${Math.round((Date.now() - scrapeStart) / 1000)}s: ${msg.slice(0, 300)}`);

    const partialOutput = errObj.stdout || '';
    claudeOutputLength = partialOutput.length;
    if (partialOutput.length > 0) {
      saveClaudeOutput(company.name, company.id, partialOutput, '-FAILED');
      const partialLines = partialOutput.trim().split('\n');
      claudeOutputTail = partialLines.slice(-40).join('\n').slice(-4000);
      log(`  Partial output captured (${partialOutput.length} chars)`);
    }
  }

  // ── Post-scrape: backfill summary fields from data points ──
  await backfillSummaryFields(company.id, company.batch_id);

  // ── Emit phase events: check data points per source ──
  await emitPhaseEvents(company.id, company.batch_id, runId);

  // ── Verify data was actually written ──
  const { count: dataPointCount } = await supabase
    .from('df_data_points')
    .select('*', { count: 'exact', head: true })
    .eq('company_id', company.id);

  const hasData = (dataPointCount || 0) > 0;

  if (claudeSucceeded && !hasData) {
    log(`  WARNING: Claude exited OK but wrote 0 data points — marking as failed`);
    claudeErrorType = 'no_data';
    claudeErrorMsg = 'Claude exited successfully but wrote 0 data points';
  }

  // ── Calculate completeness score ──
  const score = await calculateCompletenessFromData(company.id, dataPointCount || 0);
  await supabase.from('df_companies').update({ completeness_score: score }).eq('id', company.id);
  log(`  Completeness: ${score}% (${dataPointCount || 0} data points)`);

  return { succeeded: hasData, errorType: claudeErrorType, runId, claudeOutputTail, claudeOutputChars: claudeOutputLength, dataPointCount: dataPointCount || 0 };
}

// ─── Finish Company ──────────────────────────────────────────────────
async function finishCompany(companyId: string, result: ScrapeResult): Promise<void> {
  const { succeeded, runId, claudeOutputTail, claudeOutputChars, dataPointCount } = result;
  const { data: company } = await supabase.from('df_companies').select('*').eq('id', companyId).single();
  if (!company) { log(`Company ${companyId} not found`); return; }

  const startedAt = company.scrape_started_at ? new Date(company.scrape_started_at).getTime() : Date.now();
  const durationSeconds = Math.round((Date.now() - startedAt) / 1000);
  const retryCount = company.retry_count || 0;

  // Auto-retry: if failed and under retry limit, queue for retry
  if (!succeeded && retryCount < MAX_RETRIES) {
    log(`  ${company.name}: FAILED — queuing for auto-retry (attempt ${retryCount + 1}/${MAX_RETRIES})`);

    // Emit event (sets scrape_status = 'pending' via Postgres function)
    await emitEvent(companyId, company.batch_id, 'company.retry_auto', {
      attempt: retryCount + 1,
      error_type: 'auto_retry',
      company_name: company.name,
    }, { runId });

    // Update metadata (not scrape_status — that's handled by the event)
    await supabase.from('df_companies').update({
      retry_count: retryCount + 1,
      scrape_completed_at: new Date().toISOString(),
      scrape_duration_seconds: durationSeconds,
    }).eq('id', companyId);

    return;
  }

  // Mark final status via event
  if (succeeded) {
    await emitEvent(companyId, company.batch_id, 'company.scrape_completed', {
      data_points: dataPointCount,
      completeness: company.completeness_score || 0,
      duration_s: durationSeconds,
      claude_output_chars: claudeOutputChars,
      claude_output_tail: claudeOutputTail,
      company_name: company.name,
    }, { runId });
  } else {
    await emitEvent(companyId, company.batch_id, 'company.scrape_failed', {
      error_type: 'max_retries_exhausted',
      error: `Failed after ${retryCount + 1} attempts`,
      attempt: retryCount + 1,
      duration_s: durationSeconds,
      claude_output_chars: claudeOutputChars,
      claude_output_tail: claudeOutputTail,
      company_name: company.name,
    }, { runId });
  }

  // Update metadata
  await supabase.from('df_companies').update({
    scrape_completed_at: new Date().toISOString(),
    scrape_duration_seconds: durationSeconds,
  }).eq('id', companyId);

  // Recalculate batch counters from actual company statuses
  const { data: allCompanies } = await supabase
    .from('df_companies')
    .select('scrape_status, scrape_duration_seconds')
    .eq('batch_id', company.batch_id);

  if (allCompanies) {
    const finishedCompanies = allCompanies.filter(c => c.scrape_status === 'scraped' || c.scrape_status === 'failed');
    const scrapedCount = finishedCompanies.length;
    const durations = finishedCompanies.filter(c => c.scrape_duration_seconds).map(c => c.scrape_duration_seconds!);
    const avgSec = durations.length > 0 ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : null;

    await supabase.from('df_batches').update({
      scraped_count: scrapedCount,
      avg_scrape_seconds: avgSec,
      status: scrapedCount >= (allCompanies.length) ? 'complete' : 'scraping',
    }).eq('id', company.batch_id);

    log(`  ${company.name}: ${succeeded ? 'done' : 'FAILED (permanent)'} in ${durationSeconds}s. Batch: ${scrapedCount}/${allCompanies.length}`);
  }
}

// ─── Batch Mode ──────────────────────────────────────────────────────
async function scrapeBatch(batchId: string): Promise<void> {
  log(`Starting batch: ${batchId}`);

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

  log(`${companies.length} companies to scrape (concurrency: ${CONCURRENCY}, stagger: ${STAGGER_DELAY_MS}ms)`);

  // ── Concurrent scraping with pool ──
  let bailOut = false;

  interface CompanyScrapeResult { companyId: string; result: ScrapeResult; }

  const tasks: PoolTask<CompanyScrapeResult>[] = companies.map((company) => ({
    fn: async (): Promise<CompanyScrapeResult> => {
      const result = await scrapeCompany(company as Company);
      await finishCompany(company.id, result);

      // Signal bail-out on fatal errors — other workers will stop picking up new tasks
      if (result.errorType === 'out_of_usage') {
        log(`\nFATAL: Claude usage limit reached. Signaling bail-out to stop new scrapes.`);
        bailOut = true;
        await emitBatchEvent(batchId, 'batch.paused', { reason: 'out_of_usage' });
      }

      return { companyId: company.id, result };
    },
  }));

  await runPool(tasks, CONCURRENCY, STAGGER_DELAY_MS, () => bailOut);

  if (bailOut) return;

  // ── Retry loop: concurrent retries until MAX_RETRIES exhausted or all succeed ──
  for (let retryPass = 1; retryPass <= MAX_RETRIES; retryPass++) {
    const { data: retries } = await supabase
      .from('df_companies')
      .select('*')
      .eq('batch_id', batchId)
      .eq('scrape_status', 'pending')
      .gt('retry_count', 0)
      .order('created_at', { ascending: true });

    if (!retries || retries.length === 0) break;

    log(`\nRetry pass ${retryPass}/${MAX_RETRIES}: ${retries.length} failed companies to retry (concurrency: ${CONCURRENCY})`);

    const retryTasks: PoolTask<CompanyScrapeResult>[] = retries.map((company) => ({
      fn: async (): Promise<CompanyScrapeResult> => {
        const result = await scrapeCompany(company as Company);
        await finishCompany(company.id, result);

        if (result.errorType === 'out_of_usage') {
          log(`\nFATAL: Claude usage limit reached during retry. Signaling bail-out.`);
          bailOut = true;
          await emitBatchEvent(batchId, 'batch.paused', { reason: 'out_of_usage' });
        }

        return { companyId: company.id, result };
      },
    }));

    await runPool(retryTasks, CONCURRENCY, STAGGER_DELAY_MS, () => bailOut);

    if (bailOut) return;
  }

  // Log final batch summary
  const { data: finalCounts } = await supabase
    .from('df_companies')
    .select('scrape_status')
    .eq('batch_id', batchId);

  if (finalCounts) {
    const succeeded = finalCounts.filter(c => c.scrape_status === 'scraped').length;
    const failed = finalCounts.filter(c => c.scrape_status === 'failed').length;
    const total = finalCounts.length;
    log(`\nBatch complete. ${succeeded}/${total} succeeded, ${failed} permanently failed.`);

    await emitBatchEvent(batchId, 'batch.completed', {
      success_count: succeeded,
      fail_count: failed,
      total_count: total,
    });
  } else {
    log('Batch complete.');
  }
}

// ─── Entry Point ─────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);

  // Heartbeat: engine started
  await updateHeartbeat({ status: 'alive', company_id: null, company_name: null, batch_id: null, message: 'Engine started' });

  if (args.includes('--company')) {
    const id = args[args.indexOf('--company') + 1];
    if (!id) { console.error('Missing company ID'); process.exit(1); }
    const result = await scrapeCompany((await supabase.from('df_companies').select('*').eq('id', id).single()).data as Company);
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

  // Heartbeat: engine done
  await updateHeartbeat({ status: 'idle', company_id: null, company_name: null, batch_id: null, message: 'Run complete' });
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
