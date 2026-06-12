import { createServerSupabase } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import NavBar from '@/components/nav-bar';
import UploadForm from './upload-form';
import BatchList from '@/components/batch-list';
import type { Batch } from '@/lib/types';

interface BatchWithCounts extends Batch {
  actual_scraped: number;
  actual_failed: number;
}

export default async function UploadPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Get existing batches
  const { data: batches } = await supabase
    .from('df_batches')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10) as { data: Batch[] | null };

  // Get actual company counts per batch (not the inflated scraped_count)
  const batchesWithCounts: BatchWithCounts[] = [];
  for (const batch of (batches || [])) {
    const { count: scraped } = await supabase
      .from('df_companies')
      .select('*', { count: 'exact', head: true })
      .eq('batch_id', batch.id)
      .eq('scrape_status', 'scraped');
    const { count: failed } = await supabase
      .from('df_companies')
      .select('*', { count: 'exact', head: true })
      .eq('batch_id', batch.id)
      .eq('scrape_status', 'failed');
    batchesWithCounts.push({ ...batch, actual_scraped: scraped || 0, actual_failed: failed || 0 });
  }

  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="animate-fade-up">
          <h1 className="text-2xl font-bold text-[var(--text-bright)]">Upload Companies</h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Upload a CSV file or paste a Google Sheets URL. Column headers are auto-detected — you just need a company name column at minimum.
          </p>
        </div>

        <div className="mt-8">
          <UploadForm userId={user.id} />
        </div>

        {batchesWithCounts.length > 0 && (
          <div className="mt-12 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-4">Recent Batches</h2>
            <BatchList
              batches={batchesWithCounts}
              batchScrapedCounts={Object.fromEntries(batchesWithCounts.map(b => [b.id, b.actual_scraped]))}
              batchFailedCounts={Object.fromEntries(batchesWithCounts.map(b => [b.id, b.actual_failed]))}
              linkPrefix="/pipeline"
            />
          </div>
        )}
      </main>
    </>
  );
}
