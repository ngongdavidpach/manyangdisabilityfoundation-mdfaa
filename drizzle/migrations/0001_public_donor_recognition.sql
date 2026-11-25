ALTER TABLE public.donation_intents ADD COLUMN IF NOT EXISTS show_publicly boolean NOT NULL DEFAULT false;
CREATE OR REPLACE FUNCTION public.list_public_donors()
RETURNS TABLE(display_name text, amount_cents integer, currency text, pledged_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT CASE WHEN is_anonymous OR coalesce(trim(donor_name),'') = '' THEN 'Anonymous donor' ELSE trim(donor_name) END,
         amount_cents, currency, created_at
  FROM public.donation_intents
  WHERE show_publicly = true AND status <> 'cancelled'
  ORDER BY created_at DESC
$$;
REVOKE ALL ON FUNCTION public.list_public_donors() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.list_public_donors() TO anon, authenticated, service_role;