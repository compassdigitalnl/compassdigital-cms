import { NextRequest, NextResponse } from 'next/server'
import { lookupPostcode } from '@/lib/integrations/postcode/client'

/**
 * GET /api/postcode-lookup?postal=1234AB&number=10
 *
 * Returns { success, street, city, province } for NL postcodes.
 * Used by AddressForm component for autocomplete.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const postal = searchParams.get('postal')
  const number = searchParams.get('number') || undefined

  if (!postal) {
    return NextResponse.json(
      { success: false, error: 'Parameter "postal" is verplicht' },
      { status: 400 },
    )
  }

  try {
    const result = await lookupPostcode(postal, number)

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Postcode niet gevonden' },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      street: result.street,
      city: result.city,
      province: result.province || null,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { success: false, error: message || 'Postcode lookup mislukt' },
      { status: 400 },
    )
  }
}
