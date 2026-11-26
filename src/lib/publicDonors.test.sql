-- Regression checks use transaction-only fixtures; no test pledge is retained.
BEGIN;
INSERT INTO public.donation_intents (reference, donor_name, donor_email, amount_cents, currency, channel, status)
VALUES ('TEST-RECOGNITION-PRIVATE', 'Recognition test donor', 'private@example.invalid', 12345, 'AUD', 'payid', 'pledged');
DO $$
BEGIN
  IF (SELECT show_publicly FROM public.donation_intents WHERE reference = 'TEST-RECOGNITION-PRIVATE') IS DISTINCT FROM false THEN
    RAISE EXCEPTION 'New pledges must be private by default';
  END IF;
  IF EXISTS (SELECT 1 FROM public.list_public_donors() WHERE display_name = 'Recognition test donor') THEN
    RAISE EXCEPTION 'Unapproved pledges must not appear publicly';
  END IF;
END $$;
UPDATE public.donation_intents SET show_publicly = true WHERE reference = 'TEST-RECOGNITION-PRIVATE';
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.list_public_donors() WHERE display_name = 'Recognition test donor' AND amount_cents = 12345 AND currency = 'AUD') THEN
    RAISE EXCEPTION 'Approved pledge must display its actual name and amount';
  END IF;
END $$;
UPDATE public.donation_intents SET is_anonymous = true WHERE reference = 'TEST-RECOGNITION-PRIVATE';
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.list_public_donors() WHERE display_name = 'Recognition test donor') OR
     NOT EXISTS (SELECT 1 FROM public.list_public_donors() WHERE display_name = 'Anonymous donor' AND amount_cents = 12345) THEN
    RAISE EXCEPTION 'Anonymous pledges must hide the donor name';
  END IF;
END $$;
UPDATE public.donation_intents SET status = 'cancelled' WHERE reference = 'TEST-RECOGNITION-PRIVATE';
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.list_public_donors() WHERE amount_cents = 12345) THEN
    RAISE EXCEPTION 'Cancelled pledges must not appear publicly';
  END IF;
END $$;
ROLLBACK;