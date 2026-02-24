/**
 * Webhook Rate Limiter
 *
 * Protects webhook endpoints from abuse and DDoS attacks
 * Implements sliding window rate limiting with Redis
 */

import { getRedisClient } from '@/lib/queue/redis'
import type { NextRequest } from 'next/server'

/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests in window
  keyPrefix?: string // Redis key prefix
  skipSuccessfulRequests?: boolean // Don't count successful requests
  skipFailedRequests?: boolean // Don't count failed requests
}

/**
 * Rate limit result
 */
export interface RateLimitResult {
  allowed: boolean
  limit: number
  remaining: number
  resetAt: Date
  retryAfter?: number // Seconds until reset
}

/**
 * Webhook Rate Limiter
 */
export class WebhookRateLimiter {
  private redis: ReturnType<typeof getRedisClient>
  private config: Required<RateLimitConfig>

  constructor(config: RateLimitConfig) {
    this.redis = getRedisClient()
    this.config = {
      keyPrefix: 'webhook_rate_limit',
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
      ...config,
    }
  }

  /**
   * Check if request is allowed
   *
   * @param identifier - Unique identifier (IP, tenant ID, API key, etc.)
   * @returns Rate limit result
   */
  async checkLimit(identifier: string): Promise<RateLimitResult> {
    const key = `${this.config.keyPrefix}:${identifier}`
    const now = Date.now()
    const windowStart = now - this.config.windowMs

    try {
      // Use Redis sorted set for sliding window
      // Score is timestamp, value is request ID

      // Remove old entries outside the window
      await this.redis.zremrangebyscore(key, '-inf', windowStart.toString())

      // Count current requests in window
      const currentCount = await this.redis.zcard(key)

      // Check if limit exceeded
      if (currentCount >= this.config.maxRequests) {
        // Get oldest request in window to calculate reset time
        const oldestRequests = await this.redis.zrange(key, 0, 0, 'WITHSCORES')
        const oldestTimestamp = oldestRequests.length > 0 ? parseInt(oldestRequests[1]) : now
        const resetAt = new Date(oldestTimestamp + this.config.windowMs)
        const retryAfter = Math.ceil((resetAt.getTime() - now) / 1000)

        return {
          allowed: false,
          limit: this.config.maxRequests,
          remaining: 0,
          resetAt,
          retryAfter,
        }
      }

      // Add current request
      const requestId = `${now}:${Math.random().toString(36).substring(7)}`
      await this.redis.zadd(key, now.toString(), requestId)

      // Set expiry on key (cleanup)
      await this.redis.expire(key, Math.ceil(this.config.windowMs / 1000))

      // Calculate next reset time
      const resetAt = new Date(now + this.config.windowMs)

      return {
        allowed: true,
        limit: this.config.maxRequests,
        remaining: this.config.maxRequests - currentCount - 1,
        resetAt,
      }
    } catch (error) {
      console.error('[RateLimiter] Redis error:', error)
      // Fail open - allow request if Redis is down
      return {
        allowed: true,
        limit: this.config.maxRequests,
        remaining: this.config.maxRequests,
        resetAt: new Date(now + this.config.windowMs),
      }
    }
  }

  /**
   * Record request result (for skipSuccessful/skipFailed logic)
   *
   * @param identifier - Unique identifier
   * @param success - Whether request was successful
   */
  async recordResult(identifier: string, success: boolean): Promise<void> {
    // If we should skip this type of request, remove it from count
    if ((success && this.config.skipSuccessfulRequests) || (!success && this.config.skipFailedRequests)) {
      const key = `${this.config.keyPrefix}:${identifier}`
      const now = Date.now()

      // Remove the most recent request (the one we just added)
      const recentRequests = await this.redis.zrevrange(key, 0, 0)
      if (recentRequests.length > 0) {
        await this.redis.zrem(key, recentRequests[0])
      }
    }
  }

  /**
   * Reset rate limit for identifier
   *
   * @param identifier - Unique identifier
   */
  async reset(identifier: string): Promise<void> {
    const key = `${this.config.keyPrefix}:${identifier}`
    await this.redis.del(key)
  }

  /**
   * Get current count for identifier
   *
   * @param identifier - Unique identifier
   * @returns Current request count in window
   */
  async getCurrentCount(identifier: string): Promise<number> {
    const key = `${this.config.keyPrefix}:${identifier}`
    const now = Date.now()
    const windowStart = now - this.config.windowMs

    // Remove old entries
    await this.redis.zremrangebyscore(key, '-inf', windowStart.toString())

    // Return count
    return await this.redis.zcard(key)
  }
}

/**
 * Multi-tier rate limiter
 * Combines multiple rate limits (e.g., per-IP, per-tenant, global)
 */
