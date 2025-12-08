-- Create market_watchlist table
CREATE TABLE public.market_watchlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.market_watchlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own watchlist"
  ON public.market_watchlist FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own watchlist"
  ON public.market_watchlist FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own watchlist"
  ON public.market_watchlist FOR DELETE
  USING (auth.uid() = user_id);

-- Create business_metrics table
CREATE TABLE public.business_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL CHECK (metric_type IN ('revenue', 'expense', 'profit')),
  amount DECIMAL(15,2) NOT NULL,
  period DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.business_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own business metrics"
  ON public.business_metrics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own business metrics"
  ON public.business_metrics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own business metrics"
  ON public.business_metrics FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own business metrics"
  ON public.business_metrics FOR DELETE
  USING (auth.uid() = user_id);

-- Create audit_logs table
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own audit logs"
  ON public.audit_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own audit logs"
  ON public.audit_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create function to update account balance
CREATE OR REPLACE FUNCTION public.update_balance_from_transaction()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.transaction_type = 'income' THEN
    UPDATE public.financial_accounts
    SET balance = balance + NEW.amount
    WHERE id = NEW.account_id;
  ELSIF NEW.transaction_type = 'expense' THEN
    UPDATE public.financial_accounts
    SET balance = balance - NEW.amount
    WHERE id = NEW.account_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for account balance update
CREATE TRIGGER on_transaction_created
  AFTER INSERT ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_balance_from_transaction();
