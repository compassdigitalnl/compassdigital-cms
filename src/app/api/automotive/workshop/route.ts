import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Workshop Booking API
 *
 * POST /api/automotive/workshop
 *
 * Maakt een werkplaatsboeking aan in content-bookings.
 * Koppelt optioneel een dienst (content-services).
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      serviceId,
      licensePlate,
      vehicleBrand,
      vehicleModel,
      date,
      time,
      firstName,
      lastName,
      email,
      phone,
      remarks,
    } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !date || !time) {
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

    const bookingData: Record<string, any> = {
      branch: 'automotive',
      status: 'new',
      firstName,
      lastName,
      email,
      phone,
      date,
      time,
      licensePlate: licensePlate || '',
      vehicleBrand: vehicleBrand || '',
      vehicleModel: vehicleModel || '',
      remarks: remarks || '',
    }

    // Link the service if provided
    if (serviceId) {
      bookingData.service = serviceId
    }

    const booking = await payload.create({
      collection: 'content-bookings',
      data: bookingData,
    })

    console.log(
      `[automotive/workshop] Werkplaatsafspraak aangemaakt — booking ${booking.id}, ` +
        `klant: ${firstName} ${lastName}, kenteken: ${licensePlate || 'n.v.t.'}, datum: ${date} ${time}`,
    )

    return NextResponse.json({ success: true, id: booking.id })
  } catch (error) {
    console.error('[automotive/workshop] Error:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het aanmaken van de werkplaatsafspraak' },
      { status: 500 },
    )
  }
}

// Prevent caching of API route
export const dynamic = 'force-dynamic'
