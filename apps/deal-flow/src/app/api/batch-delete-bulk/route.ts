import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';

export async function DELETE(request: Request) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { batchIds } = await request.json();
    if (!Array.isArray(batchIds) || batchIds.length === 0) {
      return NextResponse.json({ error: 'batchIds array required' }, { status: 400 });
    }

    const admin = getAdminClient();

    // Verify all batches belong to this user
    const { data: batches, error: fetchError } = await admin
      .from('df_batches')
      .select('id, user_id')
      .in('id', batchIds);

    if (fetchError) {
      console.error('[batch-delete-bulk] Fetch error:', fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!batches || batches.length === 0) {
      return NextResponse.json({ error: 'No batches found' }, { status: 404 });
    }

    const unauthorized = batches.filter(b => b.user_id !== user.id);
    if (unauthorized.length > 0) {
      return NextResponse.json({ error: 'Forbidden: some batches belong to another user' }, { status: 403 });
    }

    const ownedIds = batches.map(b => b.id);

    // Delete — CASCADE handles companies, events, data_points
    const { error } = await admin
      .from('df_batches')
      .delete()
      .in('id', ownedIds);

    if (error) {
      console.error('[batch-delete-bulk] Delete error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, deleted: ownedIds.length });
  } catch (err) {
    console.error('[batch-delete-bulk] Unhandled error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
