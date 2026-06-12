import { createServerSupabase } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import NavBar from '@/components/nav-bar';
import Link from 'next/link';
import type { Batch } from '@/lib/types';

export default async function PipelineIndex() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: batches } = await supabase
    .from('df_batches')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20) as { data: Batch[] | null };

  // Get actual scraped company counts per batch (scraped_count on batch is inflated by retries)
  const batchScrapedCounts: Record<string, number> = {};
  if (batches && batches.length > 0) {
    const batchIds = batches.map(b => b.id);
    const { data: companies } = await supabase
      .from('df_companies')
      .select('batch_id, scrape_status')
      .in('batch_id', batchIds)
      .eq('scrape_status', 'scraped') as { data: { batch_id: string; scrape_status: string }[] | null };
    if (companies) {
      for (const c of companies) {
        batchScrapedCounts[c.batch_id] = (batchScrapedCounts[c.batch_id] || 0) + 1;
      }
    }
  }

  // If only one batch, go directly to it
  if (batches && batches.length === 1) {
    redirect(`/pipeline/${batches[0].id}`);
  }

  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-2xl font-bold text-[var(--text-bright)]">Pipelines</h1>
        {(!batches || batches.length === 0) ? (
          <div className="mt-8 card p-12 text-center">
            <p className="text-sm text-[var(--text-muted)]">No pipelines yet.</p>
            <Link href="/upload" className="mt-3 inline-block rounded-lg bg-[var(--accent)] px-4 py-2 text-xs font-medium text-white hover:brightness-110 transition-all">
              Upload Companies
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-2">
            {batches.map(batch => (
              <Link key={batch.id} href={`/pipeline/${batch.id}`}
                className="card flex items-center justify-between p-4 hover:bg-[var(--bg-hover)] transition-colors">
                <div>
                  <p className="text-sm font-medium text-[var(--text-bright)]">{batch.name}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    {new Date(batch.created_at).toLocaleDateString()} &middot; {batch.total_companies} companies
                  </p>
                </div>
                <span className="text-xs text-[var(--text-secondary)]">
                  {batchScrapedCounts[batch.id] || 0}/{batch.total_companies} scraped
                </span>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
