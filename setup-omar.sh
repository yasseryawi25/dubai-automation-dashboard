#!/bin/bash

# Omar Lead Qualification Agent - Complete Setup Script
# This script sets up the backend API server and tests database connectivity

echo "🎯 Setting up Omar (Lead Qualification Agent) - Backend API Server"
echo "=================================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Step 1: Install API server dependencies
echo "📦 Step 1: Installing backend API dependencies..."
if [ -f "api-package.json" ]; then
    cp api-package.json package-api.json
    echo "✅ API package configuration ready"
else
    echo "❌ Error: api-package.json not found"
    exit 1
fi

# Create separate directory for API server
mkdir -p api
cp api-server.ts api/
cp tsconfig.api.json api/tsconfig.json
cp .env.api.example api/.env.example

cd api

# Initialize if needed
if [ ! -f "package.json" ]; then
    cp ../package-api.json package.json
fi

# Install dependencies
echo "Installing Node.js dependencies..."
npm install

echo "✅ Backend dependencies installed"

# Step 2: Environment setup
echo ""
echo "⚙️ Step 2: Environment configuration..."

if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "📝 Created .env file from template"
    echo "⚠️  IMPORTANT: You need to update the database password in api/.env"
    echo "   Edit the DB_PASSWORD value with your actual Coolify PostgreSQL password"
else
    echo "✅ .env file already exists"
fi

# Step 3: Database connectivity test
echo ""
echo "🗄️ Step 3: Testing database connectivity..."

# Create a simple test script
cat > test-db.js << 'EOF'
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'automation-postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'automation_platform',
  user: process.env.DB_USER || 'automation_user',
  password: process.env.DB_PASSWORD || '',
});

async function testConnection() {
  try {
    console.log('🔌 Testing database connection...');
    console.log(`Host: ${process.env.DB_HOST || 'automation-postgres'}`);
    console.log(`Database: ${process.env.DB_NAME || 'automation_platform'}`);
    console.log(`User: ${process.env.DB_USER || 'automation_user'}`);
    
    const client = await pool.connect();
    console.log('✅ Database connection successful!');
    
    // Test if ai_agents table exists
    const result = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'ai_agents'
    `);
    
    if (result.rows.length > 0) {
      console.log('✅ AI Agents table found');
      
      // Count agents
      const agentCount = await client.query('SELECT COUNT(*) FROM ai_agents');
      console.log(`✅ Found ${agentCount.rows[0].count} AI agents in database`);
      
      // Check for Omar specifically
      const omar = await client.query(`
        SELECT agent_name, agent_status FROM ai_agents 
        WHERE agent_name LIKE '%Omar%' AND agent_role LIKE '%Lead%'
      `);
      
      if (omar.rows.length > 0) {
        console.log(`✅ Omar Hassan (Lead Qualification Agent) found - Status: ${omar.rows[0].agent_status}`);
      } else {
        console.log('⚠️  Omar Hassan not found - you may need to run the database setup SQL');
      }
      
    } else {
      console.log('⚠️  AI Agents table not found - you need to run the database schema setup');
    }
    
    client.release();
    await pool.end();
    
    console.log('');
    console.log('🎯 Database test completed successfully!');
    console.log('🚀 Ready to start the API server with: npm run dev');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting steps:');
    console.log('1. Check your .env file has the correct database password');
    console.log('2. Ensure your Coolify PostgreSQL service is running');
    console.log('3. Verify network connectivity to the database');
    console.log('4. Check if the database schema has been loaded');
    process.exit(1);
  }
}

testConnection();
EOF

# Run the database test
echo "Running database connectivity test..."
node test-db.js

# Cleanup
rm test-db.js

echo ""
echo "🎉 Setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Update api/.env with your actual database password"
echo "2. Start the API server: cd api && npm run dev"
echo "3. Start the frontend: npm run dev (in main directory)"
echo "4. Visit http://localhost:5173 to see Omar in action!"
echo ""
echo "🎯 Omar (Lead Qualification Agent) is ready to process leads!"
