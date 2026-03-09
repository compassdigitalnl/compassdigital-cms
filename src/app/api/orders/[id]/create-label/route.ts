import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getCarrierProvider } from '@/lib/carriers'
import type { CreateShipmentParams, ShipmentAddress } from '@/lib/carriers'

/**
 * POST /api/orders/[id]/create-label
 *
 * Create a shipping label for an order via Sendcloud or MyParcel.
 * Updates the order with tracking info.
 *
 * Body (optional):
 * - shippingMethodId: number (carrier-specific shipping method ID)
 * - weight: number (grams, defaults to 1000)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: orderId } = await params
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
    }

    // Get order
    const order = await payload.findByID({
      collection: 'orders',
      id: orderId,
      depth: 1,
      overrideAccess: true,
    }) as any

    if (!order) {
      return NextResponse.json({ error: 'Bestelling niet gevonden' }, { status: 404 })
    }

    // Check if order already has tracking
    if (order.trackingCode) {
      return NextResponse.json(
        { error: 'Deze bestelling heeft al een verzendlabel', trackingCode: order.trackingCode },
        { status: 400 },
      )
    }

    // Get carrier settings
    const ecomSettings: any = await payload.findGlobal({
      slug: 'e-commerce-settings' as any,
      depth: 0,
    }).catch(() => null)

    const carrier = getCarrierProvider(ecomSettings)
    if (!carrier) {
      return NextResponse.json(
        { error: 'Geen carrier integratie geconfigureerd. Ga naar E-commerce Instellingen → Carrier Integratie.' },
        { status: 400 },
      )
    }

    // Parse optional body
    let body: any = {}
    try {
      body = await request.json()
    } catch {
      // No body is fine
    }

    // Build shipping address from order
    const shipping = order.shippingAddress || {}
    const toAddress: ShipmentAddress = {
      name: [shipping.firstName, shipping.lastName].filter(Boolean).join(' ') || order.guestName || 'Klant',
      companyName: shipping.company || undefined,
      street: shipping.street || '',
      houseNumber: shipping.houseNumber || '',
      postalCode: shipping.postalCode || '',
      city: shipping.city || '',
      country: shipping.country === 'Nederland' ? 'NL' : (shipping.country || 'NL'),
      email: order.customerEmail || order.guestEmail || undefined,
      phone: shipping.phone || order.guestPhone || undefined,
    }

    // Build shipment params
    const shipmentParams: CreateShipmentParams = {
      orderId: String(order.id),
      orderNumber: order.orderNumber,
      shippingMethodId: body.shippingMethodId || undefined,
      weight: body.weight || 1000,
      toAddress,
      items: order.items?.map((item: any) => ({
        description: item.title || 'Product',
        quantity: item.quantity || 1,
        weight: Math.round((body.weight || 1000) / (order.items?.length || 1)),
        value: Math.round((item.price || 0) * 100),
        sku: item.sku || undefined,
      })),
    }

    // Create shipment
    const result = await carrier.createShipment(shipmentParams)

    if (!result.success) {
      return NextResponse.json(
        { error: `Label aanmaken mislukt: ${result.error}` },
        { status: 400 },
      )
    }

    // Update order with tracking info
    const updateData: any = {
      trackingCode: result.trackingNumber || result.shipmentId,
    }

    if (result.trackingUrl) {
      updateData.trackingUrl = result.trackingUrl
    }

    if (result.carrier) {
      const providerMap: Record<string, string> = {
        postnl: 'postnl', dhl: 'dhl', dpd: 'dpd', ups: 'ups',
      }
      updateData.shippingProvider = providerMap[result.carrier] || 'postnl'
    }

    // Add timeline event
    const timeline = (order.timeline as any[]) || []
    updateData.timeline = [
      ...timeline,
      {
        event: 'processing',
        title: `Verzendlabel aangemaakt via ${carrier.name}`,
        timestamp: new Date().toISOString(),
        description: `Tracking: ${result.trackingNumber || result.shipmentId}`,
      },
    ]

    // Update status to processing if still paid
    if (order.status === 'paid') {
      updateData.status = 'processing'
    }

    await payload.update({
      collection: 'orders',
      id: order.id,
      data: updateData,
      overrideAccess: true,
    })

    console.log(`🏷️ Label created for order ${order.orderNumber}: ${result.trackingNumber || result.shipmentId}`)

    return NextResponse.json({
      success: true,
      shipmentId: result.shipmentId,
      trackingNumber: result.trackingNumber,
      trackingUrl: result.trackingUrl,
      labelUrl: result.labelUrl,
      carrier: result.carrier,
      message: `Verzendlabel aangemaakt. Tracking: ${result.trackingNumber || result.shipmentId}`,
    })
  } catch (error: any) {
    console.error('Create label error:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het aanmaken van het label' },
      { status: 500 },
    )
  }
}
