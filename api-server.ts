// Backend API Server for Real Estate AI Agents Platform
// This server connects the frontend dashboard to PostgreSQL database

import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://demo.yasta.online'],
  credentials: true
}));
app.use(express.json());

// PostgreSQL connection
const pool = new pg.Pool({
  host: process.env.DB_HOST || 'automation-postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'automation_platform',
  user: process.env.DB_USER || 'automation_user',
  password: process.env.DB_PASSWORD,
  ssl: false, // Set to true for production
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test database connection
async function testDatabaseConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Database connected successfully');
    
    // Test basic query
    const result = await client.query('SELECT NOW() as current_time, COUNT(*) as agent_count FROM ai_agents');
    console.log('📊 Database status:', result.rows[0]);
    
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Helper function to convert database rows to AI Agent format
function formatAgent(row: any) {
  return {
    id: row.id,
    name: row.agent_name,
    type: row.agent_type,
    role: row.agent_role,
    status: row.agent_status,
    avatar: row.agent_avatar,
    specialty: row.specialty,
    capabilities: row.capabilities || {},
    performanceMetrics: row.performance_metrics || {},
    tasksCompleted: row.tasks_completed || 0,
    successRate: parseFloat(row.success_rate) || 0,
    lastActivity: row.last_activity,
    createdAt: row.created_at,
    isActive: row.is_active
  };
}

// Helper function to format communications
function formatCommunication(row: any) {
  return {
    id: row.id,
    agentId: row.agent_id,
    leadId: row.lead_id,
    type: row.communication_type,
    content: row.content,
    direction: row.direction,
    language: row.language,
    timestamp: row.created_at,
    metadata: row.metadata || {}
  };
}

// Helper function to format tasks
function formatTask(row: any) {
  return {
    id: row.id,
    agentId: row.agent_id,
    leadId: row.lead_id,
    type: row.task_type,
    title: row.task_title,
    description: row.task_description,
    status: row.task_status,
    priority: getPriorityFromNumber(row.priority),
    createdAt: row.created_at,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    deadline: row.deadline,
    taskData: row.task_data || {},
    taskResult: row.task_result || {}
  };
}

function getPriorityFromNumber(priority: number): string {
  switch (priority) {
    case 5: return 'urgent';
    case 4: return 'high';
    case 3: return 'medium';
    case 2: return 'low';
    default: return 'low';
  }
}

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Get all agents
app.get('/api/agents', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id, agent_name, agent_type, agent_role, agent_status, 
        agent_avatar, specialty, capabilities, performance_metrics,
        tasks_completed, success_rate, last_activity, created_at, is_active
      FROM ai_agents 
      WHERE is_active = true 
      ORDER BY 
        CASE agent_type 
          WHEN 'manager' THEN 1 
          WHEN 'coordinator' THEN 2 
          WHEN 'basic' THEN 3 
          ELSE 4 
        END, 
        agent_name
    `);

    const agents = result.rows.map(formatAgent);
    res.json(agents);
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
});

// Get specific agent
app.get('/api/agents/:agentId', async (req, res) => {
  try {
    const { agentId } = req.params;
    const result = await pool.query(`
      SELECT 
        id, agent_name, agent_type, agent_role, agent_status, 
        agent_avatar, specialty, capabilities, performance_metrics,
        tasks_completed, success_rate, last_activity, created_at, is_active
      FROM ai_agents 
      WHERE id = $1 AND is_active = true
    `, [agentId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const agent = formatAgent(result.rows[0]);
    res.json(agent);
  } catch (error) {
    console.error('Error fetching agent:', error);
    res.status(500).json({ error: 'Failed to fetch agent' });
  }
});

// Update agent status
app.put('/api/agents/:agentId/status', async (req, res) => {
  try {
    const { agentId } = req.params;
    const { status } = req.body;

    if (!['active', 'busy', 'offline'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const result = await pool.query(`
      UPDATE ai_agents 
      SET agent_status = $1, updated_at = NOW() 
      WHERE id = $2 AND is_active = true
      RETURNING id, agent_status
    `, [status, agentId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    res.json({ success: true, status: result.rows[0].agent_status });
  } catch (error) {
    console.error('Error updating agent status:', error);
    res.status(500).json({ error: 'Failed to update agent status' });
  }
});

// Get agent communications
app.get('/api/agents/:agentId/communications', async (req, res) => {
  try {
    const { agentId } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;
    
    const result = await pool.query(`
      SELECT 
        id, agent_id, lead_id, communication_type, content, 
        direction, language, sentiment_score, intent, metadata, 
        response_time_seconds, created_at
      FROM agent_communications 
      WHERE agent_id = $1 
      ORDER BY created_at DESC 
      LIMIT $2
    `, [agentId, limit]);

    const communications = result.rows.map(formatCommunication);
    res.json(communications);
  } catch (error) {
    console.error('Error fetching communications:', error);
    res.status(500).json({ error: 'Failed to fetch communications' });
  }
});

// Send message to agent (create communication record)
app.post('/api/agents/:agentId/message', async (req, res) => {
  try {
    const { agentId } = req.params;
    const { content, type = 'message' } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    // Insert user message
    const userMessageResult = await pool.query(`
      INSERT INTO agent_communications (
        agent_id, communication_type, content, direction, language, created_at
      ) VALUES ($1, $2, $3, 'inbound', 'english', NOW())
      RETURNING id, agent_id, communication_type, content, direction, created_at
    `, [agentId, type, content]);

    const userMessage = formatCommunication(userMessageResult.rows[0]);

    // Generate AI response based on agent
    const agentResult = await pool.query('SELECT agent_name, agent_type, agent_role, specialty FROM ai_agents WHERE id = $1', [agentId]);
    
    if (agentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const agent = agentResult.rows[0];
    let responseContent = '';

    // Generate contextual response based on agent
    if (agent.agent_name.includes('Omar')) {
      responseContent = `I'm Omar Hassan, your Lead Qualification Specialist. I've received your message: "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}". Let me analyze this for you. I specialize in ${agent.specialty} and can process this immediately. Would you like me to start the qualification process?`;
    } else if (agent.agent_name.includes('Sarah')) {
      responseContent = `مرحباً! أنا سارة المنصوري، مديرة الفريق.\n\nHello! I'm Sarah Al-Mansouri, your team manager. I understand your request regarding: "${content.substring(0, 40)}...". As your strategic advisor, I'll analyze this and provide recommendations. Would you like me to schedule a voice consultation to discuss this in detail?`;
    } else if (agent.agent_type === 'coordinator') {
      responseContent = `I'm ${agent.agent_name}, your ${agent.agent_role}. I've received your request and I'm coordinating the appropriate response. My specialty is ${agent.specialty}, so I can optimize this workflow for you. Let me orchestrate the team resources to handle: "${content.substring(0, 50)}..."`;
    } else {
      responseContent = `Hi! I'm ${agent.agent_name}, specializing in ${agent.specialty}. I've received your message and I'm ready to help. Let me process your request: "${content.substring(0, 40)}..." using my specialized capabilities.`;
    }

    // Insert agent response
    const responseResult = await pool.query(`
      INSERT INTO agent_communications (
        agent_id, communication_type, content, direction, language, 
        response_time_seconds, created_at
      ) VALUES ($1, 'response', $2, 'outbound', 'english', 2, NOW())
      RETURNING id, agent_id, communication_type, content, direction, created_at
    `, [agentId, responseContent]);

    const agentResponse = formatCommunication(responseResult.rows[0]);
    res.json(agentResponse);

  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Failed to create message' });
  }
});

