import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Vastgoed Viewing API
 *
 * POST /api/vastgoed/viewing
 *
 * Maakt een bezichtigingsaanvraag aan in content-bookings.
 * Koppelt optioneel een property relatie.
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      propertyId,
      viewingType,
      preferredDate,
      preferredTime,
      firstName,
      lastName,
      email,
      phone,
      remarks,
    } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { error: 'Vul alle verplichte velden in (voornaam, achternaam, e-mail, telefoon)' },
        { status: 400 },
      )
    }

    if (!preferredDate || !preferredTime) {
      return NextResponse.json(
        { error: 'Selecteer een gewenste datum en tijdstip' },
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

    const bookingData: Record<string, any> = {
      branch: 'vastgoed',
      status: 'new',
      isValuation: false,
      firstName,
      lastName,
      email,
      phone,
      date: preferredDate,
      preferredDate,
      preferredTime,
      viewingType: viewingType || 'fysiek',
      remarks: remarks || '',
    }

    // Link the property if provided
    if (propertyId) {
      bookingData.property = Number(propertyId)
    }

    const booking = await payload.create({
      collection: 'content-bookings',
      data: bookingData,
    })

    console.log(
      `[vastgoed/viewing] Bezichtiging aangemaakt — booking ${booking.id}, ` +
        `klant: ${firstName} ${lastName}, type: ${viewingType || 'fysiek'}, ` +
        `datum: ${preferredDate}, tijd: ${preferredTime}` +
        (propertyId ? `, woning: ${propertyId}` : ''),
    )

    return NextResponse.json({ success: true, bookingId: booking.id })
  } catch (error) {
    console.error('[vastgoed/viewing] Error:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het aanmaken van de bezichtiging' },
      { status: 500 },
    )
  }
}

// Prevent caching of API route
export const dynamic = 'force-dynamic'
