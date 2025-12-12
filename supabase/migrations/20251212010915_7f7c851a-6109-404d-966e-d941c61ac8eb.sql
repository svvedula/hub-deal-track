-- Add DELETE policy for profiles table - users can only delete their own profile
CREATE POLICY "Users can delete their own profile"
ON public.profiles
FOR DELETE
USING (auth.uid() = user_id);

-- Add DELETE policy for bank_statements table - users can only delete their own statements
CREATE POLICY "Users can delete their own bank statements"
ON public.bank_statements
FOR DELETE
USING (auth.uid() = user_id);