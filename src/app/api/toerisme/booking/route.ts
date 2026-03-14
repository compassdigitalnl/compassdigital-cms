import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Toerisme Booking API
 *
 * POST /api/toerisme/booking
 *
 * Maakt een toerisme-boeking aan in content-bookings.
 * Koppelt optioneel een tour of accommodatie.
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      tourId,
      accommodationId,
      departureDate,
      returnDate,
      travelers,
      firstName,
      lastName,
      email,
      phone,
      travelInsurance,
      remarks,
    } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { error: 'Vul alle verplichte velden in (voornaam, achternaam, e-mail, telefoon)' },
        { status: 400 },
      )
    }

    if (!departureDate || !returnDate) {
      return NextResponse.json(
        { error: 'Vertrekdatum en retourdatum zijn verplicht' },
        { status: 400 },
      )
    }

    if (!travelers || travelers < 1) {
      return NextResponse.json(
        { error: 'Minimaal 1 reiziger vereist' },
        { status: 400 },
      )
    }

    if (!tourId && !accommodationId) {
      return NextResponse.json(
        { error: 'Selecteer een reis of accommodatie' },
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

    // Validate dates
    const departure = new Date(departureDate)
    const returnD = new Date(returnDate)
    if (returnD <= departure) {
      return NextResponse.json(
        { error: 'Retourdatum moet na vertrekdatum liggen' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config: configPromise })

    const bookingData: Record<string, any> = {
      branch: 'toerisme',
      status: 'new',
      firstName,
      lastName,
      email,
      phone,
      date: departureDate,
      departureDate,
      returnDate,
      travelers: Number(travelers),
      travelInsurance: travelInsurance || false,
      remarks: remarks || '',
    }

    // Link the tour if provided
    if (tourId) {
      bookingData.tour = Number(tourId)
    }

    // Link the accommodation if provided
    if (accommodationId) {
      bookingData.accommodation = Number(accommodationId)
    }

    const booking = await payload.create({
      collection: 'content-bookings',
      data: bookingData,
    })

    console.log(
      `[toerisme/booking] Reisboeking aangemaakt — booking ${booking.id}, ` +
        `klant: ${firstName} ${lastName}, reizigers: ${travelers}, ` +
        `vertrek: ${departureDate}, retour: ${returnDate}` +
        (tourId ? `, tour: ${tourId}` : '') +
        (accommodationId ? `, accommodatie: ${accommodationId}` : ''),
    )

    return NextResponse.json({ success: true, id: booking.id })
  } catch (error) {
    console.error('[toerisme/booking] Error:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het aanmaken van de boeking' },
      { status: 500 },
    )
  }
}

// Prevent caching of API route
export const dynamic = 'force-dynamic'
