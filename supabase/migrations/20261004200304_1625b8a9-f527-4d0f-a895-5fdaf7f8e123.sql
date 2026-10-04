CREATE OR REPLACE VIEW public.staff_members_public
WITH (security_invoker = false, security_barrier = true) AS
SELECT id, full_name, role_title, bio, photo_url, sort_order, is_active, created_at, updated_at
FROM public.staff_members
WHERE is_active = true;

GRANT SELECT ON public.staff_members_public TO anon, authenticated;
GRANT ALL ON public.staff_members_public TO service_role;