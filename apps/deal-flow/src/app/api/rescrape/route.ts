import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { emitEvent } from '@/lib/pipeline-events';

export async function POST(request: Request) {
  const supabase = getAdminClient();

  const { companyId, reason } = await request.json();

  if (!companyId || !reason) {
    return NextResponse.json({ error: 'companyId and reason are required' }, { status: 400 });
  }

  // Get company to find batch_id
  const { data: company } = await supabase
    .from('df_companies')
    .select('id, batch_id, scrape_status')
    .eq('id', companyId)
    .single();

  if (!company) {
    return NextResponse.json({ error: 'Company not found' }, { status: 404 });
  }

  // Delete existing data points for this company
  await supabase.from('df_data_points').delete().eq('company_id', companyId);

  // Emit rescrape_requested event (sets scrape_status = 'rescrape' via Postgres function)
  await emitEvent(supabase, {
    companyId,
    batchId: company.batch_id,
    eventType: 'company.rescrape_requested',
    actor: 'user',
    payload: { reason, previous_status: company.scrape_status },
  });

  // Update metadata (not scrape_status — handled by emitEvent)
  await supabase.from('df_companies').update({
    rescrape_reason: reason,
    completeness_score: 0,
    retry_count: 0,
    scrape_started_at: null,
    scrape_completed_at: null,
    scrape_duration_seconds: null,
  }).eq('id', companyId);

  return NextResponse.json({ success: true });
}
