import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { emitEvent } from '@/lib/pipeline-events';

export async function POST(request: Request) {
  const supabase = getAdminClient();

  const { companyId, reason } = await request.json();

  if (!companyId) {
    return NextResponse.json({ error: 'companyId is required' }, { status: 400 });
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

  // Emit skipped event (sets scrape_status = 'skipped' via Postgres function)
  await emitEvent(supabase, {
    companyId,
    batchId: company.batch_id,
    eventType: 'company.skipped',
    actor: 'user',
    payload: { reason: reason || 'Manually skipped', previous_status: company.scrape_status },
  });

  return NextResponse.json({ success: true });
}
