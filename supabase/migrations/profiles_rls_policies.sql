-- Create RLS policies for the profiles table
BEGIN;

-- First, ensure RLS is enabled for the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_policy" ON public.profiles;

-- Allow users to insert their own profile
CREATE POLICY "profiles_insert_policy" ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Allow users to select their own profile
CREATE POLICY "profiles_select_policy" ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "profiles_update_policy" ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Allow users to delete their own profile (rarely needed)
CREATE POLICY "profiles_delete_policy" ON public.profiles 
FOR DELETE 
USING (auth.uid() = id);

-- Add a service role policy for admin operations
-- This is optional but helpful if you have a service role
CREATE POLICY "service_role_all_operations" ON public.profiles
USING (auth.role() = 'service_role');

COMMIT;
