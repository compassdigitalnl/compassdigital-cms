/**
 * GET /api/stripe/connect/account-status?clientId=xxx
 *
 * Check Stripe account status for a client
 */

import { NextRequest, NextResponse } from 'next/server'
import { StripeConnectService } from '@/lib/stripe/StripeConnectService'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('clientId')

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
      return NextResponse.json({
        success: true,
        hasAccount: false,
        status: 'not_started',
        message: 'No Stripe account exists for this client',
      })
    }

    // Get account status from Stripe
    const stripeService = new StripeConnectService()
    const accountStatus = await stripeService.getAccountStatus(client.stripeAccountId)

    // Update client record if status changed
    if (accountStatus.status !== client.stripeAccountStatus) {
      await payload.update({
        collection: 'clients',
        id: clientId,
        data: {
          stripeAccountStatus: accountStatus.status,
          paymentsEnabled: accountStatus.status === 'enabled',
        },
      })
    }

    return NextResponse.json({
      success: true,
      hasAccount: true,
      accountId: client.stripeAccountId,
      status: accountStatus.status,
      chargesEnabled: accountStatus.chargesEnabled,
      payoutsEnabled: accountStatus.payoutsEnabled,
      detailsSubmitted: accountStatus.detailsSubmitted,
      requirements: accountStatus.requirements,
      paymentsEnabled: accountStatus.status === 'enabled',
    })

  } catch (error: any) {
    console.error('[Stripe Connect] Error checking account status:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to check account status' },
      { status: 500 }
    )
  }
}
