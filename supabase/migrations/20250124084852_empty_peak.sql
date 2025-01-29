/*
  # Add onboarding flag to profiles

  1. Changes
    - Add has_completed_onboarding column to profiles table
*/

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS has_completed_onboarding boolean DEFAULT false;