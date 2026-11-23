DROP TRIGGER IF EXISTS on_auth_user_created_bootstrap_admin ON auth.users;
DO $$ DECLARE t record; BEGIN
  FOR t IN SELECT tgname FROM pg_trigger tr JOIN pg_proc p ON p.oid = tr.tgfoid
    WHERE tr.tgrelid = 'auth.users'::regclass AND p.proname = 'bootstrap_first_admin' LOOP
    EXECUTE format('DROP TRIGGER %I ON auth.users', t.tgname);
  END LOOP;
END $$;
DROP FUNCTION IF EXISTS public.bootstrap_first_admin();

CREATE TABLE IF NOT EXISTS public.internal_cron_tokens (
  name text PRIMARY KEY,
  token text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
REVOKE ALL ON public.internal_cron_tokens FROM anon, authenticated;
GRANT ALL ON public.internal_cron_tokens TO service_role;
ALTER TABLE public.internal_cron_tokens ENABLE ROW LEVEL SECURITY;

INSERT INTO public.internal_cron_tokens(name, token)
VALUES ('purge-deleted-accounts', encode(extensions.gen_random_bytes(32), 'hex'))
ON CONFLICT (name) DO NOTHING;

SELECT cron.unschedule('purge-deleted-accounts')
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'purge-deleted-accounts');

SELECT cron.schedule(
  'purge-deleted-accounts',
  '0 3 * * *',
  $$
  SELECT net.http_post(
    url := 'https://project--b11f2ede-4baf-42ba-8d4c-06cc21dd4aa8.lovable.app/api/public/hooks/purge-deleted-accounts',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-token', (SELECT token FROM public.internal_cron_tokens WHERE name = 'purge-deleted-accounts')
    ),
    body := '{}'::jsonb
  );
  $$
);