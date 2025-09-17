-- Create financial tracking tables for bank statement analysis and spending tracking
CREATE TABLE public.financial_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  account_name TEXT NOT NULL,
  account_type TEXT NOT NULL CHECK (account_type IN ('checking', 'savings', 'credit_card', 'business')),
  bank_name TEXT,
  current_balance DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create transactions table to store parsed bank statement data
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  account_id UUID,
  date DATE NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('income', 'expense')),
  category TEXT,
  merchant TEXT,
  ai_parsed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bank statements table to track uploaded files
CREATE TABLE public.bank_statements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  filename TEXT NOT NULL,
  file_size INTEGER,
  upload_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  ai_analysis JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create spending insights table for AI recommendations
CREATE TABLE public.spending_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  insight_type TEXT NOT NULL CHECK (insight_type IN ('spending_category', 'cost_cutting', 'revenue_opportunity', 'cash_flow')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  potential_savings DECIMAL(10,2),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'viewed', 'acted_on', 'dismissed')),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create business marketplace table for deal opportunities  
CREATE TABLE public.deal_opportunities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  deal_type TEXT NOT NULL CHECK (deal_type IN ('seeking_investment', 'offering_investment', 'partnership', 'acquisition', 'joint_venture', 'supplier', 'customer')),
  industry TEXT,
  investment_range_min DECIMAL(12,2),
  investment_range_max DECIMAL(12,2),
  location TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'closed')),
  views_count INTEGER DEFAULT 0,
  interested_parties INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.financial_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_statements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spending_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_opportunities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for financial_accounts
CREATE POLICY "Users can view their own financial accounts" ON public.financial_accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own financial accounts" ON public.financial_accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own financial accounts" ON public.financial_accounts FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for transactions
CREATE POLICY "Users can view their own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own transactions" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own transactions" ON public.transactions FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for bank_statements
CREATE POLICY "Users can view their own bank statements" ON public.bank_statements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own bank statements" ON public.bank_statements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own bank statements" ON public.bank_statements FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for spending_insights
CREATE POLICY "Users can view their own spending insights" ON public.spending_insights FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own spending insights" ON public.spending_insights FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own spending insights" ON public.spending_insights FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for deal_opportunities (publicly viewable, but users can only edit their own)
CREATE POLICY "Anyone can view deal opportunities" ON public.deal_opportunities FOR SELECT USING (true);
CREATE POLICY "Users can create their own deal opportunities" ON public.deal_opportunities FOR INSERT WITH CHECK (auth.uid() = creator_user_id);
CREATE POLICY "Users can update their own deal opportunities" ON public.deal_opportunities FOR UPDATE USING (auth.uid() = creator_user_id);

-- Add foreign key constraints
ALTER TABLE public.transactions ADD CONSTRAINT fk_transactions_account FOREIGN KEY (account_id) REFERENCES public.financial_accounts(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX idx_transactions_user_date ON public.transactions(user_id, date DESC);
CREATE INDEX idx_transactions_category ON public.transactions(category);
CREATE INDEX idx_deal_opportunities_type ON public.deal_opportunities(deal_type);
CREATE INDEX idx_deal_opportunities_industry ON public.deal_opportunities(industry);
CREATE INDEX idx_spending_insights_type ON public.spending_insights(insight_type, priority);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_financial_accounts_updated_at BEFORE UPDATE ON public.financial_accounts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bank_statements_updated_at BEFORE UPDATE ON public.bank_statements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_spending_insights_updated_at BEFORE UPDATE ON public.spending_insights FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_deal_opportunities_updated_at BEFORE UPDATE ON public.deal_opportunities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();