/**
 * POST /api/stripe/connect/create-account
 *
 * Create a Stripe Connect Express account for a client
 */

import { NextRequest, NextResponse } from 'next/server'
import { StripeConnectService } from '@/lib/stripe/StripeConnectService'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { clientId } = body

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

    // Check if account already exists
    if (client.stripeAccountId) {
      return NextResponse.json(
        {
          error: 'Stripe account already exists for this client',
          accountId: client.stripeAccountId
        },
        { status: 400 }
      )
    }

    // Create Stripe Connect account
    const stripeService = new StripeConnectService()
    const account = await stripeService.createAccount({
      clientId,
      email: client.contactEmail,
      businessName: client.name,
      country: 'NL',
    })

    // Update client record
    await payload.update({
      collection: 'clients',
      id: clientId,
      data: {
        stripeAccountId: account.id,
        stripeAccountStatus: 'pending',
        paymentsEnabled: false,
      },
    })

    console.log(`[Stripe Connect] Account created for client ${clientId}: ${account.id}`)

    return NextResponse.json({
      success: true,
      accountId: account.id,
      message: 'Stripe Connect account created successfully',
    })

  } catch (error: any) {
    console.error('[Stripe Connect] Error creating account:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create Stripe account' },
      { status: 500 }
    )
  }
}
