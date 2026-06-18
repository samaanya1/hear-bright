-- Allow authenticated users to upload to media bucket
CREATE POLICY "Authenticated can upload media" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media');

-- Allow authenticated users to update media
CREATE POLICY "Authenticated can update media" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'media');

-- Allow authenticated users to delete media
CREATE POLICY "Authenticated can delete media" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'media');

-- Allow public to read media
CREATE POLICY "Public can read media" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'media');
