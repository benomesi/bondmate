/*
  # Add Premium Plan Support

  1. Changes
    - Add is_premium column to profiles table
    - Set test user as premium

  2. Security
    - Column is protected by existing RLS policies
*/

-- Add is_premium column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_premium boolean DEFAULT false;

-- Update your test user to premium (replace with your user ID)
UPDATE profiles 
SET is_premium = true 
WHERE id IN (
  SELECT id FROM auth.users 
  WHERE email = 'benomesi@gmail.com'  -- Replace with your email
);