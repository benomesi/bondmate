-- Add Stripe-related columns to profiles table
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS stripe_customer_id text,
  ADD COLUMN IF NOT EXISTS subscription_id text,
  ADD COLUMN IF NOT EXISTS subscription_status text,
  ADD COLUMN IF NOT EXISTS trial_end timestamptz;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id 
  ON profiles(stripe_customer_id);

CREATE INDEX IF NOT EXISTS idx_profiles_subscription_id
  ON profiles(subscription_id);