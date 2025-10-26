-- Fix 1: Add DELETE policy for messages table
CREATE POLICY "Users can delete their own sent messages"
ON public.messages
FOR DELETE
TO authenticated
USING (auth.uid() = sender_id);

-- Fix 2: Fix function search_path for increment_deal_views
CREATE OR REPLACE FUNCTION public.increment_deal_views(deal_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  UPDATE public.deal_opportunities
  SET views_count = COALESCE(views_count, 0) + 1
  WHERE id = deal_id;
END;
$function$;