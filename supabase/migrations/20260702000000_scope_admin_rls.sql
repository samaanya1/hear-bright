-- Tighten RLS: "authenticated full access" previously matched ANY authenticated
-- Supabase user, not just the site admin. Scope writes to the admin account only,
-- and drop the public anon INSERT on donations (real donations are recorded via
-- the service-role RPC in api/verify-payment.js, which bypasses RLS entirely —
-- this open policy let anyone insert fake donation rows using the public anon key).

DROP POLICY IF EXISTS "Authenticated full access fundraisers" ON public.fundraisers;
DROP POLICY IF EXISTS "Authenticated full access webinars" ON public.webinars;
DROP POLICY IF EXISTS "Authenticated full access stories" ON public.stories;
DROP POLICY IF EXISTS "Authenticated full access donations" ON public.donations;
DROP POLICY IF EXISTS "Public can insert donations" ON public.donations;

REVOKE INSERT ON public.donations FROM anon;

CREATE POLICY "Admin full access fundraisers" ON public.fundraisers
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' = 'samaanya1@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'samaanya1@gmail.com');

CREATE POLICY "Admin full access webinars" ON public.webinars
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' = 'samaanya1@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'samaanya1@gmail.com');

CREATE POLICY "Admin full access stories" ON public.stories
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' = 'samaanya1@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'samaanya1@gmail.com');

CREATE POLICY "Admin full access donations" ON public.donations
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' = 'samaanya1@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'samaanya1@gmail.com');

-- Storage: scope media write access to the admin account too (public read is unchanged).
DROP POLICY IF EXISTS "Authenticated can upload media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete media" ON storage.objects;

CREATE POLICY "Admin can upload media" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND auth.jwt() ->> 'email' = 'samaanya1@gmail.com');

CREATE POLICY "Admin can update media" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND auth.jwt() ->> 'email' = 'samaanya1@gmail.com');

CREATE POLICY "Admin can delete media" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND auth.jwt() ->> 'email' = 'samaanya1@gmail.com');
