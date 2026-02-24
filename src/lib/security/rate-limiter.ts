/**
 * Rate Limiter
 *
 * IP-based rate limiting for API endpoints
 *
 * Features:
 * - Configurable rate limits per endpoint
 * - In-memory storage (can be extended to use Redis)
 * - Automatic cleanup of expired entries
 * - Rate limit headers in responses
 */

import { NextRequest, NextResponse } from 'next/server'

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export interface RateLimitConfig {
  /** Maximum number of requests */
  maxRequests: number
  /** Time window in milliseconds */
  windowMs: number
  /** Custom message when rate limit is exceeded */
  message?: string
  /** Skip successful requests (only count errors) */
  skipSuccessfulRequests?: boolean
  /** Skip failed requests (only count successes) */
  skipFailedRequests?: boolean
}

interface RateLimitEntry {
  count: number
  resetTime: number
}

// ═══════════════════════════════════════════════════════════
// STORAGE
// ═══════════════════════════════════════════════════════════

/**
 * In-memory rate limit storage
 * Format: Map<"ip:endpoint", RateLimitEntry>
 */
const rateLimitStore = new Map<string, RateLimitEntry>()

/**
 * Cleanup expired entries every 10 minutes
 */
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key)
    }
  }
}, 10 * 60 * 1000) // 10 minutes

// ═══════════════════════════════════════════════════════════
// RATE LIMIT CONFIGURATIONS
// ═══════════════════════════════════════════════════════════

/**
 * Preset rate limit configurations
 */
export const RateLimitPresets = {
  /** Very strict: 10 requests per minute */
  VERY_STRICT: {
    maxRequests: 10,
    windowMs: 60 * 1000,
    message: 'Too many requests. Please try again in a minute.',
  } as RateLimitConfig,

  /** Strict: 30 requests per minute */
  STRICT: {
    maxRequests: 30,
    windowMs: 60 * 1000,
    message: 'Too many requests. Please try again in a minute.',
  } as RateLimitConfig,

  /** Moderate: 60 requests per minute */
  MODERATE: {
    maxRequests: 60,
    windowMs: 60 * 1000,
    message: 'Too many requests. Please try again in a minute.',
  } as RateLimitConfig,

  /** Relaxed: 120 requests per minute */
  RELAXED: {
    maxRequests: 120,
    windowMs: 60 * 1000,
    message: 'Too many requests. Please try again in a minute.',
  } as RateLimitConfig,

  /** Webhook: 100 requests per minute (for external services) */
  WEBHOOK: {
    maxRequests: 100,
    windowMs: 60 * 1000,
    message: 'Webhook rate limit exceeded. Please reduce request frequency.',
  } as RateLimitConfig,

  /** API: 60 requests per minute (for API endpoints) */
  API: {
    maxRequests: 60,
    windowMs: 60 * 1000,
    message: 'API rate limit exceeded. Please try again in a minute.',
  } as RateLimitConfig,
}

// ═══════════════════════════════════════════════════════════
// RATE LIMITER MIDDLEWARE
// ═══════════════════════════════════════════════════════════

/**
 * Get client IP address from request
 */
function getClientIp(request: NextRequest): string {
  // Try various headers (in order of priority)
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  const cfConnectingIp = request.headers.get('cf-connecting-ip') // Cloudflare
  if (cfConnectingIp) {
    return cfConnectingIp
  }

  // Fallback to 'unknown' if no IP found
  return 'unknown'
}

/**
 * Rate limit check
 *
 * @param request - Next.js request object
 * @param config - Rate limit configuration
 * @param identifier - Optional custom identifier (defaults to IP + pathname)
 * @returns Rate limit result with headers
 */
