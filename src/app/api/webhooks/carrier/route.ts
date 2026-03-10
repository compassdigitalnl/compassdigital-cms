import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import crypto from 'crypto'

/**
 * POST /api/webhooks/carrier
 *
 * Receives tracking updates from carrier APIs (Sendcloud, MyParcel, PostNL).
 * Auto-updates order status + timeline based on carrier events.
 *
 * Supported carriers:
 * - Sendcloud: parcel status webhooks
 * - MyParcel: shipment status webhooks
 *
 * Security:
 * - HMAC signature verification per carrier
 * - Rate limiting (IP-based)
 */

// Rate limiter
const rateLimit = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimit.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + 60_000 })
    return true
  }
  if (entry.count >= 30) return false
  entry.count++
  return true
}

setInterval(() => {
  const now = Date.now()
  for (const [ip, entry] of rateLimit) {
    if (now > entry.resetAt) rateLimit.delete(ip)
  }
}, 300_000)

// ═══════════════════════════════════════════════════════════
// CARRIER STATUS MAPPINGS
// ═══════════════════════════════════════════════════════════

type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'

interface CarrierStatusMapping {
  orderStatus?: OrderStatus
  timelineEvent: string
  timelineTitle: string
}

// Sendcloud parcel statuses → order statuses
const SENDCLOUD_STATUS_MAP: Record<number, CarrierStatusMapping> = {
  1: { timelineEvent: 'processing', timelineTitle: 'Aangemeld bij Sendcloud' },
  3: { orderStatus: 'shipped', timelineEvent: 'shipped', timelineTitle: 'Verzonden via carrier' },
  4: { timelineEvent: 'in_transit', timelineTitle: 'Onderweg naar bestemming' },
  5: { timelineEvent: 'in_transit', timelineTitle: 'Bij sorteercentrum' },
  6: { timelineEvent: 'in_transit', timelineTitle: 'Niet afgeleverd — nieuwe poging' },
  7: { timelineEvent: 'in_transit', timelineTitle: 'Klaar voor ophalen bij afhaalpunt' },
  8: { timelineEvent: 'in_transit', timelineTitle: 'Afgeleverd bij afhaalpunt' },
  11: { orderStatus: 'delivered', timelineEvent: 'delivered', timelineTitle: 'Afgeleverd' },
  12: { orderStatus: 'cancelled', timelineEvent: 'cancelled', timelineTitle: 'Geannuleerd' },
  62: { timelineEvent: 'in_transit', timelineTitle: 'Bij douane' },
  80: { timelineEvent: 'in_transit', timelineTitle: 'Retour onderweg' },
  91: { timelineEvent: 'in_transit', timelineTitle: 'Retour bij afzender' },
  // 1000+ = error states
  1000: { timelineEvent: 'note_added', timelineTitle: 'Verzendfout — neem contact op' },
  1999: { timelineEvent: 'cancelled', timelineTitle: 'Pakket verloren' },
}

