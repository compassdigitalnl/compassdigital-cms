/**
 * DNS Check API
 * POST /api/email-deliverability/dns-check
 *
 * Validates DNS records (SPF, DKIM, DMARC, MX) for email deliverability
 *
 * Body: { domain: string, dkimSelectors?: string[] }
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { validateDNS, extractDomain } from '@/lib/email/deliverability/dns-validator'
import { emailMarketingFeatures } from '@/lib/features'

export async function POST(request: NextRequest) {
  try {
    // Check feature flag
    if (!emailMarketingFeatures.campaigns()) {
      return NextResponse.json(
        { error: 'Email marketing feature is disabled' },
        { status: 403 }
      )
    }

    const payload = await getPayload({ config })

    // Get user from session
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    let { domain, dkimSelectors } = body

    if (!domain) {
      return NextResponse.json(
        { error: 'domain is required' },
        { status: 400 }
      )
    }

    // Extract domain from email if provided
    if (domain.includes('@')) {
      domain = extractDomain(domain)
    }

    // Validate domain format
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])*$/
    if (!domainRegex.test(domain)) {
      return NextResponse.json(
        { error: 'Invalid domain format' },
        { status: 400 }
      )
    }

    // Run DNS validation
    const result = await validateDNS(domain, dkimSelectors)

    return NextResponse.json({
      success: true,
      result,
    })
  } catch (error: any) {
    console.error('[API] DNS check error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to check DNS records' },
      { status: 500 }
    )
  }
}
