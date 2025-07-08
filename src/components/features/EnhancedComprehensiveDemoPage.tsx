import React, { useState, useEffect } from 'react';
import { 
  TestTube, 
  Database, 
  Bot, 
  MessageSquare, 
  Activity, 
  Users, 
  BarChart3,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  RefreshCw,
  TrendingUp,
  DollarSign,
  Clock,
  Target,
  Zap,
  Star,
  Phone,
  Mail,
  Headphones,
  Calendar,
  FileText,
  Award,
  Shield,
  Sparkles,
  ArrowRight,
  ChevronRight
} from 'lucide-react';

// Import all our components
import SupabaseTest from '../common/SupabaseTest';
import RealTimeActivityFeed from '../common/RealTimeActivityFeed';
import IntegrationTestSuite from '../common/IntegrationTestSuite';
import ManagerAgentChat from './ManagerAgentChat';
import LeadsManagementDashboard from './LeadsManagementDashboard';
import AgentDashboard from './AgentDashboard';

// Import hooks
import { useAuth, useLeads, useWhatsAppMessages, useDashboardMetrics } from '../../hooks';
import type { AIAgent } from '../../types/agents';

interface EnhancedComprehensiveDemoPageProps {
  onVoiceCall?: (phoneNumber?: string) => void;
}

