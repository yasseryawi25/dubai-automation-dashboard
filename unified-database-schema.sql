-- =============================================
-- DUBAI REAL ESTATE AI PLATFORM - UNIFIED DATABASE SCHEMA
-- =============================================

-- Switch to the main application database
\c dubai_real_estate;

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- CORE TABLES
-- =============================================

-- Client Profiles (Multi-tenant isolation)
CREATE TABLE IF NOT EXISTS client_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    company_name VARCHAR(255),
    subscription_plan VARCHAR(50) DEFAULT 'basic' CHECK (subscription_plan IN ('basic', 'premium', 'enterprise')),
    settings JSONB DEFAULT '{}',
    api_settings JSONB DEFAULT '{}',
    billing_info JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Profiles (Individual users within clients)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES client_profiles(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'agent' CHECK (role IN ('admin', 'manager', 'agent', 'viewer')),
    avatar_url TEXT,
    preferences JSONB DEFAULT '{}',
    last_login_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leads Management
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES client_profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'viewing_scheduled', 'offer_made', 'converted', 'lost', 'inactive')),
    source VARCHAR(100),
    notes TEXT,
    lead_score INTEGER DEFAULT 0 CHECK (lead_score >= 0 AND lead_score <= 100),
    assigned_agent VARCHAR(255),
    assigned_agent_id UUID,
    priority_level VARCHAR(20) DEFAULT 'medium' CHECK (priority_level IN ('low', 'medium', 'high', 'urgent')),
    follow_up_date TIMESTAMP WITH TIME ZONE,
    conversion_probability INTEGER CHECK (conversion_probability >= 0 AND conversion_probability <= 100),
    last_contacted_at TIMESTAMP WITH TIME ZONE,
    contact_attempts INTEGER DEFAULT 0,
    preferred_contact_method VARCHAR(50),
    property_type_interest TEXT[],
    budget_min NUMERIC(12,2),
    budget_max NUMERIC(12,2),
    location_preference TEXT[],
    timeline VARCHAR(100),
    financing_status VARCHAR(100),
    lead_tags TEXT[],
    whatsapp_number VARCHAR(50),
    source_details TEXT,
    referral_source VARCHAR(255),
    lead_source VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- WhatsApp Messages
CREATE TABLE IF NOT EXISTS whatsapp_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES client_profiles(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    phone_number VARCHAR(50) NOT NULL,
    message_content TEXT NOT NULL,
    direction VARCHAR(20) NOT NULL CHECK (direction IN ('inbound', 'outbound')),
    status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read', 'failed')),
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'document', 'audio', 'video')),
    media_url TEXT,
    agent_generated BOOLEAN DEFAULT false,
    automation_triggered BOOLEAN DEFAULT false,
    sentiment VARCHAR(50),
    language_detected VARCHAR(10),
    message_id VARCHAR(255),
    template_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Property Listings
CREATE TABLE IF NOT EXISTS property_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES client_profiles(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    property_type VARCHAR(50) NOT NULL CHECK (property_type IN ('apartment', 'villa', 'townhouse', 'penthouse', 'studio', 'office', 'shop', 'warehouse')),
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'sold', 'rented', 'off_market')),
    listing_type VARCHAR(20) DEFAULT 'sale' CHECK (listing_type IN ('sale', 'rent', 'both')),
    location VARCHAR(255) NOT NULL,
    area VARCHAR(100),
    building_name VARCHAR(255),
    floor_number INTEGER,
    unit_number VARCHAR(50),
    price NUMERIC(15,2) NOT NULL,
    rent_frequency VARCHAR(20) CHECK (rent_frequency IN ('monthly', 'yearly', 'weekly')),
    bedrooms INTEGER,
    bathrooms INTEGER,
    area_sqft NUMERIC(10,2),
    parking_spaces INTEGER DEFAULT 0,
    furnished_status VARCHAR(20) CHECK (furnished_status IN ('furnished', 'unfurnished', 'semi_furnished')),
    amenities TEXT[],
    features JSONB DEFAULT '{}',
    images JSONB DEFAULT '[]',
    virtual_tour_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    views_count INTEGER DEFAULT 0,
    inquiries_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Automation Workflows
