CREATE OR REPLACE VIEW public.staff_members_public
WITH (security_invoker = true, security_barrier = true) AS
SELECT id, full_name, role_title, bio, photo_url, sort_order, is_active, created_at, updated_at
FROM public.staff_members
WHERE is_active = true;

GRANT SELECT ON public.staff_members_public TO anon, authenticated;
GRANT ALL ON public.staff_members_public TO service_role;

GRANT SELECT (id, full_name, role_title, bio, photo_url, sort_order, is_active, created_at, updated_at)
ON public.staff_members TO anon, authenticated;

DROP POLICY IF EXISTS staff_public_read_active ON public.staff_members;
CREATE POLICY staff_public_read_active
ON public.staff_members
FOR SELECT
TO anon, authenticated
USING (is_active = true);