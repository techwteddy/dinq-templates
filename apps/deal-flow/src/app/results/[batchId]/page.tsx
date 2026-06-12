import { createServerSupabase } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import NavBar from '@/components/nav-bar';
import ResultsTable from './results-table';
import type { Batch, Company } from '@/lib/types';

export default async function ResultsPage({ params }: { params: Promise<{ batchId: string }> }) {
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

  return (
    <>
      <NavBar />
      <ResultsTable
        batch={batch}
        initialCompanies={companies || []}
      />
    </>
  );
}
