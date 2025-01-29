-- Update user metadata to add admin privileges
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{is_admin}',
  'true'
)
WHERE email = 'benomesi@gmail.com';  -- Replace with your email

-- Also update the profiles table
UPDATE profiles
SET is_admin = true
WHERE id IN (
  SELECT id FROM auth.users
  WHERE email = 'benomesi@gmail.com'  -- Replace with your email
);