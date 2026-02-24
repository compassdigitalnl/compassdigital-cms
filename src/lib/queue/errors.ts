/**
 * Advanced Error Handling for BullMQ Workers
 *
 * Classifies errors and determines appropriate retry strategies
 */

// ═══════════════════════════════════════════════════════════
// ERROR TYPES
// ═══════════════════════════════════════════════════════════

export enum ErrorType {
  // Transient errors - safe to retry
  NETWORK = 'network',
  RATE_LIMIT = 'rate_limit',
  TIMEOUT = 'timeout',
  SERVICE_UNAVAILABLE = 'service_unavailable',

  // Permanent errors - DO NOT retry
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  NOT_FOUND = 'not_found',
  CONFLICT = 'conflict',

  // Application errors
  DATABASE = 'database',
  EXTERNAL_API = 'external_api',
  BUSINESS_LOGIC = 'business_logic',

  // Unknown
  UNKNOWN = 'unknown',
}

export interface ClassifiedError {
  type: ErrorType
  retryable: boolean
  retryDelay?: number // Milliseconds
  maxRetries?: number
  originalError: Error
  message: string
  metadata?: Record<string, any>
}

// ═══════════════════════════════════════════════════════════
// ERROR CLASSIFICATION
// ═══════════════════════════════════════════════════════════

/**
 * Classify error and determine retry strategy
 */
export function classifyError(error: any): ClassifiedError {
  const errorMessage = error.message || String(error)
  const statusCode = error.response?.status || error.statusCode

  // Network errors (ECONNREFUSED, ETIMEDOUT, etc.)
  if (
    error.code === 'ECONNREFUSED' ||
    error.code === 'ETIMEDOUT' ||
    error.code === 'ENOTFOUND' ||
    error.code === 'EAI_AGAIN' ||
    errorMessage.includes('network') ||
    errorMessage.includes('connection')
  ) {
    return {
      type: ErrorType.NETWORK,
      retryable: true,
      retryDelay: 5000, // 5s
      maxRetries: 5,
      originalError: error,
      message: 'Network error - will retry',
      metadata: { code: error.code },
    }
  }

  // Rate limiting (429, 503 with Retry-After)
  if (statusCode === 429 || statusCode === 503) {
    const retryAfter = error.response?.headers?.['retry-after']
    const retryDelay = retryAfter ? parseInt(retryAfter) * 1000 : 60000 // Default 60s

    return {
      type: ErrorType.RATE_LIMIT,
      retryable: true,
      retryDelay,
      maxRetries: 3,
      originalError: error,
      message: `Rate limited - retry after ${retryDelay}ms`,
      metadata: { statusCode, retryAfter },
    }
  }

  // Service unavailable (502, 503, 504)
  if (statusCode === 502 || statusCode === 503 || statusCode === 504) {
    return {
      type: ErrorType.SERVICE_UNAVAILABLE,
      retryable: true,
      retryDelay: 10000, // 10s
      maxRetries: 3,
      originalError: error,
      message: 'Service unavailable - will retry',
      metadata: { statusCode },
    }
  }

  // Timeout errors
  if (
    error.code === 'ETIMEDOUT' ||
    errorMessage.includes('timeout') ||
    errorMessage.includes('timed out')
  ) {
    return {
      type: ErrorType.TIMEOUT,
      retryable: true,
      retryDelay: 3000, // 3s
      maxRetries: 3,
      originalError: error,
      message: 'Request timeout - will retry',
      metadata: { code: error.code },
    }
  }

  // Validation errors (400)
  if (
    statusCode === 400 ||
    errorMessage.includes('validation') ||
    errorMessage.includes('invalid')
  ) {
    return {
      type: ErrorType.VALIDATION,
      retryable: false,
      originalError: error,
      message: 'Validation error - permanent failure',
      metadata: { statusCode },
    }
  }

  // Authentication errors (401)
  if (statusCode === 401) {
    return {
      type: ErrorType.AUTHENTICATION,
      retryable: false,
      originalError: error,
      message: 'Authentication failed - check API credentials',
      metadata: { statusCode },
    }
  }

  // Authorization errors (403)
  if (statusCode === 403) {
    return {
      type: ErrorType.AUTHORIZATION,
      retryable: false,
      originalError: error,
      message: 'Authorization failed - insufficient permissions',
      metadata: { statusCode },
    }
  }

  // Not found (404)
  if (statusCode === 404) {
    return {
      type: ErrorType.NOT_FOUND,
      retryable: false,
      originalError: error,
      message: 'Resource not found',
      metadata: { statusCode },
    }
  }

  // Conflict (409)
  if (statusCode === 409) {
    return {
      type: ErrorType.CONFLICT,
      retryable: false,
      originalError: error,
      message: 'Conflict - resource already exists or state conflict',
      metadata: { statusCode },
    }
  }

  // Database errors
  if (
    errorMessage.includes('database') ||
    errorMessage.includes('sql') ||
    errorMessage.includes('postgres') ||
    error.code?.startsWith('PG')
  ) {
    return {
      type: ErrorType.DATABASE,
      retryable: true,
      retryDelay: 2000, // 2s
      maxRetries: 3,
      originalError: error,
      message: 'Database error - will retry',
      metadata: { code: error.code },
    }
  }

  // External API errors
  if (errorMessage.includes('listmonk') || errorMessage.includes('API')) {
    return {
      type: ErrorType.EXTERNAL_API,
      retryable: true,
      retryDelay: 5000, // 5s
      maxRetries: 3,
      originalError: error,
      message: 'External API error - will retry',
    }
  }

  // Business logic errors
  if (
    errorMessage.includes('quota') ||
    errorMessage.includes('limit reached') ||
    errorMessage.includes('rate limit')
  ) {
    return {
      type: ErrorType.BUSINESS_LOGIC,
      retryable: false,
      originalError: error,
      message: 'Business logic error - permanent failure',
    }
  }

  // Unknown error - retry with caution
  return {
    type: ErrorType.UNKNOWN,
    retryable: true,
    retryDelay: 10000, // 10s
    maxRetries: 2, // Limited retries for unknown errors
    originalError: error,
    message: 'Unknown error - limited retries',
  }
}

