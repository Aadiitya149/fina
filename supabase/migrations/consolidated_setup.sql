-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Financial Accounts Table
CREATE TABLE IF NOT EXISTS public.financial_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  account_name TEXT NOT NULL,
  account_type TEXT CHECK (account_type IN ('checking', 'savings', 'investment', 'retirement', 'crypto', 'Home Purchase', 'Education', 'Medical', 'Travel', 'Other')) NOT NULL,
  balance DECIMAL(15, 2) DEFAULT 0.00,
  currency TEXT DEFAULT 'INR',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Goals Table (Updated with description and priority)
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  target_amount DECIMAL(15, 2) NOT NULL,
  current_amount DECIMAL(15, 2) DEFAULT 0.00,
  monthly_contribution DECIMAL(15, 2) DEFAULT 0.00,
  target_date DATE NOT NULL,
  goal_type TEXT CHECK (goal_type IN ('retirement', 'savings', 'debt_payoff', 'investment', 'major_purchase', 'home', 'education', 'travel', 'emergency', 'other')) NOT NULL,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  description TEXT,
  status TEXT CHECK (status IN ('active', 'completed', 'paused')) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add columns if they don't exist (for existing tables)
DO $$
BEGIN
    ALTER TABLE public.goals ADD COLUMN IF NOT EXISTS description TEXT;
    ALTER TABLE public.goals ADD COLUMN IF NOT EXISTS priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium';
EXCEPTION
    WHEN duplicate_column THEN RAISE NOTICE 'column already exists';
END $$;

-- 5. Create Transactions Table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  account_id UUID REFERENCES public.financial_accounts(id) ON DELETE SET NULL,
  amount DECIMAL(15, 2) NOT NULL,
  transaction_type TEXT CHECK (transaction_type IN ('income', 'expense', 'transfer', 'investment')) NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  transaction_date TIMESTAMPTZ DEFAULT NOW(),
  receipt_url TEXT,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurring_interval TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create Budgets Table
CREATE TABLE IF NOT EXISTS public.budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(15,2) NOT NULL,
  last_alert_sent TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create Market Watchlist Table
CREATE TABLE IF NOT EXISTS public.market_watchlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  symbol TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Create Business Metrics Table
CREATE TABLE IF NOT EXISTS public.business_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  metric_type TEXT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  period DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Create Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 11. Drop existing policies to avoid errors
DROP POLICY IF EXISTS "Users can view own data" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own data" ON public.profiles;

DROP POLICY IF EXISTS "Users can view own accounts" ON public.financial_accounts;
DROP POLICY IF EXISTS "Users can insert own accounts" ON public.financial_accounts;
DROP POLICY IF EXISTS "Users can update own accounts" ON public.financial_accounts;
DROP POLICY IF EXISTS "Users can delete own accounts" ON public.financial_accounts;

DROP POLICY IF EXISTS "Users can view own goals" ON public.goals;
DROP POLICY IF EXISTS "Users can insert own goals" ON public.goals;
DROP POLICY IF EXISTS "Users can update own goals" ON public.goals;
DROP POLICY IF EXISTS "Users can delete own goals" ON public.goals;

DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can insert own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can update own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can delete own transactions" ON public.transactions;

DROP POLICY IF EXISTS "Users can view own budgets" ON public.budgets;
DROP POLICY IF EXISTS "Users can insert own budgets" ON public.budgets;
DROP POLICY IF EXISTS "Users can update own budgets" ON public.budgets;
DROP POLICY IF EXISTS "Users can delete own budgets" ON public.budgets;

DROP POLICY IF EXISTS "Users can view own watchlist" ON public.market_watchlist;
DROP POLICY IF EXISTS "Users can insert own watchlist" ON public.market_watchlist;
DROP POLICY IF EXISTS "Users can delete own watchlist" ON public.market_watchlist;

DROP POLICY IF EXISTS "Users can view own metrics" ON public.business_metrics;
DROP POLICY IF EXISTS "Users can insert own metrics" ON public.business_metrics;
DROP POLICY IF EXISTS "Users can update own metrics" ON public.business_metrics;
DROP POLICY IF EXISTS "Users can delete own metrics" ON public.business_metrics;

DROP POLICY IF EXISTS "Users can view own logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Users can insert own logs" ON public.audit_logs;

-- 12. Create RLS Policies
CREATE POLICY "Users can view own data" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own accounts" ON public.financial_accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own accounts" ON public.financial_accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own accounts" ON public.financial_accounts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own accounts" ON public.financial_accounts FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own goals" ON public.goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goals" ON public.goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON public.goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own goals" ON public.goals FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own transactions" ON public.transactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own transactions" ON public.transactions FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own budgets" ON public.budgets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own budgets" ON public.budgets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own budgets" ON public.budgets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own budgets" ON public.budgets FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own watchlist" ON public.market_watchlist FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own watchlist" ON public.market_watchlist FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own watchlist" ON public.market_watchlist FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own metrics" ON public.business_metrics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own metrics" ON public.business_metrics FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own metrics" ON public.business_metrics FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own metrics" ON public.business_metrics FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own logs" ON public.audit_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own logs" ON public.audit_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 13. Create Trigger Function to Update Account Balance
CREATE OR REPLACE FUNCTION public.update_account_balance()
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

-- 14. Create Trigger (Drop first to avoid error)
DROP TRIGGER IF EXISTS on_transaction_created ON public.transactions;
CREATE TRIGGER on_transaction_created
  AFTER INSERT ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_account_balance();

-- 15. Handle New User Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
