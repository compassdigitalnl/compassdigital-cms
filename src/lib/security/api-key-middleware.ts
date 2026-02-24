/**
 * API Key Authentication Middleware
 *
 * Validates API keys from request headers
 */

import { NextRequest, NextResponse } from 'next/server'
import { validateApiKey, trackApiKeyUsage, type ApiKeyData } from './api-keys'

// ═══════════════════════════════════════════════════════════
// MIDDLEWARE
// ═══════════════════════════════════════════════════════════

/**
 * Extract API key from request headers
 *
 * Supports multiple header formats:
 * - Authorization: Bearer sk_live_...
 * - X-API-Key: sk_live_...
 */
function extractApiKey(request: NextRequest): string | null {
  // Try Authorization header (Bearer token)
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  // Try X-API-Key header
  const apiKeyHeader = request.headers.get('x-api-key')
  if (apiKeyHeader) {
    return apiKeyHeader
  }

  return null
}

/**
 * Get client IP from request
 */
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  return 'unknown'
}

/**
 * Verify API key middleware
 *
 * Usage in API route:
 * ```ts
 * export async function POST(request: NextRequest) {
 *   const apiKeyResult = await verifyApiKey(request, { requiredScopes: ['webhooks:write'] })
 *   if (apiKeyResult.error) return apiKeyResult.error
 *
 *   const { keyData } = apiKeyResult
 *   // ... your handler code, use keyData.tenant for multi-tenancy
 * }
 * ```
 */
export async function verifyApiKey(
  request: NextRequest,
  options?: {
    requiredScopes?: string[]
  }
): Promise<{
  error?: NextResponse
  keyData?: ApiKeyData
}> {
  // Extract API key
  const apiKey = extractApiKey(request)

  if (!apiKey) {
    return {
      error: NextResponse.json(
        {
          success: false,
          error: 'Missing API key. Provide via Authorization: Bearer or X-API-Key header.',
        },
        { status: 401 }
      ),
    }
  }

  // Get client IP
  const clientIp = getClientIp(request)

  // Validate API key
  const validation = await validateApiKey(apiKey, {
    requiredScopes: options?.requiredScopes,
    clientIp,
  })

  if (!validation.valid) {
    return {
      error: NextResponse.json(
        {
          success: false,
          error: validation.reason || 'Invalid API key',
        },
        { status: 403 }
      ),
    }
  }

  // Track usage (async, don't wait)
  if (validation.key) {
    trackApiKeyUsage(validation.key.id, clientIp).catch((err) => {
      console.error('[API Key Middleware] Failed to track usage:', err)
    })
  }

  // Success!
  return {
    keyData: validation.key,
  }
}

/**
 * Verify API key and apply custom rate limiting
 *
 * Combines API key verification with rate limiting
 */
export async function verifyApiKeyWithRateLimit(
  request: NextRequest,
  options?: {
    requiredScopes?: string[]
  }
): Promise<{
  error?: NextResponse
  keyData?: ApiKeyData
}> {
  // First, verify API key
  const result = await verifyApiKey(request, options)

  if (result.error) {
    return result
  }

  const { keyData } = result

  // Check if key has custom rate limiting
  if (keyData?.rateLimit?.enabled) {
    const { rateLimit: rateLimiter } = await import('./rate-limiter')

    const rateLimitResult = rateLimiter(
      request,
      {
        maxRequests: keyData.rateLimit.maxRequests,
        windowMs: 60 * 1000, // 1 minute
        message: `API key rate limit exceeded. Max ${keyData.rateLimit.maxRequests} requests per minute.`,
      },
      `apikey:${keyData.id}` // Use key ID as identifier
    )

    if (rateLimitResult) {
      return {
        error: rateLimitResult,
      }
    }
  }

  return {
    keyData,
  }
}
