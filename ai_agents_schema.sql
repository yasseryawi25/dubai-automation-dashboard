-- =====================================================
-- AI AGENTS SYSTEM - Day 6 Enhancement
-- Add this to your existing PostgreSQL database
-- =====================================================

-- AI Agents table
CREATE TABLE ai_agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    agent_name VARCHAR(100) NOT NULL,
    agent_type VARCHAR(50) NOT NULL, -- 'manager', 'coordinator', 'basic'
    agent_role VARCHAR(100) NOT NULL, -- 'Personal AI Assistant', 'Lead Qualification', etc.
    agent_status VARCHAR(20) DEFAULT 'active', -- 'active', 'busy', 'offline'
    agent_avatar VARCHAR(255) DEFAULT '🤖',
    specialty VARCHAR(255),
    
    -- Capabilities and features
    capabilities JSONB DEFAULT '{}', -- Skills and features this agent has
    performance_metrics JSONB DEFAULT '{}', -- Current performance data
    configuration JSONB DEFAULT '{}', -- Agent-specific settings
    
    -- Activity tracking
    tasks_completed INTEGER DEFAULT 0,
    success_rate DECIMAL(5,2) DEFAULT 0.00,
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Agent Tasks table
CREATE TABLE agent_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES ai_agents(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    
    -- Task details
    task_type VARCHAR(50) NOT NULL, -- 'lead_qualification', 'follow_up', 'voice_call', etc.
    task_title VARCHAR(255) NOT NULL,
    task_description TEXT,
    task_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'failed'
    
    -- Priority and scheduling
    priority INTEGER DEFAULT 1, -- 1=low, 5=urgent
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    deadline TIMESTAMPTZ,
    
    -- Task data and results
    task_data JSONB DEFAULT '{}',
    task_result JSONB DEFAULT '{}',
    error_message TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent Communications table
CREATE TABLE agent_communications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES ai_agents(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    
    -- Communication details
    communication_type VARCHAR(50) NOT NULL, -- 'message', 'call', 'email', 'insight', 'recommendation'
    content TEXT NOT NULL,
    direction VARCHAR(10) DEFAULT 'outbound', -- 'inbound', 'outbound'
    
    -- Language and context
    language VARCHAR(10) DEFAULT 'english',
    sentiment_score DECIMAL(3,2), -- -1.00 to 1.00
    intent VARCHAR(100),
    
    -- Metadata and tracking
    metadata JSONB DEFAULT '{}',
    response_time_seconds INTEGER,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent Metrics (daily aggregates)
CREATE TABLE agent_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES ai_agents(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    
    -- Task metrics
    tasks_assigned INTEGER DEFAULT 0,
    tasks_completed INTEGER DEFAULT 0,
    tasks_failed INTEGER DEFAULT 0,
    avg_completion_time_minutes INTEGER DEFAULT 0,
    
    -- Communication metrics
    messages_sent INTEGER DEFAULT 0,
    messages_received INTEGER DEFAULT 0,
    calls_made INTEGER DEFAULT 0,
    emails_sent INTEGER DEFAULT 0,
    
    -- Performance metrics
    success_rate DECIMAL(5,2) DEFAULT 0.00,
    avg_response_time_seconds INTEGER DEFAULT 0,
    client_satisfaction_score DECIMAL(3,2), -- 1.00 to 5.00
    
    -- AI-specific metrics
    ai_confidence_avg DECIMAL(3,2), -- 0.00 to 1.00
    automation_accuracy DECIMAL(5,2) DEFAULT 0.00,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(agent_id, date)
);

-- Voice Calls enhancement (add agent_id reference)
ALTER TABLE voice_calls ADD COLUMN agent_id UUID REFERENCES ai_agents(id) ON DELETE SET NULL;

-- Add indexes for performance
CREATE INDEX idx_ai_agents_client_id ON ai_agents(client_id);
CREATE INDEX idx_ai_agents_type ON ai_agents(agent_type);
CREATE INDEX idx_ai_agents_status ON ai_agents(agent_status);
CREATE INDEX idx_agent_tasks_agent_id ON agent_tasks(agent_id);
CREATE INDEX idx_agent_tasks_status ON agent_tasks(task_status);
CREATE INDEX idx_agent_tasks_priority ON agent_tasks(priority DESC);
CREATE INDEX idx_agent_communications_agent_id ON agent_communications(agent_id);
CREATE INDEX idx_agent_communications_type ON agent_communications(communication_type);
CREATE INDEX idx_agent_metrics_agent_date ON agent_metrics(agent_id, date);

-- Enable RLS for multi-tenant security
ALTER TABLE ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_metrics ENABLE ROW LEVEL SECURITY;

-- Update triggers for ai_agents
CREATE TRIGGER update_ai_agents_updated_at 
    BEFORE UPDATE ON ai_agents 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agent_tasks_updated_at 
    BEFORE UPDATE ON agent_tasks 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SAMPLE AI AGENTS DATA
-- =====================================================

-- Get the demo client ID for inserting sample agents
DO $$
DECLARE
    demo_client_id UUID;
BEGIN
    SELECT id INTO demo_client_id 
    FROM clients 
    WHERE email = 'demo@yasta.online' 
    LIMIT 1;
    
    IF demo_client_id IS NOT NULL THEN
        -- Insert sample AI agents
        INSERT INTO ai_agents (client_id, agent_name, agent_type, agent_role, agent_avatar, specialty, capabilities, performance_metrics, tasks_completed, success_rate) VALUES
        
        -- Manager Agent
        (demo_client_id, 'Sarah Al-Mansouri', 'manager', 'Personal AI Assistant', '👩‍💼', 'Strategic Analysis & Voice Calls',
         '{"voice_calling": true, "strategic_analysis": true, "client_consultation": true, "arabic_english": true, "market_insights": true, "decision_making": true}',
         '{"calls_completed": 47, "client_satisfaction": 4.8, "response_time_avg": 120, "languages": ["English", "Arabic"], "insights_generated": 23}',
         47, 96.2),
        
        -- Coordinator Agents
        (demo_client_id, 'Alex Thompson', 'coordinator', 'Pipeline Coordinator', '👨‍💻', 'Lead-to-Closing Orchestration',
         '{"lead_routing": true, "workflow_orchestration": true, "performance_monitoring": true, "pipeline_management": true, "team_coordination": true}',
         '{"leads_processed": 342, "conversion_rate": 23.5, "pipeline_efficiency": 94.2, "workflows_managed": 15}',
         342, 87.3),
        
        (demo_client_id, 'Maya Patel', 'coordinator', 'Campaign Coordinator', '👩‍🎨', 'Marketing Automation Management',
         '{"email_campaigns": true, "social_media": true, "content_creation": true, "analytics": true, "multi_channel": true}',
         '{"campaigns_managed": 15, "open_rate": 45.3, "click_rate": 12.7, "roi_percentage": 340, "content_pieces": 89}',
         89, 91.5),
        
        -- Basic Agents
        (demo_client_id, 'Omar Hassan', 'basic', 'Lead Qualification Specialist', '🎯', '24/7 Prospect Processing',
         '{"whatsapp_automation": true, "lead_scoring": true, "language_detection": true, "qualification": true, "real_time_response": true}',
         '{"leads_qualified": 189, "accuracy_rate": 87.3, "response_time_avg": 30, "languages_handled": 2}',
         189, 87.3),
        
        (demo_client_id, 'Layla Ahmed', 'basic', 'Follow-up Specialist', '💌', 'Personalized Nurturing Sequences',
         '{"email_sequences": true, "personalization": true, "nurturing": true, "behavioral_triggers": true, "content_optimization": true}',
         '{"sequences_sent": 1247, "engagement_rate": 34.8, "conversion_rate": 18.9, "personalization_score": 92}',
         1247, 89.7),
        
        (demo_client_id, 'Ahmed Khalil', 'basic', 'Appointment Coordinator', '📅', 'Smart Scheduling Coordination',
         '{"calendar_management": true, "scheduling": true, "reminders": true, "confirmations": true, "timezone_handling": true}',
         '{"appointments_scheduled": 156, "show_up_rate": 89.7, "satisfaction_score": 4.9, "conflicts_resolved": 23}',
         156, 89.7);

        -- Insert sample agent communications
        INSERT INTO agent_communications (agent_id, communication_type, content, language, metadata) 
        SELECT 
            a.id,
            'insight',
            CASE a.agent_name 
                WHEN 'Sarah Al-Mansouri' THEN 'مرحباً! لقد حللت أداء الأسبوع الماضي. معدل تحويل العملاء المحتملين تحسن بنسبة 15%. النهج الأكثر فعالية كان الرسائل ثنائية اللغة العربية-الإنجليزية.

Hello! I''ve analyzed last week''s performance. Your lead conversion rate improved by 15%. The most effective approach was the Arabic-English bilingual messaging.'
                WHEN 'Alex Thompson' THEN 'Pipeline status update: 23 leads in qualification stage, 8 in viewing phase, 5 in negotiation. Recommend prioritizing the DIFC luxury inquiry - high conversion probability.'
                WHEN 'Maya Patel' THEN 'Campaign performance: Downtown Dubai property campaign achieved 34% engagement rate. Suggest expanding budget by 25% for maximum ROI.'
                ELSE 'Agent ready and operational. Monitoring assigned channels for new activity.'
            END,
            CASE WHEN a.agent_name = 'Sarah Al-Mansouri' THEN 'bilingual' ELSE 'english' END,
            '{"message_type": "status_update", "priority": "normal", "requires_action": false}'
        FROM ai_agents a 
        WHERE a.client_id = demo_client_id;

        RAISE NOTICE 'Sample AI agents inserted successfully for demo client';
    ELSE
        RAISE NOTICE 'Demo client not found. Please ensure the demo client exists first.';
    END IF;
END $$;

-- =====================================================
-- AGENT PERFORMANCE FUNCTIONS
-- =====================================================

-- Function to update agent performance metrics
CREATE OR REPLACE FUNCTION update_agent_performance(agent_uuid UUID)
RETURNS VOID AS $$
DECLARE
    completed_tasks INTEGER;
    total_tasks INTEGER;
    avg_response_time INTEGER;
BEGIN
    -- Calculate completed tasks
    SELECT COUNT(*) INTO completed_tasks
    FROM agent_tasks
    WHERE agent_id = agent_uuid AND task_status = 'completed'
    AND created_at >= CURRENT_DATE - INTERVAL '30 days';
    
    -- Calculate total tasks
    SELECT COUNT(*) INTO total_tasks
    FROM agent_tasks
    WHERE agent_id = agent_uuid
    AND created_at >= CURRENT_DATE - INTERVAL '30 days';
    
    -- Calculate average response time
    SELECT AVG(response_time_seconds) INTO avg_response_time
    FROM agent_communications
    WHERE agent_id = agent_uuid
    AND created_at >= CURRENT_DATE - INTERVAL '30 days';
    
    -- Update agent metrics
    UPDATE ai_agents SET
        tasks_completed = completed_tasks,
        success_rate = CASE WHEN total_tasks > 0 THEN (completed_tasks::DECIMAL / total_tasks) * 100 ELSE 0 END,
        performance_metrics = performance_metrics || 
            jsonb_build_object(
                'tasks_30_days', completed_tasks,
                'success_rate_30_days', CASE WHEN total_tasks > 0 THEN (completed_tasks::DECIMAL / total_tasks) * 100 ELSE 0 END,
                'avg_response_time', COALESCE(avg_response_time, 0),
                'last_updated', NOW()
            ),
        updated_at = NOW()
    WHERE id = agent_uuid;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- VIEWS FOR AI AGENT DASHBOARD
-- =====================================================

-- Agent hierarchy view
CREATE VIEW agent_hierarchy AS
SELECT 
    a.id,
    a.client_id,
    a.agent_name,
    a.agent_type,
    a.agent_role,
    a.agent_status,
    a.agent_avatar,
    a.specialty,
    a.tasks_completed,
    a.success_rate,
    a.last_activity,
    a.capabilities,
    a.performance_metrics,
    CASE a.agent_type
        WHEN 'manager' THEN 1
        WHEN 'coordinator' THEN 2
        WHEN 'basic' THEN 3
        ELSE 4
    END as hierarchy_level
FROM ai_agents a
WHERE a.is_active = true
ORDER BY hierarchy_level, a.agent_name;

-- Team performance summary
CREATE VIEW team_performance_summary AS
SELECT 
    client_id,
    COUNT(*) as total_agents,
    COUNT(CASE WHEN agent_status = 'active' THEN 1 END) as active_agents,
    COUNT(CASE WHEN agent_status = 'busy' THEN 1 END) as busy_agents,
    COUNT(CASE WHEN agent_status = 'offline' THEN 1 END) as offline_agents,
    SUM(tasks_completed) as total_tasks_completed,
    AVG(success_rate) as avg_success_rate,
    MAX(last_activity) as last_team_activity
FROM ai_agents
WHERE is_active = true
GROUP BY client_id;

COMMIT;