// ═══════════════════════════════════════════════════════════
// RETRY STRATEGY
// ═══════════════════════════════════════════════════════════

/**
 * Determine if job should be retried based on error and attempt count
 */
export function shouldRetry(error: any, attemptsMade: number): {
  shouldRetry: boolean
  delay?: number
  reason: string
} {
  const classified = classifyError(error)

  // Non-retryable errors
  if (!classified.retryable) {
    return {
      shouldRetry: false,
      reason: `${classified.type}: ${classified.message}`,
    }
  }

  // Check max retries
  const maxRetries = classified.maxRetries || 3
  if (attemptsMade >= maxRetries) {
    return {
      shouldRetry: false,
      reason: `Max retries (${maxRetries}) reached for ${classified.type}`,
    }
  }

  // Calculate delay (exponential backoff + jitter)
  const baseDelay = classified.retryDelay || 2000
  const exponentialDelay = baseDelay * Math.pow(2, attemptsMade - 1)
  const jitter = Math.random() * 1000 // 0-1s jitter
  const finalDelay = Math.min(exponentialDelay + jitter, 60000) // Max 60s

  return {
    shouldRetry: true,
    delay: finalDelay,
    reason: `Retrying ${classified.type} (attempt ${attemptsMade + 1}/${maxRetries})`,
  }
}

// ═══════════════════════════════════════════════════════════
// DEAD LETTER QUEUE
// ═══════════════════════════════════════════════════════════

/**
 * Move failed job to dead letter queue for manual inspection
 */
