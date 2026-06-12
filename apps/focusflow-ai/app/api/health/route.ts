import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  const start = Date.now();
  let dbOk = false;

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from('profiles').select('id', { count: 'exact', head: true }).limit(1);
    dbOk = !error;
  } catch {
    dbOk = false;
  }

  return NextResponse.json({
    status: 'ok',
    version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'dev',
    timestamp: new Date().toISOString(),
    checks: {
      database: dbOk,
      uptime_ms: Date.now() - start,
    },
  });
}
