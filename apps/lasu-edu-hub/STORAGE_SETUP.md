# File Upload Configuration

## Supabase Storage Setup

To enable file uploads for the LASU STESSA Hub, you need to create a storage bucket in your Supabase project.

### Steps to Create the 'uploads' Bucket:

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **Create a new bucket**
4. Name it: `uploads`
5. Choose **Public** (so files can be accessed without authentication)
6. Click **Create bucket**

### Bucket Policy (Optional - for security)

If you want to restrict uploads to authenticated users only, you can add a policy:

```sql
-- Allow authenticated users to upload
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'uploads');

-- Allow public read access
CREATE POLICY "Allow public read"
ON storage.objects
FOR SELECT
USING (bucket_id = 'uploads');
```

### Supported File Types:

- **Faculty photos**: PNG, JPG, JPEG (up to 5MB)
- **Event media**: PNG, JPG, JPEG, MP4, WebM (up to 50MB)
- **Course materials**: PDF, DOCX, PPTX (up to 20MB)

### File Organization:

Files are stored in the following structure:
```
uploads/
├── faculty/
│   ├── faculty-{timestamp}-{filename}
├── events/
│   ├── event-{timestamp}-{filename}
└── courses/
    ├── course-{timestamp}-{filename}
```

### Troubleshooting:

If you see "Bucket not found" error:
1. Verify the bucket exists in Supabase Storage
2. Check the bucket name is exactly `uploads` (lowercase)
3. Ensure the bucket is set to Public
4. Refresh the page and try again

If uploads are slow:
1. Check file size (should be under limits)
2. Verify your internet connection
3. Check Supabase dashboard for any service issues
