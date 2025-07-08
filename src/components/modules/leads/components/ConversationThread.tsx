import React from 'react';
import type { Message } from '../types';
import { User, Bot, Phone, Mail } from 'lucide-react';

interface ConversationThreadProps {
  messages: Message[];
  leadName: string;
  agentName: string;
}

const senderStyle = {
  lead: 'bg-blue-50 text-blue-900 self-start',
  agent: 'bg-primary-gold text-white self-end',
  ai: 'bg-neutral-100 text-neutral-700 self-center',
};

const senderIcon = {
  lead: <User className="w-4 h-4 mr-1 inline" />,
  agent: <User className="w-4 h-4 mr-1 inline text-primary-gold" />,
  ai: <Bot className="w-4 h-4 mr-1 inline text-neutral-400" />,
};

const typeIcon = {
  whatsapp: <Phone className="w-4 h-4 inline text-green-500 mr-1" />,
  email: <Mail className="w-4 h-4 inline text-blue-500 mr-1" />,
  call: <Phone className="w-4 h-4 inline text-primary-gold mr-1" />,
  note: <Bot className="w-4 h-4 inline text-neutral-400 mr-1" />,
};

const ConversationThread: React.FC<ConversationThreadProps> = ({ messages, leadName, agentName }) => {
  // For now, no pagination (add if > 20 messages)
  return (
    <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto p-2">
      {messages.length === 0 && (
        <div className="text-neutral-400 text-center py-8">No messages yet.</div>
      )}
      {messages.map(msg => (
        <div
          key={msg.id}
          className={`rounded-lg px-3 py-2 max-w-[80%] shadow-sm flex items-center ${senderStyle[msg.sender]}`}
          title={new Date(msg.timestamp).toLocaleString()}
        >
          {typeIcon[msg.type]} {senderIcon[msg.sender]}
          <span className="font-medium mr-2">
            {msg.sender === 'lead' ? leadName : msg.sender === 'agent' ? (msg.agentName || agentName) : 'AI'}
          </span>
          <span>{msg.content}</span>
        </div>
      ))}
    </div>
  );
};

export default ConversationThread; 