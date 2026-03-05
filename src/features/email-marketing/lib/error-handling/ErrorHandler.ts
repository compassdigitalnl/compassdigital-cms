/**
 * Error Handling & Retry Logic
 *
 * Centralized error handling for email marketing operations
 * Implements exponential backoff, dead letter queues, and error logging
 */

import type { Job } from 'bullmq'

/**
 * Error classification for different retry strategies
 */
export enum ErrorType {
  // Temporary errors - should retry
  NETWORK_ERROR = 'network_error',
  TIMEOUT = 'timeout',
  RATE_LIMIT = 'rate_limit',
  SERVER_ERROR = 'server_error', // 5xx errors

  // Permanent errors - should NOT retry
  VALIDATION_ERROR = 'validation_error',
  AUTH_ERROR = 'auth_error',
  NOT_FOUND = 'not_found',
  DUPLICATE = 'duplicate',
  FORBIDDEN = 'forbidden',

  // Unknown errors - retry with caution
  UNKNOWN = 'unknown',
}

/**
 * Classified error with context
 */
export interface ClassifiedError {
  type: ErrorType
  message: string
  originalError: Error
  shouldRetry: boolean
  retryAfter?: number // Milliseconds to wait before retry
  context?: Record<string, any>
}

/**
 * Classify error to determine retry strategy
 */
export function classifyError(error: any, context?: Record<string, any>): ClassifiedError {
  const message = error.message || String(error)

  // Network errors
  if (
    error.code === 'ECONNREFUSED' ||
    error.code === 'ENOTFOUND' ||
    error.code === 'ECONNRESET' ||
    message.includes('network') ||
    message.includes('connection')
  ) {
    return {
      type: ErrorType.NETWORK_ERROR,
      message: 'Network connection failed',
      originalError: error,
      shouldRetry: true,
      retryAfter: 5000, // 5 seconds
      context,
    }
  }

  // Timeout errors
  if (
    error.code === 'ETIMEDOUT' ||
    message.includes('timeout') ||
    message.includes('timed out')
  ) {
    return {
      type: ErrorType.TIMEOUT,
      message: 'Request timed out',
      originalError: error,
      shouldRetry: true,
      retryAfter: 10000, // 10 seconds
      context,
    }
  }

  // Rate limiting (429 Too Many Requests)
  if (error.status === 429 || message.includes('rate limit')) {
    // Extract retry-after header if available
    const retryAfter = error.headers?.['retry-after']
      ? parseInt(error.headers['retry-after']) * 1000
      : 60000 // Default 1 minute

    return {
      type: ErrorType.RATE_LIMIT,
      message: 'Rate limit exceeded',
      originalError: error,
      shouldRetry: true,
      retryAfter,
      context,
    }
  }

  // Server errors (5xx)
  if (error.status >= 500 && error.status < 600) {
    return {
      type: ErrorType.SERVER_ERROR,
      message: `Server error: ${error.status}`,
      originalError: error,
      shouldRetry: true,
      retryAfter: 30000, // 30 seconds
      context,
    }
  }

  // Validation errors (400)
  if (
    error.status === 400 ||
    message.includes('validation') ||
    message.includes('invalid') ||
    message.includes('required')
  ) {
    return {
      type: ErrorType.VALIDATION_ERROR,
      message: 'Validation failed',
      originalError: error,
      shouldRetry: false,
      context,
    }
  }

  // Authentication errors (401)
  if (error.status === 401 || message.includes('unauthorized') || message.includes('auth')) {
    return {
      type: ErrorType.AUTH_ERROR,
      message: 'Authentication failed',
      originalError: error,
      shouldRetry: false,
      context,
    }
  }

  // Not found errors (404)
  if (error.status === 404 || message.includes('not found')) {
    return {
      type: ErrorType.NOT_FOUND,
      message: 'Resource not found',
      originalError: error,
      shouldRetry: false,
      context,
    }
  }

  // Duplicate errors (409)
  if (error.status === 409 || message.includes('duplicate') || message.includes('already exists')) {
    return {
      type: ErrorType.DUPLICATE,
      message: 'Duplicate resource',
      originalError: error,
      shouldRetry: false,
      context,
    }
  }

  // Forbidden errors (403)
  if (error.status === 403 || message.includes('forbidden') || message.includes('permission')) {
    return {
      type: ErrorType.FORBIDDEN,
      message: 'Forbidden',
      originalError: error,
      shouldRetry: false,
      context,
    }
  }

  // Unknown error - retry with caution
  return {
    type: ErrorType.UNKNOWN,
    message: message || 'Unknown error',
    originalError: error,
    shouldRetry: true,
    retryAfter: 60000, // 1 minute
    context,
  }
}