export class MultiTierRateLimiter {
  private limiters: Map<string, WebhookRateLimiter>

  constructor(configs: Record<string, RateLimitConfig>) {
    this.limiters = new Map()
    for (const [name, config] of Object.entries(configs)) {
      this.limiters.set(name, new WebhookRateLimiter(config))
    }
  }

  /**
   * Check all rate limits
   *
   * @param identifiers - Map of limiter name to identifier
   * @returns Aggregated result (denied if any tier denies)
   */
  async checkLimits(identifiers: Record<string, string>): Promise<RateLimitResult> {
    const results: RateLimitResult[] = []

    for (const [name, identifier] of Object.entries(identifiers)) {
      const limiter = this.limiters.get(name)
      if (limiter) {
        const result = await limiter.checkLimit(identifier)
        results.push(result)

        // If any tier denies, return that result
        if (!result.allowed) {
          return result
        }
      }
    }

    // All tiers allowed - return most restrictive remaining count
    const mostRestrictive = results.reduce((min, r) => (r.remaining < min.remaining ? r : min))
    return mostRestrictive
  }

  /**
   * Record result for all limiters
   */
  async recordResult(identifiers: Record<string, string>, success: boolean): Promise<void> {
    const promises: Promise<void>[] = []

    for (const [name, identifier] of Object.entries(identifiers)) {
      const limiter = this.limiters.get(name)
      if (limiter) {
        promises.push(limiter.recordResult(identifier, success))
      }
    }

    await Promise.all(promises)
  }
}

/**
 * Extract client IP from request
 */
export function getClientIp(req: NextRequest): string {
  // Check X-Forwarded-For header (proxy/load balancer)
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    // Take first IP (original client)
    return forwarded.split(',')[0].trim()
  }

  // Check X-Real-IP header
  const realIp = req.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  // Fallback to connection IP (not available in Edge runtime)
  return 'unknown'
}

/**
 * Create standard webhook rate limiter
 * - Per-IP: 60 req/min, 1000 req/hour
 * - Per-Tenant: 300 req/min, 10000 req/hour
 * - Global: 10000 req/min
 */
export function createWebhookRateLimiter(): MultiTierRateLimiter {
  return new MultiTierRateLimiter({
    ip: {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 60,
      keyPrefix: 'webhook_ip',
    },
    ipHourly: {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: 1000,
      keyPrefix: 'webhook_ip_hourly',
    },
    tenant: {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 300,
      keyPrefix: 'webhook_tenant',
    },
    tenantHourly: {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: 10000,
      keyPrefix: 'webhook_tenant_hourly',
    },
    global: {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 10000,
      keyPrefix: 'webhook_global',
    },
  })
}

/**
 * Rate limiting middleware for webhook endpoints
 *
 * Usage:
 * ```typescript
 * export async function POST(req: NextRequest) {
 *   const rateLimitResult = await applyWebhookRateLimit(req, tenantId)
 *   if (!rateLimitResult.allowed) {
 *     return Response.json(
 *       { error: 'Rate limit exceeded' },
 *       {
 *         status: 429,
 *         headers: {
 *           'X-RateLimit-Limit': rateLimitResult.limit.toString(),
 *           'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
 *           'X-RateLimit-Reset': rateLimitResult.resetAt.toISOString(),
 *           'Retry-After': rateLimitResult.retryAfter?.toString() || '',
 *         },
 *       }
 *     )
 *   }
 *
 *   // Process webhook...
 *   const success = true
 *   await recordWebhookResult(req, tenantId, success)
 * }
 * ```
 */
export async function applyWebhookRateLimit(
  req: NextRequest,
  tenantId?: string,
): Promise<RateLimitResult> {
  const rateLimiter = createWebhookRateLimiter()
  const ip = getClientIp(req)

  const identifiers: Record<string, string> = {
    ip,
    ipHourly: ip,
    global: 'global',
  }

  if (tenantId) {
    identifiers.tenant = tenantId
    identifiers.tenantHourly = tenantId
  }

  return rateLimiter.checkLimits(identifiers)
}

/**
 * Record webhook result (for skip logic)
 */
export async function recordWebhookResult(
  req: NextRequest,
  tenantId: string | undefined,
  success: boolean,
): Promise<void> {
  const rateLimiter = createWebhookRateLimiter()
  const ip = getClientIp(req)

  const identifiers: Record<string, string> = {
    ip,
    ipHourly: ip,
    global: 'global',
  }

  if (tenantId) {
    identifiers.tenant = tenantId
    identifiers.tenantHourly = tenantId
  }

  await rateLimiter.recordResult(identifiers, success)
}
