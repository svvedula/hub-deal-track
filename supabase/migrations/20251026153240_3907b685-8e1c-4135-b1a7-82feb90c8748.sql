-- Fix 1: Restrict profiles to only show user's own profile
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON public.profiles;

CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Fix 2: Require authentication for businesses table
DROP POLICY IF EXISTS "Anyone can view businesses" ON public.businesses;

CREATE POLICY "Authenticated users can view businesses"
ON public.businesses
FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);

-- Fix 3: Require authentication for deal_opportunities table
DROP POLICY IF EXISTS "Anyone can view deal opportunities" ON public.deal_opportunities;

CREATE POLICY "Authenticated users can view deal opportunities"
ON public.deal_opportunities
FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);