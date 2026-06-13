import { createClient } from '@supabase/supabase-js';
import { HealthLog } from '@/types';

/**
 * Creates a Supabase client for server-side usage (API routes).
 * Uses SUPABASE_SERVICE_ROLE_KEY which bypasses Row Level Security (RLS).
 *
 * This client should ONLY be used in backend code (API routes, server components).
 * Never expose the service role key to the client-side.
 *
 * @returns Supabase client with full admin access
 */
export function getServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Missing Supabase server credentials. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file.'
    );
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

/**
 * Creates a Supabase client for client-side usage (browser).
 * Uses the anonymous public key which respects Row Level Security (RLS).
 *
 * This client can only perform operations allowed by RLS policies (SELECT only).
 *
 * @returns Supabase client with limited (read-only) access
 */
export function getClientSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    throw new Error(
      'Missing Supabase client credentials. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env file.'
    );
  }

  return createClient(supabaseUrl, anonKey);
}

/**
 * Logs health check results to the Supabase health_logs table.
 * This function uses the server client which bypasses RLS.
 *
 * @param results - Array of health check results to log
 * @returns Promise that resolves when logging is complete
 */
export async function logHealthCheckResults(results: Array<{
  envName: string;
  url: string;
  status: string;
  latencyMs: number;
}>): Promise<void> {
  const supabase = getServerSupabaseClient();

  const logsToInsert = results.map((result) => ({
    env_name: result.envName,
    url: result.url,
    status: result.status,
    latency_ms: result.latencyMs,
  }));

  const { error } = await supabase.from('health_logs').insert(logsToInsert);

  if (error) {
    console.error('Failed to log health check results to Supabase:', error.message);
    // Don't throw - logging is async and shouldn't break the health check response
  }
}

/**
 * Fetches the latest health log entry for a specific environment.
 *
 * @param envName - The environment name to fetch logs for
 * @returns The most recent HealthLog or null if none found
 */
export async function getLatestHealthLog(envName: string): Promise<HealthLog | null> {
  const supabase = getServerSupabaseClient();

  const { data, error } = await supabase
    .from('health_logs')
    .select('*')
    .eq('env_name', envName)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error(`Failed to fetch latest health log for ${envName}:`, error.message);
    return null;
  }

  return data as HealthLog;
}
