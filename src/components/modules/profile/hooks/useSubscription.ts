import { useState, useEffect } from 'react';
import { SubscriptionInfo } from '../types';

const LOCAL_KEY = 'dubai_subscription';

const defaultSubscription: SubscriptionInfo = {
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

export function useSubscription() {
  const [subscription, setSubscription] = useState<SubscriptionInfo>(() => {
    const stored = localStorage.getItem(LOCAL_KEY);
    return stored ? JSON.parse(stored) : defaultSubscription;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(subscription));
  }, [subscription]);

  // Simulate plan change
  const changePlan = async (plan: 'free' | 'pro' | 'enterprise') => {
    setLoading(true);
    setTimeout(() => {
      setSubscription(prev => ({ ...prev, plan }));
      setLoading(false);
      setError(null);
    }, 800);
  };

  // Simulate usage update
  const updateUsage = async (usage: Partial<SubscriptionInfo['usage']>) => {
    setLoading(true);
    setTimeout(() => {
      setSubscription(prev => ({ ...prev, usage: { ...prev.usage, ...usage } }));
      setLoading(false);
    }, 600);
  };

  return { subscription, loading, error, changePlan, updateUsage };
} 