import React, { Suspense, ReactNode } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { LoadingSpinner, FullPageLoading, CardSkeleton } from './LoadingStates';

interface LoadingWrapperProps {
  children: ReactNode;
  loading?: boolean;
  error?: any;
  fallback?: ReactNode;
  skeleton?: 'card' | 'full' | 'spinner';
  onRetry?: () => void;
  className?: string;
}

// Default fallback component
const DefaultFallback: React.FC = () => (
  <div className="flex items-center justify-center p-8">
    <LoadingSpinner size="lg" />
  </div>
);

// Error display component
const ErrorDisplay: React.FC<{ error: any; onRetry?: () => void }> = ({ error, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
    <div className="text-red-600 font-semibold mb-2">
      {error?.message || 'An error occurred'}
    </div>
    {onRetry && (
      <button
        onClick={onRetry}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
      >
        Try Again
      </button>
    )}
  </div>
);

// Loading wrapper component
const LoadingWrapper: React.FC<LoadingWrapperProps> = ({
  children,
  loading = false,
  error = null,
  fallback,
  skeleton = 'spinner',
  onRetry,
  className = ''
}) => {
  // Show error if present
  if (error) {
    return <ErrorDisplay error={error} onRetry={onRetry} />;
  }

  // Show loading state
  if (loading) {
    if (fallback) {
      return <>{fallback}</>;
    }

    switch (skeleton) {
      case 'card':
        return <CardSkeleton className={className} />;
      case 'full':
        return <FullPageLoading />;
      default:
        return <DefaultFallback />;
    }
  }

  // Show children when not loading and no error
  return <>{children}</>;
};

// Suspense wrapper with error boundary
interface SuspenseWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  errorFallback?: ReactNode;
}

const SuspenseWrapper: React.FC<SuspenseWrapperProps> = ({
  children,
  fallback = <DefaultFallback />,
  errorFallback
}) => (
  <ErrorBoundary fallback={errorFallback}>
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  </ErrorBoundary>
);

// Async component wrapper
interface AsyncWrapperProps {
  children: ReactNode;
  promise: Promise<any>;
  fallback?: ReactNode;
  errorFallback?: ReactNode;
}

const AsyncWrapper: React.FC<AsyncWrapperProps> = ({
  children,
  promise,
  fallback = <DefaultFallback />,
  errorFallback
}) => {
  const [state, setState] = React.useState<{
    loading: boolean;
    error: any;
    data: any;
  }>({
    loading: true,
    error: null,
    data: null
  });

  React.useEffect(() => {
    promise
      .then(data => setState({ loading: false, error: null, data }))
      .catch(error => setState({ loading: false, error, data: null }));
  }, [promise]);

  return (
    <ErrorBoundary fallback={errorFallback}>
      <LoadingWrapper
        loading={state.loading}
        error={state.error}
        fallback={fallback}
      >
        {children}
      </LoadingWrapper>
    </ErrorBoundary>
  );
};

// Module-specific loading wrappers
export const ModuleLoadingWrapper = {
  Dashboard: ({ children, loading, error, onRetry }: LoadingWrapperProps) => (
    <LoadingWrapper
      loading={loading}
      error={error}
      onRetry={onRetry}
      skeleton="card"
    >
      {children}
    </LoadingWrapper>
  ),

  Table: ({ children, loading, error, onRetry }: LoadingWrapperProps) => (
    <LoadingWrapper
      loading={loading}
      error={error}
      onRetry={onRetry}
      skeleton="card"
    >
      {children}
    </LoadingWrapper>
  ),

  Form: ({ children, loading, error, onRetry }: LoadingWrapperProps) => (
    <LoadingWrapper
      loading={loading}
      error={error}
      onRetry={onRetry}
      skeleton="card"
    >
      {children}
    </LoadingWrapper>
  ),

  FullPage: ({ children, loading, error, onRetry }: LoadingWrapperProps) => (
    <LoadingWrapper
      loading={loading}
      error={error}
      onRetry={onRetry}
      skeleton="full"
    >
      {children}
    </LoadingWrapper>
  )
};

// Higher-order component for adding loading states
export const withLoading = <P extends object>(
  Component: React.ComponentType<P>,
  loadingProps: Partial<LoadingWrapperProps> = {}
) => {
  return React.forwardRef<any, P & LoadingWrapperProps>((props, ref) => {
    const { loading, error, onRetry, ...componentProps } = props;
    
    return (
      <LoadingWrapper
        loading={loading}
        error={error}
        onRetry={onRetry}
        {...loadingProps}
      >
        <Component {...(componentProps as P)} ref={ref} />
      </LoadingWrapper>
    );
  });
};

export default LoadingWrapper;
export { SuspenseWrapper, AsyncWrapper }; 