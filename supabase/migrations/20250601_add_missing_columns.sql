-- Add missing columns to waitlist_entries table
ALTER TABLE public.waitlist_entries
ADD COLUMN IF NOT EXISTS twitter_username TEXT,
ADD COLUMN IF NOT EXISTS discord_username TEXT,
ADD COLUMN IF NOT EXISTS wallet_address TEXT;
