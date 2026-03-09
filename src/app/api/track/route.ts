import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

/**
 * GET /api/track?order=ORD-20260307-00123&email=jan@example.com
 *
 * Public order tracking API — no auth required.
 * Validates order number + email combination.
 * Returns limited data (no prices — privacy).
 * Rate limited: max 10 requests per IP per minute.
 */

// Simple in-memory rate limiter
const rateLimit = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimit.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + 60_000 })
    return true
  }

  if (entry.count >= 10) return false

  entry.count++
  return true
}

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [ip, entry] of rateLimit) {
    if (now > entry.resetAt) rateLimit.delete(ip)
  }
}, 300_000)

export async function GET(req: NextRequest) {
  // Rate limiting
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Te veel verzoeken. Probeer het over een minuut opnieuw.' },
      { status: 429 },
    )
  }

  const { searchParams } = new URL(req.url)
  const orderNumber = searchParams.get('order')?.trim()
  const email = searchParams.get('email')?.trim()?.toLowerCase()

  if (!orderNumber || !email) {
    return NextResponse.json(
      { error: 'Ordernummer en e-mailadres zijn vereist.' },
      { status: 400 },
    )
  }

  try {
    const payload = await getPayload({ config: configPromise })

    // Check if public tracking is enabled
    const ecomSettings: any = await payload.findGlobal({
      slug: 'e-commerce-settings',
      depth: 0,
    }).catch(() => null)

    if (!ecomSettings?.emailNotifications?.enablePublicTracking) {
      return NextResponse.json(
        { error: 'Publieke order tracking is niet beschikbaar.' },
        { status: 404 },
      )
    }

    // Find order by orderNumber
    const { docs } = await payload.find({
      collection: 'orders',
      where: {
        orderNumber: { equals: orderNumber },
      },
      limit: 1,
      depth: 1,
      overrideAccess: true, // Public endpoint — we validate via email match
    })

    const order: any = docs[0]
    if (!order) {
      return NextResponse.json(
        { error: 'Bestelling niet gevonden. Controleer je ordernummer en e-mailadres.' },
        { status: 404 },
      )
    }

    // Validate email matches (guest or user email)
    const orderEmail = resolveOrderEmail(order)
    if (!orderEmail || orderEmail.toLowerCase() !== email) {
      // Return same 404 message to prevent email enumeration
      return NextResponse.json(
        { error: 'Bestelling niet gevonden. Controleer je ordernummer en e-mailadres.' },
        { status: 404 },
      )
    }

    // Build public response (limited data — no prices)
    const response = {
      orderNumber: order.orderNumber,
      status: order.status,
      statusLabel: getStatusLabel(order.status as string),
      createdAt: order.createdAt,
      // Timeline
      timeline: (order.timeline as any[] || []).map((evt: any) => ({
        event: evt.event,
        title: evt.title || getEventLabel(evt.event),
        timestamp: evt.timestamp,
        description: evt.description || null,
        location: evt.location || null,
      })),
      // Tracking info
      tracking: order.trackingCode
        ? {
            code: order.trackingCode,
            url: order.trackingUrl || null,
            carrier: order.shippingProvider || null,
            carrierName: getCarrierName(order.shippingProvider as string),
          }
        : null,
      expectedDeliveryDate: order.expectedDeliveryDate || null,
      // Shipping address (city + postal code only — privacy)
      shippingAddress: order.shippingAddress
        ? {
            city: (order.shippingAddress as any).city || null,
            postalCode: (order.shippingAddress as any).postalCode || null,
          }
        : null,
      // Products (names + quantities only — no prices)
      items: ((order.items as any[]) || []).map((item: any) => ({
        title: item.title || 'Product',
        quantity: item.quantity || 0,
        sku: item.sku || null,
      })),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('[Track API] Error:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden. Probeer het later opnieuw.' },
      { status: 500 },
    )
  }
}

function resolveOrderEmail(order: any): string | null {
  if (order.customerEmail) return order.customerEmail
  if (order.guestEmail) return order.guestEmail
  if (typeof order.customer === 'object' && order.customer?.email) return order.customer.email
  return null
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'In afwachting',
    paid: 'Betaald',
    processing: 'In behandeling',
    shipped: 'Onderweg',
    delivered: 'Afgeleverd',
    cancelled: 'Geannuleerd',
    refunded: 'Terugbetaald',
  }
  return labels[status] || status
}

function getEventLabel(event: string): string {
  const labels: Record<string, string> = {
    order_placed: 'Bestelling geplaatst',
    payment_received: 'Betaling ontvangen',
    processing: 'In behandeling',
    invoice_generated: 'Factuur gegenereerd',
    shipped: 'Verzonden',
    in_transit: 'In transit',
    delivered: 'Afgeleverd',
    cancelled: 'Geannuleerd',
    return_requested: 'Retour aangevraagd',
    refunded: 'Terugbetaald',
    note_added: 'Opmerking',
  }
  return labels[event] || event
}

function getCarrierName(provider: string | null | undefined): string {
  if (!provider) return ''
  const carriers: Record<string, string> = {
    postnl: 'PostNL',
    dhl: 'DHL',
    dpd: 'DPD',
    ups: 'UPS',
    transmission: 'Transmission',
    own: 'Eigen bezorging',
    pickup: 'Ophalen',
  }
  return carriers[provider] || provider
}
