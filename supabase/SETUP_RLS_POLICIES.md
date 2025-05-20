# Fixing Profiles Table Row Level Security Policies

To properly set up RLS (Row Level Security) for the profiles table in Supabase, follow these steps:

## Access the Supabase SQL Editor

1. Log in to your Supabase dashboard
2. Go to the SQL Editor section
3. Create a new query

## Execute the Following SQL

```sql
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
```

## Testing the Changes

After executing the SQL, try to sign up for the app again. The profile creation should now work correctly.

## Why This Fix Works

The error "violates row-level security policy for table 'profiles'" occurs because Row Level Security is enabled for the profiles table, but no policies are in place to allow insertions. The SQL commands above create the necessary policies that:

1. Allow users to create their own profile (where id matches their auth.uid())
2. Allow users to read and update their own profile
3. Allow service role access (for admin operations)

Without these policies, you'll see 401 Unauthorized errors when trying to create or access profiles.
