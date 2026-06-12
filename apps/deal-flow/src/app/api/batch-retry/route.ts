import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { emitEvent } from '@/lib/pipeline-events';

export async function POST(request: Request) {
  const supabase = getAdminClient();
  const { batchId, mode } = await request.json();

  if (!batchId || !mode) {
    return NextResponse.json({ error: 'batchId and mode required' }, { status: 400 });
  }

  let statuses: string[];
  if (mode === 'failed') {
    statuses = ['failed'];
  } else if (mode === 'all') {
    statuses = ['failed', 'pending'];
  } else {
    return NextResponse.json({ error: 'Invalid mode. Use "failed" or "all"' }, { status: 400 });
  }

  // Get companies that will be retried
  const { data: targetCompanies, error: fetchError } = await supabase
    .from('df_companies')
    .select('id, scrape_status')
    .eq('batch_id', batchId)
    .in('scrape_status', statuses);

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  const resetCount = targetCompanies?.length || 0;

  if (resetCount === 0) {
    return NextResponse.json({ success: true, resetCount: 0, message: 'No companies to retry' });
  }

  // Emit retry_requested event for each company
  // This atomically sets scrape_status = 'retry_queued' via the Postgres function
  for (const company of targetCompanies!) {
    await emitEvent(supabase, {
      companyId: company.id,
      batchId,
      eventType: 'company.retry_requested',
      actor: 'user',
      payload: { mode, previous_status: company.scrape_status },
    });
  }

  // Reset metadata fields (not scrape_status — that's handled by emitEvent)
  const companyIds = targetCompanies!.map(c => c.id);
  await supabase
    .from('df_companies')
    .update({
      retry_count: 0,
      scrape_started_at: null,
      scrape_completed_at: null,
      scrape_duration_seconds: null,
    })
    .eq('batch_id', batchId)
    .in('id', companyIds);

  // Recalculate scraped_count from actual company statuses
  const { data: allCompanies } = await supabase
    .from('df_companies')
    .select('scrape_status')
    .eq('batch_id', batchId);

  const scrapedCount = allCompanies?.filter(c =>
    c.scrape_status === 'scraped' || c.scrape_status === 'failed'
  ).length || 0;

  // Set batch back to 'pending' — this triggers the Realtime watcher
  await supabase.from('df_batches').update({
    status: 'pending',
    scraped_count: scrapedCount,
  }).eq('id', batchId);

  return NextResponse.json({ success: true, resetCount });
}
