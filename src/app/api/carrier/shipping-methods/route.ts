import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getCarrierProvider } from '@/lib/carriers'

/**
 * GET /api/carrier/shipping-methods
 *
 * Get available shipping methods from the configured carrier.
 * Used in admin panel for selecting shipping method when creating labels.
 */
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
    }

    const ecomSettings: any = await payload.findGlobal({
      slug: 'e-commerce-settings' as any,
      depth: 0,
    }).catch(() => null)

    const carrier = getCarrierProvider(ecomSettings)
    if (!carrier) {
      return NextResponse.json({ methods: [], provider: 'none' })
    }

    const methods = await carrier.getShippingMethods()

    return NextResponse.json({
      provider: carrier.name,
      methods,
    })
  } catch (error: unknown) {
    console.error('Shipping methods error:', error)
    return NextResponse.json(
      { error: 'Verzendmethodes ophalen mislukt' },
      { status: 500 },
    )
  }
}
