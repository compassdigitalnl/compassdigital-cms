import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { processEvent } from '@/features/email-marketing/lib/automation/engine'
import type { CartEventPayload } from '@/features/email-marketing/lib/automation/types'

/**
 * GET /api/cron/detect-abandoned-carts
 *
 * Cron job that detects abandoned carts and fires cart.abandoned events
 * through the automation engine (for Listmonk email flows).
 *
 * Should be called every 30-60 minutes by a cron service.
 *
 * Logic:
 * 1. Find active carts not updated in X hours (configurable, default 24h)
 * 2. Mark them as status='abandoned'
 * 3. Fire cart.abandoned event for each → triggers automation rules/flows
 *
 * Security: Requires CRON_SECRET
 */
export async function GET(request: NextRequest) {
  try {
    // ─── AUTH ────
    const authHeader = request.headers.get('authorization')
    const secret = request.nextUrl.searchParams.get('secret')
    const cronSecret = process.env.CRON_SECRET

    const isVercelCron = authHeader === `Bearer ${cronSecret}`
    const isValidSecret = secret && cronSecret && secret === cronSecret

    if (!isVercelCron && !isValidSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ─── GET SETTINGS ────
    const payload = await getPayload({ config })

    const ecomSettings: any = await payload.findGlobal({
      slug: 'e-commerce-settings',
      depth: 0,
    }).catch(() => null)

    const enabled = ecomSettings?.abandonedCart?.enabled ?? false
    if (!enabled) {
      return NextResponse.json({
        success: true,
        skipped: true,
        message: 'Abandoned cart detection is disabled',
        timestamp: new Date().toISOString(),
      })
    }

    const timeoutHours = ecomSettings?.abandonedCart?.timeoutHours ?? 24
    const cutoffDate = new Date(Date.now() - timeoutHours * 60 * 60 * 1000)
    const tenantId = process.env.TENANT_ID || process.env.DATABASE_NAME || 'default'

    // ─── FIND ABANDONED CARTS ────
    const { docs: abandonedCarts } = await payload.find({
      collection: 'carts',
      where: {
        status: { equals: 'active' },
        updatedAt: { less_than: cutoffDate.toISOString() },
      },
      limit: 100,
      depth: 1,
      overrideAccess: true,
    })

    if (abandonedCarts.length === 0) {
      return NextResponse.json({
        success: true,
        detected: 0,
        message: 'No abandoned carts found',
        timestamp: new Date().toISOString(),
      })
    }

    let processed = 0
    let eventsTriggered = 0
    const errors: string[] = []

    for (const cart of abandonedCarts) {
      try {
        const cartAny = cart as any

        // Mark cart as abandoned
        await payload.update({
          collection: 'carts',
          id: cart.id,
          data: { status: 'abandoned' } as any,
          overrideAccess: true,
        })

        // Resolve email from cart
        const email = resolveCartEmail(cartAny)
        if (!email) {
          // No email = can't send abandoned cart notification
          processed++
          continue
        }

        // Build cart items for event payload
        const items = ((cartAny.items as any[]) || []).map((item: any) => ({
          productId: String(typeof item.product === 'object' ? item.product?.id : item.product || ''),
          name: typeof item.product === 'object' ? (item.product?.title || 'Product') : 'Product',
          quantity: item.quantity || 1,
          price: item.unitPrice || 0,
        }))

        // Fire cart.abandoned event through automation engine
        const eventPayload: CartEventPayload = {
          eventType: 'cart.abandoned',
          cartId: String(cart.id),
          userId: cartAny.customer
            ? String(typeof cartAny.customer === 'object' ? cartAny.customer.id : cartAny.customer)
            : undefined,
          email,
          total: cartAny.total || 0,
          items,
          tenantId,
          timestamp: new Date(),
        }

        const result = await processEvent(eventPayload)
        if (result.triggeredRules > 0 || result.triggeredFlows > 0) {
          eventsTriggered++
        }
        processed++
      } catch (err: unknown) {
        const errMessage = err instanceof Error ? err.message : String(err)
        errors.push(`Cart ${cart.id}: ${errMessage}`)
        processed++
      }
    }

    return NextResponse.json({
      success: true,
      detected: abandonedCarts.length,
      processed,
      eventsTriggered,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString(),
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('[Cron] detect-abandoned-carts error:', error)
    return NextResponse.json(
      { success: false, error: message || 'Unknown error', timestamp: new Date().toISOString() },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  return GET(request)
}

function resolveCartEmail(cart: any): string | null {
  // Customer relationship
  if (typeof cart.customer === 'object' && cart.customer?.email) {
    return cart.customer.email
  }
  // Guest email stored on cart (if applicable)
  if (cart.guestEmail) return cart.guestEmail
  if (cart.email) return cart.email
  return null
}
