import { createServerSupabase } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import NavBar from '@/components/nav-bar';
import CompanyProfile from './company-profile';
import type { Company, DataPoint } from '@/lib/types';
import type { PipelineEvent } from '@/lib/pipeline-events';

export default async function CompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: company } = await supabase
    .from('df_companies')
    .select('*')
    .eq('id', id)
    .single() as { data: Company | null };

  if (!company) notFound();

  const { data: dataPoints } = await supabase
    .from('df_data_points')
    .select('*')
    .eq('company_id', id)
    .order('category', { ascending: true })
    .order('field_name', { ascending: true }) as { data: DataPoint[] | null };

  const { data: phaseEvents } = await supabase
    .from('df_pipeline_events')
    .select('*')
    .eq('company_id', id)
    .in('event_type', ['company.phase_completed', 'company.phase_failed'])
    .order('created_at', { ascending: true }) as { data: PipelineEvent[] | null };

  return (
    <>
      <NavBar />
      <CompanyProfile
        company={company}
        dataPoints={dataPoints || []}
        phaseEvents={phaseEvents || []}
      />
    </>
  );
}
