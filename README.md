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
VITE_DATABASE_URL=postgresql://user:pass@host:5432/db
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

- **Real-time Agent Status** - Monitor all 6 AI agents
- **Manager Agent Chat** - Direct communication with AI manager
- **Performance Metrics** - Track tasks, communications, efficiency
- **Voice Call Integration** - VAPI integration for voice calling
- **Responsive Design** - Works on desktop and mobile
- **Professional UI** - Clean, modern interface

## 🔮 Upcoming Features (Day 7-8)

- **n8n Workflow Integration** - Connect to backend automation
- **VAPI Voice Agent** - Complete voice calling functionality  
- **Real-time Database** - Live updates from PostgreSQL
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
- AI Agent dashboard with 6 specialized agents
- Manager Agent chat interface
- Professional responsive design
- TypeScript implementation
- Database integration foundation

**🔄 In Progress (Day 7):**
- n8n workflow integration
- Real database connectivity
- Advanced agent features

**📋 Planned (Day 8):**
- VAPI voice agent integration
- Advanced performance analytics
- Multi-client deployment system

## 📞 Support

For technical support or questions about the AI Agent Team platform, please contact the development team.

---

**Dubai Real Estate AI Agent Team** - Revolutionizing property sales with artificial intelligence.