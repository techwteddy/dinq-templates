import { createServerSupabase } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import NavBar from '@/components/nav-bar';
import PipelineBoard from './pipeline-board';
import type { Batch, Company } from '@/lib/types';
import type { PipelineEvent } from '@/lib/pipeline-events';

export default async function PipelinePage({ params }: { params: Promise<{ batchId: string }> }) {
  const { batchId } = await params;
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: batch } = await supabase
    .from('df_batches')
    .select('*')
    .eq('id', batchId)
    .single() as { data: Batch | null };

  if (!batch) notFound();

  const { data: companies } = await supabase
    .from('df_companies')
    .select('*')
    .eq('batch_id', batchId)
    .order('created_at', { ascending: true }) as { data: Company[] | null };

  const { data: phaseEvents } = await supabase
    .from('df_pipeline_events')
    .select('*')
    .eq('batch_id', batchId)
    .in('event_type', ['company.phase_completed', 'company.phase_failed'])
    .order('created_at', { ascending: true }) as { data: PipelineEvent[] | null };

  return (
    <>
      <NavBar />
      <PipelineBoard
        initialBatch={batch}
        initialCompanies={companies || []}
        initialPhaseEvents={phaseEvents || []}
      />
    </>
  );
}
