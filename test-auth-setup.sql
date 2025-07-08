-- Test authentication system by creating a demo user
-- Run this in your Supabase SQL editor

-- First, let's create a demo client profile
INSERT INTO client_profiles (
  id,
  name,
  email,
  phone,
  company_name,
  subscription_plan,
  created_at,
  updated_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'Demo Real Estate Agency',
  'demo@realestate.ae',
  '+971501234567',
  'Demo Real Estate Agency',
  'premium',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  updated_at = NOW();

-- Note: The actual user will be created through Supabase Auth when they register
-- This just ensures we have a client profile ready for testing

-- Check if our tables exist
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name IN ('client_profiles', 'user_profiles', 'leads')
  AND table_schema = 'public'
ORDER BY table_name, ordinal_position;