-- Create RPC function to increment deal views
CREATE OR REPLACE FUNCTION public.increment_deal_views(deal_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.deal_opportunities
  SET views_count = COALESCE(views_count, 0) + 1
  WHERE id = deal_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;