/**
 * POST /api/multisafepay/affiliates/create
 *
 * Create a MultiSafePay affiliate/sub-merchant account for a client
 */

import { NextRequest, NextResponse } from 'next/server'
import { MultiSafepayConnectService } from '@/lib/multisafepay/MultiSafepayConnectService'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { clientId, phone, address } = body

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

    // Check if affiliate already exists
    if (client.multiSafepayAffiliateId) {
      return NextResponse.json(
        {
          error: 'MultiSafePay affiliate already exists for this client',
          affiliateId: client.multiSafepayAffiliateId
        },
        { status: 400 }
      )
    }

    // Create MultiSafePay affiliate
    const multiSafepayService = new MultiSafepayConnectService()
    const affiliate = await multiSafepayService.createAffiliate({
      clientId,
      email: client.contactEmail,
      businessName: client.name,
      country: 'NL',
      phone,
      address,
    })

    // Update client record
    await payload.update({
      collection: 'clients',
      id: clientId,
      data: {
        multiSafepayAffiliateId: affiliate.id,
        multiSafepayAccountStatus: affiliate.status || 'pending',
        multiSafepayEnabled: false, // Enable after verification
      },
    })

    console.log(`[MultiSafePay Connect] Affiliate created for client ${clientId}: ${affiliate.id}`)

    return NextResponse.json({
      success: true,
      affiliateId: affiliate.id,
      status: affiliate.status,
      message: 'MultiSafePay affiliate created successfully. Awaiting verification.',
    })

  } catch (error: any) {
    console.error('[MultiSafePay Connect] Error creating affiliate:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create MultiSafePay affiliate' },
      { status: 500 }
    )
  }
}
