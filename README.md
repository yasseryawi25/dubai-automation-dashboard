# Dubai Real Estate AI Agent Team Dashboard

A sophisticated AI Agent Team management platform for Dubai real estate professionals, featuring Manager, Coordinator, and Specialist AI agents.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Access to PostgreSQL database (local or remote)

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start development server:**
```bash
npm run dev
```

4. **Open in browser:**
```
http://localhost:5173
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── layout/          # Header, Sidebar, Layout
│   └── features/        # AI Agent components
│       ├── AgentCard.tsx
│       ├── AgentDashboard.tsx
│       └── ManagerAgentChat.tsx
├── services/            # API services
│   └── agentAPI.ts
├── types/               # TypeScript definitions
│   └── index.ts
├── App.tsx              # Main application
└── main.tsx             # Entry point
```

## 🤖 AI Agent Team Features

### Manager Agents
- **Sarah** - Strategic consultation with voice calling
- Personal AI assistant for performance analysis
- Real-time business insights and recommendations

### Coordinator Agents  
- **Alex** - Pipeline Coordinator for workflow orchestration
- **Maya** - Campaign Coordinator for marketing automation

### Specialist Agents
- **Omar** - Lead Qualification Agent
- **Layla** - Follow-up Specialist  
- **Ahmed** - Appointment Agent

## 🔧 Configuration

### Environment Variables
```bash
VITE_API_URL=http://localhost:3001
VITE_APP_NAME=AI Real Estate Team
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_VAPI_API_KEY=your_vapi_api_key
VITE_CLIENT_ID=demo_client
```

### Database Setup
The application expects these PostgreSQL tables:
- `ai_agents` - Agent definitions
- `agent_tasks` - Task management
- `agent_metrics` - Performance tracking
- `agent_communications` - Chat history
- `client_agent_settings` - Client configuration

## 📱 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎯 Key Features

- **Enhanced Comprehensive Demo** - Complete business value showcase with ROI calculator
- **Real-time Agent Status** - Monitor all 6 AI agents with live Supabase data
- **Manager Agent Chat** - Direct communication with AI manager (voice-enabled)
- **Live Simulation** - Interactive demonstration of agent coordination
- **Performance Metrics** - Track tasks, communications, efficiency with real-time updates
- **Voice Call Integration** - VAPI integration for voice calling
- **Business Value Calculator** - ROI analysis comparing AI vs human team costs
- **Responsive Design** - Works on desktop and mobile
- **Professional UI** - Clean, modern interface optimized for client presentations

## 🎯 Enhanced Demo Features

### 🚀 Business Value Demonstration
- **ROI Calculator** - Compare AED 22,000 human team vs AED 1,497 AI team
- **Interactive Cost Analysis** - Step-by-step business case presentation
- **Performance Metrics** - Side-by-side human vs AI comparison
- **Savings Timeline** - Annual ROI projection with real numbers

### 🤖 Live Agent Simulation
- **Real-time Workflow** - Watch AI agents process leads in 5 minutes vs 2-4 hours human time
- **Agent Coordination** - See how 6 agents work together seamlessly
- **Step-by-step Process** - From WhatsApp lead to scheduled appointment
- **Visual Timeline** - Interactive demonstration with timing

### 📊 Technical Integration Showcase
- **Supabase Real-time** - Live database connectivity demonstration
- **VAPI Voice Calling** - Manager Agent voice consultation capability
- **System Health Monitoring** - Real-time status of all integrations
- **Mobile Responsive** - Perfect for iPad presentations in meetings

### 📱 Presentation Features
- **Auto-advance Mode** - Hands-free demonstration capability
- **Interactive Navigation** - Jump to any section instantly
- **Professional Design** - Optimized for client presentations
- **Offline Fallback** - Works without internet for reliable demos

## 🔮 Upcoming Features (Day 7-8)

- **n8n Workflow Integration** - Connect to backend automation
- **Advanced Analytics** - Performance reporting
- **Multi-client Support** - Agency management features

## 🏢 Business Value

This platform replaces a **AED 22,000/month human team** with **AED 1,497/month AI agents**:

- **93% cost savings** for real estate professionals
- **24/7 operation** - never miss a lead
- **Consistent performance** - no human errors
- **Scalable growth** - add agents as needed

## 🛠️ Development Status

