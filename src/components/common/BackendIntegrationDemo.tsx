import React, { useState } from 'react';
import { Send, Phone, Mail, MessageCircle, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { testDatabaseConnection, testN8nConnection, testVAPIConnection } from '../../services/backendIntegration';

interface DemoLead {
  name: string;
  phone: string;
  email: string;
  message: string;
  source: string;
  propertyInterest: string;
  budget: string;
}

interface ProcessingStep {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  description: string;
  icon: React.ReactNode;
}

const BackendIntegrationDemo: React.FC = () => {
  const [demoLead, setDemoLead] = useState<DemoLead>({
    name: 'Ahmed Al-Rashid',
    phone: '+971501234567',
    email: 'ahmed.rashid@email.com',
    message: 'I am interested in a 2-bedroom apartment in Downtown Dubai. My budget is around AED 1.5M. Can you help me find something suitable?',
    source: 'website',
    propertyInterest: '2BR Apartment',
    budget: 'AED 1.5M'
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([
    {
      id: 'database',
      name: 'Create Lead in Database',
      status: 'pending',
      description: 'Store lead information in Supabase database',
      icon: <Phone className="w-5 h-5" />
    },
    {
      id: 'qualification',
      name: 'n8n Lead Qualification',
      status: 'pending',
      description: 'Trigger Omar Hassan (Lead Qualification Agent) workflow',
      icon: <MessageCircle className="w-5 h-5" />
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Welcome Message',
      status: 'pending',
      description: 'Send immediate WhatsApp response via Business API',
      icon: <MessageCircle className="w-5 h-5" />
    },
    {
      id: 'voice_call',
      name: 'AI Voice Call (High Score)',
      status: 'pending',
      description: 'Sarah Manager Agent initiates voice call via VAPI',
      icon: <Phone className="w-5 h-5" />
    },
    {
      id: 'email_sequence',
      name: 'Email Follow-up Sequence',
      status: 'pending',
      description: 'Layla Follow-up Agent starts nurture sequence',
      icon: <Mail className="w-5 h-5" />
    }
  ]);

  const [results, setResults] = useState<any>(null);

  const handleInputChange = (field: keyof DemoLead, value: string) => {
    setDemoLead(prev => ({ ...prev, [field]: value }));
  };

  const processDemo = async () => {
    setIsProcessing(true);
    setResults(null);
    
    // Reset all steps to pending
    setProcessingSteps(prev => prev.map(step => ({ ...step, status: 'pending' })));

    try {
      // Step 1: Database
      setProcessingSteps(prev => prev.map(step => 
        step.id === 'database' 
          ? { ...step, status: 'processing' }
          : step
      ));
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing
      
      setProcessingSteps(prev => prev.map(step => 
        step.id === 'database' 
          ? { ...step, status: 'completed' }
          : step
      ));

      // Step 2: n8n Qualification
      setProcessingSteps(prev => prev.map(step => 
        step.id === 'qualification' 
          ? { ...step, status: 'processing' }
          : step
      ));

      // Simulate the actual backend integration call
      const databaseTest = await testDatabaseConnection();
      const n8nTest = await testN8nConnection();
      const vapiTest = await testVAPIConnection();
      
      const processingResult = {
        success: databaseTest.connected && n8nTest.connected,
        qualificationScore: Math.floor(Math.random() * 40) + 60, // 60-100
        leadId: 'LEAD-' + Date.now(),
        automationTriggered: true,
        nextActions: [
          'WhatsApp welcome message sent',
          'Lead qualification workflow started',
          'Follow-up sequence scheduled',
          vapiTest.connected && Math.random() > 0.5 ? 'AI voice call scheduled' : 'Email nurturing sequence started'
        ].filter(Boolean)
      };

      await new Promise(resolve => setTimeout(resolve, 1500));

      setProcessingSteps(prev => prev.map(step => 
        step.id === 'qualification' 
          ? { ...step, status: processingResult.success ? 'completed' : 'failed' }
          : step
      ));

      // Step 3: WhatsApp
      setProcessingSteps(prev => prev.map(step => 
        step.id === 'whatsapp' 
          ? { ...step, status: 'processing' }
          : step
      ));

      await new Promise(resolve => setTimeout(resolve, 1000));

      setProcessingSteps(prev => prev.map(step => 
        step.id === 'whatsapp' 
          ? { ...step, status: 'completed' }
          : step
      ));

      // Step 4: Voice Call (for high-score leads)
      if (processingResult.qualificationScore && processingResult.qualificationScore >= 80) {
        setProcessingSteps(prev => prev.map(step => 
          step.id === 'voice_call' 
            ? { ...step, status: 'processing' }
            : step
        ));

        await new Promise(resolve => setTimeout(resolve, 2000));

        setProcessingSteps(prev => prev.map(step => 
          step.id === 'voice_call' 
            ? { ...step, status: 'completed' }
            : step
        ));
      }

      // Step 5: Email Sequence
      if (demoLead.email) {
        setProcessingSteps(prev => prev.map(step => 
          step.id === 'email_sequence' 
            ? { ...step, status: 'processing' }
            : step
        ));

        await new Promise(resolve => setTimeout(resolve, 1000));

        setProcessingSteps(prev => prev.map(step => 
          step.id === 'email_sequence' 
            ? { ...step, status: 'completed' }
            : step
        ));
      }

      setResults(processingResult);

    } catch (error) {
      console.error('Demo processing error:', error);
      setProcessingSteps(prev => prev.map(step => 
        step.status === 'processing' 
          ? { ...step, status: 'failed' }
          : step
      ));
    } finally {
      setIsProcessing(false);
    }
  };

  const getStepIcon = (status: ProcessingStep['status']) => {
    switch (status) {
      case 'processing':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-neutral-800">Backend Integration Demo</h2>
        <p className="text-neutral-600 mt-1">
          Test the complete lead processing pipeline from frontend to AI agents
        </p>
      </div>

      {/* Demo Lead Form */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-neutral-800 mb-4">
          Demo Lead Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Name
            </label>
            <input
              type="text"
              value={demoLead.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Phone
            </label>
            <input
              type="text"
              value={demoLead.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={demoLead.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Source
            </label>
            <select
              value={demoLead.source}
              onChange={(e) => handleInputChange('source', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold"
            >
              <option value="website">Website</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="referral">Referral</option>
              <option value="facebook">Facebook</option>
              <option value="google">Google Ads</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Message
            </label>
            <textarea
              value={demoLead.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold"
            />
          </div>
        </div>

        <button
          onClick={processDemo}
          disabled={isProcessing}
          className="mt-4 flex items-center gap-2 px-6 py-2 bg-primary-gold text-white rounded-lg hover:bg-primary-gold-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          {isProcessing ? 'Processing Lead...' : 'Process Demo Lead'}
        </button>
      </div>

      {/* Processing Steps */}
      {(isProcessing || results) && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-neutral-800 mb-4">
            Processing Pipeline
          </h3>
          
          <div className="space-y-4">
            {processingSteps.map((step, index) => (
              <div key={step.id} className="flex items-start gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-gray-200 bg-white">
                  {getStepIcon(step.status)}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-neutral-800">{step.name}</h4>
                  <p className="text-sm text-neutral-600">{step.description}</p>
                  {step.status === 'processing' && (
                    <p className="text-xs text-blue-600 mt-1">Processing...</p>
                  )}
                  {step.status === 'completed' && (
                    <p className="text-xs text-green-600 mt-1">✅ Completed</p>
                  )}
                  {step.status === 'failed' && (
                    <p className="text-xs text-red-600 mt-1">❌ Failed</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-neutral-800 mb-4">
            Processing Results
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-neutral-700">Success:</span>
                <span className={`text-sm ${results.success ? 'text-green-600' : 'text-red-600'}`}>
                  {results.success ? '✅ Yes' : '❌ No'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm font-medium text-neutral-700">Lead ID:</span>
                <span className="text-sm text-neutral-600 font-mono">{results.leadId}</span>
              </div>
              
              {results.qualificationScore && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-neutral-700">Qualification Score:</span>
                  <span className={`text-sm font-medium ${
                    results.qualificationScore >= 80 ? 'text-green-600' :
                    results.qualificationScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {results.qualificationScore}/100
                  </span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-sm font-medium text-neutral-700">Automation Triggered:</span>
                <span className={`text-sm ${results.automationTriggered ? 'text-green-600' : 'text-red-600'}`}>
                  {results.automationTriggered ? '✅ Yes' : '❌ No'}
                </span>
              </div>
            </div>
            
            <div>
              <span className="text-sm font-medium text-neutral-700">Next Actions:</span>
              <ul className="text-sm text-neutral-600 mt-1 space-y-1">
                {results.nextActions?.map((action: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-primary-gold rounded-full mt-2 flex-shrink-0"></span>
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {results.error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">
                <strong>Error:</strong> {results.error}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BackendIntegrationDemo;