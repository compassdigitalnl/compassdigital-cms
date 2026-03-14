import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Trade-In Request API
 *
 * POST /api/automotive/trade-in
 *
 * Slaat een inruilaanvraag op als form-submission.
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      licensePlate,
      brand,
      model,
      year,
      mileage,
      condition,
      firstName,
      lastName,
      email,
      phone,
      remarks,
    } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { error: 'Vul alle verplichte velden in' },
        { status: 400 },
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Ongeldig e-mailadres' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config: configPromise })

    const submission = await payload.create({
      collection: 'form-submissions',
      data: {
        form: 'trade-in' as any,
        data: [
          { field: 'firstName', value: firstName },
          { field: 'lastName', value: lastName },
          { field: 'email', value: email },
          { field: 'phone', value: phone },
          ...(licensePlate ? [{ field: 'licensePlate', value: licensePlate }] : []),
          ...(brand ? [{ field: 'brand', value: brand }] : []),
          ...(model ? [{ field: 'model', value: model }] : []),
          ...(year ? [{ field: 'year', value: String(year) }] : []),
          ...(mileage ? [{ field: 'mileage', value: String(mileage) }] : []),
          ...(condition ? [{ field: 'condition', value: condition }] : []),
          ...(remarks ? [{ field: 'remarks', value: remarks }] : []),
        ],
      } as any,
    })

    console.log(
      `[automotive/trade-in] Inruilaanvraag ontvangen — submission ${submission.id}, ` +
        `klant: ${firstName} ${lastName}, voertuig: ${brand || ''} ${model || ''} (${year || 'onbekend'})`,
    )

    return NextResponse.json({ success: true, id: submission.id })
  } catch (error) {
    console.error('[automotive/trade-in] Error:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het indienen van de inruilaanvraag' },
      { status: 500 },
    )
  }
}

// Prevent caching of API route
export const dynamic = 'force-dynamic'
