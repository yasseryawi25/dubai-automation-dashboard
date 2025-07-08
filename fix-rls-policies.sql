-- Fix Row Level Security policies for authentication
-- Run this in your Supabase SQL Editor

-- =============================================
-- STEP 1: Check current RLS status
-- =============================================
SELECT schemaname, tablename, rowsecurity, hasindex 
FROM pg_tables 
WHERE tablename IN ('client_profiles', 'user_profiles', 'leads')
  AND schemaname = 'public';

-- =============================================
-- STEP 2: Disable RLS temporarily to check if tables exist
-- =============================================
ALTER TABLE public.client_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- =============================================
-- STEP 3: Create proper RLS policies for authentication
-- =============================================

-- Enable RLS on the tables
ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- =============================================
-- CLIENT PROFILES POLICIES
-- =============================================

-- Allow authenticated users to INSERT their own client profile during registration
CREATE POLICY "Users can create client profiles during registration" ON public.client_profiles
    FOR INSERT 
    WITH CHECK (true);  -- Allow any authenticated user to create a client profile

-- Allow users to SELECT their own client profile
CREATE POLICY "Users can view their own client profile" ON public.client_profiles
    FOR SELECT 
    USING (auth.uid() IN (
        SELECT user_profiles.id 
        FROM user_profiles 
        WHERE user_profiles.client_id = client_profiles.id
    ));

-- Allow users to UPDATE their own client profile
CREATE POLICY "Users can update their own client profile" ON public.client_profiles
    FOR UPDATE 
    USING (auth.uid() IN (
        SELECT user_profiles.id 
        FROM user_profiles 
        WHERE user_profiles.client_id = client_profiles.id
    ));

-- =============================================
-- USER PROFILES POLICIES  
-- =============================================

-- Allow authenticated users to INSERT their own user profile during registration
CREATE POLICY "Users can create their own profile" ON public.user_profiles
    FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- Allow users to SELECT their own profile
CREATE POLICY "Users can view their own profile" ON public.user_profiles
    FOR SELECT 
    USING (auth.uid() = id);

-- Allow users to UPDATE their own profile
CREATE POLICY "Users can update their own profile" ON public.user_profiles
    FOR UPDATE 
    USING (auth.uid() = id);

-- =============================================
-- LEADS POLICIES (Multi-tenant by client_id)
-- =============================================

-- Allow users to SELECT leads from their client
CREATE POLICY "Users can view leads from their client" ON public.leads
    FOR SELECT 
    USING (client_id IN (
        SELECT user_profiles.client_id 
        FROM user_profiles 
        WHERE user_profiles.id = auth.uid()
    ));

-- Allow users to INSERT leads for their client
CREATE POLICY "Users can create leads for their client" ON public.leads
    FOR INSERT 
    WITH CHECK (client_id IN (
        SELECT user_profiles.client_id 
        FROM user_profiles 
        WHERE user_profiles.id = auth.uid()
    ));

-- Allow users to UPDATE leads from their client
CREATE POLICY "Users can update leads from their client" ON public.leads
    FOR UPDATE 
    USING (client_id IN (
        SELECT user_profiles.client_id 
        FROM user_profiles 
        WHERE user_profiles.id = auth.uid()
    ));

-- =============================================
-- STEP 4: Create demo user for testing
-- =============================================

-- Insert demo client profile (this will work now with the policies)
INSERT INTO public.client_profiles (
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

-- =============================================
-- STEP 5: Check if policies were created successfully
-- =============================================
SELECT 
    schemaname,
    tablename, 
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('client_profiles', 'user_profiles', 'leads')
ORDER BY tablename, policyname;