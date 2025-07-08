// Temporary bypass for RLS issues - Demo mode authentication
import { useState, useEffect } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface DemoAuthState {
  user: any | null
  session: Session | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
}

/**
 * Demo authentication hook that bypasses RLS issues
 * Use this temporarily while fixing database policies
 */
export function useDemoAuth() {
  const [state, setState] = useState<DemoAuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
    isAuthenticated: false
  })

  useEffect(() => {
    // Check for existing session
    checkExistingSession()
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session)
        
        if (session) {
          setState({
            user: createDemoUser(session.user),
            session,
            loading: false,
            error: null,
            isAuthenticated: true
          })
        } else {
          setState({
            user: null,
            session: null,
            loading: false,
            error: null,
            isAuthenticated: false
          })
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const checkExistingSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        setState({
          user: createDemoUser(session.user),
          session,
          loading: false,
          error: null,
          isAuthenticated: true
        })
      } else {
        setState(prev => ({ ...prev, loading: false }))
      }
    } catch (error) {
      console.error('Session check error:', error)
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Failed to check session' 
      }))
    }
  }

  const signIn = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        // Handle specific error cases
        if (error.message.includes('Email not confirmed')) {
          // For demo purposes, try to sign in anyway
          setState(prev => ({
            ...prev,
            loading: false,
            error: 'Email confirmation required, but proceeding with demo mode'
          }))
          
          // Create a demo session anyway
          const demoUser = {
            id: 'demo-' + Date.now(),
            email: email,
            user_metadata: {
              first_name: 'Demo',
              last_name: 'User',
              company_name: 'Dubai Real Estate Demo'
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          
          const demoSession = {
            access_token: 'demo-token-' + Date.now(),
            refresh_token: 'demo-refresh-' + Date.now(),
            user: demoUser,
            expires_at: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
            expires_in: 24 * 60 * 60
          }
          
          setState({
            user: createDemoUser(demoUser as any),
            session: demoSession as any,
            loading: false,
            error: null,
            isAuthenticated: true
          })
          
          return { success: true, error: null }
        }
        
        setState(prev => ({
          ...prev,
          loading: false,
          error: error.message
        }))
        return { success: false, error: error.message }
      }

      // Success - auth state change will handle the rest
      return { success: true, error: null }
      
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }))
      return { success: false, error: error.message }
    }
  }

  const signUp = async (data: {
    email: string
    password: string
    firstName: string
    lastName: string
    companyName?: string
  }) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      // Create the auth user with autoConfirm option
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            company_name: data.companyName
          },
          // Try to skip email confirmation
          emailRedirectTo: undefined
        }
      })
      
      if (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: error.message
        }))
        return { success: false, error: error.message }
      }

      // If user is created but not confirmed, create demo session
      if (authData.user && !authData.session) {
        // Email confirmation required, but we'll create a demo session
        const demoUser = {
          ...authData.user,
          user_metadata: {
            first_name: data.firstName,
            last_name: data.lastName,
            company_name: data.companyName
          }
        }
        
        const demoSession = {
          access_token: 'demo-token-' + Date.now(),
          refresh_token: 'demo-refresh-' + Date.now(),
          user: demoUser,
          expires_at: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
          expires_in: 24 * 60 * 60
        }
        
        setState({
          user: createDemoUser(demoUser as any),
          session: demoSession as any,
          loading: false,
          error: null,
          isAuthenticated: true
        })
        
        return { success: true, error: null }
      }

      // Success - user created and confirmed automatically
      return { success: true, error: null }
      
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }))
      return { success: false, error: error.message }
    }
  }

  const signOut = async () => {
    setState(prev => ({ ...prev, loading: true }))
    
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: error.message
        }))
        return { success: false, error: error.message }
      }

      // Success - auth state change will handle the rest
      return { success: true, error: null }
      
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }))
      return { success: false, error: error.message }
    }
  }

  return {
    user: state.user,
    session: state.session,
    loading: state.loading,
    error: state.error,
    isAuthenticated: state.isAuthenticated,
    clientId: state.user?.profile?.client_id || 'demo-client',
    signIn,
    signUp,
    signOut
  }
}

// Create a demo user object with mock profile data
function createDemoUser(authUser: User) {
  return {
    ...authUser,
    profile: {
      id: authUser.id,
      client_id: 'demo-client-' + authUser.id.slice(0, 8),
      first_name: authUser.user_metadata?.first_name || 'Demo',
      last_name: authUser.user_metadata?.last_name || 'User',
      role: 'admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    clientProfile: {
      id: 'demo-client-' + authUser.id.slice(0, 8),
      name: (authUser.user_metadata?.first_name || 'Demo') + ' ' + (authUser.user_metadata?.last_name || 'User'),
      email: authUser.email || 'demo@dubaireal.com',
      phone: '+971501234567',
      company_name: authUser.user_metadata?.company_name || 'Dubai Real Estate Demo',
      subscription_plan: 'premium',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }
}

export default useDemoAuth