export async function moveToDLQ(
  jobName: string,
  jobData: any,
  error: ClassifiedError,
  attemptsMade: number
): Promise<void> {
  try {
    // In production, this would send to a dead letter queue
    // For now, we log it for manual inspection
    console.error('[DLQ] Job permanently failed:', {
      jobName,
      jobData,
      errorType: error.type,
      errorMessage: error.message,
      attemptsMade,
      timestamp: new Date().toISOString(),
    })

    // TODO: Send to monitoring/alerting system (Sentry, etc.)
    // TODO: Store in database for retry dashboard
  } catch (dlqError: any) {
    console.error('[DLQ] Failed to move job to DLQ:', dlqError)
  }
}

// ═══════════════════════════════════════════════════════════
// ERROR REPORTING
// ═══════════════════════════════════════════════════════════

/**
 * Report error to monitoring system
 */
export function reportError(
  jobName: string,
  error: ClassifiedError,
  metadata?: Record<string, any>
): void {
  console.error(`[Error Report] ${jobName}:`, {
    type: error.type,
    message: error.message,
    retryable: error.retryable,
    metadata: { ...error.metadata, ...metadata },
    stack: error.originalError.stack,
  })

  // TODO: Send to Sentry or other error tracking
  // Sentry.captureException(error.originalError, {
  //   tags: {
  //     jobName,
  //     errorType: error.type,
  //     retryable: error.retryable,
  //   },
  //   extra: metadata,
  // })
}

// ═══════════════════════════════════════════════════════════
// CIRCUIT BREAKER
// ═══════════════════════════════════════════════════════════

interface CircuitState {
  failures: number
  lastFailureTime: number
  state: 'closed' | 'open' | 'half-open'
}

const circuits = new Map<string, CircuitState>()

/**
 * Circuit breaker pattern for external services
 */
export class CircuitBreaker {
  private serviceName: string
  private failureThreshold: number
  private resetTimeout: number

  constructor(serviceName: string, failureThreshold: number = 5, resetTimeout: number = 60000) {
    this.serviceName = serviceName
    this.failureThreshold = failureThreshold
    this.resetTimeout = resetTimeout

    if (!circuits.has(serviceName)) {
      circuits.set(serviceName, {
        failures: 0,
        lastFailureTime: 0,
        state: 'closed',
      })
    }
  }

  /**
   * Execute function with circuit breaker protection
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    const circuit = circuits.get(this.serviceName)!

    // Check if circuit is open
    if (circuit.state === 'open') {
      const timeSinceFailure = Date.now() - circuit.lastFailureTime

      if (timeSinceFailure < this.resetTimeout) {
        throw new Error(
          `Circuit breaker OPEN for ${this.serviceName} (${Math.round((this.resetTimeout - timeSinceFailure) / 1000)}s remaining)`
        )
      }

      // Try half-open
      circuit.state = 'half-open'
      console.log(`[Circuit Breaker] ${this.serviceName} entering HALF-OPEN state`)
    }

    try {
      const result = await fn()

      // Success - reset circuit
      if (circuit.state === 'half-open') {
        console.log(`[Circuit Breaker] ${this.serviceName} closing circuit (recovered)`)
      }

      circuit.failures = 0
      circuit.state = 'closed'
      return result
    } catch (error) {
      circuit.failures++
      circuit.lastFailureTime = Date.now()

      console.error(
        `[Circuit Breaker] ${this.serviceName} failure ${circuit.failures}/${this.failureThreshold}`
      )

      // Open circuit if threshold reached
      if (circuit.failures >= this.failureThreshold) {
        circuit.state = 'open'
        console.error(
          `[Circuit Breaker] ${this.serviceName} circuit OPEN after ${circuit.failures} failures`
        )
      }

      throw error
    }
  }

  /**
   * Get current circuit state
   */
  getState(): CircuitState {
    return circuits.get(this.serviceName)!
  }

  /**
   * Manually reset circuit
   */
  reset(): void {
    circuits.set(this.serviceName, {
      failures: 0,
      lastFailureTime: 0,
      state: 'closed',
    })
    console.log(`[Circuit Breaker] ${this.serviceName} manually reset`)
  }
}
