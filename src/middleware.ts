import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rate limiting store (in-memory, consider Redis for production multi-instance)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Rate limit configuration
const RATE_LIMIT_CONFIG = {
  // API routes
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // 100 requests per window
  },
  // Contact form (stricter)
  contact: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 5, // 5 submissions per hour
  },
  // AI endpoints (stricter)
  ai: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 requests per minute
  },
  // Wizard/site generator (DISABLED for testing)
  wizard: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 10000, // Effectively unlimited during development
  },
}

// Get client IP address
function getClientIp(request: NextRequest): string {
  // Try various headers (for different proxy setups)
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')

  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  if (realIp) {
    return realIp
  }

  if (cfConnectingIp) {
    return cfConnectingIp
  }

  return 'unknown'
}

// Check rate limit
function checkRateLimit(
  ip: string,
  config: { windowMs: number; maxRequests: number }
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const key = ip
  const record = rateLimitStore.get(key)

  // Clean up expired entries
  if (record && now > record.resetTime) {
    rateLimitStore.delete(key)
  }

  // Get or create record
  const currentRecord = rateLimitStore.get(key) || {
    count: 0,
    resetTime: now + config.windowMs,
  }

  // Check if limit exceeded
  if (currentRecord.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: currentRecord.resetTime,
    }
  }

  // Increment counter
  currentRecord.count++
  rateLimitStore.set(key, currentRecord)

  return {
    allowed: true,
    remaining: config.maxRequests - currentRecord.count,
    resetTime: currentRecord.resetTime,
  }
}

// Add security headers
function addSecurityHeaders(response: NextResponse): NextResponse {
  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')

  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff')

  // XSS Protection (legacy, but still useful)
  response.headers.set('X-XSS-Protection', '1; mode=block')

  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Permissions Policy (restrict dangerous features)
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  )

  // HSTS (Strict-Transport-Security) - only in production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    )
  }

  // Content Security Policy (CSP)
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google.com https://www.gstatic.com https://www.googletagmanager.com https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https: http:",
    "connect-src 'self' https://www.google-analytics.com https://www.google.com https://region1.google-analytics.com",
    "frame-src 'self' https://www.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
  ]

  response.headers.set('Content-Security-Policy', cspDirectives.join('; '))

  return response
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // Skip files with extensions
  ) {
    return NextResponse.next()
  }

  // SKIP rate limiting for wizard and SSE endpoints during development (early return)
  if (pathname.startsWith('/api/wizard/') || pathname.startsWith('/api/ai/stream/')) {
    const response = NextResponse.next()
    return addSecurityHeaders(response)
  }

  // Get client IP
  const clientIp = getClientIp(request)

  // Apply rate limiting to API routes
  if (pathname.startsWith('/api/')) {

    let rateLimitConfig = RATE_LIMIT_CONFIG.api

    // Stricter limits for specific endpoints
    if (pathname.startsWith('/api/contact')) {
      rateLimitConfig = RATE_LIMIT_CONFIG.contact
    } else if (pathname.includes('/ai/')) {
      rateLimitConfig = RATE_LIMIT_CONFIG.ai
    }

    const rateLimit = checkRateLimit(clientIp, rateLimitConfig)

    // Rate limit exceeded
    if (!rateLimit.allowed) {
      const resetDate = new Date(rateLimit.resetTime)
      const response = NextResponse.json(
        {
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: resetDate.toISOString(),
        },
        { status: 429 }
      )

      // Add rate limit headers
      response.headers.set('X-RateLimit-Limit', rateLimitConfig.maxRequests.toString())
      response.headers.set('X-RateLimit-Remaining', '0')
      response.headers.set('X-RateLimit-Reset', rateLimit.resetTime.toString())
      response.headers.set('Retry-After', Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString())

      return addSecurityHeaders(response)
    }

    // Add rate limit headers to successful response
    const response = NextResponse.next()
    response.headers.set('X-RateLimit-Limit', rateLimitConfig.maxRequests.toString())
    response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString())
    response.headers.set('X-RateLimit-Reset', rateLimit.resetTime.toString())

    return addSecurityHeaders(response)
  }

  // Add security headers to all responses
  const response = NextResponse.next()
  return addSecurityHeaders(response)
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
