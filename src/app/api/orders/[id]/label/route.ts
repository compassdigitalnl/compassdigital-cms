import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getCarrierProvider } from '@/lib/carriers'

/**
 * GET /api/orders/[id]/label
 *
 * Download the shipping label PDF for an order.
 * Requires the order to have a shipment ID (tracking code).
 */
export async function GET(
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
      depth: 0,
      overrideAccess: true,
    }) as any

    if (!order) {
      return NextResponse.json({ error: 'Bestelling niet gevonden' }, { status: 404 })
    }

    if (!order.trackingCode) {
      return NextResponse.json(
        { error: 'Deze bestelling heeft nog geen verzendlabel' },
        { status: 400 },
      )
    }

    // Get carrier
    const ecomSettings: any = await payload.findGlobal({
      slug: 'e-commerce-settings',
      depth: 0,
    }).catch(() => null)

    const carrier = getCarrierProvider(ecomSettings)
    if (!carrier) {
      return NextResponse.json({ error: 'Geen carrier geconfigureerd' }, { status: 400 })
    }

    // Download label PDF
    // Use trackingCode as shipment ID (Sendcloud uses parcel ID, MyParcel uses shipment ID)
    const { pdf, filename } = await carrier.getLabel(order.trackingCode)

    return new NextResponse(pdf, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': String(pdf.length),
      },
    })
  } catch (error: unknown) {
    console.error('Label download error:', error)
    return NextResponse.json(
      { error: 'Label downloaden mislukt' },
      { status: 500 },
    )
  }
}
