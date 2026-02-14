/**
 * POST /api/multisafepay/payments/create-order
 *
 * Create a MultiSafePay payment order for a client's affiliate account
 */

import { NextRequest, NextResponse } from 'next/server'
import { MultiSafepayConnectService } from '@/lib/multisafepay/MultiSafepayConnectService'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      clientId,
      orderId,
      amount,
      currency = 'EUR',
      description,
      customer,
      redirectUrl,
      cancelUrl,
      notificationUrl,
      metadata = {},
    } = body

    // Validate required fields
    if (!clientId) {
      return NextResponse.json(
        { error: 'clientId is required' },
        { status: 400 }
      )
    }

    if (!orderId) {
      return NextResponse.json(
        { error: 'orderId is required' },
        { status: 400 }
      )
    }

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'amount must be greater than 0' },
        { status: 400 }
      )
    }

    if (!description) {
      return NextResponse.json(
        { error: 'description is required' },
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

    // Check if MultiSafePay is enabled
    if (!client.multiSafepayEnabled) {
      return NextResponse.json(
        {
          error: 'MultiSafePay not enabled for this client',
          message: 'Complete affiliate verification first',
        },
        { status: 400 }
      )
    }

    // Check if affiliate exists
    if (!client.multiSafepayAffiliateId) {
      return NextResponse.json(
        { error: 'No MultiSafePay affiliate found for this client' },
        { status: 400 }
      )
    }

    // Determine pricing tier
    const pricingTier = client.multiSafepayPricingTier || 'standard'

    // Get custom rates if applicable
    const customRates = pricingTier === 'custom' && client.multiSafepayCustomRates
      ? {
          idealFee: client.multiSafepayCustomRates.idealFee,
          cardPercentage: client.multiSafepayCustomRates.cardPercentage,
          cardFixed: client.multiSafepayCustomRates.cardFixed,
        }
      : undefined

    // Create payment order
    const multiSafepayService = new MultiSafepayConnectService()
    const order = await multiSafepayService.createPaymentOrder({
      affiliateId: client.multiSafepayAffiliateId,
      orderId,
      amount,
      currency,
      description,
      pricingTier,
      customRates,
      customer,
      redirectUrl: redirectUrl || `${process.env.NEXT_PUBLIC_SERVER_URL}/payment/success`,
      cancelUrl: cancelUrl || `${process.env.NEXT_PUBLIC_SERVER_URL}/payment/cancel`,
      notificationUrl: notificationUrl || `${process.env.NEXT_PUBLIC_SERVER_URL}/api/multisafepay/webhooks`,
      metadata: {
        ...metadata,
        clientId,
        clientName: client.name,
        pricingTier,
      },
    })

    console.log(`[MultiSafePay Connect] Payment order created for client ${clientId}`)
    console.log(`  Order ID: ${order.orderId}`)
    console.log(`  Amount: €${(amount / 100).toFixed(2)}`)
    console.log(`  Payment URL: ${order.paymentUrl}`)

    return NextResponse.json({
      success: true,
      orderId: order.orderId,
      paymentUrl: order.paymentUrl,
      status: order.status,
      message: 'Payment order created successfully',
    })

  } catch (error: any) {
    console.error('[MultiSafePay Connect] Error creating payment order:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create payment order' },
      { status: 500 }
    )
  }
}