/**
 * Calculate exponential backoff delay
 *
 * @param attempt - Current attempt number (0-based)
 * @param baseDelay - Base delay in milliseconds (default: 1000)
 * @param maxDelay - Maximum delay in milliseconds (default: 5 minutes)
 * @param jitter - Add random jitter to prevent thundering herd (default: true)
 * @returns Delay in milliseconds
 */
export function calculateBackoff(
  attempt: number,
  baseDelay: number = 1000,
  maxDelay: number = 5 * 60 * 1000,
  jitter: boolean = true,
): number {
  // Exponential: baseDelay * 2^attempt
  let delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay)

  // Add jitter (±25%)
  if (jitter) {
    const jitterAmount = delay * 0.25
    delay = delay + (Math.random() * 2 - 1) * jitterAmount
  }

  return Math.floor(delay)
}

/**
 * Retry configuration
 */
export interface RetryConfig {
  maxAttempts: number
  baseDelay: number
  maxDelay: number
  jitter: boolean
}

/**
 * Default retry configurations per error type
 */
export const DEFAULT_RETRY_CONFIGS: Record<ErrorType, RetryConfig> = {
  [ErrorType.NETWORK_ERROR]: {
    maxAttempts: 5,
    baseDelay: 1000,
    maxDelay: 60000,
    jitter: true,
  },
  [ErrorType.TIMEOUT]: {
    maxAttempts: 3,
    baseDelay: 5000,
    maxDelay: 60000,
    jitter: true,
  },
  [ErrorType.RATE_LIMIT]: {
    maxAttempts: 10,
    baseDelay: 60000, // 1 minute
    maxDelay: 15 * 60000, // 15 minutes
    jitter: true,
  },
  [ErrorType.SERVER_ERROR]: {
    maxAttempts: 5,
    baseDelay: 10000,
    maxDelay: 5 * 60000,
    jitter: true,
  },
  [ErrorType.UNKNOWN]: {
    maxAttempts: 3,
    baseDelay: 30000,
    maxDelay: 5 * 60000,
    jitter: true,
  },
  // No retries for permanent errors
  [ErrorType.VALIDATION_ERROR]: {
    maxAttempts: 0,
    baseDelay: 0,
    maxDelay: 0,
    jitter: false,
  },
  [ErrorType.AUTH_ERROR]: {
    maxAttempts: 0,
    baseDelay: 0,
    maxDelay: 0,
    jitter: false,
  },
  [ErrorType.NOT_FOUND]: {
    maxAttempts: 0,
    baseDelay: 0,
    maxDelay: 0,
    jitter: false,
  },
  [ErrorType.DUPLICATE]: {
    maxAttempts: 0,
    baseDelay: 0,
    maxDelay: 0,
    jitter: false,
  },
  [ErrorType.FORBIDDEN]: {
    maxAttempts: 0,
    baseDelay: 0,
    maxDelay: 0,
    jitter: false,
  },
}

/**
 * Execute function with automatic retry logic
 *
 * @param fn - Async function to execute
 * @param context - Context for error logging
 * @param customRetryConfig - Optional custom retry configuration
 * @returns Result of function or throws error after max retries
 */
export async function executeWithRetry<T>(
  fn: () => Promise<T>,
  context?: Record<string, any>,
  customRetryConfig?: Partial<RetryConfig>,
): Promise<T> {
  let lastError: ClassifiedError | null = null
  let attempt = 0

  while (true) {
    try {
      return await fn()
    } catch (error) {
      lastError = classifyError(error, { ...context, attempt })

      // Get retry config
      const defaultConfig = DEFAULT_RETRY_CONFIGS[lastError.type]
      const retryConfig: RetryConfig = {
        ...defaultConfig,
        ...customRetryConfig,
      }

      // Check if we should retry
      if (!lastError.shouldRetry || attempt >= retryConfig.maxAttempts) {
        console.error('[ErrorHandler] Max retries exceeded or non-retryable error', {
          error: lastError,
          attempt,
          maxAttempts: retryConfig.maxAttempts,
        })
        throw lastError.originalError
      }

      // Calculate backoff delay
      const delay = lastError.retryAfter || calculateBackoff(
        attempt,
        retryConfig.baseDelay,
        retryConfig.maxDelay,
        retryConfig.jitter,
      )

      console.warn(`[ErrorHandler] Retrying after ${delay}ms`, {
        error: lastError.type,
        message: lastError.message,
        attempt: attempt + 1,
        maxAttempts: retryConfig.maxAttempts,
        delay,
      })

      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, delay))

      attempt++
    }
  }
}

