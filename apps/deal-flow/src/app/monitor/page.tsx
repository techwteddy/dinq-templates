import { createServerSupabase } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import NavBar from '@/components/nav-bar';
import MonitorDashboard from './monitor-dashboard';
import type { Batch, HeartbeatRow } from '@/lib/types';
import type { PipelineEvent } from '@/lib/pipeline-events';

export default async function MonitorPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [heartbeatRes, batchesRes, eventsRes] = await Promise.all([
    supabase
      .from('df_scraper_heartbeat')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('df_batches')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20),
    supabase
      .from('df_pipeline_events')
      .select('*, df_companies(name)')
      .order('created_at', { ascending: false })
      .limit(200),
  ]);

  // Flatten joined company name into each event
  const events: PipelineEvent[] = ((eventsRes.data as any[]) || []).map((e) => ({
    ...e,
    company_name: e.df_companies?.name || null,
    df_companies: undefined,
  }));

  return (
    <>
      <NavBar />
      <MonitorDashboard
        initialHeartbeat={(heartbeatRes.data as HeartbeatRow | null) ?? null}
        initialBatches={(batchesRes.data as Batch[]) || []}
        initialEvents={events}
      />
    </>
  );
}
