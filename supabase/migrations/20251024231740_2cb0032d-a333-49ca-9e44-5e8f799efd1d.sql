-- Fix profiles table public exposure
-- Restrict profile viewing to authenticated users only
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;

CREATE POLICY "Authenticated users can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Keep existing policies for updates (users can only update their own profiles)
-- This maintains the business directory functionality while preventing public internet access