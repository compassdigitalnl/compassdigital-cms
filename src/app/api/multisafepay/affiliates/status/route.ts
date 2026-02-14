/**
 * GET /api/multisafepay/affiliates/status?clientId=xxx
 *
 * Check MultiSafePay affiliate status for a client
 */

import { NextRequest, NextResponse } from 'next/server'
import { MultiSafepayConnectService } from '@/lib/multisafepay/MultiSafepayConnectService'
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

    // Check if affiliate exists
    if (!client.multiSafepayAffiliateId) {
      return NextResponse.json({
        success: true,
        hasAffiliate: false,
        status: 'not_started',
        message: 'No MultiSafePay affiliate exists for this client',
      })
    }

    // Get affiliate status from MultiSafePay
    const multiSafepayService = new MultiSafepayConnectService()
    const affiliate = await multiSafepayService.getAffiliate(client.multiSafepayAffiliateId)
    const isActive = await multiSafepayService.isAffiliateActive(client.multiSafepayAffiliateId)

    // Update client record if status changed
    const newStatus = affiliate.status || 'pending'
    if (newStatus !== client.multiSafepayAccountStatus) {
      await payload.update({
        collection: 'clients',
        id: clientId,
        data: {
          multiSafepayAccountStatus: newStatus,
          multiSafepayEnabled: isActive,
        },
      })
    }

    return NextResponse.json({
      success: true,
      hasAffiliate: true,
      affiliateId: client.multiSafepayAffiliateId,
      status: newStatus,
      isActive,
      paymentsEnabled: isActive,
      details: affiliate,
    })

  } catch (error: any) {
    console.error('[MultiSafePay Connect] Error checking affiliate status:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to check affiliate status' },
      { status: 500 }
    )
  }
}