// MyParcel shipment statuses → order statuses
const MYPARCEL_STATUS_MAP: Record<number, CarrierStatusMapping> = {
  1: { timelineEvent: 'processing', timelineTitle: 'Geregistreerd bij MyParcel' },
  2: { timelineEvent: 'processing', timelineTitle: 'Wacht op ophaling' },
  3: { orderStatus: 'shipped', timelineEvent: 'shipped', timelineTitle: 'Verzonden' },
  4: { timelineEvent: 'in_transit', timelineTitle: 'Sortering' },
  5: { timelineEvent: 'in_transit', timelineTitle: 'Distributie' },
  6: { timelineEvent: 'in_transit', timelineTitle: 'Douane' },
  7: { orderStatus: 'delivered', timelineEvent: 'delivered', timelineTitle: 'Afgeleverd' },
  8: { timelineEvent: 'in_transit', timelineTitle: 'Klaar voor ophalen' },
  9: { timelineEvent: 'in_transit', timelineTitle: 'Pakket opgehaald' },
  30: { timelineEvent: 'note_added', timelineTitle: 'Probleem met bezorging' },
  32: { timelineEvent: 'in_transit', timelineTitle: 'Retour onderweg' },
  33: { timelineEvent: 'in_transit', timelineTitle: 'Retour bij afzender' },
  34: { timelineEvent: 'note_added', timelineTitle: 'Onbestelbaar' },
  36: { timelineEvent: 'cancelled', timelineTitle: 'Geannuleerd' },
  38: { timelineEvent: 'note_added', timelineTitle: 'Onbekende status' },
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Rate limited' }, { status: 429 })
  }

  try {
    const payload = await getPayload({ config })

    // Get carrier settings
    const ecomSettings: any = await payload.findGlobal({
      slug: 'e-commerce-settings',
      depth: 0,
    }).catch(() => null)

    const carrierProvider = ecomSettings?.carrierIntegration?.provider
    if (!carrierProvider || carrierProvider === 'none') {
      return NextResponse.json({ error: 'No carrier integration configured' }, { status: 404 })
    }

    const webhookSecret = ecomSettings?.carrierIntegration?.webhookSecret
    const body = await request.text()
    const data = JSON.parse(body)

    // ─── ROUTE TO CORRECT HANDLER ────
    if (carrierProvider === 'sendcloud') {
      return handleSendcloud(payload, request, body, data, webhookSecret)
    } else if (carrierProvider === 'myparcel') {
      return handleMyParcel(payload, request, body, data, webhookSecret)
    }

    return NextResponse.json({ error: 'Unknown carrier provider' }, { status: 400 })
  } catch (error: unknown) {
    console.error('[Carrier Webhook] Error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

// ═══════════════════════════════════════════════════════════
// SENDCLOUD HANDLER
// ═══════════════════════════════════════════════════════════

async function handleSendcloud(
  payload: any,
  request: NextRequest,
  rawBody: string,
  data: any,
  webhookSecret?: string,
) {
  // Verify Sendcloud signature
  if (webhookSecret) {
    const signature = request.headers.get('sendcloud-signature')
    const computed = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex')
    if (!signature || signature !== computed) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }
  }

  const action = data.action
  if (action !== 'parcel_status_changed') {
    return NextResponse.json({ received: true, action, skipped: true })
  }

  const parcel = data.parcel
  if (!parcel) {
    return NextResponse.json({ error: 'No parcel data' }, { status: 400 })
  }

  const trackingNumber = parcel.tracking_number
  const statusId = parcel.status?.id
  const statusMessage = parcel.status?.message || ''
  const carrierName = parcel.carrier?.code || 'sendcloud'
  const trackingUrl = parcel.tracking_url || null

  const mapping = SENDCLOUD_STATUS_MAP[statusId]
  if (!mapping) {
    console.log(`[Carrier Webhook] Unknown Sendcloud status ${statusId}: ${statusMessage}`)
    return NextResponse.json({ received: true, unknownStatus: statusId })
  }

  // Find order by tracking code
  const order = await findOrderByTracking(payload, trackingNumber)
  if (!order) {
    console.log(`[Carrier Webhook] No order found for tracking: ${trackingNumber}`)
    return NextResponse.json({ received: true, orderNotFound: true })
  }

  await updateOrderFromCarrier(payload, order, mapping, trackingNumber, trackingUrl, carrierName, statusMessage)

  return NextResponse.json({ received: true, orderId: order.id, status: mapping.timelineEvent })
}

// ═══════════════════════════════════════════════════════════
// MYPARCEL HANDLER
// ═══════════════════════════════════════════════════════════

async function handleMyParcel(
  payload: any,
  request: NextRequest,
  rawBody: string,
  data: any,
  webhookSecret?: string,
) {
  // Verify MyParcel signature
  if (webhookSecret) {
    const signature = request.headers.get('x-myparcel-authorization')
    const computed = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex')
    if (!signature || signature !== computed) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }
  }

  // MyParcel sends an array of hooks
  const hooks = data.data?.hooks || []
  if (!Array.isArray(hooks) || hooks.length === 0) {
    return NextResponse.json({ received: true, skipped: true })
  }

  const results: any[] = []

  for (const hook of hooks) {
    if (hook.event !== 'shipment_status_change') continue

    const shipmentId = hook.shipment_id
    const statusId = hook.status
    const barcode = hook.barcode

    if (!barcode) continue

    const mapping = MYPARCEL_STATUS_MAP[statusId]
    if (!mapping) {
      console.log(`[Carrier Webhook] Unknown MyParcel status ${statusId}`)
      results.push({ shipmentId, skipped: true, unknownStatus: statusId })
      continue
    }

    const order = await findOrderByTracking(payload, barcode)
    if (!order) {
      results.push({ shipmentId, orderNotFound: true })
      continue
    }

    const trackingUrl = `https://myparcel.me/track-trace/${barcode}`
    await updateOrderFromCarrier(payload, order, mapping, barcode, trackingUrl, 'myparcel', '')

    results.push({ shipmentId, orderId: order.id, status: mapping.timelineEvent })
  }

  return NextResponse.json({ received: true, results })
}

