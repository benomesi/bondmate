-- Drop existing function if it exists
DROP FUNCTION IF EXISTS create_new_profile(uuid, text, text);

-- Create stored procedure for profile creation
CREATE OR REPLACE FUNCTION create_new_profile(
  user_id uuid,
  user_email text,
  user_name text DEFAULT NULL
)
RETURNS SETOF profiles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Try to insert new profile
  RETURN QUERY
  INSERT INTO public.profiles (
    id,
    name,
    interests,
    goals,
    has_completed_onboarding,
    is_premium,
    is_admin
  )
  VALUES (
    user_id,
    COALESCE(user_name, split_part(user_email, '@', 1)),
    '{}',
    '{}',
    false,
    false,
    false
  )
  ON CONFLICT (id) DO UPDATE
  SET updated_at = now()
  RETURNING *;
END;
$$;