export function checkRateLimit(
  request: NextRequest,
  config: RateLimitConfig,
  identifier?: string
): {
  allowed: boolean
  headers: Record<string, string>
  remaining: number
  resetTime: number
  retryAfter?: number
} {
  const ip = getClientIp(request)
  const pathname = request.nextUrl.pathname
  const key = identifier || `${ip}:${pathname}`

  const now = Date.now()
  const entry = rateLimitStore.get(key)

  // No existing entry or entry expired - create new
  if (!entry || entry.resetTime < now) {
    const resetTime = now + config.windowMs

    rateLimitStore.set(key, {
      count: 1,
      resetTime,
    })

    return {
      allowed: true,
      headers: {
        'X-RateLimit-Limit': config.maxRequests.toString(),
        'X-RateLimit-Remaining': (config.maxRequests - 1).toString(),
        'X-RateLimit-Reset': new Date(resetTime).toISOString(),
      },
      remaining: config.maxRequests - 1,
      resetTime,
    }
  }

  // Existing entry - check if limit exceeded
  if (entry.count >= config.maxRequests) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000) // seconds

    return {
      allowed: false,
      headers: {
        'X-RateLimit-Limit': config.maxRequests.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': new Date(entry.resetTime).toISOString(),
        'Retry-After': retryAfter.toString(),
      },
      remaining: 0,
      resetTime: entry.resetTime,
      retryAfter,
    }
  }

  // Increment count
  entry.count++

  return {
    allowed: true,
    headers: {
      'X-RateLimit-Limit': config.maxRequests.toString(),
      'X-RateLimit-Remaining': (config.maxRequests - entry.count).toString(),
      'X-RateLimit-Reset': new Date(entry.resetTime).toISOString(),
    },
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  }
}

/**
 * Rate limit middleware wrapper
 *
 * Usage in API route:
 * ```ts
 * export async function POST(request: NextRequest) {
 *   const rateLimitResult = rateLimit(request, RateLimitPresets.WEBHOOK)
 *   if (rateLimitResult) return rateLimitResult
 *
 *   // ... your handler code
 * }
 * ```
 */
export function rateLimit(
  request: NextRequest,
  config: RateLimitConfig,
  identifier?: string
): NextResponse | null {
  const result = checkRateLimit(request, config, identifier)

  // Rate limit exceeded
  if (!result.allowed) {
    const message = config.message || 'Too many requests'

    return NextResponse.json(
      {
        success: false,
        error: message,
        retryAfter: result.retryAfter,
        limit: config.maxRequests,
        windowMs: config.windowMs,
      },
      {
        status: 429,
        headers: result.headers,
      }
    )
  }

  // Rate limit OK - return null (let request proceed)
  return null
}

/**
 * Add rate limit headers to a response
 */
export function addRateLimitHeaders(
  response: NextResponse,
  request: NextRequest,
  config: RateLimitConfig,
  identifier?: string
): NextResponse {
  const result = checkRateLimit(request, config, identifier)

  // Add headers
  Object.entries(result.headers).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
}

// ═══════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════

/**
 * Get current rate limit status for an IP/endpoint
 */
export function getRateLimitStatus(
  ip: string,
  endpoint: string
): {
  count: number
  remaining: number
  resetTime: number
} | null {
  const key = `${ip}:${endpoint}`
  const entry = rateLimitStore.get(key)

  if (!entry) {
    return null
  }

  return {
    count: entry.count,
    remaining: Math.max(0, 100 - entry.count), // Assuming max 100
    resetTime: entry.resetTime,
  }
}

/**
 * Clear rate limit for specific IP/endpoint
 * Useful for whitelisting or manual resets
 */
export function clearRateLimit(ip: string, endpoint?: string): void {
  if (endpoint) {
    const key = `${ip}:${endpoint}`
    rateLimitStore.delete(key)
  } else {
    // Clear all entries for this IP
    for (const key of rateLimitStore.keys()) {
      if (key.startsWith(`${ip}:`)) {
        rateLimitStore.delete(key)
      }
    }
  }
}

/**
 * Get all rate limit entries (for debugging/monitoring)
 */
export function getAllRateLimits(): Array<{
  key: string
  count: number
  resetTime: number
}> {
  return Array.from(rateLimitStore.entries()).map(([key, entry]) => ({
    key,
    count: entry.count,
    resetTime: entry.resetTime,
  }))
}

/**
 * Clear all rate limits (use with caution!)
 */
export function clearAllRateLimits(): void {
  rateLimitStore.clear()
  console.log('[RateLimiter] All rate limits cleared')
}