**✅ Completed (Day 6):**
- ✅ Enhanced Comprehensive Demo Page with business value showcase
- ✅ ROI Calculator with AED 22,000 vs AED 1,497 comparison
- ✅ Live Agent Simulation with real-time coordination
- ✅ Supabase real-time database integration
- ✅ AI Agent dashboard with 6 specialized agents
- ✅ Manager Agent chat interface with voice calling preparation
- ✅ Professional responsive design optimized for presentations
- ✅ TypeScript implementation with full type safety
- ✅ Database integration with real-time updates
- ✅ Mobile-responsive design for iPad presentations

**🔄 In Progress (Day 7):**
- n8n workflow integration for backend automation
- Advanced agent coordination features
- Enhanced voice calling with VAPI

**📋 Planned (Day 8):**
- Multi-client deployment system
- Advanced performance analytics
- Enterprise-grade scaling features

## 📞 Support

For technical support or questions about the AI Agent Team platform, please contact the development team.

---

**Dubai Real Estate AI Agent Team** - Revolutionizing property sales with artificial intelligence.

# Dubai Real Estate CRM - Supabase Database Validation & Diagnostics

A comprehensive validation and troubleshooting system for your custom Supabase real estate CRM application.

## 🏗️ Overview

This application provides extensive tools to validate, monitor, and troubleshoot your Supabase database connection, ensuring your real estate CRM operates at peak performance.

## 🚀 Features

### 🔍 Health Check System
- **Comprehensive Health Check**: Tests connectivity, authentication, database tables, API endpoints, CORS, SSL, and real-time subscriptions
- **Quick Health Check**: Fast status check for dashboard integration
- **Auto-refresh**: Continuous monitoring with configurable intervals
- **Detailed Reporting**: Comprehensive status reports with troubleshooting guides

### 🛠️ Connection Testing
- **Database Connection Tester**: Multi-suite testing framework
- **Schema Validation**: Validates table structure, foreign keys, RLS policies, and permissions
- **Performance Analysis**: Analyzes query performance, indexes, and optimization opportunities
- **API Endpoint Testing**: Tests all REST API endpoints and real-time subscriptions

### 📊 Diagnostics & Monitoring
- **Real-time Diagnostics**: Live connection monitoring and metrics
- **Performance Metrics**: Response time tracking, uptime monitoring, and trend analysis
- **Alert System**: Automatic alerts for connection issues and performance problems
- **Historical Data**: Connection history and performance trends

### 🔧 Troubleshooting Tools
- **Automated Troubleshooting**: AI-powered issue detection and resolution guides
- **Step-by-step Solutions**: Detailed troubleshooting steps for common issues
- **Code Examples**: Working code examples for fixes and optimizations
- **Prevention Tips**: Best practices to prevent future issues

## 🏠 Real Estate CRM Specific Features

### Database Schema Validation
- Validates all critical tables: `leads`, `property_listings`, `ai_agents`, `whatsapp_messages`, etc.
- Checks foreign key relationships for lead assignments and property matching
- Verifies RLS policies for multi-tenant security
- Ensures proper indexing for performance

### Performance Optimization
- Analyzes query performance for lead management operations
- Identifies missing indexes for property searches and lead filtering
- Optimizes real-time subscriptions for WhatsApp message tracking
- Provides recommendations for AI agent task processing

### Security Validation
- Validates API key configuration and JWT token handling
- Checks CORS configuration for frontend access
- Verifies SSL certificate validity
- Ensures proper authentication flow

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Custom Supabase instance at `https://supabase.yasta.online`

### Environment Variables
```env
VITE_SUPABASE_URL=https://supabase.yasta.online
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_SUPABASE_SERVICE_KEY=your_service_key_here
```

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd dubai-automation-dashboard

# Install dependencies
npm install

# Start development server
npm run dev

# Run database tests
npm run db:test

# Run comprehensive diagnostics
npm run db:diagnose
```

## 📋 Usage

### 1. Health Check Dashboard
```typescript
import { SupabaseHealthCheck } from './components/common'

// Basic health check
<SupabaseHealthCheck />

// With auto-refresh and detailed reporting
<SupabaseHealthCheck 
  showDetails={true} 
  autoRefresh={true} 
  refreshInterval={30000}
  onHealthChange={(healthy) => console.log('Health status:', healthy)}
/>
```

### 2. Connection Testing
```typescript
import { DatabaseConnectionTester } from './components/common'

// Run comprehensive connection tests
<DatabaseConnectionTester />
```

### 3. Real-time Diagnostics
```typescript
import { ConnectionDiagnostics } from './components/common'

// Start monitoring with real-time metrics
<ConnectionDiagnostics />
```

### 4. Programmatic Validation
```typescript
import { 
  runComprehensiveHealthCheck, 
  validateDatabaseSchema, 
  analyzePerformance 
} from './utils'

