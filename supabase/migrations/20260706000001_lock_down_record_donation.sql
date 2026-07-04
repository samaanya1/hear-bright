-- record_donation is SECURITY DEFINER and was executable by anon/authenticated via
-- PostgREST (/rest/v1/rpc/record_donation). It does no signature/payment verification
-- of its own — that only happens in api/verify-payment.js before it calls this function
-- with the service-role key. Leaving it open to anon let anyone forge donation rows and
-- inflate a fundraiser's raised/donors counters with no real payment.
--
-- Restrict execution to service_role only, and pin search_path to close the
-- SECURITY DEFINER search_path hijacking vector flagged by the Supabase security advisor.

REVOKE EXECUTE ON FUNCTION public.record_donation(uuid, integer, text, text, text, text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.record_donation(uuid, integer, text, text, text, text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.record_donation(uuid, integer, text, text, text, text) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.record_donation(uuid, integer, text, text, text, text) TO service_role;

ALTER FUNCTION public.record_donation(uuid, integer, text, text, text, text) SET search_path = public, pg_temp;
