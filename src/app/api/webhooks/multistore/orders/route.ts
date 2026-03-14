/**
 * POST /api/webhooks/multistore/orders
 *
 * Hub endpoint: receives orders pushed from child webshops.
 *
 * Events:
 * - order-created: Child pushes a new order to Hub
 * - order-updated: Child pushes an order status change to Hub
 *
 * Security:
 * - HMAC-SHA256 signature verification (x-webhook-signature + x-webhook-timestamp)
 * - Rate limiting (IP-based)
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import crypto from 'crypto'
import { multistoreFeatures } from '@/lib/tenant/features'
import { mapChildOrderToHub, calculateCommission } from '@/features/multistore/lib/order-mapper'

// Rate limiter
const rateLimit = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimit.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + 60_000 })
    return true
  }
  if (entry.count >= 60) return false
  entry.count++
  return true
}

// Cleanup stale entries
setInterval(() => {
  const now = Date.now()
  for (const [ip, entry] of rateLimit) {
    if (now > entry.resetAt) rateLimit.delete(ip)
  }
}, 300_000)

// ═══════════════════════════════════════════════════════════
// SIGNATURE VERIFICATION
// ═══════════════════════════════════════════════════════════

function verifySignature(
  rawBody: string,
  signatureHeader: string | null,
  timestampHeader: string | null,
  secret: string,
): { valid: boolean; error?: string } {
  if (!signatureHeader || !timestampHeader) {
    return { valid: false, error: 'Missing signature or timestamp header' }
  }

  const timestamp = parseInt(timestampHeader, 10)
  if (isNaN(timestamp)) {
    return { valid: false, error: 'Invalid timestamp' }
  }

  // Check timestamp tolerance (5 minutes)
  const now = Math.floor(Date.now() / 1000)
  const age = Math.abs(now - timestamp)
  if (age > 300) {
    return { valid: false, error: `Timestamp too old (${age}s)` }
  }

  const signedPayload = `${timestamp}.${rawBody}`
  const expected = crypto.createHmac('sha256', secret).update(signedPayload).digest('hex')

  try {
    const valid = crypto.timingSafeEqual(
      Buffer.from(signatureHeader),
      Buffer.from(expected),
    )
    return { valid }
  } catch {
    return { valid: false, error: 'Signature mismatch' }
  }
}

// ═══════════════════════════════════════════════════════════
// MAIN HANDLER
// ═══════════════════════════════════════════════════════════

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Rate limited' }, { status: 429 })
  }

  // This endpoint is only for the Hub
  if (!multistoreFeatures.isHub()) {
    return NextResponse.json({ error: 'Multistore Hub not enabled' }, { status: 404 })
  }

  try {
    const rawBody = await request.text()
    const data = JSON.parse(rawBody)

    // Verify HMAC signature if webhook secret is configured
    const webhookSecret = process.env.MULTISTORE_WEBHOOK_SECRET
    if (webhookSecret) {
      const verification = verifySignature(
        rawBody,
        request.headers.get('x-webhook-signature'),
        request.headers.get('x-webhook-timestamp'),
        webhookSecret,
      )
      if (!verification.valid) {
        console.warn(`[Multistore Orders Webhook] Invalid signature from ${ip}: ${verification.error}`)
        return NextResponse.json({ error: verification.error }, { status: 401 })
      }
    }

    const event = data.event
    if (!event) {
      return NextResponse.json({ error: 'Missing event field' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    switch (event) {
      case 'order-created':
        return handleOrderCreated(payload, data)

      case 'order-updated':
        return handleOrderUpdated(payload, data)

      default:
        return NextResponse.json({ error: `Unknown event: ${event}` }, { status: 400 })
    }
  } catch (error: unknown) {
    console.error('[Multistore Orders Webhook] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal error' },
      { status: 500 },
    )
  }
}

// ═══════════════════════════════════════════════════════════
// EVENT HANDLERS
// ═══════════════════════════════════════════════════════════

/**
 * Child pushes a new order to the Hub
 */
