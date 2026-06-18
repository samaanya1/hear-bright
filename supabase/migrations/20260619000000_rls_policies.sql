-- Grant read access to public tables for anonymous users
GRANT SELECT ON public.fundraisers TO anon;
GRANT SELECT ON public.webinars TO anon;
GRANT SELECT ON public.stories TO anon;
GRANT INSERT ON public.donations TO anon;

-- Grant full access to authenticated users (admin)
GRANT ALL ON public.fundraisers TO authenticated;
GRANT ALL ON public.webinars TO authenticated;
GRANT ALL ON public.stories TO authenticated;
GRANT ALL ON public.donations TO authenticated;

-- Enable RLS
ALTER TABLE public.fundraisers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webinars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can read fundraisers" ON public.fundraisers FOR SELECT TO anon USING (true);
CREATE POLICY "Public can read webinars" ON public.webinars FOR SELECT TO anon USING (true);
CREATE POLICY "Public can read stories" ON public.stories FOR SELECT TO anon USING (true);
CREATE POLICY "Public can insert donations" ON public.donations FOR INSERT TO anon WITH CHECK (true);

-- Admin full access policies
CREATE POLICY "Authenticated full access fundraisers" ON public.fundraisers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated full access webinars" ON public.webinars FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated full access stories" ON public.stories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated full access donations" ON public.donations FOR ALL TO authenticated USING (true) WITH CHECK (true);
