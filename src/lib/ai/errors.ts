/**
 * AI Service Error Classes
 * Custom error types for better error handling
 */

export class AIServiceError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode: number = 500,
  ) {
    super(message)
    this.name = 'AIServiceError'
  }
}

export class AIConfigurationError extends AIServiceError {
  constructor(message: string) {
    super(message, 'AI_CONFIG_ERROR', 500)
    this.name = 'AIConfigurationError'
  }
}

export class AIAPIError extends AIServiceError {
  constructor(
    message: string,
    public originalError?: unknown,
  ) {
    super(message, 'AI_API_ERROR', 500)
    this.name = 'AIAPIError'
  }
}

export class AIValidationError extends AIServiceError {
  constructor(
    message: string,
    public validationErrors?: unknown[],
  ) {
    super(message, 'AI_VALIDATION_ERROR', 400)
    this.name = 'AIValidationError'
  }
}

export class AIRateLimitError extends AIServiceError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 'AI_RATE_LIMIT', 429)
    this.name = 'AIRateLimitError'
  }
}

export class AIQuotaExceededError extends AIServiceError {
  constructor(message: string = 'AI quota exceeded') {
    super(message, 'AI_QUOTA_EXCEEDED', 402)
    this.name = 'AIQuotaExceededError'
  }
}

export class AIGenerationError extends AIServiceError {
  constructor(message: string = 'AI generation failed') {
    super(message, 'AI_GENERATION_ERROR', 500)
    this.name = 'AIGenerationError'
  }
}

/**
 * Helper to check if error is an AI service error
 */
export function isAIServiceError(error: unknown): error is AIServiceError {
  return error instanceof AIServiceError
}

/**
 * Format error for API response
 */
export function formatAIError(error: unknown): {
  message: string
  code?: string
  statusCode: number
} {
  if (isAIServiceError(error)) {
    return {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'UNKNOWN_ERROR',
      statusCode: 500,
    }
  }

  return {
    message: 'An unknown error occurred',
    code: 'UNKNOWN_ERROR',
    statusCode: 500,
  }
}