async function handleOrderCreated(payload: any, data: any) {
  const { order } = data
  if (!order || !order.id) {
    return NextResponse.json({ error: 'Missing order data' }, { status: 400 })
  }

  console.log(`[Multistore Orders Webhook] Receiving new order ${order.orderNumber || order.id} from child`)

  // Identify the source site by API key or domain
  const sourceSite = await identifySourceSite(payload, data)

  // Check if this order already exists on the Hub (idempotency)
  const existing = await payload.find({
    collection: 'orders',
    where: {
      and: [
        { remoteOrderId: { equals: order.id } },
        ...(sourceSite ? [{ sourceSite: { equals: sourceSite.id } }] : []),
      ],
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  if (existing.docs.length > 0) {
    console.log(`[Multistore Orders Webhook] Order already exists on Hub (id: ${existing.docs[0].id}), skipping create`)
    return NextResponse.json({
      success: true,
      hubOrderId: existing.docs[0].id,
      message: 'Order already exists',
    })
  }

  // Map child order to Hub format
  const mapped = mapChildOrderToHub(order, sourceSite?.id || 0)

  // Calculate commission
  const commissionPercentage = sourceSite?.defaultCommission || 0
  const commissionType = sourceSite?.commissionType || 'percentage'
  const commission = calculateCommission(
    mapped.total,
    commissionPercentage,
    commissionType,
  )

  // Create order on Hub
  const hubOrder = await payload.create({
    collection: 'orders',
    data: {
      // Standard order fields
      orderNumber: `HUB-${mapped.remoteOrderNumber}`,
      status: mapped.status,
      paymentStatus: mapped.paymentStatus,
      paymentMethod: mapped.paymentMethod || 'ideal',
      items: mapped.items.map((item: any) => ({
        product: item.hubProductId || undefined,
        title: item.title,
        sku: item.sku,
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal: mapped.subtotal,
      shippingCost: mapped.shippingCost,
      tax: mapped.tax,
      discount: mapped.discount,
      total: mapped.total,
      customerEmail: mapped.customerEmail,
      shippingAddress: mapped.shippingAddress,
      billingAddress: mapped.billingAddress,
      notes: mapped.notes,
      // Hub-specific multistore fields
      sourceSite: sourceSite?.id || undefined,
      remoteOrderId: order.id,
      remoteOrderNumber: order.orderNumber,
      fulfillmentStatus: 'new',
      commission,
      commissionPercentage,
    },
    overrideAccess: true,
    context: { fromMultistoreSync: true },
  })

  console.log(`[Multistore Orders Webhook] Created Hub order ${hubOrder.id} (${hubOrder.orderNumber}) from child order ${order.orderNumber}`)

  // Log sync
  try {
    await payload.create({
      collection: 'multistore-sync-log' as any,
      data: {
        site: sourceSite?.id || undefined,
        direction: 'child-to-hub',
        entityType: 'order',
        entityId: String(hubOrder.id),
        operation: 'create',
        status: 'success',
      },
      overrideAccess: true,
    })
  } catch {
    // Don't fail the webhook
  }

  return NextResponse.json({
    success: true,
    hubOrderId: hubOrder.id,
    hubOrderNumber: hubOrder.orderNumber,
  })
}

/**
 * Child pushes an order status update to the Hub
 */
async function handleOrderUpdated(payload: any, data: any) {
  const { order } = data
  if (!order || !order.id) {
    return NextResponse.json({ error: 'Missing order data' }, { status: 400 })
  }

  console.log(`[Multistore Orders Webhook] Receiving order update ${order.orderNumber || order.id} from child`)

  // Find the Hub order by remoteOrderId
  const sourceSite = await identifySourceSite(payload, data)

  const existing = await payload.find({
    collection: 'orders',
    where: {
      and: [
        { remoteOrderId: { equals: order.id } },
        ...(sourceSite ? [{ sourceSite: { equals: sourceSite.id } }] : []),
      ],
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  if (existing.docs.length === 0) {
    // Order doesn't exist yet — create it instead
    console.log(`[Multistore Orders Webhook] Order not found on Hub, creating as new`)
    return handleOrderCreated(payload, { ...data, event: 'order-created' })
  }

  const hubOrder = existing.docs[0]

  // Update relevant fields
  const updateData: Record<string, any> = {}

  if (order.status && order.status !== hubOrder.status) {
    updateData.status = order.status
  }
  if (order.paymentStatus && order.paymentStatus !== hubOrder.paymentStatus) {
    updateData.paymentStatus = order.paymentStatus
  }
  if (order.trackingCode) {
    updateData.trackingCode = order.trackingCode
  }
  if (order.trackingUrl) {
    updateData.trackingUrl = order.trackingUrl
  }
  if (order.shippingProvider) {
    updateData.shippingProvider = order.shippingProvider
  }

  if (Object.keys(updateData).length > 0) {
    await payload.update({
      collection: 'orders',
      id: hubOrder.id,
      data: updateData,
      overrideAccess: true,
      context: { fromMultistoreSync: true },
    })

    console.log(`[Multistore Orders Webhook] Updated Hub order ${hubOrder.id} with:`, Object.keys(updateData))
  }

  // Log sync
  try {
    await payload.create({
      collection: 'multistore-sync-log' as any,
      data: {
        site: sourceSite?.id || undefined,
        direction: 'child-to-hub',
        entityType: 'order',
        entityId: String(hubOrder.id),
        operation: 'update',
        status: 'success',
      },
      overrideAccess: true,
    })
  } catch {
    // Don't fail the webhook
  }

  return NextResponse.json({
    success: true,
    hubOrderId: hubOrder.id,
    updated: Object.keys(updateData),
  })
}

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

/**
 * Try to identify the source site from the request data or API key
 */
async function identifySourceSite(payload: any, data: any): Promise<any | null> {
  // If siteId is provided in the payload
  if (data.siteId) {
    try {
      return await payload.findByID({
        collection: 'multistore-sites' as any,
        id: data.siteId,
        depth: 0,
        overrideAccess: true,
      })
    } catch {
      return null
    }
  }

  // If domain is provided
  if (data.domain) {
    const sites = await payload.find({
      collection: 'multistore-sites' as any,
      where: { domain: { equals: data.domain } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    return sites.docs[0] || null
  }

  return null
}

export const dynamic = 'force-dynamic'