// ═══════════════════════════════════════════════════════════
// SHARED HELPERS
// ═══════════════════════════════════════════════════════════

async function findOrderByTracking(payload: any, trackingCode: string) {
  const { docs } = await payload.find({
    collection: 'orders',
    where: { trackingCode: { equals: trackingCode } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  return docs[0] || null
}

async function updateOrderFromCarrier(
  payload: any,
  order: any,
  mapping: CarrierStatusMapping,
  trackingCode: string,
  trackingUrl: string | null,
  carrierCode: string,
  description: string,
) {
  const existingTimeline = (order.timeline as any[]) || []

  // Avoid duplicate timeline events (same event within 5 minutes)
  const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
  const isDuplicate = existingTimeline.some(
    (evt: any) =>
      evt.event === mapping.timelineEvent &&
      evt.timestamp > fiveMinAgo,
  )

  if (isDuplicate) return

  // Build update data
  const updateData: any = {
    trackingCode,
    timeline: [
      ...existingTimeline,
      {
        event: mapping.timelineEvent,
        title: mapping.timelineTitle,
        timestamp: new Date().toISOString(),
        description: description || undefined,
      },
    ],
  }

  // Update tracking URL if provided
  if (trackingUrl) {
    updateData.trackingUrl = trackingUrl
  }

  // Map carrier code to shipping provider enum
  const providerMap: Record<string, string> = {
    postnl: 'postnl',
    dhl: 'dhl',
    dpd: 'dpd',
    ups: 'ups',
    sendcloud: 'postnl', // Sendcloud uses various carriers, default to PostNL
    myparcel: 'postnl',
  }
  if (!order.shippingProvider && providerMap[carrierCode]) {
    updateData.shippingProvider = providerMap[carrierCode]
  }

  // Update order status if mapping specifies it
  if (mapping.orderStatus && order.status !== mapping.orderStatus) {
    // Only progress forward, never go back
    const statusOrder = ['pending', 'paid', 'processing', 'shipped', 'delivered']
    const currentIdx = statusOrder.indexOf(order.status)
    const newIdx = statusOrder.indexOf(mapping.orderStatus)
    if (newIdx > currentIdx) {
      updateData.status = mapping.orderStatus
    }

    // Set actual delivery date
    if (mapping.orderStatus === 'delivered') {
      updateData.actualDeliveryDate = new Date().toISOString()
    }
  }

  await payload.update({
    collection: 'orders',
    id: order.id,
    data: updateData,
    overrideAccess: true,
  })

  console.log(`[Carrier Webhook] Updated order ${order.orderNumber}: ${mapping.timelineEvent}`)
}

export const dynamic = 'force-dynamic'
