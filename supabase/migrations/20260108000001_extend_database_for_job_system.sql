-- Extend profiles table with email verification and resume fields
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email_verification_token UUID;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email_verification_expires TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_email_verified BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS resume_url TEXT;
