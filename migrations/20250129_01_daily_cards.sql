-- Create daily_cards table for storing user's daily card draws
CREATE TABLE IF NOT EXISTS public.daily_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id TEXT NOT NULL,
  card_name TEXT NOT NULL,
  card_image_url TEXT NOT NULL,
  card_url TEXT NOT NULL,
  card_meaning TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  locale TEXT NOT NULL DEFAULT 'tr',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_daily_cards_user_id ON public.daily_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_cards_date ON public.daily_cards(date);
CREATE INDEX IF NOT EXISTS idx_daily_cards_user_date ON public.daily_cards(user_id, date);

-- Ensure one card per user per day
CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_cards_unique_user_date 
  ON public.daily_cards(user_id, date);

-- Enable RLS
ALTER TABLE public.daily_cards ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only see their own daily cards
CREATE POLICY "Users can view own daily cards"
  ON public.daily_cards
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own daily cards
CREATE POLICY "Users can insert own daily cards"
  ON public.daily_cards
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users cannot update or delete daily cards (they're historical records)
CREATE POLICY "Users cannot update daily cards"
  ON public.daily_cards
  FOR UPDATE
  USING (false);

CREATE POLICY "Users cannot delete daily cards"
  ON public.daily_cards
  FOR DELETE
  USING (false);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_daily_cards_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function
CREATE TRIGGER trigger_update_daily_cards_updated_at
  BEFORE UPDATE ON public.daily_cards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_daily_cards_updated_at();

-- Comment on table
COMMENT ON TABLE public.daily_cards IS 'Stores user daily card draws - one card per user per day';

