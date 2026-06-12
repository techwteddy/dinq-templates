import { createServerSupabase } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import NavBar from '@/components/nav-bar';
import BatchList from '@/components/batch-list';
import type { Batch } from '@/lib/types';

export default async function ResultsIndex() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: batches } = await supabase
    .from('df_batches')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20) as { data: Batch[] | null };

  // Get actual scraped/failed company counts per batch
  const batchScrapedCounts: Record<string, number> = {};
  const batchFailedCounts: Record<string, number> = {};
  if (batches && batches.length > 0) {
    const batchIds = batches.map(b => b.id);
    const { data: companies } = await supabase
      .from('df_companies')
      .select('batch_id, scrape_status')
      .in('batch_id', batchIds) as { data: { batch_id: string; scrape_status: string }[] | null };
    if (companies) {
      for (const c of companies) {
        if (c.scrape_status === 'scraped') {
          batchScrapedCounts[c.batch_id] = (batchScrapedCounts[c.batch_id] || 0) + 1;
        } else if (c.scrape_status === 'failed') {
          batchFailedCounts[c.batch_id] = (batchFailedCounts[c.batch_id] || 0) + 1;
        }
      }
    }
  }

  if (batches && batches.length === 1) {
    redirect(`/results/${batches[0].id}`);
  }

  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-2xl font-bold text-[var(--text-bright)]">Results</h1>
        <BatchList
          batches={batches || []}
          batchScrapedCounts={batchScrapedCounts}
          batchFailedCounts={batchFailedCounts}
        />
      </main>
    </>
  );
}
