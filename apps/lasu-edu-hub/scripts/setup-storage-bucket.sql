-- Create uploads storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Set up the bucket policies to allow authenticated users to upload
CREATE POLICY "Allow authenticated users to upload files"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'uploads' AND auth.role() = 'authenticated');

-- Allow public read access
CREATE POLICY "Allow public read access"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'uploads');

-- Allow authenticated users to delete their own files
CREATE POLICY "Allow authenticated users to delete their files"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'uploads' AND auth.role() = 'authenticated');
