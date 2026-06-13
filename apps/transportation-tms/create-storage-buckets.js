/**
 * Script to create Supabase Storage Buckets
 * 
 * This script uses the Supabase Management API to create storage buckets.
 * 
 * Prerequisites:
 * 1. Install dependencies: npm install @supabase/supabase-js dotenv
 * 2. Set up environment variables in .env.local:
 *    - SUPABASE_URL=your_project_url
 *    - SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
 * 
 * Usage:
 *   node create-storage-buckets.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nMake sure .env.local exists and contains these values.');
  process.exit(1);
}

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Bucket configurations
const buckets = [
  {
    name: 'approval-letters',
    public: true,
    fileSizeLimit: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
    ],
  },
  {
    name: 'vehicle-documents',
    public: true,
    fileSizeLimit: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/jpg'],
  },
  {
    name: 'driver-documents',
    public: true,
    fileSizeLimit: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/jpg'],
  },
];

async function createBucket(bucketConfig) {
  try {
    console.log(`\n📦 Creating bucket: ${bucketConfig.name}...`);

    // Check if bucket already exists
    const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error(`  ⚠️  Error checking existing buckets: ${listError.message}`);
    }

    const bucketExists = existingBuckets?.some(b => b.name === bucketConfig.name);

    if (bucketExists) {
      console.log(`  ✅ Bucket "${bucketConfig.name}" already exists, skipping...`);
      return { success: true, exists: true };
    }

    // Create the bucket
    // Note: Supabase JS client doesn't have a direct method to create buckets
    // You need to use the REST API or create them via the dashboard
    // This is a placeholder that shows what needs to be done

    console.log(`  ⚠️  Bucket creation via API is not directly supported by the JS client.`);
    console.log(`  📋 Please create the bucket "${bucketConfig.name}" manually:`);
    console.log(`     1. Go to Supabase Dashboard > Storage`);
    console.log(`     2. Click "New bucket"`);
    console.log(`     3. Name: ${bucketConfig.name}`);
    console.log(`     4. Public: ${bucketConfig.public ? 'Yes' : 'No'}`);
    console.log(`     5. File size limit: ${bucketConfig.fileSizeLimit / (1024 * 1024)}MB`);
    console.log(`     6. Click "Create bucket"`);

    return { success: true, exists: false, manual: true };
  } catch (error) {
    console.error(`  ❌ Error creating bucket "${bucketConfig.name}":`, error.message);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('🚀 Starting storage bucket setup...\n');
  console.log('⚠️  Note: Supabase JS client does not support bucket creation via API.');
  console.log('   You need to create buckets manually in the Supabase Dashboard.\n');
  console.log('📋 Required buckets:');
  buckets.forEach(bucket => {
    console.log(`   - ${bucket.name} (${bucket.public ? 'Public' : 'Private'}, ${bucket.fileSizeLimit / (1024 * 1024)}MB)`);
  });

  console.log('\n📝 Instructions:');
  console.log('   1. Go to your Supabase Dashboard');
  console.log('   2. Navigate to Storage section');
  console.log('   3. Create each bucket with the settings above');
  console.log('   4. After creating buckets, run storage-policies.sql in SQL Editor\n');

  // Verify existing buckets
  console.log('🔍 Checking existing buckets...');
  const { data: existingBuckets, error } = await supabase.storage.listBuckets();

  if (error) {
    console.error('❌ Error fetching buckets:', error.message);
    console.log('\n💡 Make sure your SUPABASE_SERVICE_ROLE_KEY is correct.');
    process.exit(1);
  }

  const existingBucketNames = existingBuckets?.map(b => b.name) || [];
  
  console.log('\n✅ Existing buckets:');
  if (existingBucketNames.length === 0) {
    console.log('   (none)');
  } else {
    existingBucketNames.forEach(name => {
      console.log(`   - ${name}`);
    });
  }

  console.log('\n📋 Buckets to create:');
  buckets.forEach(bucket => {
    const exists = existingBucketNames.includes(bucket.name);
    const status = exists ? '✅' : '❌';
    console.log(`   ${status} ${bucket.name}`);
  });

  const missingBuckets = buckets.filter(b => !existingBucketNames.includes(b.name));
  
  if (missingBuckets.length > 0) {
    console.log('\n⚠️  Missing buckets detected. Please create them in the Supabase Dashboard.');
    console.log('   After creating, run storage-policies.sql to set up access policies.\n');
  } else {
    console.log('\n✅ All required buckets exist!');
    console.log('   Next step: Run storage-policies.sql in SQL Editor to set up access policies.\n');
  }
}

// Run the script
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});




