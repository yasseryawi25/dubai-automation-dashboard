import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../common/LoadingStates';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

/**
 * Simplified AuthGuard with timeout protection
 */
const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAuth = true,
  redirectTo 
}) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication (with timeout in useAuth)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-gold to-primary-blue">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-neutral-600">Checking authentication...</p>
          <p className="mt-2 text-sm text-neutral-500">This should only take a moment</p>
        </div>
      </div>
    );
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    console.log('🔒 User not authenticated, redirecting to login')
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // If user is authenticated but trying to access auth pages (login, register)
  if (!requireAuth && isAuthenticated) {
    console.log('✅ User authenticated, redirecting to dashboard')
    const intendedPath = (location.state as any)?.from?.pathname || '/';
    return <Navigate to={redirectTo || intendedPath} replace />;
  }

  // Render the protected content
  console.log('🎯 Rendering protected content')
  return <>{children}</>;
};

export default AuthGuard;