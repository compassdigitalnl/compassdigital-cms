/**
 * POST /api/webhooks/multistore
 *
 * Child endpoint: receives product pushes from the Hub.
 * Also receives stock-change notifications from children (on the Hub).
 *
 * Events:
 * - product-sync: Hub pushes a product create/update to child
 * - product-delete: Hub removes a product from child
 * - stock-changed: Child notifies Hub of local stock change
 * - fulfillment-update: Hub pushes fulfillment status to child
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

// Cleanup stale rate limit entries
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

  // Must be either a Hub or Child site
  if (!multistoreFeatures.isHub() && !multistoreFeatures.isChild()) {
    return NextResponse.json({ error: 'Multistore not enabled' }, { status: 404 })
  }

  try {
    const rawBody = await request.text()
    const data = JSON.parse(rawBody)

    // Verify HMAC signature if webhook secret is configured
    const webhookSecret = process.env.MULTISTORE_WEBHOOK_SECRET || process.env.MULTISTORE_HUB_WEBHOOK_SECRET
    if (webhookSecret) {
      const verification = verifySignature(
        rawBody,
        request.headers.get('x-webhook-signature'),
        request.headers.get('x-webhook-timestamp'),
        webhookSecret,
      )
      if (!verification.valid) {
        console.warn(`[Multistore Webhook] Invalid signature from ${ip}: ${verification.error}`)
        return NextResponse.json({ error: verification.error }, { status: 401 })
      }
    }

    const event = data.event
    if (!event) {
      return NextResponse.json({ error: 'Missing event field' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    switch (event) {
      case 'product-sync':
        return handleProductSync(payload, data)

      case 'product-delete':
        return handleProductDelete(payload, data)

      case 'stock-changed':
        return handleStockChanged(payload, data)

      case 'fulfillment-update':
        return handleFulfillmentUpdate(payload, data)

      default:
        return NextResponse.json({ error: `Unknown event: ${event}` }, { status: 400 })
    }
  } catch (error: unknown) {
    console.error('[Multistore Webhook] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal error' },
      { status: 500 },
    )
  }
}

// ═══════════════════════════════════════════════════════════
// EVENT HANDLERS (Child receives from Hub)
// ═══════════════════════════════════════════════════════════

/**
 * Hub pushes product data to this child
 */
async function handleProductSync(payload: any, data: any) {
  if (!multistoreFeatures.isChild()) {
    return NextResponse.json({ error: 'Not a child site' }, { status: 400 })
  }

  const { product, hubProductId, hubMasterSku, operation } = data
  if (!product || !hubProductId) {
    return NextResponse.json({ error: 'Missing product data or hubProductId' }, { status: 400 })
  }

  console.log(`[Multistore Webhook] Receiving product ${hubProductId} from Hub (${operation})`)

  // Check if product already exists on this child
  const existing = await payload.find({
    collection: 'products',
    where: { hubProductId: { equals: hubProductId } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  const productData = {
    ...product,
    hubProductId,
    hubMasterSku: hubMasterSku || product.sku,
    syncStatus: 'synced',
    syncSource: 'hub',
    lastSyncedAt: new Date().toISOString(),
  }

  // Remove fields that shouldn't be synced
  delete productData.id
  delete productData.createdAt
  delete productData.updatedAt
  delete productData.distributedTo
  delete productData.multistoreSyncEnabled

  let result
  if (existing.docs.length > 0) {
    result = await payload.update({
      collection: 'products',
      id: existing.docs[0].id,
      data: productData,
      overrideAccess: true,
      context: { fromMultistoreSync: true },
    })
    console.log(`[Multistore Webhook] Updated product ${result.id} from Hub product ${hubProductId}`)
  } else {
    result = await payload.create({
      collection: 'products',
      data: productData,
      overrideAccess: true,
      context: { fromMultistoreSync: true },
    })
    console.log(`[Multistore Webhook] Created product ${result.id} from Hub product ${hubProductId}`)
  }

  return NextResponse.json({
    success: true,
    localProductId: result.id,
    hubProductId,
    operation: existing.docs.length > 0 ? 'update' : 'create',
  })
}

/**
 * Hub instructs this child to delete a product
 */
async function handleProductDelete(payload: any, data: any) {
  if (!multistoreFeatures.isChild()) {
    return NextResponse.json({ error: 'Not a child site' }, { status: 400 })
  }

  const { hubProductId } = data
  if (!hubProductId) {
    return NextResponse.json({ error: 'Missing hubProductId' }, { status: 400 })
  }

  const existing = await payload.find({
    collection: 'products',
    where: { hubProductId: { equals: hubProductId } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  if (existing.docs.length === 0) {
    return NextResponse.json({ success: true, message: 'Product not found (already deleted)' })
  }

  await payload.delete({
    collection: 'products',
    id: existing.docs[0].id,
    overrideAccess: true,
  })

  console.log(`[Multistore Webhook] Deleted product ${existing.docs[0].id} (Hub product ${hubProductId})`)

  return NextResponse.json({ success: true, deletedProductId: existing.docs[0].id })
}

// ═══════════════════════════════════════════════════════════
// EVENT HANDLERS (Hub receives from Child)
// ═══════════════════════════════════════════════════════════

/**
 * Child notifies Hub that stock changed (local sale, manual adjustment, etc.)
 */
async function handleStockChanged(payload: any, data: any) {
  if (!multistoreFeatures.isHub()) {
    return NextResponse.json({ error: 'Not a Hub site' }, { status: 400 })
  }

  const { hubProductId, stock, stockStatus } = data
  if (!hubProductId) {
    return NextResponse.json({ error: 'Missing hubProductId' }, { status: 400 })
  }

  console.log(`[Multistore Webhook] Stock update from child: product ${hubProductId}, stock=${stock}`)

  // For now, just log it. Full inventory reconciliation is in Fase 4.
  // The Hub admin can decide the conflict resolution strategy.
  try {
    await payload.create({
      collection: 'multistore-sync-log' as any,
      data: {
        direction: 'child-to-hub',
        entityType: 'inventory',
        entityId: String(hubProductId),
        operation: 'update',
        status: 'success',
        requestPayload: { stock, stockStatus },
      },
      overrideAccess: true,
    })
  } catch (err) {
    // Don't fail the webhook
  }

  return NextResponse.json({ success: true, received: true })
}

/**
 * Hub pushes fulfillment status to this child
 */
async function handleFulfillmentUpdate(payload: any, data: any) {
  if (!multistoreFeatures.isChild()) {
    return NextResponse.json({ error: 'Not a child site' }, { status: 400 })
  }

  const { remoteOrderId, fulfillmentStatus, trackingCode, shippingProvider } = data
  if (!remoteOrderId) {
    return NextResponse.json({ error: 'Missing remoteOrderId' }, { status: 400 })
  }

  console.log(`[Multistore Webhook] Fulfillment update for order ${remoteOrderId}: ${fulfillmentStatus}`)

  // Map fulfillment status to order status
  const statusMap: Record<string, string> = {
    shipped: 'shipped',
    delivered: 'delivered',
  }

  const updateData: any = {}
  if (statusMap[fulfillmentStatus]) {
    updateData.status = statusMap[fulfillmentStatus]
  }
  if (trackingCode) {
    updateData.trackingCode = trackingCode
  }
  if (shippingProvider) {
    updateData.shippingProvider = shippingProvider
  }

  if (Object.keys(updateData).length > 0) {
    await payload.update({
      collection: 'orders',
      id: remoteOrderId,
      data: updateData,
      overrideAccess: true,
    })
  }

  return NextResponse.json({ success: true })
}

export const dynamic = 'force-dynamic'
