/**
 * API Key Validation Middleware
 *
 * Validates API keys for email marketing API endpoints
 * Handles authentication, authorization, rate limiting, and usage tracking
 */

import crypto from 'crypto'
import type { Payload } from 'payload'
import type { NextRequest } from 'next/server'

/**
 * Hash API key for lookup
 */
function hashApiKey(apiKey: string): string {
  return crypto.createHash('sha256').update(apiKey).digest('hex')
}

/**
 * Check if IP is allowed for this API key
 */
function isIpAllowed(ip: string, allowedIps: Array<{ ip: string }>): boolean {
  if (!allowedIps || allowedIps.length === 0) {
    return true // No restrictions
  }

  for (const entry of allowedIps) {
    const allowedIp = entry.ip

    // Check for CIDR notation
    if (allowedIp.includes('/')) {
      // CIDR check (simplified - for production use a proper CIDR library)
      const [network, bits] = allowedIp.split('/')
      const ipParts = ip.split('.')
      const networkParts = network.split('.')

      if (ipParts.length !== 4 || networkParts.length !== 4) continue

      // Simple /24 or /32 check
      if (bits === '32' && ip === network) return true
      if (bits === '24' && ipParts.slice(0, 3).join('.') === networkParts.slice(0, 3).join('.'))
        return true
      if (bits === '16' && ipParts.slice(0, 2).join('.') === networkParts.slice(0, 2).join('.'))
        return true
    } else {
      // Exact IP match
      if (ip === allowedIp) return true
    }
  }

  return false
}

/**
 * Extract client IP from request
 */
function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  const realIp = req.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  return 'unknown'
}

/**
 * API Key validation result
 */
export interface ApiKeyValidationResult {
  valid: boolean
  error?: string
  errorCode?:
    | 'MISSING_KEY'
    | 'INVALID_KEY'
    | 'REVOKED_KEY'
    | 'EXPIRED_KEY'
    | 'IP_NOT_ALLOWED'
    | 'RATE_LIMIT_EXCEEDED'
    | 'SCOPE_REQUIRED'
  apiKey?: {
    id: string
    name: string
    tenant: string
    scopes: string[]
    environment: 'live' | 'test'
  }
}

/**
 * Validate API key from request
 *
 * @param req - Next.js request
 * @param payload - Payload CMS instance
 * @param requiredScope - Optional scope that must be present (e.g., 'subscribers:create')
 * @returns Validation result
 */
export async function validateApiKey(
  req: NextRequest,
  payload: Payload,
  requiredScope?: string,
): Promise<ApiKeyValidationResult> {
  try {
    // Extract API key from Authorization header
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return {
        valid: false,
        error: 'Missing Authorization header',
        errorCode: 'MISSING_KEY',
      }
    }

    // Support both "Bearer sk_xxx" and "sk_xxx" formats
    let apiKey = authHeader
    if (authHeader.startsWith('Bearer ')) {
      apiKey = authHeader.substring(7)
    }

    // Validate key format
    if (!apiKey.startsWith('sk_live_') && !apiKey.startsWith('sk_test_')) {
      return {
        valid: false,
        error: 'Invalid API key format. Must start with sk_live_ or sk_test_',
        errorCode: 'INVALID_KEY',
      }
    }

    // Hash the key to look it up
    const keyHash = hashApiKey(apiKey)

    // Find the API key in database
    const result = await payload.find({
      collection: 'email-api-keys',
      where: {
        keyHash: {
          equals: keyHash,
        },
      },
      depth: 1,
    })

    if (!result.docs || result.docs.length === 0) {
      return {
        valid: false,
        error: 'Invalid API key',
        errorCode: 'INVALID_KEY',
      }
    }

    const keyDoc = result.docs[0]

    // Check if key is active
    if (keyDoc.status !== 'active') {
      return {
        valid: false,
        error: `API key is ${keyDoc.status}`,
        errorCode: 'REVOKED_KEY',
      }
    }

    // Check expiry
    if (keyDoc.security?.expiresAt) {
      const expiryDate = new Date(keyDoc.security.expiresAt)
      if (expiryDate < new Date()) {
        return {
          valid: false,
          error: 'API key has expired',
          errorCode: 'EXPIRED_KEY',
        }
      }
    }

    // Check IP restrictions
    const clientIp = getClientIp(req)
    if (keyDoc.security?.allowedIps && keyDoc.security.allowedIps.length > 0) {
      if (!isIpAllowed(clientIp, keyDoc.security.allowedIps)) {
        return {
          valid: false,
          error: `IP ${clientIp} is not allowed to use this API key`,
          errorCode: 'IP_NOT_ALLOWED',
        }
      }
    }

    // Check required scope
    if (requiredScope && !keyDoc.scopes.includes(requiredScope as any)) {
      return {
        valid: false,
        error: `API key does not have required scope: ${requiredScope}`,
        errorCode: 'SCOPE_REQUIRED',
      }
    }

    // Check rate limits (using Redis would be better for production)
    const rateLimitCheck = await checkRateLimit(payload, String(keyDoc.id), keyDoc.rateLimit)
    if (!rateLimitCheck.allowed) {
      return {
        valid: false,
        error: rateLimitCheck.error || 'Rate limit exceeded',
        errorCode: 'RATE_LIMIT_EXCEEDED',
      }
    }

    // Update usage stats (non-blocking)
    const endpoint = new URL(req.url).pathname
    updateApiKeyUsage(payload, String(keyDoc.id), clientIp, endpoint).catch((error) => {
      console.error('[API Key] Failed to update usage:', error)
    })

    // Return successful validation
    return {
      valid: true,
      apiKey: {
        id: String(keyDoc.id),
        name: keyDoc.name,
        tenant: typeof keyDoc.tenant === 'object' && keyDoc.tenant ? String((keyDoc.tenant as any).id) : String(keyDoc.tenant),
        scopes: keyDoc.scopes,
        environment: keyDoc.environment,
      },
    }
  } catch (error) {
    console.error('[API Key] Validation error:', error)
    return {
      valid: false,
      error: 'Internal server error during API key validation',
      errorCode: 'INVALID_KEY',
    }
  }
}

