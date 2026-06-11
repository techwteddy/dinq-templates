-- Supabase Storage Policies for General Images Bucket
-- This file contains policies for the general-images storage bucket to allow image uploads

-- Create the general-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('general-images', 'general-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Policy to allow anyone to upload images to the general-images bucket
-- This is for payment screenshots attached to reviews
CREATE POLICY "Allow public uploads to general-images bucket" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'general-images' AND
  (storage.extension(name))::text IN ('jpg', 'jpeg', 'png', 'gif', 'webp')
);

-- Policy to allow public read access to general-images bucket
-- Anyone can view the uploaded images
CREATE POLICY "Allow public read access to general-images bucket" ON storage.objects
FOR SELECT USING (bucket_id = 'general-images');

-- Policy to allow users to update their own uploaded images
-- Users can update images they uploaded (optional, for editing)
CREATE POLICY "Allow users to update their own general-images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'general-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy to allow users to delete their own uploaded images
-- Users can delete images they uploaded (optional, for cleanup)
CREATE POLICY "Allow users to delete their own general-images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'general-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Alternative: If you want to allow anyone to delete any image (for admin purposes)
-- Uncomment the following policy and comment out the user-specific delete policy above
/*
CREATE POLICY "Allow public delete access to general-images bucket" ON storage.objects
FOR DELETE USING (bucket_id = 'general-images');
*/

-- Enable Row Level Security on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY; 