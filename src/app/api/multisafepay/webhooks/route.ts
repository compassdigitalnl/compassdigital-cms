/**
 * POST /api/multisafepay/webhooks
 *
 * Handle MultiSafePay webhook notifications
 * Important: Configure this URL in MultiSafePay Dashboard → Settings → Notifications
 */

import { NextRequest, NextResponse } from 'next/server'
import { MultiSafepayConnectService } from '@/lib/multisafepay/MultiSafepayConnectService'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()

    // Parse the notification data
    // MultiSafePay sends data as query parameters or form-encoded
    const searchParams = new URL(request.url).searchParams
    const transactionId = searchParams.get('transactionid')

    if (!transactionId) {
      return NextResponse.json(
        { error: 'Missing transaction ID' },
        { status: 400 }
      )
    }

    console.log(`[MultiSafePay Webhook] Received notification for transaction: ${transactionId}`)

    const payload = await getPayload({ config })
    const multiSafepayService = new MultiSafepayConnectService()

    // Get order details from MultiSafePay
    const order = await multiSafepayService.getOrder(transactionId)

    console.log(`[MultiSafePay Webhook] Order status: ${order.status}`)

    // Extract client ID from metadata
    const clientId = order.var1 || order.customer?.reference

    if (!clientId) {
      console.warn('[MultiSafePay Webhook] No client ID found in order metadata')
      return NextResponse.json({ received: true })
    }

    // Find client
    const clients = await payload.find({
      collection: 'clients',
      where: {
        id: {
          equals: clientId,
        },
      },
    })

    if (clients.docs.length === 0) {
      console.warn(`[MultiSafePay Webhook] Client not found: ${clientId}`)
      return NextResponse.json({ received: true })
    }

    const client = clients.docs[0]

    // Handle payment status
    switch (order.status) {
      case 'completed': {
        // Payment successful!
        const amount = order.amount / 100 // Convert cents to EUR
        const paymentMethod = order.payment_details?.type || 'unknown'

        // Calculate platform commission
        // Note: MultiSafePay doesn't automatically deduct commission
        // You need to track this yourself based on the payment method
        let commission = 0

        if (paymentMethod.toLowerCase() === 'ideal') {
          // iDEAL transaction
          const clientRate = getClientIdealRate(client)
          const partnerRate = 0.20 // Your negotiated rate
          commission = clientRate - partnerRate
        } else if (paymentMethod.toLowerCase().includes('visa') || paymentMethod.toLowerCase().includes('mastercard')) {
          // Card transaction
          const clientRates = getClientCardRates(client)
          const partnerRates = { percentage: 1.2, fixed: 0.20 }

          const clientCost = (amount * clientRates.percentage / 100) + clientRates.fixed
          const partnerCost = (amount * partnerRates.percentage / 100) + partnerRates.fixed
          commission = clientCost - partnerCost
        }

        // Update client statistics
        await payload.update({
          collection: 'clients',
          id: client.id,
          data: {
            multiSafepayTotalVolume: (client.multiSafepayTotalVolume || 0) + amount,
            multiSafepayTotalRevenue: (client.multiSafepayTotalRevenue || 0) + commission,
            multiSafepayLastPaymentAt: new Date().toISOString(),
          },
        })

        console.log(`[MultiSafePay Webhook] Updated client ${client.id} payment stats:`)
        console.log(`  Amount: €${amount.toFixed(2)}`)
        console.log(`  Commission: €${commission.toFixed(2)}`)
        console.log(`  Method: ${paymentMethod}`)
        break
      }

      case 'cancelled':
      case 'declined':
      case 'expired': {
        console.log(`[MultiSafePay Webhook] Payment ${order.status}: ${transactionId}`)
        // Could send notification to client here
        break
      }

      case 'initialized':
      case 'uncleared': {
        console.log(`[MultiSafePay Webhook] Payment pending: ${transactionId}`)
        // Payment started but not completed yet
        break
      }

      default:
        console.log(`[MultiSafePay Webhook] Unhandled status: ${order.status}`)
    }

    return NextResponse.json({ received: true })

  } catch (error: any) {
    console.error('[MultiSafePay Webhook] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

/**
 * Get client's iDEAL rate based on their pricing tier
 */
function getClientIdealRate(client: any): number {
  const tier = client.multiSafepayPricingTier || 'standard'

  if (tier === 'custom' && client.multiSafepayCustomRates?.idealFee) {
    return client.multiSafepayCustomRates.idealFee
  }

  const rates = {
    standard: 0.35,
    professional: 0.30,
    enterprise: 0.28,
  }

  return rates[tier as keyof typeof rates] || rates.standard
}

/**
 * Get client's card rates based on their pricing tier
 */
function getClientCardRates(client: any): { percentage: number; fixed: number } {
  const tier = client.multiSafepayPricingTier || 'standard'

  if (tier === 'custom' && client.multiSafepayCustomRates) {
    return {
      percentage: client.multiSafepayCustomRates.cardPercentage || 1.8,
      fixed: client.multiSafepayCustomRates.cardFixed || 0.25,
    }
  }

  const rates = {
    standard: { percentage: 1.8, fixed: 0.25 },
    professional: { percentage: 1.6, fixed: 0.25 },
    enterprise: { percentage: 1.5, fixed: 0.25 },
  }

  return rates[tier as keyof typeof rates] || rates.standard
}