// Run health check
const healthResult = await runComprehensiveHealthCheck()

// Validate schema
const schemaResult = await validateDatabaseSchema()

// Analyze performance
const performanceResult = await analyzePerformance()
```

## 🔧 Troubleshooting Common Issues

### Connection Issues
1. **CORS Errors**: Check CORS configuration in Supabase dashboard
2. **Authentication Failures**: Verify API keys and JWT token format
3. **Network Timeouts**: Check firewall and DNS configuration
4. **SSL Certificate Issues**: Verify certificate validity and domain configuration

### Database Issues
1. **Missing Tables**: Run schema validation and create missing tables
2. **RLS Policy Problems**: Check Row Level Security policies
3. **Permission Errors**: Verify database user permissions
4. **Foreign Key Violations**: Check referential integrity

### Performance Issues
1. **Slow Queries**: Add missing indexes identified by performance analysis
2. **High Response Times**: Implement query optimization and caching
3. **Connection Pool Exhaustion**: Adjust connection pool settings
4. **Memory Issues**: Optimize query patterns and implement pagination

## 📊 Monitoring & Alerts

### Health Check Metrics
- **Connectivity**: Network connectivity and DNS resolution
- **Authentication**: API key validation and JWT token handling
- **Database Tables**: Schema integrity and table accessibility
- **API Endpoints**: REST API functionality and real-time subscriptions
- **CORS Configuration**: Cross-origin request handling
- **SSL Certificate**: HTTPS certificate validation
- **Real-time Subscriptions**: WebSocket connectivity and event handling

### Performance Metrics
- **Response Time**: Average query response time
- **Uptime**: Connection availability percentage
- **Error Rate**: Failed requests and error frequency
- **Resource Utilization**: Connection pool and cache usage

### Alert Thresholds
- **Critical**: Connection down, authentication failures, schema errors
- **Warning**: Slow response times, high resource utilization
- **Info**: Performance optimizations, configuration changes

## 🏗️ Architecture

### Components
- **SupabaseHealthCheck**: Comprehensive health monitoring
- **DatabaseConnectionTester**: Multi-suite connection testing
- **ConnectionDiagnostics**: Real-time diagnostics and metrics
- **TroubleshootingGuide**: Automated issue resolution

### Utilities
- **supabaseHealthCheck**: Core health check functionality
- **databaseValidator**: Schema validation and integrity checks
- **performanceOptimizer**: Performance analysis and optimization
- **troubleshootingGuide**: Issue detection and resolution

### Database Schema
The application validates the following real estate CRM schema:

```sql
-- Core tables
client_profiles (id, name, email, subscription_plan, ...)
leads (id, client_id, name, status, assigned_agent, ...)
property_listings (id, client_id, title, property_type, price, ...)
ai_agents (id, client_id, name, type, status, ...)

-- Communication tables
whatsapp_messages (id, client_id, lead_id, message_content, ...)
email_campaigns (id, client_id, name, status, ...)

-- Workflow tables
automation_workflows (id, client_id, name, type, ...)
agent_tasks (id, client_id, agent_id, task_type, ...)

-- Analytics tables
analytics_events (id, client_id, event_type, ...)
agent_metrics_daily (id, client_id, agent_id, tasks_completed, ...)
```

## 🔒 Security Considerations

### API Key Management
- Store API keys in environment variables
- Use different keys for different environments
- Rotate keys regularly
- Monitor key usage and access patterns

### Database Security
- Implement Row Level Security (RLS) policies
- Use service role key only for admin operations
- Validate user permissions before data access
- Monitor database access logs

### Network Security
- Use HTTPS for all connections
- Validate SSL certificates
- Implement proper CORS policies
- Monitor network traffic for anomalies

## 📈 Performance Optimization

### Database Optimization
- Add indexes for frequently queried columns
- Implement query result caching
- Use materialized views for analytics
- Optimize table partitioning for large datasets

### Application Optimization
- Implement connection pooling
- Use pagination for large result sets
- Optimize real-time subscriptions
- Implement proper error handling and retry logic

### Monitoring Optimization
- Set appropriate monitoring intervals
- Implement alert thresholds
- Use historical data for trend analysis
- Regular performance reviews and optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the troubleshooting guides in the application
- Review the documentation
- Open an issue on GitHub
- Contact the development team

## 🔄 Updates

Stay updated with the latest features and improvements:
- Monitor the repository for updates
- Check the changelog for version history
- Subscribe to release notifications
- Follow best practices for database management

---

**Built with ❤️ for the Dubai Real Estate CRM Platform**