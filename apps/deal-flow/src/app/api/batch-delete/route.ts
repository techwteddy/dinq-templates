import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';

export async function DELETE(request: Request) {
  try {
    // Verify the user is authenticated
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { batchId } = await request.json();
    if (!batchId) {
      return NextResponse.json({ error: 'batchId required' }, { status: 400 });
    }

    // Verify ownership
    const admin = getAdminClient();
    const { data: batch, error: fetchError } = await admin
      .from('df_batches')
      .select('id, user_id, status')
      .eq('id', batchId)
      .single();

    if (fetchError) {
      console.error('[batch-delete] Fetch error:', fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!batch) {
      return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
    }

    if (batch.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete the batch — CASCADE handles companies, events, data_points
    const { error } = await admin
      .from('df_batches')
      .delete()
      .eq('id', batchId);

    if (error) {
      console.error('[batch-delete] Delete error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[batch-delete] Unhandled error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
