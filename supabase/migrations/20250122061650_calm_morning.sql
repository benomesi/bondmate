-- Create stored procedure for profile creation
CREATE OR REPLACE FUNCTION create_new_profile(
  user_id uuid,
  user_email text,
  user_name text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    user_id,
    COALESCE(user_name, split_part(user_email, '@', 1)),
    user_email
  )
  ON CONFLICT (id) DO NOTHING;
END;
$$;