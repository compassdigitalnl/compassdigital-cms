/**
 * POST /api/stripe/webhooks
 *
 * Handle Stripe webhook events
 * Important: Configure this URL in Stripe Dashboard → Webhooks
 */

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

// Lazy init: instantiate inside handler to avoid build-time failure when env var is missing
function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-08-27.basil',
  })
}

export async function POST(request: NextRequest) {
  const stripe = getStripe()
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!webhookSecret) {
      console.error('[Stripe Webhook] STRIPE_WEBHOOK_SECRET not configured')
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    // Verify webhook signature
    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('[Stripe Webhook] Signature verification failed:', err.message)
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${err.message}` },
        { status: 400 }
      )
    }

    console.log(`[Stripe Webhook] Received event: ${event.type}`)

    const payload = await getPayload({ config })

    // Handle different event types
    switch (event.type) {
      // Account updated
      case 'account.updated': {
        const account = event.data.object as Stripe.Account

        // Find client by Stripe account ID
        const clients = await payload.find({
          collection: 'clients',
          where: {
            stripeAccountId: {
              equals: account.id,
            },
          },
        })

        if (clients.docs.length > 0) {
          const client = clients.docs[0]

          // Determine status
          let status: 'not_started' | 'pending' | 'enabled' | 'rejected' | 'restricted' = 'pending'

          if (account.charges_enabled && account.payouts_enabled) {
            status = 'enabled'
          } else if (account.requirements?.disabled_reason) {
            status = 'restricted'
          }

          // Update client
          await payload.update({
            collection: 'clients',
            id: client.id,
            data: {
              stripeAccountStatus: status,
              paymentsEnabled: status === 'enabled',
            },
          })

          console.log(`[Stripe Webhook] Updated client ${client.id} status: ${status}`)
        }
        break
      }

      // Payment successful
      case 'charge.succeeded': {
        const charge = event.data.object as Stripe.Charge

        // Get connected account ID
        const accountId = charge.transfer_data?.destination

        if (accountId) {
          // Find client
          const clients = await payload.find({
            collection: 'clients',
            where: {
              stripeAccountId: {
                equals: accountId,
              },
            },
          })

          if (clients.docs.length > 0) {
            const client = clients.docs[0]

            // Update payment volume and revenue
            const amount = charge.amount / 100 // Convert to EUR
            const platformFee = (charge.application_fee_amount || 0) / 100

            await payload.update({
              collection: 'clients',
              id: client.id,
              data: {
                totalPaymentVolume: (client.totalPaymentVolume || 0) + amount,
                totalPaymentRevenue: (client.totalPaymentRevenue || 0) + platformFee,
                lastPaymentAt: new Date().toISOString(),
              },
            })

            console.log(`[Stripe Webhook] Updated client ${client.id} payment stats:`)
            console.log(`  Amount: €${amount.toFixed(2)}`)
            console.log(`  Platform Fee: €${platformFee.toFixed(2)}`)
          }
        }
        break
      }

      // Payment failed
      case 'charge.failed': {
        const charge = event.data.object as Stripe.Charge
        console.log(`[Stripe Webhook] Payment failed: ${charge.id}`)
        // Could send notification to client here
        break
      }

      // Payout
      case 'payout.paid':
      case 'payout.failed': {
        const payout = event.data.object as Stripe.Payout
        console.log(`[Stripe Webhook] Payout ${event.type}: ${payout.id}`)
        // Track payouts if needed
        break
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error: any) {
    console.error('[Stripe Webhook] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
