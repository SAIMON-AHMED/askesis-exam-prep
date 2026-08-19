import axios, { AxiosError } from 'axios';

interface SentryClient {
  captureException: (error: Error, context?: Record<string, unknown>) => void;
}

export interface ErrorResponse {
  error: string;
  message: string;
  details?: Record<string, any>;
  error_id?: string;
}

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public errorCode: string,
    public message: string,
    public details?: Record<string, any>,
    public errorId?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Parse error response from API
 */
export function parseError(error: unknown): AppError {
  // Network error or timeout
  if (!(error instanceof AxiosError)) {
    return new AppError(
      500,
      'NETWORK_ERROR',
      'Network error. Please check your connection and try again.'
    );
  }

  // Request was made but no response was received
  if (!error.response) {
    return new AppError(
      0,
      'TIMEOUT_ERROR',
      'Request timeout. Please try again.'
    );
  }

  const response = error.response;
  const data = response.data as ErrorResponse;

  return new AppError(
    response.status,
    data.error || 'UNKNOWN_ERROR',
    data.message || 'An unexpected error occurred',
    data.details,
    data.error_id
  );
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: AppError): string {
  const messages: Record<string, string> = {
    VALIDATION_ERROR: 'Please check your input and try again.',
    AUTH_ERROR: 'Invalid email or password.',
    FORBIDDEN: 'You do not have permission to perform this action.',
    NOT_FOUND: 'The requested resource was not found.',
    CONFLICT: 'This resource already exists.',
    RATE_LIMITED: 'Too many requests. Please wait a moment and try again.',
    INTERNAL_ERROR: 'An unexpected error occurred. Please try again later.',
    NETWORK_ERROR: 'Network connection error. Please check your internet.',
    TIMEOUT_ERROR: 'Request timed out. Please try again.',
  };

  return messages[error.errorCode] || error.message;
}

/**
 * Log error for monitoring (Sentry, etc.)
 */
export function logError(error: AppError, context?: Record<string, any>) {
  console.error('Application Error:', {
    errorCode: error.errorCode,
    statusCode: error.statusCode,
    message: error.message,
    errorId: error.errorId,
    context,
  });

  // Send to error tracking service (Sentry, etc.)
  const sentry = typeof window !== 'undefined'
    ? (window as Window & { Sentry?: SentryClient }).Sentry
    : undefined;
  if (sentry) {
    sentry.captureException(error, {
      tags: {
        errorCode: error.errorCode,
        statusCode: error.statusCode,
      },
      extra: context,
    });
  }
}

/**
 * Is the error recoverable?
 */
export function isRecoverableError(error: AppError): boolean {
  const recoverableErrors = new Set([
    'TIMEOUT_ERROR',
    'RATE_LIMITED',
    'NETWORK_ERROR',
    'VALIDATION_ERROR',
  ]);
  return recoverableErrors.has(error.errorCode);
}

export function isAuthError(error: AppError): boolean {
  return error.errorCode === 'AUTH_ERROR' || error.statusCode === 401;
}

export function isForbiddenError(error: AppError): boolean {
  return error.errorCode === 'FORBIDDEN' || error.statusCode === 403;
}