CREATE TABLE IF NOT EXISTS automation_workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES client_profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('lead_generation', 'follow_up', 'nurturing', 'scheduling', 'qualification', 'marketing')),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    configuration JSONB DEFAULT '{}',
    n8n_workflow_id VARCHAR(255),
    trigger_conditions JSONB DEFAULT '{}',
    actions JSONB DEFAULT '{}',
    success_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    last_execution TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- AI AGENTS TABLES
-- =============================================

-- AI Agents
CREATE TABLE IF NOT EXISTS ai_agents (
    id VARCHAR(100) PRIMARY KEY, -- Custom IDs like 'sarah-manager'
    client_id UUID NOT NULL REFERENCES client_profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('manager', 'coordinator', 'basic')),
    specialty TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'busy', 'idle', 'offline')),
    avatar VARCHAR(10) DEFAULT '🤖',
    description TEXT,
    capabilities TEXT[],
    configuration JSONB DEFAULT '{}',
    performance_metrics JSONB DEFAULT '{}',
    is_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agent Tasks
CREATE TABLE IF NOT EXISTS agent_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES client_profiles(id) ON DELETE CASCADE,
    agent_id VARCHAR(100) NOT NULL REFERENCES ai_agents(id) ON DELETE CASCADE,
    task_type VARCHAR(100) NOT NULL,
    task_description TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    related_lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    input_data JSONB DEFAULT '{}',
    output_data JSONB DEFAULT '{}',
    error_message TEXT,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agent Communications
CREATE TABLE IF NOT EXISTS agent_communications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES client_profiles(id) ON DELETE CASCADE,
    from_agent_id VARCHAR(100) NOT NULL REFERENCES ai_agents(id) ON DELETE CASCADE,
    to_agent_id VARCHAR(100) REFERENCES ai_agents(id) ON DELETE CASCADE,
    message_type VARCHAR(50) NOT NULL CHECK (message_type IN ('task_assignment', 'status_update', 'escalation', 'collaboration')),
    message_content TEXT NOT NULL,
    related_task_id UUID REFERENCES agent_tasks(id) ON DELETE SET NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agent Daily Metrics
CREATE TABLE IF NOT EXISTS agent_metrics_daily (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES client_profiles(id) ON DELETE CASCADE,
    agent_id VARCHAR(100) NOT NULL REFERENCES ai_agents(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    tasks_completed INTEGER DEFAULT 0,
    tasks_failed INTEGER DEFAULT 0,
    response_time_avg NUMERIC(8,2),
    success_rate NUMERIC(5,2),
    leads_processed INTEGER DEFAULT 0,
    messages_sent INTEGER DEFAULT 0,
    calls_made INTEGER DEFAULT 0,
    efficiency_score NUMERIC(5,2),
    uptime_minutes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(agent_id, date)
);

-- Agent Errors
CREATE TABLE IF NOT EXISTS agent_errors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES client_profiles(id) ON DELETE CASCADE,
    agent_id VARCHAR(100) NOT NULL REFERENCES ai_agents(id) ON DELETE CASCADE,
    error_type VARCHAR(100) NOT NULL,
    error_message TEXT NOT NULL,
    error_context JSONB DEFAULT '{}',
    stack_trace TEXT,
    related_task_id UUID REFERENCES agent_tasks(id) ON DELETE SET NULL,
    is_resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ADDITIONAL SUPPORT TABLES
-- =============================================

-- Email Campaigns
CREATE TABLE IF NOT EXISTS email_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES client_profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    template_id VARCHAR(100),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'completed', 'failed')),
    target_audience JSONB DEFAULT '{}',
    scheduled_at TIMESTAMP WITH TIME ZONE,
    sent_count INTEGER DEFAULT 0,
    delivered_count INTEGER DEFAULT 0,
    open_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    bounce_count INTEGER DEFAULT 0,
    unsubscribe_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics Events
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES client_profiles(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    event_category VARCHAR(100),
    event_data JSONB DEFAULT '{}',
    user_agent TEXT,
    ip_address INET,
    session_id VARCHAR(255),
    user_id UUID,
    page_url TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lead Follow-ups
CREATE TABLE IF NOT EXISTS lead_followups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES client_profiles(id) ON DELETE CASCADE,
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('call', 'email', 'whatsapp', 'meeting', 'property_viewing')),
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'missed', 'cancelled')),
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    outcome TEXT,
    next_action TEXT,
    agent_assigned VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lead Sentiment Analysis
