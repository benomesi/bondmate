/*
  # Add admin column to profiles table

  1. Changes
    - Add is_admin column to profiles table with default false
*/

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;