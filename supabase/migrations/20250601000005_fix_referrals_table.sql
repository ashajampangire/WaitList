-- Drop existing foreign key constraints if they exist
ALTER TABLE IF EXISTS public.referrals
DROP CONSTRAINT IF EXISTS referrals_referred_email_fkey;

ALTER TABLE IF EXISTS public.referrals
DROP CONSTRAINT IF EXISTS referrals_referrer_email_fkey;

-- Drop the table if it exists
DROP TABLE IF EXISTS public.referrals;

-- Create referrals table
CREATE TABLE public.referrals (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    referrer_email text NOT NULL,
    referred_email text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Add foreign key constraints
ALTER TABLE public.referrals
ADD CONSTRAINT referrals_referred_email_fkey
FOREIGN KEY (referred_email)
REFERENCES public.waitlist_entries(email)
ON DELETE CASCADE;

ALTER TABLE public.referrals
ADD CONSTRAINT referrals_referrer_email_fkey
FOREIGN KEY (referrer_email)
REFERENCES public.waitlist_entries(email)
ON DELETE CASCADE; 