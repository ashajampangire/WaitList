-- Create referrals table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.referrals (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    referrer_email text NOT NULL,
    referred_email text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Add foreign key constraints for referrals table
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
