import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Test Drive Booking API
 *
 * POST /api/automotive/test-drive
 *
 * Maakt een proefritboeking aan in content-bookings.
 * Haalt voertuiggegevens op uit de vehicles collection.
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      vehicleId,
      firstName,
      lastName,
      email,
      phone,
      preferredDate,
      preferredTime,
      remarks,
    } = body

    // Validate required fields
    if (!vehicleId || !firstName || !lastName || !email || !phone || !preferredDate) {
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

    // Fetch vehicle details to populate brand/model on the booking
    let vehicleBrand = ''
    let vehicleModel = ''
    let licensePlate = ''

    try {
      const vehicle = await payload.findByID({
        collection: 'vehicles',
        id: vehicleId,
        depth: 1,
      })

      if (vehicle) {
        // brand can be a relationship object or ID
        if (typeof vehicle.brand === 'object' && vehicle.brand?.name) {
          vehicleBrand = vehicle.brand.name
        }
        vehicleModel = vehicle.model || ''
        licensePlate = vehicle.licensePlate || ''
      }
    } catch (err) {
      console.warn('[automotive/test-drive] Could not fetch vehicle:', err)
    }

    const booking = await payload.create({
      collection: 'content-bookings',
      data: {
        branch: 'automotive',
        status: 'new',
        firstName,
        lastName,
        email,
        phone,
        date: preferredDate,
        time: preferredTime || '',
        licensePlate,
        vehicleBrand,
        vehicleModel,
        remarks: remarks || '',
      },
    })

    console.log(
      `[automotive/test-drive] Proefrit aangevraagd — booking ${booking.id}, ` +
        `klant: ${firstName} ${lastName}, voertuig: ${vehicleBrand} ${vehicleModel}`,
    )

    return NextResponse.json({ success: true, id: booking.id })
  } catch (error) {
    console.error('[automotive/test-drive] Error:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het aanmaken van de proefrit' },
      { status: 500 },
    )
  }
}

// Prevent caching of API route
export const dynamic = 'force-dynamic'
