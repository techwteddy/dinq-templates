#!/usr/bin/env npx tsx
/**
 * Deal Flow — Supabase Realtime Watcher
 *
 * Subscribes to df_batches and df_companies changes via outbound WebSocket.
 * Triggers scrape-engine.ts when a batch goes pending or a company is set to rescrape.
 * No inbound ports exposed — outbound WebSocket only.
 *
 * Usage:
 *   npx tsx scripts/scrape-watcher.ts          # Run watcher (long-running process)
 *
 * Deploy as systemd service on Hetzner VPS — see scripts/deal-flow-watcher.service
 */

import { createClient } from '@supabase/supabase-js';
import { spawn, ChildProcess } from 'child_process';
import { appendFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// ─── Config ──────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY. Set it in .env.local or environment.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  realtime: {
    params: { eventsPerSecond: 10 },
  },
});

const __filename2 = fileURLToPath(import.meta.url);
const __dirname2 = dirname(__filename2);
const REPO_ROOT = resolve(__dirname2, '..');
const LOGS_DIR = resolve(__dirname2, 'logs');
const WATCHER_LOG = resolve(LOGS_DIR, 'watcher.log');

const NPX_BIN = process.env.NPX_BIN || (process.platform === 'linux' ? '/usr/bin/npx' : '/opt/homebrew/bin/npx');
const ENGINE_SCRIPT = resolve(__dirname2, 'scrape-engine.ts');

// ─── Lock Sets (prevent double-spawning) ─────────────────────────────
const activeBatches = new Set<string>();
const activeCompanies = new Set<string>();

let reconnectDelay = 1000;

// ─── Logging ─────────────────────────────────────────────────────────
if (!existsSync(LOGS_DIR)) mkdirSync(LOGS_DIR, { recursive: true });

function log(msg: string) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  try {
    appendFileSync(WATCHER_LOG, line + '\n');
  } catch {
    // Log file write failure is not fatal
  }
}

// ─── Spawn Engine ────────────────────────────────────────────────────
function spawnEngine(args: string[], label: string, lockKey: string, lockSet: Set<string>) {
  if (lockSet.has(lockKey)) {
    log(`[SKIP] ${label} — already active`);
    return;
  }

  log(`[SPAWN] ${label}`);
  lockSet.add(lockKey);

  const child: ChildProcess = spawn(NPX_BIN, ['tsx', ENGINE_SCRIPT, ...args], {
    cwd: REPO_ROOT,
    env: { ...process.env },
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: false,
  });

  child.stdout?.on('data', (d: Buffer) => {
    const text = d.toString().trim();
    if (text) log(`[ENGINE] ${text}`);
  });

  child.stderr?.on('data', (d: Buffer) => {
    const text = d.toString().trim();
    if (text) log(`[ENGINE:ERR] ${text}`);
  });

  child.on('error', (err) => {
    log(`[ERROR] ${label} — spawn error: ${err.message}`);
    lockSet.delete(lockKey);
  });

  child.on('exit', (code) => {
    log(`[DONE] ${label} — exit code ${code}`);
    lockSet.delete(lockKey);
  });
}

// ─── Startup Check ──────────────────────────────────────────────────
async function checkStuckBatches() {
  const { data } = await supabase
    .from('df_batches')
    .select('id, name')
    .eq('status', 'scraping');

  if (data && data.length > 0) {
    log(`[WARN] Found ${data.length} batch(es) stuck in 'scraping' state:`);
    for (const b of data) {
      log(`  - ${b.name} (${b.id})`);
    }
    log(`[WARN] Cron fallback will handle these within 5 min.`);
  }
}

// ─── Realtime Channels ──────────────────────────────────────────────
function setupChannels() {
  // Channel 1: Watch df_batches for new uploads (INSERT with status=pending)
  // and manual triggers (UPDATE setting status back to pending)
  const batchChannel = supabase
    .channel('watcher-batches')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'df_batches',
    }, (payload) => {
      const row = payload.new as { id: string; status: string; name: string };
      if (!row || row.status !== 'pending') return;

      log(`[EVENT] Batch pending: ${row.name} (${row.id})`);
      spawnEngine(['--batch', row.id], `batch:${row.name}`, row.id, activeBatches);
    })
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        log('[RT] Batch channel connected');
        reconnectDelay = 1000;
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        log(`[RT] Batch channel ${status} — reconnecting in ${reconnectDelay}ms`);
        supabase.removeChannel(batchChannel);
        setTimeout(setupChannels, reconnectDelay);
        reconnectDelay = Math.min(reconnectDelay * 2, 30_000);
      }
    });

  // Channel 2: Watch df_companies for rescrape triggers
  const companyChannel = supabase
    .channel('watcher-companies')
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'df_companies',
    }, (payload) => {
      const row = payload.new as {
        id: string;
        batch_id: string;
        scrape_status: string;
        name: string;
      };
      if (!row || row.scrape_status !== 'rescrape') return;

      // If the batch is already being scraped, the running engine will pick up this company
      if (activeBatches.has(row.batch_id)) {
        log(`[SKIP] Company rescrape: ${row.name} — batch already active, engine will pick it up`);
        return;
      }

      log(`[EVENT] Company rescrape: ${row.name} (${row.id})`);
      spawnEngine(['--company', row.id], `company:${row.name}`, row.id, activeCompanies);
    })
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        log('[RT] Company channel connected');
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        log(`[RT] Company channel ${status} — reconnecting in ${reconnectDelay}ms`);
        supabase.removeChannel(companyChannel);
        // Batch channel reconnect already calls setupChannels, but guard with delay
        setTimeout(setupChannels, reconnectDelay);
        reconnectDelay = Math.min(reconnectDelay * 2, 30_000);
      }
    });

  log('[RT] Subscribing to batch + company channels...');
}

// ─── Heartbeat (log active status periodically) ─────────────────────
function startHeartbeat() {
  setInterval(() => {
    const batchList = activeBatches.size > 0
      ? `active batches: ${[...activeBatches].join(', ')}`
      : 'no active batches';
    const companyList = activeCompanies.size > 0
      ? `active companies: ${[...activeCompanies].join(', ')}`
      : 'no active companies';
    log(`[HEARTBEAT] ${batchList} | ${companyList}`);
  }, 5 * 60 * 1000); // Every 5 minutes
}

// ─── Main ────────────────────────────────────────────────────────────
async function main() {
  log('═══════════════════════════════════════════════════');
  log('[START] Deal Flow Realtime Watcher');
  log(`  Engine: ${ENGINE_SCRIPT}`);
  log(`  NPX: ${NPX_BIN}`);
  log(`  Supabase: ${SUPABASE_URL}`);
  log('═══════════════════════════════════════════════════');

  await checkStuckBatches();
  setupChannels();
  startHeartbeat();

  // Keep process alive
  process.on('SIGTERM', () => {
    log('[STOP] SIGTERM received, shutting down');
    process.exit(0);
  });
  process.on('SIGINT', () => {
    log('[STOP] SIGINT received, shutting down');
    process.exit(0);
  });
}

main().catch(err => {
  log(`[FATAL] ${err.message}`);
  console.error(err);
  process.exit(1);
});
