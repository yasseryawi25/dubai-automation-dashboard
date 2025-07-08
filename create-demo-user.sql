-- Create demo user manually in Supabase
-- Run this AFTER running the RLS fix

-- =============================================
-- OPTION 1: Create demo user via Supabase Auth (Recommended)
-- =============================================
-- Go to Supabase Dashboard > Authentication > Users > Add User
-- Email: demo@realestate.ae
-- Password: demo123
-- Auto Confirm: Yes

-- Then run this to create the user profile:
INSERT INTO public.user_profiles (
    id,
    client_id,
    first_name,
    last_name,
    email,
    role,
    created_at,
    updated_at
) VALUES (
    -- Replace 'USER_ID_FROM_SUPABASE_AUTH' with the actual UUID from Supabase Auth
    'USER_ID_FROM_SUPABASE_AUTH', 
    '550e8400-e29b-41d4-a716-446655440000',
    'Demo',
    'User',
    'demo@realestate.ae',
    'admin',
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    client_id = EXCLUDED.client_id,
    updated_at = NOW();

-- =============================================
-- OPTION 2: Alternative - Just test registration
-- =============================================
-- Try registering a new account with these details:
-- Name: Test User
-- Email: test@example.com
-- Password: test123
-- Company: Test Company