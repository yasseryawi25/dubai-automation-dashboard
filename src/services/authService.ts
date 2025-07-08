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
   * Register new user
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

      if (data.user) {
        // Create client profile
        const clientProfile = await this.createClientProfile({
          name: `${registerData.firstName} ${registerData.lastName}`,
          email: registerData.email,
          phone: registerData.phone,
          company_name: registerData.companyName
        })

        // Create user profile
        await this.createUserProfile({
          id: data.user.id,
          client_id: clientProfile.id,
          first_name: registerData.firstName,
          last_name: registerData.lastName,
          role: 'admin'
        })
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
   * Get user with profile data
   */
  private static async getUserWithProfile(user: User): Promise<AuthUser> {
    try {
      // Get user profile
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      let clientProfile = null
      if (userProfile?.client_id) {
        // Get client profile
        const { data } = await supabase
          .from('client_profiles')
          .select('*')
          .eq('id', userProfile.client_id)
          .single()
        
        clientProfile = data
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
   * Create client profile
   */
  private static async createClientProfile(data: {
    name: string
    email: string
    phone?: string
    company_name?: string
  }): Promise<ClientProfile> {
    const { data: clientProfile, error } = await supabase
      .from('client_profiles')
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        company_name: data.company_name,
        subscription_plan: 'starter'
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create client profile: ${error.message}`)
    }

    return clientProfile
  }

  /**
   * Create user profile
   */
  private static async createUserProfile(data: {
    id: string
    client_id: string
    first_name: string
    last_name: string
    role: string
  }): Promise<UserProfile> {
    const { data: userProfile, error } = await supabase
      .from('user_profiles')
      .insert(data)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create user profile: ${error.message}`)
    }

    return userProfile
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
