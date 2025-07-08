import { useState } from 'react';

interface User {
  id: string;
  email: string;
  user_metadata?: {
    first_name?: string;
    last_name?: string;
    company_name?: string;
  };
  profile?: {
    first_name?: string;
    last_name?: string;
    client_id?: string;
  };
  clientProfile?: {
    company_name?: string;
  };
}

export const useAuth = () => {
  const [user] = useState<User | null>({
    id: 'demo-user',
    email: 'demo@example.com',
    user_metadata: {
      first_name: 'Demo',
      last_name: 'User',
      company_name: 'Real Estate Agency'
    },
    profile: {
      first_name: 'Demo',
      last_name: 'User',
      client_id: 'demo-client'
    },
    clientProfile: {
      company_name: 'Real Estate Agency'
    }
  });

  const signOut = async () => {
    return { success: true };
  };

  const signIn = async (email: string, password: string) => {
    return { success: true, user };
  };

  return {
    user,
    signOut,
    signIn,
    loading: false,
    error: null
  };
};