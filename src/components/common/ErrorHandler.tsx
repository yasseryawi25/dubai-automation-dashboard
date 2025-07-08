// Centralized error handling utility for Dubai Real Estate Platform

export interface ErrorInfo {
  code?: string;
  message: string;
  details?: string;
  timestamp: string;
  context?: string;
  retryable?: boolean;
}

export interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: any;
}

// Error codes and user-friendly messages
const ERROR_MESSAGES = {
  // Network errors
  NETWORK_ERROR: {
    en: 'Network connection error. Please check your internet connection.',
    ar: 'خطأ في الاتصال بالشبكة. يرجى التحقق من اتصال الإنترنت.'
  },
  TIMEOUT_ERROR: {
    en: 'Request timed out. Please try again.',
    ar: 'انتهت مهلة الطلب. يرجى المحاولة مرة أخرى.'
  },
  
  // Authentication errors
  UNAUTHORIZED: {
    en: 'You are not authorized to perform this action. Please log in again.',
    ar: 'غير مصرح لك بتنفيذ هذا الإجراء. يرجى تسجيل الدخول مرة أخرى.'
  },
  FORBIDDEN: {
    en: 'Access denied. You do not have permission for this resource.',
    ar: 'تم رفض الوصول. ليس لديك إذن لهذا المورد.'
  },
  
  // Server errors
  SERVER_ERROR: {
    en: 'Server error occurred. Please try again later.',
    ar: 'حدث خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.'
  },
  SERVICE_UNAVAILABLE: {
    en: 'Service temporarily unavailable. Please try again later.',
    ar: 'الخدمة غير متاحة مؤقتاً. يرجى المحاولة مرة أخرى لاحقاً.'
  },
  
  // Validation errors
  VALIDATION_ERROR: {
    en: 'Please check your input and try again.',
    ar: 'يرجى التحقق من المدخلات والمحاولة مرة أخرى.'
  },
  INVALID_DATA: {
    en: 'Invalid data provided. Please check your information.',
    ar: 'بيانات غير صالحة. يرجى التحقق من المعلومات.'
  },
  
  // Business logic errors
  DUPLICATE_ENTRY: {
    en: 'This record already exists.',
    ar: 'هذا السجل موجود بالفعل.'
  },
  NOT_FOUND: {
    en: 'The requested resource was not found.',
    ar: 'لم يتم العثور على المورد المطلوب.'
  },
  
  // Dubai-specific errors
  RERA_VALIDATION: {
    en: 'RERA number validation failed. Please check your license details.',
    ar: 'فشل التحقق من رقم ريرا. يرجى التحقق من تفاصيل الترخيص.'
  },
  PROPERTY_LIMIT: {
    en: 'You have reached your property listing limit for this plan.',
    ar: 'لقد وصلت إلى حد إدراج العقارات لهذه الخطة.'
  },
  AGENT_LIMIT: {
    en: 'You have reached your AI agent limit for this plan.',
    ar: 'لقد وصلت إلى حد وكلاء الذكاء الاصطناعي لهذه الخطة.'
  }
};

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: ErrorInfo[] = [];
  private retryAttempts: Map<string, number> = new Map();
  private maxRetries = 3;

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  // Parse API errors and convert to user-friendly messages
  parseApiError(error: ApiError, language: 'en' | 'ar' = 'en'): ErrorInfo {
    const timestamp = new Date().toISOString();
    let message = '';
    let code = 'UNKNOWN_ERROR';

    switch (error.status) {
      case 400:
        code = 'VALIDATION_ERROR';
        message = this.getLocalizedMessage('VALIDATION_ERROR', language);
        break;
      case 401:
        code = 'UNAUTHORIZED';
        message = this.getLocalizedMessage('UNAUTHORIZED', language);
        break;
      case 403:
        code = 'FORBIDDEN';
        message = this.getLocalizedMessage('FORBIDDEN', language);
        break;
      case 404:
        code = 'NOT_FOUND';
        message = this.getLocalizedMessage('NOT_FOUND', language);
        break;
      case 409:
        code = 'DUPLICATE_ENTRY';
        message = this.getLocalizedMessage('DUPLICATE_ENTRY', language);
        break;
      case 422:
        code = 'INVALID_DATA';
        message = this.getLocalizedMessage('INVALID_DATA', language);
        break;
      case 500:
        code = 'SERVER_ERROR';
        message = this.getLocalizedMessage('SERVER_ERROR', language);
        break;
      case 503:
        code = 'SERVICE_UNAVAILABLE';
        message = this.getLocalizedMessage('SERVICE_UNAVAILABLE', language);
        break;
      default:
        code = 'UNKNOWN_ERROR';
        message = this.getLocalizedMessage('SERVER_ERROR', language);
    }

    return {
      code,
      message,
      details: error.details,
      timestamp,
      retryable: this.isRetryable(error.status)
    };
  }

  // Parse network errors
  parseNetworkError(error: any, language: 'en' | 'ar' = 'en'): ErrorInfo {
    const timestamp = new Date().toISOString();
    let code = 'NETWORK_ERROR';
    let message = '';

    if (error.name === 'TimeoutError' || error.code === 'ECONNABORTED') {
      code = 'TIMEOUT_ERROR';
      message = this.getLocalizedMessage('TIMEOUT_ERROR', language);
    } else if (error.code === 'NETWORK_ERROR') {
      message = this.getLocalizedMessage('NETWORK_ERROR', language);
    } else {
      message = this.getLocalizedMessage('NETWORK_ERROR', language);
    }

    return {
      code,
      message,
      timestamp,
      retryable: true
    };
  }

  // Get localized error message
  getLocalizedMessage(code: string, language: 'en' | 'ar'): string {
    const errorMessage = ERROR_MESSAGES[code as keyof typeof ERROR_MESSAGES];
    if (errorMessage) {
      return errorMessage[language];
    }
    return language === 'ar' ? 'حدث خطأ غير معروف' : 'An unknown error occurred';
  }

  // Check if error is retryable
  isRetryable(status: number): boolean {
    return [408, 429, 500, 502, 503, 504].includes(status);
  }

  // Log error for reporting
  logError(error: ErrorInfo, context?: string): void {
    const errorWithContext = {
      ...error,
      context: context || 'unknown',
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    };

    this.errorLog.push(errorWithContext);
    
    // In production, send to error reporting service
    if (process.env.NODE_ENV === 'production') {
      this.reportError(errorWithContext);
    }

    console.error('Error logged:', errorWithContext);
  }

  // Report error to external service
  private reportError(error: ErrorInfo): void {
    // Example: send to backend or external service
    // fetch('/api/errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(error)
    // }).catch(console.error);
  }

  // Retry mechanism
  async retryOperation<T>(
    operation: () => Promise<T>,
    operationId: string,
    maxRetries: number = this.maxRetries
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          break;
        }

        // Exponential backoff
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }

  // Get error log
  getErrorLog(): ErrorInfo[] {
    return [...this.errorLog];
  }

  // Clear error log
  clearErrorLog(): void {
    this.errorLog = [];
  }

  // Create user-friendly error display
  createErrorDisplay(error: ErrorInfo, onRetry?: () => void, onDismiss?: () => void) {
    return {
      title: error.code || 'Error',
      message: error.message,
      retryable: error.retryable,
      onRetry,
      onDismiss,
      timestamp: error.timestamp
    };
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance();

// Utility functions for common error scenarios
export const handleApiError = (error: any, language: 'en' | 'ar' = 'en') => {
  if (error.response) {
    return errorHandler.parseApiError(error.response.data, language);
  } else if (error.request) {
    return errorHandler.parseNetworkError(error, language);
  } else {
    return {
      code: 'UNKNOWN_ERROR',
      message: errorHandler.getLocalizedMessage('SERVER_ERROR', language),
      timestamp: new Date().toISOString(),
      retryable: false
    };
  }
};

export const handleAsyncError = async <T,>(
  operation: () => Promise<T>,
  context: string,
  language: 'en' | 'ar' = 'en'
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    const errorInfo = handleApiError(error, language);
    errorInfo.context = context;
    errorHandler.logError(errorInfo, context);
    throw errorInfo;
  }
}; 