import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
    
    // Log error to reporting service
    this.logError(error, errorInfo);
  }

  logError = (error: Error, errorInfo: ErrorInfo) => {
    // In production, send to error reporting service
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };
    
    // Example: send to backend or external service
    // fetch('/api/errors', { method: 'POST', body: JSON.stringify(errorReport) });
    console.log('Error Report:', errorReport);
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoBack = () => {
    window.history.back();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                عذراً، حدث خطأ غير متوقع
              </h1>
              <h2 className="text-lg font-semibold text-gray-600 mb-4">
                Sorry, an unexpected error occurred
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                يبدو أن هناك مشكلة في النظام. يرجى المحاولة مرة أخرى أو العودة للصفحة الرئيسية.
                <br />
                It seems there's a system issue. Please try again or return to the home page.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={this.handleReload}
                className="w-full bg-primary-gold text-white py-3 px-4 rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                إعادة تحميل الصفحة / Reload Page
              </button>
              
              <button
                onClick={this.handleGoBack}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                العودة للصفحة السابقة / Go Back
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                الصفحة الرئيسية / Home
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Technical Details (Development Only)
                </summary>
                <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono overflow-auto">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error.message}
                  </div>
                  <div className="mb-2">
                    <strong>Stack:</strong>
                    <pre className="whitespace-pre-wrap">{this.state.error.stack}</pre>
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="whitespace-pre-wrap">{this.state.errorInfo.componentStack}</pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 