import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

const BATCH_ID = '00000000-0000-0000-0000-000000000000';

// Get user_id from existing batch
const { data: existingBatch } = await sb.from('df_batches').select('user_id').eq('id', BATCH_ID).single();
const userId = existingBatch.user_id;
console.log('User ID:', userId);

const { data: companies } = await sb.from('df_companies')
  .select('name, linkedin_url, website')
  .eq('batch_id', BATCH_ID)
  .order('created_at');

if (companies === null || companies.length === 0) { console.log('No companies found'); process.exit(1); }
console.log('Found', companies.length, 'companies to duplicate');

const { data: newBatch, error: batchErr } = await sb.from('df_batches').insert({
  user_id: userId,
  name: 'Test Batch - 30 Companies (Rescrape)',
  status: 'pending',
  total_companies: companies.length,
  scraped_count: 0,
}).select().single();

if (batchErr) { console.error('Batch create error:', batchErr); process.exit(1); }
console.log('Created batch:', newBatch.id, newBatch.name);

const rows = companies.map(c => ({
  user_id: userId,
  batch_id: newBatch.id,
  name: c.name,
  linkedin_url: c.linkedin_url,
  website: c.website,
  scrape_status: 'pending',
  retry_count: 0,
}));

const { data: inserted, error: insertErr } = await sb.from('df_companies').insert(rows).select('id, name');
if (insertErr) { console.error('Insert error:', insertErr); process.exit(1); }
console.log('Inserted', inserted.length, 'companies with status pending');
for (const c of inserted) {
  console.log(' -', c.name);
}
