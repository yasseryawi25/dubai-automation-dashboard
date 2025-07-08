import React, { useState } from 'react';
import { SubscriptionInfo } from '../types';
import { Loader2, CheckCircle2, XCircle, CreditCard, AlertTriangle, TrendingUp } from 'lucide-react';

const sampleSubscription: SubscriptionInfo = {
  userId: 'user-001',
  plan: 'pro',
  billingCycle: 'monthly',
  renewalDate: '2024-07-01',
  usage: {
    workflows: 8,
    agents: 3,
    executions: 420,
    storageMB: 1200,
  },
  paymentMethod: 'VISA **** 1234',
  status: 'active',
};

const billingHistory = [
  { date: '2024-06-01', amount: 299, status: 'Paid', invoice: 'INV-20240601' },
  { date: '2024-05-01', amount: 299, status: 'Paid', invoice: 'INV-20240501' },
  { date: '2024-04-01', amount: 299, status: 'Paid', invoice: 'INV-20240401' },
];

const planFeatures = {
  free: ['Basic profile', '1 agent', 'Limited workflows'],
  pro: ['Up to 10 agents', 'Unlimited workflows', 'AI agent analytics', 'Priority support'],
  enterprise: ['Unlimited agents', 'Custom integrations', 'Dedicated support', 'SLA'],
};

const SubscriptionManagement: React.FC = () => {
  const [subscription, setSubscription] = useState<SubscriptionInfo>(sampleSubscription);
  const [upgrading, setUpgrading] = useState(false);
  const [downgrading, setDowngrading] = useState(false);
  const [alert, setAlert] = useState('');

  // Simulate upgrade/downgrade
  const handlePlanChange = (plan: 'free' | 'pro' | 'enterprise') => {
    if (plan === subscription.plan) return;
    setUpgrading(plan === 'enterprise');
    setDowngrading(plan === 'free');
    setTimeout(() => {
      setSubscription(prev => ({ ...prev, plan }));
      setUpgrading(false);
      setDowngrading(false);
      setAlert(`Plan changed to ${plan.charAt(0).toUpperCase() + plan.slice(1)}`);
      setTimeout(() => setAlert(''), 2000);
    }, 1200);
  };

  return (
    <div className="bg-white rounded-lg border p-6 w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <div className="text-xl font-bold">Subscription Management</div>
        <div className="ml-auto flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary-gold" />
          <span className="text-xs text-gray-500">{subscription.paymentMethod}</span>
        </div>
      </div>
      <div className="mb-4">
        <div className="font-semibold">Current Plan: <span className="capitalize text-primary-gold">{subscription.plan}</span> ({subscription.billingCycle})</div>
        <div className="text-xs text-gray-500">Renews: {subscription.renewalDate}</div>
        <div className="flex gap-2 mt-2">
          {(['free', 'pro', 'enterprise'] as const).map(plan => (
            <button
              key={plan}
              className={`px-3 py-1 rounded ${plan === subscription.plan ? 'bg-primary-gold text-white' : 'border'} text-xs`}
              onClick={() => handlePlanChange(plan)}
              disabled={plan === subscription.plan || upgrading || downgrading}
            >
              {plan.charAt(0).toUpperCase() + plan.slice(1)}
            </button>
          ))}
        </div>
        <div className="mt-2 text-xs text-gray-600">Features: {planFeatures[subscription.plan].join(', ')}</div>
      </div>
      <div className="mb-4">
        <div className="font-semibold mb-1">Usage Statistics</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="bg-gray-50 rounded p-2 text-center"><TrendingUp className="w-4 h-4 mx-auto text-primary-gold" /><div className="text-xs">Workflows</div><div className="font-bold">{subscription.usage.workflows}/20</div></div>
          <div className="bg-gray-50 rounded p-2 text-center"><TrendingUp className="w-4 h-4 mx-auto text-primary-gold" /><div className="text-xs">Agents</div><div className="font-bold">{subscription.usage.agents}/10</div></div>
          <div className="bg-gray-50 rounded p-2 text-center"><TrendingUp className="w-4 h-4 mx-auto text-primary-gold" /><div className="text-xs">Executions</div><div className="font-bold">{subscription.usage.executions}/1000</div></div>
          <div className="bg-gray-50 rounded p-2 text-center"><TrendingUp className="w-4 h-4 mx-auto text-primary-gold" /><div className="text-xs">Storage</div><div className="font-bold">{subscription.usage.storageMB}MB/5000MB</div></div>
        </div>
        {(subscription.usage.workflows > 18 || subscription.usage.executions > 900) && (
          <div className="flex items-center gap-2 text-xs text-red-600 mt-2"><AlertTriangle className="w-4 h-4" /> Usage nearing limit! Consider upgrading.</div>
        )}
      </div>
      <div className="mb-4">
        <div className="font-semibold mb-1">Billing History</div>
        <table className="w-full text-xs border rounded">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2">Date</th>
              <th>Amount (AED)</th>
              <th>Status</th>
              <th>Invoice</th>
            </tr>
          </thead>
          <tbody>
            {billingHistory.map((bill, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{bill.date}</td>
                <td>{bill.amount}</td>
                <td>{bill.status === 'Paid' ? <CheckCircle2 className="w-4 h-4 text-green-500 inline" /> : <XCircle className="w-4 h-4 text-red-500 inline" />}</td>
                <td><a href={`#${bill.invoice}`} className="text-primary-gold underline">{bill.invoice}</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {alert && <div className="text-xs text-green-600 mb-2">{alert}</div>}
    </div>
  );
};

export default SubscriptionManagement; 