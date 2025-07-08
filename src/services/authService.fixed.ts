import { supabase } from '../lib/supabase'
import type { User, Session, AuthError } from '@supabase/supabase-js'
import type { UserProfile, ClientProfile } from '../types/database'

export interface AuthUser extends User {
  profile?: UserProfile
  clientProfile?: ClientProfile
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  companyName?: string
  phone?: string
}

/**
 * Authentication Service using Supabase Auth
 */
export class AuthService {
  /**
   * Sign in with email and password
   */
  static async signIn(credentials: LoginCredentials): Promise<{
    user: AuthUser | null
    session: Session | null
    error: AuthError | null
  }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      })

      if (error) {
        return { user: null, session: null, error }
      }

      // Get user profile data
      const userWithProfile = await this.getUserWithProfile(data.user)

      return {
        user: userWithProfile,
        session: data.session,
        error: null
      }
    } catch (error) {
      console.error('Sign in error:', error)
      return {
        user: null,
        session: null,
        error: error as AuthError
      }
    }
  }

  /**
   * Register new user with improved error handling
   */
  static async signUp(registerData: RegisterData): Promise<{
    user: User | null
    session: Session | null
    error: AuthError | null
  }> {
    try {
      // First create the auth user
      const { data, error } = await supabase.auth.signUp({
        email: registerData.email,
        password: registerData.password,
        options: {
          data: {
            first_name: registerData.firstName,
            last_name: registerData.lastName,
            company_name: registerData.companyName
          }
        }
      })

      if (error) {
        return { user: null, session: null, error }
      }

      if (data.user && data.session) {
        try {
          // Use the authenticated session to create profiles
          const { data: { session } } = await supabase.auth.getSession()
          
          if (session) {
            // Create client profile first
            const { data: clientProfile, error: clientError } = await supabase
              .from('client_profiles')
              .insert({
                name: `${registerData.firstName} ${registerData.lastName}`,
                email: registerData.email,
                phone: registerData.phone,
                company_name: registerData.companyName || '',
                subscription_plan: 'starter'
              })
              .select()
              .single()

            if (clientError) {
              console.error('Client profile creation error:', clientError)
              // Don't fail the entire registration, user can still login
              console.log('User created but profile creation failed. User can still login.')
            } else if (clientProfile) {
              // Create user profile
              const { error: userProfileError } = await supabase
                .from('user_profiles')
                .insert({
                  id: data.user.id,
                  client_id: clientProfile.id,
                  first_name: registerData.firstName,
                  last_name: registerData.lastName,
                  role: 'admin'
                })

              if (userProfileError) {
                console.error('User profile creation error:', userProfileError)
              }
            }
          }
        } catch (profileError) {
          console.error('Profile creation failed:', profileError)
          // Don't fail registration - user can still login
        }
      }

      return {
        user: data.user,
        session: data.session,
        error: null
      }
    } catch (error) {
      console.error('Sign up error:', error)
      return {
        user: null,
        session: null,
        error: error as AuthError
      }
    }
  }

  /**
   * Alternative registration method using RPC function
   */
  static async signUpWithRPC(registerData: RegisterData): Promise<{
    user: User | null
    session: Session | null
    error: AuthError | null
  }> {
    try {
      // First create the auth user
      const { data, error } = await supabase.auth.signUp({
        email: registerData.email,
        password: registerData.password,
        options: {
          data: {
            first_name: registerData.firstName,
            last_name: registerData.lastName,
            company_name: registerData.companyName
          }
        }
      })

      if (error) {
        return { user: null, session: null, error }
      }

      if (data.user) {
        try {
          // Use RPC function to create profiles (bypasses RLS)
          const { error: rpcError } = await supabase.rpc('create_user_profiles', {
            user_id: data.user.id,
            user_email: registerData.email,
            first_name: registerData.firstName,
            last_name: registerData.lastName,
            company_name: registerData.companyName || '',
            phone: registerData.phone || ''
          })

          if (rpcError) {
            console.error('RPC profile creation error:', rpcError)
          }
        } catch (rpcError) {
          console.error('RPC call failed:', rpcError)
        }
      }

      return {
        user: data.user,
        session: data.session,
        error: null
      }
    } catch (error) {
      console.error('Sign up with RPC error:', error)
      return {
        user: null,
        session: null,
        error: error as AuthError
      }
    }
  }

  /**
   * Create demo account with special handling
   */
  static async createDemoAccount(): Promise<{
    user: User | null
    session: Session | null
    error: AuthError | null
  }> {
    const demoEmail = `demo-${Date.now()}@dubaireal.com`
    
    return this.signUp({
      email: demoEmail,
      password: 'DemoPass123!',
      firstName: 'Demo',
      lastName: 'User',
      companyName: 'Dubai Real Estate Demo'
    })
  }

  /**
   * Sign out current user
   */
  static async signOut(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (error) {
      console.error('Sign out error:', error)
      return { error: error as AuthError }
    }
  }

  /**
   * Get current user session
   */
  static async getCurrentSession(): Promise<{
    session: Session | null
    user: AuthUser | null
  }> {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        return { session: null, user: null }
      }

      const userWithProfile = await this.getUserWithProfile(session.user)

      return {
        session,
        user: userWithProfile
      }
    } catch (error) {
      console.error('Get session error:', error)
      return { session: null, user: null }
    }
  }

  /**
   * Reset password
   */
  static async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      return { error }
    } catch (error) {
      console.error('Reset password error:', error)
      return { error: error as AuthError }
    }
  }

  /**
   * Update password
   */
  static async updatePassword(password: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.updateUser({ password })
      return { error }
    } catch (error) {
      console.error('Update password error:', error)
      return { error: error as AuthError }
    }
  }

  /**
   * Get user with profile data (improved error handling)
   */
  private static async getUserWithProfile(user: User): Promise<AuthUser> {
    try {
      // Get user profile with error handling
      const { data: userProfile, error: userError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (userError && userError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching user profile:', userError)
      }

      let clientProfile = null
      if (userProfile?.client_id) {
        // Get client profile with error handling
        const { data, error } = await supabase
          .from('client_profiles')
          .select('*')
          .eq('id', userProfile.client_id)
          .single()
        
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching client profile:', error)
        } else {
          clientProfile = data
        }
      }

      return {
        ...user,
        profile: userProfile,
        clientProfile
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return user as AuthUser
    }
  }

  /**
   * Auth state change listener
   */
  static onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }

  /**
   * Check if user is authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    const { session } = await this.getCurrentSession()
    return !!session
  }

  /**
   * Get current user's client ID
   */
  static async getCurrentUserClientId(): Promise<string | null> {
    try {
      const { user } = await this.getCurrentSession()
      return user?.profile?.client_id || null
    } catch (error) {
      console.error('Error getting client ID:', error)
      return null
    }
  }
}

export default AuthService