CREATE TABLE IF NOT EXISTS lead_sentiments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES client_profiles(id) ON DELETE CASCADE,
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    sentiment_score NUMERIC(5,2),
    sentiment_label VARCHAR(20) CHECK (sentiment_label IN ('very_negative', 'negative', 'neutral', 'positive', 'very_positive')),
    confidence NUMERIC(5,2),
    analysis_source VARCHAR(100),
    context TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversation History
CREATE TABLE IF NOT EXISTS conversation_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES client_profiles(id) ON DELETE CASCADE,
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    conversation_id UUID,
    platform VARCHAR(20) NOT NULL CHECK (platform IN ('whatsapp', 'email', 'phone', 'in_person', 'web_chat')),
    message_content TEXT NOT NULL,
    direction VARCHAR(20) NOT NULL CHECK (direction IN ('inbound', 'outbound')),
    participant_name VARCHAR(255),
    participant_type VARCHAR(20) CHECK (participant_type IN ('lead', 'agent', 'ai_agent', 'system')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Core indexes
CREATE INDEX IF NOT EXISTS idx_leads_client_id ON leads(client_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_lead_score ON leads(lead_score);

CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_client_id ON whatsapp_messages(client_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_lead_id ON whatsapp_messages(lead_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_phone ON whatsapp_messages(phone_number);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_created_at ON whatsapp_messages(created_at);

CREATE INDEX IF NOT EXISTS idx_property_listings_client_id ON property_listings(client_id);
CREATE INDEX IF NOT EXISTS idx_property_listings_status ON property_listings(status);
CREATE INDEX IF NOT EXISTS idx_property_listings_location ON property_listings(location);
CREATE INDEX IF NOT EXISTS idx_property_listings_price ON property_listings(price);

CREATE INDEX IF NOT EXISTS idx_automation_workflows_client_id ON automation_workflows(client_id);
CREATE INDEX IF NOT EXISTS idx_automation_workflows_active ON automation_workflows(is_active);

-- AI Agents indexes
CREATE INDEX IF NOT EXISTS idx_ai_agents_client_id ON ai_agents(client_id);
CREATE INDEX IF NOT EXISTS idx_ai_agents_status ON ai_agents(status);
CREATE INDEX IF NOT EXISTS idx_ai_agents_type ON ai_agents(type);

CREATE INDEX IF NOT EXISTS idx_agent_tasks_client_id ON agent_tasks(client_id);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_agent_id ON agent_tasks(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_status ON agent_tasks(status);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_created_at ON agent_tasks(created_at);

CREATE INDEX IF NOT EXISTS idx_agent_metrics_daily_agent_date ON agent_metrics_daily(agent_id, date);
CREATE INDEX IF NOT EXISTS idx_agent_metrics_daily_client_id ON agent_metrics_daily(client_id);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_analytics_events_client_id ON analytics_events(client_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);

-- =============================================
-- UPDATE TRIGGERS
-- =============================================

-- Function to update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for tables with updated_at columns
CREATE TRIGGER update_client_profiles_updated_at BEFORE UPDATE ON client_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_property_listings_updated_at BEFORE UPDATE ON property_listings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_automation_workflows_updated_at BEFORE UPDATE ON automation_workflows FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_agents_updated_at BEFORE UPDATE ON ai_agents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_campaigns_updated_at BEFORE UPDATE ON email_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- SAMPLE DATA INSERTION
-- =============================================

-- Insert demo client profile
INSERT INTO client_profiles (
    id,
    name,
    email,
    phone,
    company_name,
    subscription_plan,
    api_settings
) VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'Demo Real Estate Agency',
    'demo@realestate.ae',
    '+971501234567',
    'Demo Real Estate Agency Dubai',
    'premium',
    '{
        "whatsapp_enabled": true,
        "voice_calls_enabled": true,
        "ai_agents_enabled": true,
        "max_monthly_leads": 1000,
        "max_ai_agents": 6
    }'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    company_name = EXCLUDED.company_name,
    api_settings = EXCLUDED.api_settings,
    updated_at = NOW();

-- Insert demo AI agents
INSERT INTO ai_agents (id, client_id, name, type, specialty, status, avatar, description, capabilities, configuration) VALUES
('sarah-manager', '550e8400-e29b-41d4-a716-446655440000', 'Sarah Al-Mansouri', 'manager', 'Strategic Analysis & Voice Calls', 'active', '👩‍💼', 'Senior AI Manager specializing in strategic analysis and client voice consultations', ARRAY['strategic_analysis', 'voice_calls', 'client_consultation', 'market_insights'], '{"language": "bilingual", "expertise_level": "expert", "availability": "24/7", "voice_enabled": true}'),
('alex-coordinator', '550e8400-e29b-41d4-a716-446655440000', 'Alex Thompson', 'coordinator', 'Pipeline Coordination', 'active', '🎯', 'Pipeline coordinator managing lead flow and agent task distribution', ARRAY['pipeline_management', 'task_coordination', 'workflow_optimization'], '{"coordination_scope": "full_pipeline", "task_priority": "high", "automation_level": "advanced"}'),
('maya-coordinator', '550e8400-e29b-41d4-a716-446655440000', 'Maya Hassan', 'coordinator', 'Campaign Management', 'active', '📊', 'Campaign coordinator specializing in marketing automation and client engagement', ARRAY['campaign_management', 'marketing_automation', 'client_engagement'], '{"campaign_types": ["email", "social", "whatsapp"], "automation_level": "expert"}'),
('omar-qualifier', '550e8400-e29b-41d4-a716-446655440000', 'Omar Hassan', 'basic', 'Lead Qualification Specialist', 'active', '🎯', 'Lead qualification specialist with instant response capabilities', ARRAY['lead_qualification', 'whatsapp_automation', 'initial_screening'], '{"qualification_criteria": "dubai_real_estate", "response_time": "under_30_seconds", "languages": ["english", "arabic"]}'),
('layla-followup', '550e8400-e29b-41d4-a716-446655440000', 'Layla Ahmed', 'basic', 'Follow-up Specialist', 'active', '💬', 'Follow-up specialist managing client nurturing and communication sequences', ARRAY['follow_up_sequences', 'client_nurturing', 'email_automation'], '{"sequence_types": ["email", "whatsapp", "sms"], "nurturing_duration": "90_days"}'),
('ahmed-scheduler', '550e8400-e29b-41d4-a716-446655440000', 'Ahmed Rashid', 'basic', 'Appointment Coordinator', 'active', '📅', 'Smart appointment coordinator managing viewing schedules and calendar optimization', ARRAY['appointment_scheduling', 'calendar_management', 'viewing_coordination'], '{"booking_types": ["property_viewing", "consultation", "meeting"], "timezone": "Asia/Dubai"}')
ON CONFLICT (id) DO UPDATE SET
    client_id = EXCLUDED.client_id,
    name = EXCLUDED.name,
    specialty = EXCLUDED.specialty,
    capabilities = EXCLUDED.capabilities,
    configuration = EXCLUDED.configuration,
    updated_at = NOW();

-- =============================================
-- COMPLETION MESSAGE
-- =============================================

\echo '✅ Dubai Real Estate AI Platform database schema created successfully!'
\echo ''
\echo 'Created tables:'
\echo '- client_profiles (Multi-tenant isolation)'
\echo '- user_profiles (Individual users)'
\echo '- leads (Lead management)'
\echo '- whatsapp_messages (Communication)'
\echo '- property_listings (Real estate inventory)'
\echo '- automation_workflows (n8n integration)'
\echo '- ai_agents (AI agent management)'
\echo '- agent_tasks (Task tracking)'
\echo '- agent_communications (Agent coordination)'
\echo '- agent_metrics_daily (Performance tracking)'
\echo '- agent_errors (Error tracking)'
\echo '- email_campaigns (Marketing)'
\echo '- analytics_events (Analytics)'
\echo '- lead_followups (Follow-up tracking)'
\echo '- lead_sentiments (Sentiment analysis)'
\echo '- conversation_history (Communication history)'
\echo ''
\echo 'Demo data inserted:'
\echo '- Demo client profile (Demo Real Estate Agency)'
\echo '- 6 AI agents (Sarah, Alex, Maya, Omar, Layla, Ahmed)'
\echo ''
\echo 'Next steps:'
\echo '1. Configure Supabase to use this database'
\echo '2. Set up Row Level Security policies'
\echo '3. Test database connections from your dashboard'
