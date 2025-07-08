import { useState, useEffect } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null
}

/**
 * Simplified React hook for authentication state management
 * This version includes better error handling and timeouts
 */
export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    let mounted = true
    let timeoutId: NodeJS.Timeout

    // Set a timeout to prevent infinite loading
    timeoutId = setTimeout(() => {
      if (mounted) {
        console.warn('⚠️ Auth check timeout - assuming no user')
        setState({
          user: null,
          session: null,
          loading: false,
          error: null
        })
      }
    }, 5000) // 5 second timeout

    // Get initial session with simplified approach
    const getInitialSession = async () => {
      try {
        console.log('🔍 Checking initial session...')
        
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('❌ Session error:', error)
          if (mounted) {
            setState({
              user: null,
              session: null,
              loading: false,
              error: error.message
            })
          }
          return
        }

        if (mounted) {
          clearTimeout(timeoutId)
          setState({
            user: session?.user || null,
            session: session || null,
            loading: false,
            error: null
          })
        }

        console.log('✅ Session check complete:', session ? 'User found' : 'No user')
      } catch (error) {
        console.error('❌ Auth initialization error:', error)
        if (mounted) {
          clearTimeout(timeoutId)
          setState({
            user: null,
            session: null,
            loading: false,
            error: 'Authentication check failed'
          })
        }
      }
    }

    getInitialSession()

    // Listen for auth changes with error handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session ? 'User present' : 'No user')
        
        if (mounted) {
          clearTimeout(timeoutId)
          setState({
            user: session?.user || null,
            session: session || null,
            loading: false,
            error: null
          })
        }
      }
    )

    return () => {
      mounted = false
      clearTimeout(timeoutId)
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: error.message
        }))
        return { success: false, error: error.message }
      }

      // Don't set state here - onAuthStateChange will handle it
      return { success: true, error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed'
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }))
      return { success: false, error: errorMessage }
    }
  }

  const signUp = async (data: {
    email: string
    password: string
    firstName: string
    lastName: string
    companyName?: string
    phone?: string
  }) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      // First create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            company_name: data.companyName
          }
        }
      })

      if (authError) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: authError.message
        }))
        return { success: false, error: authError.message }
      }

      // For now, just return success - user will need to verify email
      setState(prev => ({ ...prev, loading: false }))
      return { success: true, error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed'
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }))
      return { success: false, error: errorMessage }
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

      // Don't set state here - onAuthStateChange will handle it
      return { success: true, error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign out failed'
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }))
      return { success: false, error: errorMessage }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      
      if (error) {
        return { success: false, error: error.message }
      }
      
      return { success: true, error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset failed'
      return { success: false, error: errorMessage }
    }
  }

  return {
    user: state.user,
    session: state.session,
    loading: state.loading,
    error: state.error,
    isAuthenticated: !!state.session,
    clientId: state.user?.user_metadata?.client_id || 'demo-client',
    signIn,
    signUp,
    signOut,
    resetPassword
  }
}

export default useAuth