/**
 * BullMQ job error handler
 *
 * Determines if a job should be retried based on error classification
 */
export function handleJobError(job: Job, error: any): {
  shouldRetry: boolean
  retryDelay?: number
  moveToDeadLetter?: boolean
} {
  const classified = classifyError(error, {
    jobId: job.id,
    jobName: job.name,
    attemptsMade: job.attemptsMade,
  })

  const retryConfig = DEFAULT_RETRY_CONFIGS[classified.type]

  // Check if we've exceeded max attempts
  if (job.attemptsMade >= retryConfig.maxAttempts) {
    console.error('[ErrorHandler] Job max retries exceeded, moving to dead letter queue', {
      jobId: job.id,
      jobName: job.name,
      attemptsMade: job.attemptsMade,
      error: classified,
    })

    return {
      shouldRetry: false,
      moveToDeadLetter: true,
    }
  }

  // Non-retryable error
  if (!classified.shouldRetry) {
    console.error('[ErrorHandler] Non-retryable error, moving to dead letter queue', {
      jobId: job.id,
      jobName: job.name,
      error: classified,
    })

    return {
      shouldRetry: false,
      moveToDeadLetter: true,
    }
  }

  // Calculate retry delay
  const retryDelay =
    classified.retryAfter ||
    calculateBackoff(job.attemptsMade, retryConfig.baseDelay, retryConfig.maxDelay, retryConfig.jitter)

  console.warn('[ErrorHandler] Job will be retried', {
    jobId: job.id,
    jobName: job.name,
    attemptsMade: job.attemptsMade,
    maxAttempts: retryConfig.maxAttempts,
    retryDelay,
    errorType: classified.type,
  })

  return {
    shouldRetry: true,
    retryDelay,
    moveToDeadLetter: false,
  }
}

/**
 * Log error to monitoring system
 * (Placeholder - integrate with Sentry, Datadog, etc.)
 */
export function logErrorToMonitoring(error: ClassifiedError, context?: Record<string, any>) {
  // TODO: Integrate with monitoring service

  console.error('[ErrorHandler] Error logged to monitoring', {
    type: error.type,
    message: error.message,
    shouldRetry: error.shouldRetry,
    context: { ...error.context, ...context },
    stack: error.originalError.stack,
  })

  // Example Sentry integration (uncomment when ready):
  // Sentry.captureException(error.originalError, {
  //   tags: {
  //     error_type: error.type,
  //     should_retry: error.shouldRetry,
  //   },
  //   extra: {
  //     ...error.context,
  //     ...context,
  //   },
  // })
}

/**
 * Create error response for API endpoints
 */
export function createErrorResponse(error: ClassifiedError, statusCode?: number) {
  const defaultStatusCodes: Record<ErrorType, number> = {
    [ErrorType.NETWORK_ERROR]: 503,
    [ErrorType.TIMEOUT]: 504,
    [ErrorType.RATE_LIMIT]: 429,
    [ErrorType.SERVER_ERROR]: 500,
    [ErrorType.VALIDATION_ERROR]: 400,
    [ErrorType.AUTH_ERROR]: 401,
    [ErrorType.NOT_FOUND]: 404,
    [ErrorType.DUPLICATE]: 409,
    [ErrorType.FORBIDDEN]: 403,
    [ErrorType.UNKNOWN]: 500,
  }

  return {
    status: statusCode || defaultStatusCodes[error.type],
    body: {
      error: error.message,
      code: error.type,
      shouldRetry: error.shouldRetry,
      retryAfter: error.retryAfter ? Math.ceil(error.retryAfter / 1000) : undefined,
    },
  }
}
