-- Create role enum
CREATE TYPE public.app_role AS ENUM ('owner', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Only owners can view all roles
CREATE POLICY "Owners can view all roles"
ON public.user_roles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'owner'
  )
);

-- Only owners can assign roles
CREATE POLICY "Owners can assign roles"
ON public.user_roles
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'owner'
  )
);

-- Only owners can update roles
CREATE POLICY "Owners can update roles"
ON public.user_roles
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'owner'
  )
);

-- Only owners can delete roles
CREATE POLICY "Owners can delete roles"
ON public.user_roles
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'owner'
  )
);

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Function to check if user has any admin role (owner or moderator)
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('owner', 'moderator')
  )
$$;

-- Assign owner role to your email
-- Note: This will execute when the migration runs, assigning the role to the user with that email
DO $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Find user by email
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = 'srivatsa.vedula2@gmail.com';
  
  -- If user exists, assign owner role
  IF target_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (target_user_id, 'owner')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;

-- Update profiles RLS to allow admins to view all profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

CREATE POLICY "Users can view profiles"
ON public.profiles
FOR SELECT
USING (
  auth.uid() = user_id OR public.is_admin(auth.uid())
);

-- Update messages RLS to allow admins to view all messages
DROP POLICY IF EXISTS "Users can view their messages" ON public.messages;

CREATE POLICY "Users and admins can view messages"
ON public.messages
FOR SELECT
USING (
  auth.uid() = sender_id OR 
  auth.uid() = receiver_id OR 
  public.is_admin(auth.uid())
);

-- Allow moderators and owners to send messages on behalf of the system
CREATE POLICY "Admins can send messages"
ON public.messages
FOR INSERT
WITH CHECK (
  auth.uid() = sender_id OR public.is_admin(auth.uid())
);

-- Update deals RLS to allow admins to view all deals
DROP POLICY IF EXISTS "Users can view their own deals" ON public.deals;

CREATE POLICY "Users and admins can view deals"
ON public.deals
FOR SELECT
USING (
  auth.uid() = user_id OR public.is_admin(auth.uid())
);

-- Create index for role lookups
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role);