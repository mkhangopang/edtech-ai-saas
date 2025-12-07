# Supabase Storage Setup for Voice Recordings

## Create Storage Bucket

1. Go to your Supabase Dashboard
2. Navigate to Storage section
3. Click "New Bucket"
4. Enter bucket name: **voice-recordings**
5. Set bucket to **Private** (not public)
6. Click "Create Bucket"

## Configure Storage Policies

After creating the bucket, add the following policies:

### Policy 1: Allow Users to Upload Their Own Files

```sql
-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload their own voice recordings"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'voice-recordings' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

### Policy 2: Allow Users to Read Their Own Files

```sql
-- Allow authenticated users to read from their own folder
CREATE POLICY "Users can read their own voice recordings"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'voice-recordings' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

### Policy 3: Allow Users to Delete Their Own Files

```sql
-- Allow authenticated users to delete from their own folder
CREATE POLICY "Users can delete their own voice recordings"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'voice-recordings' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

## Alternative: Using Supabase Dashboard UI

1. Go to Storage > voice-recordings bucket
2. Click "Policies" tab
3. Click "New Policy"
4. For each policy above:
   - Select the appropriate operation (INSERT, SELECT, or DELETE)
   - Set target roles to "authenticated"
   - Add the policy SQL condition

## File Size and MIME Type Restrictions

Configure in bucket settings:
- **Maximum file size**: 50 MB
- **Allowed MIME types**: 
  - audio/webm
  - audio/mp4
  - audio/wav
  - audio/mpeg
  - audio/ogg

## File Naming Convention

Files will be stored with the following path structure:
```
{user_id}/{timestamp}_{uuid}.{extension}
```

Example:
```
a1b2c3d4-e5f6-7890-abcd-ef1234567890/1701234567890_x9y8z7w6-v5u4-t3s2-r1q0-p9o8n7m6l5k4.webm
```

## Verification

After setup, verify:
1. Bucket is private (not publicly accessible)
2. All three policies are active
3. File size limit is set to 50 MB
4. Allowed MIME types are configured

## Cleanup Policy (Optional)

To automatically delete old recordings after 90 days:

```sql
-- Create a function to delete old voice recordings
CREATE OR REPLACE FUNCTION delete_old_voice_recordings()
RETURNS void AS $$
BEGIN
  DELETE FROM storage.objects
  WHERE bucket_id = 'voice-recordings'
  AND created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Schedule with pg_cron (if available)
-- SELECT cron.schedule('delete-old-recordings', '0 2 * * *', 'SELECT delete_old_voice_recordings()');
```
