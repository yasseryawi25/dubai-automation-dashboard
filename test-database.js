// Database Connection Test Script
// Run this to verify your database connection before starting the full app

const { Pool } = require('pg');
require('dotenv').config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'automation_platform',
  user: process.env.DB_USER || 'automation_user',
  password: process.env.DB_PASSWORD || '',
  connectionTimeoutMillis: 5000, // 5 second timeout
};

console.log('🎯 Omar Lead Qualification Agent - Database Test');
console.log('================================================');
console.log('');

async function testDatabaseConnection() {
  const pool = new Pool(dbConfig);
  
  try {
    console.log('🔌 Testing database connection...');
    console.log(`   Host: ${dbConfig.host}:${dbConfig.port}`);
    console.log(`   Database: ${dbConfig.database}`);
    console.log(`   User: ${dbConfig.user}`);
    console.log('');

    // Test basic connection
    const client = await pool.connect();
    console.log('✅ Database connection successful!');

    // Test if required tables exist
    console.log('🔍 Checking database schema...');
    
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('ai_agents', 'agent_tasks', 'agent_communications', 'leads')
      ORDER BY table_name
    `);

    console.log(`   Found ${tables.rows.length}/4 required tables:`);
    tables.rows.forEach(row => {
      console.log(`   ✅ ${row.table_name}`);
    });

    if (tables.rows.length < 4) {
      console.log('   ⚠️  Missing tables - you may need to run the database schema setup');
    }

    // Test for Omar specifically
    console.log('');
    console.log('🎯 Checking for Omar Hassan (Lead Qualification Agent)...');
    
    const omar = await client.query(`
      SELECT 
        id,
        agent_name,
        agent_type,
        agent_role,
        agent_status,
        tasks_completed,
        success_rate,
        last_activity
      FROM ai_agents 
      WHERE agent_name LIKE '%Omar%' 
      AND agent_role LIKE '%Lead%'
      LIMIT 1
    `);

    if (omar.rows.length > 0) {
      const agent = omar.rows[0];
      console.log('   ✅ Omar Hassan found!');
      console.log(`      ID: ${agent.id}`);
      console.log(`      Status: ${agent.agent_status}`);
      console.log(`      Tasks Completed: ${agent.tasks_completed}`);
      console.log(`      Success Rate: ${agent.success_rate}%`);
      console.log(`      Last Activity: ${agent.last_activity}`);

      // Check for recent tasks
      const tasks = await client.query(`
        SELECT COUNT(*) as count
        FROM agent_tasks 
        WHERE agent_id = $1 
        AND created_at >= CURRENT_DATE - INTERVAL '7 days'
      `, [agent.id]);

      console.log(`      Recent Tasks (7 days): ${tasks.rows[0].count}`);

      // Check for recent communications
      const communications = await client.query(`
        SELECT COUNT(*) as count
        FROM agent_communications 
        WHERE agent_id = $1 
        AND created_at >= CURRENT_DATE - INTERVAL '7 days'
      `, [agent.id]);

      console.log(`      Recent Communications (7 days): ${communications.rows[0].count}`);

    } else {
      console.log('   ⚠️  Omar Hassan not found');
      console.log('   💡 You may need to run the lead_qualification_agent_setup.sql script');
    }

    // Test sample query that the API will use
    console.log('');
    console.log('🔧 Testing API queries...');
    
    const agentCount = await client.query(`
      SELECT 
        agent_type,
        COUNT(*) as count,
        AVG(success_rate) as avg_success_rate
      FROM ai_agents 
      WHERE is_active = true 
      GROUP BY agent_type
      ORDER BY agent_type
    `);

    console.log('   Agent summary:');
    agentCount.rows.forEach(row => {
      console.log(`   ${row.agent_type}: ${row.count} agents, ${Math.round(row.avg_success_rate)}% avg success`);
    });

    client.release();
    await pool.end();

    console.log('');
    console.log('🎉 Database test completed successfully!');
    console.log('');
    console.log('🚀 Next steps:');
    console.log('   1. Start the API server: npm run dev');
    console.log('   2. Start the frontend with real data: VITE_MOCK_DATA=false npm run dev');
    console.log('   3. Visit http://localhost:5173 to see Omar in action!');

  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting checklist:');
    console.log('   1. Check that your .env file has the correct database credentials');
    console.log('   2. Verify your Coolify PostgreSQL service is running');
    console.log('   3. Ensure you can connect to the database from your machine');
    console.log('   4. Check if the database schema has been loaded');
    console.log('   5. Verify network connectivity (firewalls, ports, etc.)');
    console.log('');
    console.log('   Database config being used:');
    console.log(`   - Host: ${dbConfig.host}`);
    console.log(`   - Port: ${dbConfig.port}`);
    console.log(`   - Database: ${dbConfig.database}`);
    console.log(`   - User: ${dbConfig.user}`);
    console.log(`   - Password: ${dbConfig.password ? '[SET]' : '[NOT SET]'}`);
    
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Database test interrupted');
  process.exit(0);
});

// Run the test
testDatabaseConnection();