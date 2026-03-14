import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Toerisme Availability API
 *
 * GET /api/toerisme/availability
 *
 * Checkt beschikbaarheid van een reis of accommodatie.
 * Query params: tourId of accommodationId, month (YYYY-MM)
 *
 * Returns: { tourId?, accommodationId?, available, spotsLeft, maxParticipants, currentBookings }
 */

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const tourId = searchParams.get('tourId')
    const accommodationId = searchParams.get('accommodationId')
    const month = searchParams.get('month') // YYYY-MM format

    if (!tourId && !accommodationId) {
      return NextResponse.json(
        { error: 'tourId of accommodationId is verplicht' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config: configPromise })

    // Check tour availability
    if (tourId) {
      let tour: any
      try {
        tour = await payload.findByID({
          collection: 'tours',
          id: Number(tourId),
        })
      } catch {
        return NextResponse.json(
          { error: 'Reis niet gevonden' },
          { status: 404 },
        )
      }

      const maxParticipants = tour.maxParticipants || 0
      const currentBookings = tour.currentBookings || 0
      const spotsLeft = Math.max(0, maxParticipants - currentBookings)
      const available = spotsLeft > 0 && tour.availability !== 'uitverkocht'

      return NextResponse.json({
        tourId: Number(tourId),
        available,
        spotsLeft,
        maxParticipants,
        currentBookings,
        availability: tour.availability || 'beschikbaar',
        departureDate: tour.departureDate || null,
        returnDate: tour.returnDate || null,
      })
    }

    // Check accommodation availability
    if (accommodationId) {
      let accommodation: any
      try {
        accommodation = await payload.findByID({
          collection: 'accommodations',
          id: Number(accommodationId),
        })
      } catch {
        return NextResponse.json(
          { error: 'Accommodatie niet gevonden' },
          { status: 404 },
        )
      }

      // For accommodations, count bookings for the requested month
      let currentBookings = 0
      if (month) {
        const monthStart = `${month}-01T00:00:00.000Z`
        const [year, m] = month.split('-').map(Number)
        const nextMonth = m === 12 ? `${year + 1}-01` : `${year}-${String(m + 1).padStart(2, '0')}`
        const monthEnd = `${nextMonth}-01T00:00:00.000Z`

        try {
          const bookingsResult = await payload.find({
            collection: 'content-bookings',
            where: {
              and: [
                { branch: { equals: 'toerisme' } },
                { accommodation: { equals: Number(accommodationId) } },
                { status: { not_equals: 'cancelled' } },
                {
                  or: [
                    {
                      and: [
                        { departureDate: { greater_than_equal: monthStart } },
                        { departureDate: { less_than: monthEnd } },
                      ],
                    },
                    {
                      and: [
                        { returnDate: { greater_than_equal: monthStart } },
                        { returnDate: { less_than: monthEnd } },
                      ],
                    },
                  ],
                },
              ],
            },
            limit: 0,
          })
          currentBookings = bookingsResult.totalDocs
        } catch {
          // If query fails, assume available
        }
      }

      // For simplicity, assume available unless we have a lot of bookings
      const rooms = accommodation.rooms || []
      const totalCapacity = rooms.reduce((sum: number, room: any) => sum + (room.maxGuests || 2), 0) || 10
      const available = currentBookings < totalCapacity

      return NextResponse.json({
        accommodationId: Number(accommodationId),
        available,
        spotsLeft: Math.max(0, totalCapacity - currentBookings),
        maxParticipants: totalCapacity,
        currentBookings,
        month: month || null,
      })
    }

    return NextResponse.json(
      { error: 'Ongeldige aanvraag' },
      { status: 400 },
    )
  } catch (error) {
    console.error('[toerisme/availability] Error:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het ophalen van de beschikbaarheid' },
      { status: 500 },
    )
  }
}

// Prevent caching of API route
export const dynamic = 'force-dynamic'
