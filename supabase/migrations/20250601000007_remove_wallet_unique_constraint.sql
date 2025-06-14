-- Remove unique constraint on wallet_address
ALTER TABLE waitlist_entries
DROP CONSTRAINT IF EXISTS idx_waitlist_entries_wallet_address;

-- Create a non-unique index instead for better query performance
CREATE INDEX IF NOT EXISTS idx_waitlist_entries_wallet_address ON waitlist_entries(wallet_address); 