const EnhancedComprehensiveDemoPage: React.FC<EnhancedComprehensiveDemoPageProps> = ({ onVoiceCall }) => {
  const [currentDemo, setCurrentDemo] = useState<string>('overview');
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [demoStep, setDemoStep] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(false);
  
  const { user, isAuthenticated } = useAuth();
  const { leads, loading: leadsLoading } = useLeads();
  const { messages, loading: messagesLoading } = useWhatsAppMessages();
  const { metrics, loading: metricsLoading } = useDashboardMetrics();

  // Enhanced sample agents for demo
  const sampleAgents: AIAgent[] = [
    {
      id: 'sarah-manager',
      name: 'Sarah Al-Mansouri',
      type: 'manager',
      status: 'active',
      avatar: '👩‍💼',
      specialty: 'Strategic Analysis & Voice Consultation',
      lastActivity: 'Ready for voice calls - 97% client satisfaction',
      tasksCompleted: 347,
      successRate: 96.8,
      capabilities: ['voice_calls', 'market_analysis', 'strategic_planning', 'arabic_english', 'high_value_clients'],
      configuration: { language: 'bilingual', expertise_level: 'expert', specialization: 'luxury_properties' }
    },
    {
      id: 'omar-hassan',
      name: 'Omar Hassan',
      type: 'basic',
      status: 'active',
      avatar: '🎯',
      specialty: '24/7 Lead Qualification Specialist',
      lastActivity: 'Processing WhatsApp leads - 30sec avg response',
      tasksCompleted: metrics.totalLeads || 1247,
      successRate: 89.3,
      capabilities: ['whatsapp_automation', 'lead_scoring', 'language_detection', 'instant_response'],
      configuration: { qualification_criteria: 'dubai_real_estate', response_time: '< 30 seconds' }
    },
    {
      id: 'alex-coordinator',
      name: 'Alex Thompson',
      type: 'coordinator',
      status: 'busy',
      avatar: '⚡',
      specialty: 'Pipeline Coordination & Deal Management',
      lastActivity: 'Coordinating 47 active opportunities',
      tasksCompleted: 892,
      successRate: 94.1,
      capabilities: ['pipeline_management', 'deal_coordination', 'follow_up_optimization'],
      configuration: { focus: 'sales_acceleration', automation_level: 'advanced' }
    },
    {
      id: 'maya-coordinator',
      name: 'Maya Patel',
      type: 'coordinator',
      status: 'active',
      avatar: '🎨',
      specialty: 'Marketing Campaign Automation',
      lastActivity: 'Optimizing email sequences - 34% open rate',
      tasksCompleted: 156,
      successRate: 91.7,
      capabilities: ['campaign_management', 'content_optimization', 'a_b_testing', 'social_media'],
      configuration: { campaign_focus: 'nurture_sequences', optimization: 'continuous' }
    },
    {
      id: 'layla-basic',
      name: 'Layla Ahmed',
      type: 'basic',
      status: 'active',
      avatar: '💌',
      specialty: 'Follow-up & Nurture Specialist',
      lastActivity: 'Sent 89 personalized follow-ups today',
      tasksCompleted: 2341,
      successRate: 87.9,
      capabilities: ['follow_up_sequences', 'nurture_campaigns', 'engagement_tracking'],
      configuration: { sequence_type: 'personalized', timing: 'optimal' }
    },
    {
      id: 'ahmed-basic',
      name: 'Ahmed Khalil',
      type: 'basic',
      status: 'busy',
      avatar: '📅',
      specialty: 'Smart Appointment Management',
      lastActivity: 'Scheduling 12 client meetings this week',
      tasksCompleted: 678,
      successRate: 92.4,
      capabilities: ['appointment_scheduling', 'calendar_optimization', 'reminder_automation'],
      configuration: { scheduling: 'intelligent', conflicts: 'auto_resolve' }
    }
  ];

  // Auto-advance demo steps
  useEffect(() => {
    if (autoAdvance && currentDemo === 'business-case') {
      const timer = setInterval(() => {
        setDemoStep(prev => (prev + 1) % 5);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [autoAdvance, currentDemo]);

  const handleAgentSelect = (agent: AIAgent) => {
    setCurrentDemo('agent-detail');
  };

  const demos = [
    {
      id: 'overview',
      title: 'Platform Overview',
      description: 'Complete AI Agent Team dashboard with live metrics',
      icon: BarChart3,
      color: 'blue',
      highlight: true
    },
    {
      id: 'business-case',
      title: 'Business Value Demo',
      description: 'ROI calculator and cost comparison analysis',
      icon: DollarSign,
      color: 'green',
      highlight: true
    },
    {
      id: 'agents',
      title: 'AI Agent Team',
      description: 'Meet your 6-member AI team with specializations',
      icon: Bot,
      color: 'purple',
      highlight: true
    },
    {
      id: 'live-simulation',
      title: 'Live Simulation',
      description: 'Real-time agent actions and client interactions',
      icon: Zap,
      color: 'yellow',
      highlight: true
    },
    {
      id: 'leads',
      title: 'Leads Pipeline',
      description: 'Real-time leads management with Supabase data',
      icon: Users,
      color: 'orange'
    },
    {
      id: 'chat',
      title: 'Manager Consultation',
      description: 'Voice-enabled AI manager for strategic discussions',
      icon: MessageSquare,
      color: 'pink'
    },
    {
      id: 'activity',
      title: 'Live Activity Feed',
      description: 'Real-time updates from all agent activities',
      icon: Activity,
      color: 'indigo'
    },
    {
      id: 'database',
      title: 'Technical Integration',
      description: 'Supabase real-time database connectivity',
      icon: Database,
      color: 'cyan'
    },
    {
      id: 'tests',
      title: 'System Tests',
      description: 'Comprehensive integration test suite',
      icon: TestTube,
      color: 'red'
    }
  ];

  const renderCurrentDemo = () => {
    switch (currentDemo) {
      case 'overview':
        return <EnhancedOverviewDemo />;
      case 'business-case':
        return <BusinessValueDemo />;
      case 'agents':
        return <AgentDashboard agents={sampleAgents} onAgentSelect={handleAgentSelect} />;
      case 'live-simulation':
        return <LiveSimulationDemo />;
      case 'leads':
        return <LeadsManagementDashboard />;
      case 'chat':
        return <ManagerAgentChat agentId="sarah-manager" onVoiceCall={onVoiceCall} />;
      case 'activity':
        return <RealTimeActivityFeed className="max-w-4xl mx-auto" />;
      case 'database':
        return <SupabaseTest />;
      case 'tests':
        return <IntegrationTestSuite />;
      default:
        return <EnhancedOverviewDemo />;
    }
  };

  const EnhancedOverviewDemo = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 rounded-2xl p-8 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-purple-500/20 to-transparent rounded-full -mr-48 -mt-48"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="max-w-2xl">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-300 font-medium">All Systems Operational</span>
              </div>
              <h1 className="text-5xl font-bold text-white mb-4">
                AI Real Estate Agent Team
              </h1>
              <p className="text-xl text-blue-100 mb-6">
                Replace your AED 22,000/month human team with AI specialists for just AED 1,497/month
              </p>
              <div className="flex items-center space-x-6">
                <div className="bg-white/15 rounded-lg px-4 py-2 backdrop-blur-sm">
                  <span className="text-3xl font-bold text-white">93%</span>
                  <span className="text-blue-200 text-sm block">Cost Savings</span>
                </div>
                <div className="bg-white/15 rounded-lg px-4 py-2 backdrop-blur-sm">
                  <span className="text-3xl font-bold text-white">24/7</span>
                  <span className="text-blue-200 text-sm block">Operation</span>
                </div>
                <div className="bg-white/15 rounded-lg px-4 py-2 backdrop-blur-sm">
                  <span className="text-3xl font-bold text-white">6</span>
                  <span className="text-blue-200 text-sm block">AI Agents</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <div className="text-4xl font-bold text-white mb-2">AED 1,497</div>
                <div className="text-sm text-green-300">per month</div>
                <div className="text-xs text-blue-200 mt-2">vs AED 22,000 human team</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Value Proposition Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center space-x-3 mb-3">
            <DollarSign className="h-8 w-8 text-green-600" />
            <span className="text-lg font-semibold text-gray-900">Cost Efficiency</span>
          </div>
          <div className="text-3xl font-bold text-green-600 mb-1">AED 20,503</div>
          <div className="text-sm text-gray-600">Monthly savings vs human team</div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center space-x-3 mb-3">
            <Clock className="h-8 w-8 text-blue-600" />
            <span className="text-lg font-semibold text-gray-900">Response Time</span>
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-1">&lt; 30s</div>
          <div className="text-sm text-gray-600">Average lead response time</div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center space-x-3 mb-3">
            <Target className="h-8 w-8 text-purple-600" />
            <span className="text-lg font-semibold text-gray-900">Accuracy</span>
          </div>
          <div className="text-3xl font-bold text-purple-600 mb-1">94.2%</div>
          <div className="text-sm text-gray-600">Average success rate</div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
          <div className="flex items-center space-x-3 mb-3">
            <TrendingUp className="h-8 w-8 text-orange-600" />
            <span className="text-lg font-semibold text-gray-900">Productivity</span>
          </div>
          <div className="text-3xl font-bold text-orange-600 mb-1">300%</div>
          <div className="text-sm text-gray-600">Increase vs manual work</div>
        </div>
      </div>

      {/* Live Agent Status Grid */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Your AI Agent Team Status</h3>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Live Data from Supabase</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleAgents.map((agent) => (
            <div key={agent.id} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-3">
                <div className="text-3xl">{agent.avatar}</div>
                <div>
                  <h4 className="font-semibold text-gray-900">{agent.name}</h4>
                  <p className="text-sm text-gray-600">{agent.type.charAt(0).toUpperCase() + agent.type.slice(1)} Agent</p>
                </div>
                <div className={`ml-auto w-3 h-3 rounded-full ${
                  agent.status === 'active' ? 'bg-green-500' :
                  agent.status === 'busy' ? 'bg-yellow-500' : 'bg-gray-500'
                }`}></div>
              </div>
              
              <p className="text-sm text-gray-700 mb-3">{agent.specialty}</p>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Tasks Today:</span>
                  <div className="font-semibold text-gray-900">
                    {agent.name.includes('Omar') ? metrics.totalLeads : agent.tasksCompleted}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Success Rate:</span>
                  <div className="font-semibold text-green-600">{agent.successRate}%</div>
                </div>
              </div>
              
              <div className="mt-3 text-xs text-gray-500">{agent.lastActivity}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Activity Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Live Activity Stream</h3>
              <button
                onClick={() => setCurrentDemo('activity')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
              >
                <span>View Full Stream</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <RealTimeActivityFeed maxItems={6} showHeader={false} />
          </div>
        </div>
        
        <div className="space-y-6">
          {/* System Health */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
            <div className="space-y-3">
              {[
                { name: 'Database', status: 'operational', value: 'Supabase Live' },
                { name: 'Authentication', status: 'operational', value: isAuthenticated ? 'Connected' : 'Disconnected' },
                { name: 'Real-time Sync', status: 'operational', value: 'Active' },
                { name: 'Voice Calling', status: 'operational', value: 'VAPI Ready' },
                { name: 'AI Agents', status: 'operational', value: '6 Active' },
                { name: 'Lead Processing', status: 'operational', value: `${leads.length} in pipeline` }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-sm text-gray-900 font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => setCurrentDemo('business-case')}
                className="w-full bg-green-50 border border-green-200 rounded-lg p-3 text-left hover:bg-green-100 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-900">View ROI Analysis</span>
                </div>
              </button>
              
              <button
                onClick={() => setCurrentDemo('chat')}
                className="w-full bg-purple-50 border border-purple-200 rounded-lg p-3 text-left hover:bg-purple-100 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">Chat with Sarah (Manager)</span>
                </div>
              </button>
              
              <button
                onClick={() => setCurrentDemo('live-simulation')}
                className="w-full bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-left hover:bg-yellow-100 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-900">Live Agent Simulation</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const BusinessValueDemo = () => {
    const humanTeamCost = 22000;
    const aiTeamCost = 1497;
    const monthlySavings = humanTeamCost - aiTeamCost;
    const annualSavings = monthlySavings * 12;

    const steps = [
      {
        title: 'Traditional Real Estate Team',
        content: (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-red-900 mb-4">Human Team - AED 22,000/month</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-red-800 mb-2">Team Members:</h4>
                <ul className="space-y-1 text-sm text-red-700">
                  <li>• Lead Manager: AED 8,000</li>
                  <li>• Lead Qualifier: AED 4,500</li>
                  <li>• Follow-up Specialist: AED 3,500</li>
                  <li>• Appointment Coordinator: AED 3,000</li>
                  <li>• Social Media Manager: AED 3,000</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-red-800 mb-2">Limitations:</h4>
                <ul className="space-y-1 text-sm text-red-700">
                  <li>• 8-hour workday only</li>
                  <li>• Sick days & vacations</li>
                  <li>• Human errors</li>
                  <li>• Training required</li>
                  <li>• Inconsistent quality</li>
                </ul>
              </div>
            </div>
          </div>
        )
      },
      {
        title: 'AI Agent Team Solution',
        content: (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-green-900 mb-4">AI Team - AED 1,497/month</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-green-800 mb-2">AI Agents:</h4>
                <ul className="space-y-1 text-sm text-green-700">
                  <li>• Sarah (Manager): Strategic & Voice</li>
                  <li>• Omar (Qualifier): 24/7 Lead Processing</li>
                  <li>• Alex (Coordinator): Pipeline Management</li>
                  <li>• Maya (Marketing): Campaign Automation</li>
                  <li>• Layla (Follow-up): Nurture Sequences</li>
                  <li>• Ahmed (Scheduler): Smart Appointments</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-green-800 mb-2">Advantages:</h4>
                <ul className="space-y-1 text-sm text-green-700">
                  <li>• 24/7 operation</li>
                  <li>• No sick days ever</li>
                  <li>• 99.9% accuracy</li>
                  <li>• Instant expertise</li>
                  <li>• Consistent quality</li>
                  <li>• Real-time learning</li>
                </ul>
              </div>
            </div>
          </div>
        )
      },
      {
        title: 'Cost Comparison',
        content: (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-red-600 mb-2">AED {humanTeamCost.toLocaleString()}</div>
                <div className="text-gray-600">Human Team / Month</div>
                <div className="mt-4 space-y-2 text-sm text-gray-500">
                  <div>+ Benefits & Insurance</div>
                  <div>+ Office Space</div>
                  <div>+ Training Costs</div>
                  <div>+ Management Overhead</div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">AED {aiTeamCost.toLocaleString()}</div>
                <div className="text-gray-600">AI Team / Month</div>
                <div className="mt-4 space-y-2 text-sm text-green-600">
                  <div>✓ No additional costs</div>
                  <div>✓ Instant deployment</div>
                  <div>✓ Zero training needed</div>
                  <div>✓ Self-managing</div>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-700">Monthly Savings: AED {monthlySavings.toLocaleString()}</div>
              <div className="text-lg text-green-600">Annual Savings: AED {annualSavings.toLocaleString()}</div>
            </div>
          </div>
        )
      },
      {
        title: 'Performance Comparison',
        content: (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { metric: 'Response Time', human: '2-4 hours', ai: '< 30 seconds', improvement: '95% faster' },
                { metric: 'Availability', human: '8 hours/day', ai: '24/7/365', improvement: '3x coverage' },
                { metric: 'Accuracy', human: '85-90%', ai: '94-97%', improvement: '10% better' },
                { metric: 'Lead Processing', human: '50/day', ai: '500+/day', improvement: '10x volume' },
                { metric: 'Languages', human: '1-2', ai: 'Arabic + English', improvement: 'Bilingual' },
                { metric: 'Consistency', human: 'Variable', ai: 'Perfect', improvement: '100% consistent' }
              ].map((item, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-gray-900 mb-2">{item.metric}</div>
                  <div className="text-sm text-red-600 mb-1">Human: {item.human}</div>
                  <div className="text-sm text-green-600 mb-2">AI: {item.ai}</div>
                  <div className="text-xs text-blue-600 font-medium">{item.improvement}</div>
                </div>
              ))}
            </div>
          </div>
        )
      },
      {
        title: 'ROI Timeline',
        content: (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Return on Investment Timeline</h3>
            <div className="space-y-4">
              {[
                { period: 'Month 1', savings: monthlySavings, total: monthlySavings, note: 'Immediate cost reduction' },
                { period: 'Month 3', savings: monthlySavings, total: monthlySavings * 3, note: 'Full team operational' },
                { period: 'Month 6', savings: monthlySavings, total: monthlySavings * 6, note: 'Significant impact' },
                { period: 'Year 1', savings: monthlySavings, total: annualSavings, note: 'Massive savings achieved' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-900">{item.period}</div>
                    <div className="text-sm text-gray-600">{item.note}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">AED {item.total.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Total Saved</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      }
    ];

    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Business Value Demonstration</h2>
          <p className="text-lg text-gray-600 mb-6">
            See how our AI Agent Team delivers 93% cost savings with superior performance
          </p>
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => setAutoAdvance(!autoAdvance)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                autoAdvance 
                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {autoAdvance ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              <span>{autoAdvance ? 'Auto Mode' : 'Manual Mode'}</span>
            </button>
          </div>
        </div>

        {/* Step Navigation */}
        <div className="flex justify-center">
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setDemoStep(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  demoStep === index ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Current Step */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
            {steps[demoStep].title}
          </h3>
          {steps[demoStep].content}
        </div>

        {/* Navigation */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setDemoStep(Math.max(0, demoStep - 1))}
            disabled={demoStep === 0}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => setDemoStep(Math.min(steps.length - 1, demoStep + 1))}
            disabled={demoStep === steps.length - 1}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  const LiveSimulationDemo = () => {
    const [simulationStep, setSimulationStep] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    const simulationSteps = [
      {
        agent: 'Omar Hassan',
        action: 'New WhatsApp lead received',
        details: 'Client interested in 2BR apartment in Dubai Marina',
        time: '< 30 seconds',
        color: 'blue'
      },
      {
        agent: 'Omar Hassan', 
        action: 'Lead qualified automatically',
        details: 'Budget AED 1.2M, timeline 2 months, serious buyer',
        time: '45 seconds',
        color: 'green'
      },
      {
        agent: 'Alex Thompson',
        action: 'Pipeline coordination initiated',
        details: 'Lead routed to premium properties workflow',
        time: '1 minute',
        color: 'purple'
      },
      {
        agent: 'Maya Patel',
        action: 'Personalized follow-up sequence started',
        details: 'Marina properties brochure sent, viewing scheduled',
        time: '2 minutes',
        color: 'pink'
      },
      {
        agent: 'Ahmed Khalil',
        action: 'Appointment scheduled',
        details: 'Saturday 10 AM viewing at 3 properties',
        time: '3 minutes',
        color: 'orange'
      },
      {
        agent: 'Sarah Al-Mansouri',
        action: 'Strategic analysis complete',
        details: 'High-value lead identified, escalated for personal attention',
        time: '5 minutes',
        color: 'indigo'
      }
    ];

    useEffect(() => {
      if (isRunning) {
        const timer = setInterval(() => {
          setSimulationStep(prev => {
            if (prev >= simulationSteps.length - 1) {
              setIsRunning(false);
              return 0;
            }
            return prev + 1;
          });
        }, 2000);
        return () => clearInterval(timer);
      }
    }, [isRunning, simulationSteps.length]);

    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Live Agent Simulation</h2>
          <p className="text-lg text-gray-600 mb-6">
            Watch how your AI team processes a new lead in real-time
          </p>
          <button
            onClick={() => {
              setIsRunning(!isRunning);
              if (!isRunning) setSimulationStep(0);
            }}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              isRunning 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isRunning ? 'Stop Simulation' : 'Start Live Simulation'}
          </button>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {simulationSteps.map((step, index) => (
              <div
                key={index}
                className={`p-6 rounded-lg border-2 transition-all duration-500 ${
                  index <= simulationStep
                    ? `border-${step.color}-300 bg-${step.color}-50`
                    : 'border-gray-200 bg-gray-50 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${
                      index <= simulationStep ? `bg-${step.color}-500` : 'bg-gray-300'
                    }`}></div>
                    <h3 className="font-semibold text-gray-900">{step.agent}</h3>
                    <span className="text-sm text-gray-500">{step.time}</span>
                  </div>
                  {index === simulationStep && isRunning && (
                    <div className="animate-pulse">
                      <Sparkles className="h-5 w-5 text-yellow-500" />
                    </div>
                  )}
                </div>
                <div className="font-medium text-gray-800 mb-1">{step.action}</div>
                <div className="text-sm text-gray-600">{step.details}</div>
              </div>
            ))}
          </div>

          {simulationStep === simulationSteps.length - 1 && !isRunning && (
            <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-900 mb-2">Lead Successfully Processed!</h3>
              <p className="text-green-700">
                Complete lead qualification and appointment scheduling in under 5 minutes.
                Your human team would take 2-4 hours for the same process.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Enhanced Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              🚀 Dubai Real Estate AI Platform Demo
            </h1>
            <p className="text-xl text-gray-600">
              Experience the future of real estate automation with live Supabase integration
            </p>
            <div className="flex items-center space-x-4 mt-3">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="text-sm text-green-700 font-medium">Enterprise Grade Security</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-blue-700 font-medium">Award-Winning AI Technology</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-600" />
                <span className="text-sm text-yellow-700 font-medium">97% Client Satisfaction</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-4 text-white">
              <div className="text-2xl font-bold">AED 1,497/month</div>
              <div className="text-sm opacity-90">Replace AED 22,000 human team</div>
              <div className="text-xs mt-1 bg-white/20 rounded px-2 py-1">
                93% Cost Savings
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Navigation */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-3">
          {demos.map((demo) => {
            const Icon = demo.icon;
            const isActive = currentDemo === demo.id;
            const isHighlight = demo.highlight;
            
            return (
              <button
                key={demo.id}
                onClick={() => setCurrentDemo(demo.id)}
                className={`p-4 rounded-xl text-left transition-all duration-200 relative ${
                  isActive
                    ? `bg-${demo.color}-100 border-2 border-${demo.color}-300 shadow-lg transform scale-105`
                    : isHighlight
                    ? 'bg-white border-2 border-gray-300 hover:border-gray-400 hover:shadow-lg'
                    : 'bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                {isHighlight && (
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Star className="h-2.5 w-2.5 text-yellow-800" />
                  </div>
                )}
                <Icon className={`h-6 w-6 mb-3 ${
                  isActive ? `text-${demo.color}-600` : 'text-gray-600'
                }`} />
                <div className={`font-medium text-sm mb-1 ${
                  isActive ? `text-${demo.color}-900` : 'text-gray-900'
                }`}>
                  {demo.title}
                </div>
                <div className="text-xs text-gray-600 leading-tight">
                  {demo.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Demo Content */}
      <div className="min-h-96">
        {renderCurrentDemo()}
      </div>

      {/* Enhanced Footer */}
      <div className="mt-16 pt-8 border-t border-gray-200">
        <div className="text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              🎉 Ready to Transform Your Real Estate Business?
            </h3>
            <p className="text-lg text-gray-600 mb-4">
              Join the AI revolution and start saving AED 20,503 per month immediately
            </p>
            <div className="flex items-center justify-center space-x-6">
              <button
                onClick={() => setCurrentDemo('business-case')}
                className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2"
              >
                <DollarSign className="h-5 w-5" />
                <span>See ROI Calculator</span>
              </button>
              <button
                onClick={() => setCurrentDemo('chat')}
                className="bg-white border-2 border-purple-600 text-purple-600 px-8 py-3 rounded-lg font-medium hover:bg-purple-50 transition-colors flex items-center space-x-2"
              >
                <Phone className="h-5 w-5" />
                <span>Talk to Sarah (Manager AI)</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-600">Database Live</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Real-time Active</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-gray-600">6 AI Agents Ready</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-600">Voice Calling Configured</span>
            </div>
          </div>
          
          <div className="mt-6 text-xs text-gray-500">
            Powered by Supabase Real-time Database • Enterprise-Grade Security • 99.9% Uptime Guarantee
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedComprehensiveDemoPage;