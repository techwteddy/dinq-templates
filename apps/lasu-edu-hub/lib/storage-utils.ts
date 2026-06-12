import { createClient } from '@/lib/supabase/client';

/**
 * Upload a file to Supabase Storage
 * Handles bucket creation if needed
 */
export async function uploadFile(
  bucketName: string,
  filePath: string,
  file: File
): Promise<{ publicUrl: string; error?: string }> {
  const supabase = createClient();

  try {
    // Try to upload to the bucket
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      // If bucket doesn't exist, create it
      if (uploadError.message.includes('Bucket not found')) {
        console.log(`Creating bucket: ${bucketName}`);
        
        // Note: Creating buckets via client SDK is not allowed
        // Return error message for user
        return {
          publicUrl: '',
          error: `Storage bucket '${bucketName}' not found. Please create it in Supabase dashboard.`,
        };
      }
      return { publicUrl: '', error: uploadError.message };
    }

    // Get public URL
    const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);

    return { publicUrl: data.publicUrl };
  } catch (err) {
    console.error('Upload error:', err);
    return { publicUrl: '', error: 'Failed to upload file' };
  }
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFile(bucketName: string, filePath: string): Promise<{ error?: string }> {
  const supabase = createClient();

  try {
    const { error } = await supabase.storage.from(bucketName).remove([filePath]);

    if (error) {
      return { error: error.message };
    }

    return {};
  } catch (err) {
    console.error('Delete error:', err);
    return { error: 'Failed to delete file' };
  }
}
