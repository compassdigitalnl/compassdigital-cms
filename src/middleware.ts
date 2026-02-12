import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Client } from 'pg'

// Rate limiting store (in-memory, consider Redis for production multi-instance)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Tenant cache (to avoid DB lookups on every request)
const tenantCache = new Map<string, { data: any; expiresAt: number }>()

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

// Extract subdomain from hostname
function extractSubdomain(hostname: string): string | null {
  // localhost:3020 → null (no subdomain)
  // test-bedrijf-a.cms.compassdigital.nl → 'test-bedrijf-a'
  // cms.compassdigital.nl → null (main platform)

  // Development: localhost
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    return null
  }

  // Skip Vercel preview URLs (these are NOT tenant subdomains!)
  // Format: projectname-hash-teamname.vercel.app
  // Example: compassdigital-abc123-compass-digital.vercel.app
  if (hostname.includes('vercel.app')) {
    // Only treat as subdomain if it's explicitly a subdomain like: tenant.yourproject.vercel.app
    // For now, skip all vercel.app URLs (they're platform admin, not tenants)
    return null
  }

  // Split hostname
  const parts = hostname.split('.')

  // Need at least 3 parts for subdomain (subdomain.domain.tld)
  if (parts.length < 3) {
    return null
  }

  const subdomain = parts[0]

  // Skip www and platform subdomains
  if (subdomain === 'www' || subdomain === 'cms') {
    return null
  }

  return subdomain
}

// Get tenant from database (with caching)
async function getTenant(subdomain: string): Promise<any | null> {
  const cacheKey = `tenant:${subdomain}`
  const cached = tenantCache.get(cacheKey)

  // Check cache (5 min TTL)
  if (cached && Date.now() < cached.expiresAt) {
    return cached.data
  }

  // Check if database URL is configured
  const databaseUrl = process.env.PLATFORM_DATABASE_URL || process.env.DATABASE_URL
  if (!databaseUrl) {
    console.warn('[MIDDLEWARE] No database URL configured - skipping tenant lookup')
    console.warn('[MIDDLEWARE] Set DATABASE_URL or PLATFORM_DATABASE_URL environment variable')
    return null
  }

  // Query database
  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  })

  try {
    await client.connect()

    const result = await client.query(
      'SELECT * FROM tenants WHERE subdomain = $1 AND status = $2',
      [subdomain, 'active']
    )

    if (result.rows.length === 0) {
      // Cache negative result (1 min TTL)
      tenantCache.set(cacheKey, {
        data: null,
        expiresAt: Date.now() + 60 * 1000,
      })
      return null
    }

    const tenant = result.rows[0]

    // Cache positive result (5 min TTL)
    tenantCache.set(cacheKey, {
      data: tenant,
      expiresAt: Date.now() + 5 * 60 * 1000,
    })

    return tenant
  } catch (error) {
    console.error('[MIDDLEWARE] Error fetching tenant:', error)
    // Cache error result (1 min TTL) to prevent repeated failed lookups
    tenantCache.set(cacheKey, {
      data: null,
      expiresAt: Date.now() + 60 * 1000,
    })
    return null
  } finally {
    try {
      await client.end()
    } catch (endError) {
      // Ignore errors when closing connection
      console.warn('[MIDDLEWARE] Error closing database connection:', endError)
    }
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hostname = request.headers.get('host') || ''

  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // Skip files with extensions
  ) {
    return NextResponse.next()
  }

  // ========================================
  // MULTI-TENANT SUBDOMAIN ROUTING
  // ========================================

  // Extract subdomain
  const subdomain = extractSubdomain(hostname)

  // If subdomain detected, this is a tenant request
  if (subdomain) {
    console.log(`[MIDDLEWARE] Subdomain detected: ${subdomain}`)

    // Fetch tenant from database
    const tenant = await getTenant(subdomain)

    if (!tenant) {
      // Tenant not found or inactive
      return new NextResponse(
        `
        <!DOCTYPE html>
        <html>
          <head><title>Site Not Found</title></head>
          <body style="font-family: sans-serif; text-align: center; padding: 50px;">
            <h1>Site Not Found</h1>
            <p>The subdomain "${subdomain}" does not exist or is inactive.</p>
            <p><a href="https://cms.compassdigital.nl">Go to Platform</a></p>
          </body>
        </html>
        `,
        {
          status: 404,
          headers: { 'Content-Type': 'text/html' },
        }
      )
    }

    console.log(`[MIDDLEWARE] Tenant found: ${tenant.name} (${tenant.type})`)

    // Check if tenant has database configured
    if (tenant.database_url === 'PENDING_DATABASE_CREATION') {
      return new NextResponse(
        `
        <!DOCTYPE html>
        <html>
          <head><title>Site Being Set Up</title></head>
          <body style="font-family: sans-serif; text-align: center; padding: 50px;">
            <h1>Site is Being Set Up</h1>
            <p>Your site "${tenant.name}" is currently being configured.</p>
            <p>Please check back in a few minutes.</p>
          </body>
        </html>
        `,
        {
          status: 503,
          headers: { 'Content-Type': 'text/html' },
        }
      )
    }

    // Inject tenant context into request headers
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-tenant-id', tenant.id)
    requestHeaders.set('x-tenant-subdomain', tenant.subdomain)
    requestHeaders.set('x-tenant-database-url', tenant.database_url)
    requestHeaders.set('x-tenant-type', tenant.type)

    // Rewrite to tenant-specific route
    const url = request.nextUrl.clone()
    url.pathname = `/tenant${pathname}`

    console.log(`[MIDDLEWARE] Rewriting ${pathname} → /tenant${pathname}`)

    const response = NextResponse.rewrite(url, {
      request: {
        headers: requestHeaders,
      },
    })

    return addSecurityHeaders(response)
  }

  // No subdomain = platform admin routes
  console.log(`[MIDDLEWARE] Platform admin request: ${pathname}`)

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
     * - api/admin/* (platform admin APIs - skip tenant routing)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/admin|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

// Force Node.js runtime (required for pg database client)
// Edge Runtime does not support Node.js APIs like process.nextTick, crypto, etc.
export const runtime = 'nodejs'
