-- Drop existing RLS policies if they exist
DROP POLICY IF EXISTS "Users can view their own data" ON waitlist_entries;
DROP POLICY IF EXISTS "Users can update their own data" ON waitlist_entries;
DROP POLICY IF EXISTS "Anyone can insert into waitlist_entries" ON waitlist_entries;

-- Add authentication fields to waitlist_entries table
ALTER TABLE waitlist_entries
ADD COLUMN IF NOT EXISTS password_hash TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS salt TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS verification_token TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS reset_token TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS reset_token_expires TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_entries_email ON waitlist_entries(email);

-- Add RLS policies for authentication
ALTER TABLE waitlist_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own data"
ON waitlist_entries FOR SELECT
USING (true);

CREATE POLICY "Users can update their own data"
ON waitlist_entries FOR UPDATE
USING (true);

CREATE POLICY "Anyone can insert into waitlist_entries"
ON waitlist_entries FOR INSERT
WITH CHECK (true); 