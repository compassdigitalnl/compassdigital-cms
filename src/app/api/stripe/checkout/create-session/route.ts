/**
 * POST /api/stripe/checkout/create-session
 *
 * Create a Stripe Checkout session for client's connected account
 * Used for: E-commerce payments, service bookings, product purchases
 */

import { NextRequest, NextResponse } from 'next/server'
import { StripeConnectService } from '@/lib/stripe/StripeConnectService'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      clientId,
      lineItems,
      successUrl,
      cancelUrl,
      metadata = {},
    } = body

    // Validate required fields
    if (!clientId) {
      return NextResponse.json(
        { error: 'clientId is required' },
        { status: 400 }
      )
    }

    if (!lineItems || !Array.isArray(lineItems) || lineItems.length === 0) {
      return NextResponse.json(
        { error: 'lineItems array is required' },
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

    // Check if payments are enabled
    if (!client.paymentsEnabled) {
      return NextResponse.json(
        {
          error: 'Payments not enabled for this client',
          message: 'Complete Stripe onboarding first',
        },
        { status: 400 }
      )
    }

    // Check if account exists
    if (!client.stripeAccountId) {
      return NextResponse.json(
        { error: 'No Stripe account found for this client' },
        { status: 400 }
      )
    }

    // Determine pricing tier
    const pricingTier = client.paymentPricingTier || 'standard'

    // Get custom fee if applicable
    const customFee = pricingTier === 'custom' && client.customTransactionFee
      ? {
          percentage: client.customTransactionFee.percentage || 2.4,
          fixed: client.customTransactionFee.fixed || 0.25,
        }
      : undefined

    // Create checkout session
    const stripeService = new StripeConnectService()
    const session = await stripeService.createCheckoutSession({
      accountId: client.stripeAccountId,
      lineItems,
      successUrl: successUrl || `${process.env.NEXT_PUBLIC_SERVER_URL}/success`,
      cancelUrl: cancelUrl || `${process.env.NEXT_PUBLIC_SERVER_URL}/checkout`,
      pricingTier,
      customFee,
      metadata: {
        ...metadata,
        clientId,
        clientName: client.name,
      },
    })

    console.log(`[Stripe Checkout] Session created for client ${clientId}`)
    console.log(`  Session ID: ${session.id}`)
    console.log(`  URL: ${session.url}`)

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
      message: 'Checkout session created successfully',
    })

  } catch (error: any) {
    console.error('[Stripe Checkout] Error creating session:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