/**
 * Check rate limit for API key
 *
 * NOTE: This is a simple in-memory implementation
 * For production, use Redis with sliding window algorithm
 */
const rateLimitCache = new Map<string, { count: number; resetAt: number }[]>()

async function checkRateLimit(
  payload: Payload,
  keyId: string,
  rateLimit: {
    requestsPerMinute: number
    requestsPerHour: number
    requestsPerDay: number
  },
): Promise<{ allowed: boolean; error?: string }> {
  const now = Date.now()
  const windows = [
    { duration: 60 * 1000, limit: rateLimit.requestsPerMinute, name: 'minute' },
    { duration: 60 * 60 * 1000, limit: rateLimit.requestsPerHour, name: 'hour' },
    { duration: 24 * 60 * 60 * 1000, limit: rateLimit.requestsPerDay, name: 'day' },
  ]

  // Get or create rate limit entry
  if (!rateLimitCache.has(keyId)) {
    rateLimitCache.set(
      keyId,
      windows.map((w) => ({ count: 0, resetAt: now + w.duration })),
    )
  }

  const limits = rateLimitCache.get(keyId)!

  // Check each window
  for (let i = 0; i < windows.length; i++) {
    const window = windows[i]
    const limit = limits[i]

    // Reset if window expired
    if (now >= limit.resetAt) {
      limit.count = 0
      limit.resetAt = now + window.duration
    }

    // Check if limit exceeded
    if (limit.count >= window.limit) {
      const resetIn = Math.ceil((limit.resetAt - now) / 1000)
      return {
        allowed: false,
        error: `Rate limit exceeded for ${window.name}. Try again in ${resetIn} seconds.`,
      }
    }
  }

  // Increment all counters
  limits.forEach((limit) => limit.count++)

  return { allowed: true }
}

/**
 * Update API key usage statistics
 */
async function updateApiKeyUsage(
  payload: Payload,
  keyId: string,
  ip: string,
  endpoint: string,
): Promise<void> {
  try {
    const key = await payload.findByID({
      collection: 'email-api-keys',
      id: keyId,
    })

    await payload.update({
      collection: 'email-api-keys',
      id: keyId,
      data: {
        usage: {
          totalRequests: (key.usage?.totalRequests || 0) + 1,
          lastUsedAt: new Date().toISOString(),
          lastUsedIp: ip,
          lastUsedEndpoint: endpoint,
        },
      },
    })
  } catch (error) {
    console.error('[API Key] Failed to update usage:', error)
    throw error
  }
}

/**
 * Middleware wrapper for Next.js API routes
 *
 * Usage:
 * ```ts
 * export async function POST(req: NextRequest) {
 *   const validation = await requireApiKey(req, payload, 'subscribers:create')
 *   if (!validation.valid) {
 *     return Response.json({ error: validation.error }, { status: 401 })
 *   }
 *
 *   // Use validation.apiKey.tenant for tenant isolation
 *   // ...
 * }
 * ```
 */
export async function requireApiKey(
  req: NextRequest,
  payload: Payload,
  requiredScope?: string,
): Promise<ApiKeyValidationResult> {
  return validateApiKey(req, payload, requiredScope)
}

/**
 * Check if API key has specific scope
 */
export function hasScope(apiKey: ApiKeyValidationResult['apiKey'], scope: string): boolean {
  if (!apiKey) return false
  return apiKey.scopes.includes(scope)
}

/**
 * Check if API key has any of the specified scopes
 */
export function hasAnyScope(apiKey: ApiKeyValidationResult['apiKey'], scopes: string[]): boolean {
  if (!apiKey) return false
  return scopes.some((scope) => apiKey.scopes.includes(scope))
}

/**
 * Check if API key has all of the specified scopes
 */
export function hasAllScopes(apiKey: ApiKeyValidationResult['apiKey'], scopes: string[]): boolean {
  if (!apiKey) return false
  return scopes.every((scope) => apiKey.scopes.includes(scope))
}
