-- CORRECTED Combined migration script for PostCraft Stripe integration
-- Use this in the Supabase SQL Editor

-- IMPORTANT: This is the fixed version that addresses the syntax error
-- with CREATE POLICY statements

BEGIN;

-- 1. Create subscribers table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  subscribed BOOLEAN NOT NULL DEFAULT false,
  subscription_tier TEXT,
  subscription_end TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Enable Row Level Security
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- 3. First drop existing policies if they exist
DROP POLICY IF EXISTS "select_own_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "update_own_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "insert_subscription" ON public.subscribers;

-- 4. Create new policies
CREATE POLICY "select_own_subscription" ON public.subscribers
FOR SELECT
USING (user_id = auth.uid() OR email = auth.email());

CREATE POLICY "update_own_subscription" ON public.subscribers
FOR UPDATE
USING (true);

CREATE POLICY "insert_subscription" ON public.subscribers
FOR INSERT
WITH CHECK (true);

-- 5. Add trigger to update 'updated_at' column
CREATE OR REPLACE FUNCTION public.update_subscribers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_subscribers_updated_at ON public.subscribers;
CREATE TRIGGER update_subscribers_updated_at
BEFORE UPDATE ON public.subscribers
FOR EACH ROW
EXECUTE FUNCTION public.update_subscribers_updated_at();

-- 6. Update profiles table with subscription columns
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_subscribed BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS remaining_free_posts INTEGER NOT NULL DEFAULT 3;

-- 7. Create function to sync subscription status
CREATE OR REPLACE FUNCTION public.sync_subscription_status()
RETURNS TRIGGER AS $$
BEGIN
  -- When subscription status changes in subscribers table, update profiles table
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE public.profiles
    SET is_subscribed = NEW.subscribed
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Create trigger to sync subscription status
DROP TRIGGER IF EXISTS sync_subscription_status ON public.subscribers;
CREATE TRIGGER sync_subscription_status
AFTER INSERT OR UPDATE OF subscribed ON public.subscribers
FOR EACH ROW
EXECUTE FUNCTION public.sync_subscription_status();

COMMIT;

-- Operation completed
SELECT 'Database updated successfully for PostCraft Stripe integration' as status;
