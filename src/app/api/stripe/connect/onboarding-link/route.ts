/**
 * POST /api/stripe/connect/onboarding-link
 *
 * Generate Stripe onboarding link for client
 */

import { NextRequest, NextResponse } from 'next/server'
import { StripeConnectService } from '@/lib/stripe/StripeConnectService'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { clientId, returnUrl, refreshUrl } = body

    if (!clientId) {
      return NextResponse.json(
        { error: 'clientId is required' },
        { status: 400 }
      )
    }

    // Get client from database
    const payload = await getPayload({ config })
    const client = await payload.findByID({
      collection: 'clients',
      id: clientId,
    })

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      )
    }

    // Check if account exists
    if (!client.stripeAccountId) {
      return NextResponse.json(
        { error: 'No Stripe account found for this client. Create account first.' },
        { status: 400 }
      )
    }

    // Generate onboarding link
    const stripeService = new StripeConnectService()
    const accountLink = await stripeService.createOnboardingLink({
      accountId: client.stripeAccountId,
      returnUrl: returnUrl || `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/collections/clients/${clientId}`,
      refreshUrl: refreshUrl || `${process.env.NEXT_PUBLIC_SERVER_URL}/api/stripe/connect/onboarding-link`,
    })

    console.log(`[Stripe Connect] Onboarding link created for client ${clientId}`)

    return NextResponse.json({
      success: true,
      url: accountLink.url,
      expiresAt: accountLink.expires_at,
    })

  } catch (error: any) {
    console.error('[Stripe Connect] Error creating onboarding link:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create onboarding link' },
      { status: 500 }
    )
  }
}