// Get agent tasks
app.get('/api/agents/:agentId/tasks', async (req, res) => {
  try {
    const { agentId } = req.params;
    const limit = parseInt(req.query.limit as string) || 100;
    
    const result = await pool.query(`
      SELECT 
        id, agent_id, lead_id, task_type, task_title, task_description,
        task_status, priority, assigned_at, started_at, completed_at,
        deadline, task_data, task_result, created_at
      FROM agent_tasks 
      WHERE agent_id = $1 
      ORDER BY 
        CASE task_status 
          WHEN 'pending' THEN 1 
          WHEN 'in_progress' THEN 2 
          WHEN 'completed' THEN 3 
          ELSE 4 
        END,
        priority DESC, 
        created_at DESC 
      LIMIT $2
    `, [agentId, limit]);

    const tasks = result.rows.map(formatTask);
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Get team summary statistics
app.get('/api/team/summary', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_agents,
        COUNT(CASE WHEN agent_status = 'active' THEN 1 END) as active_agents,
        COUNT(CASE WHEN agent_status = 'busy' THEN 1 END) as busy_agents,
        COUNT(CASE WHEN agent_status = 'offline' THEN 1 END) as offline_agents,
        SUM(tasks_completed) as total_tasks_completed,
        AVG(success_rate) as avg_success_rate,
        MAX(last_activity) as last_team_activity
      FROM ai_agents 
      WHERE is_active = true
    `);

    const summary = {
      totalAgents: parseInt(result.rows[0].total_agents),
      activeAgents: parseInt(result.rows[0].active_agents),
      busyAgents: parseInt(result.rows[0].busy_agents),
      offlineAgents: parseInt(result.rows[0].offline_agents),
      totalTasksCompleted: parseInt(result.rows[0].total_tasks_completed) || 0,
      avgSuccessRate: parseFloat(result.rows[0].avg_success_rate) || 0,
      lastTeamActivity: result.rows[0].last_team_activity
    };

    res.json(summary);
  } catch (error) {
    console.error('Error fetching team summary:', error);
    res.status(500).json({ error: 'Failed to fetch team summary' });
  }
});

// Database test endpoint
app.get('/api/database/test', async (req, res) => {
  try {
    const connection = await testDatabaseConnection();
    
    if (!connection) {
      return res.status(500).json({ 
        status: 'error', 
        message: 'Database connection failed' 
      });
    }

    // Additional tests
    const tests = {
      agents: false,
      tasks: false,
      communications: false
    };

    try {
      const agentsResult = await pool.query('SELECT COUNT(*) FROM ai_agents');
      tests.agents = true;
      
      const tasksResult = await pool.query('SELECT COUNT(*) FROM agent_tasks');
      tests.tasks = true;
      
      const commsResult = await pool.query('SELECT COUNT(*) FROM agent_communications');
      tests.communications = true;

      res.json({
        status: 'success',
        connection: true,
        tables: tests,
        counts: {
          agents: parseInt(agentsResult.rows[0].count),
          tasks: parseInt(tasksResult.rows[0].count),
          communications: parseInt(commsResult.rows[0].count)
        }
      });
    } catch (tableError) {
      res.json({
        status: 'partial',
        connection: true,
        tables: tests,
        error: 'Some tables might not exist yet'
      });
    }
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ 
      status: 'error', 
      connection: false, 
      error: error.message 
    });
  }
});

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
async function startServer() {
  try {
    // Test database connection first
    const dbConnected = await testDatabaseConnection();
    
    if (!dbConnected) {
      console.warn('⚠️  Starting server without database connection');
    }

    app.listen(PORT, () => {
      console.log(`🚀 API Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🤖 Agents API: http://localhost:${PORT}/api/agents`);
      console.log(`🔧 Database test: http://localhost:${PORT}/api/database/test`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  try {
    await pool.end();
    console.log('✅ Database connections closed');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

startServer();
