import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Vastgoed Valuation API
 *
 * POST /api/vastgoed/valuation
 *
 * Maakt een waardebepaling aanvraag aan in content-bookings.
 * Slaat adres, type en oppervlakte op in vastgoed-specifieke velden.
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      address,
      propertyType,
      area,
      name,
      email,
      phone,
    } = body

    // Validate required fields
    if (!address || !propertyType || !name || !email) {
      return NextResponse.json(
        { error: 'Vul alle verplichte velden in (adres, woningtype, naam, e-mail)' },
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

    // Split name into firstName and lastName
    const nameParts = name.trim().split(/\s+/)
    const firstName = nameParts[0] || name
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ''

    const payload = await getPayload({ config: configPromise })

    const bookingData: Record<string, any> = {
      branch: 'vastgoed',
      status: 'new',
      isValuation: true,
      propertyAddress: address,
      propertyType,
      firstName,
      lastName: lastName || firstName, // Payload requires lastName
      email,
      phone: phone || '',
      date: new Date().toISOString().split('T')[0],
    }

    if (area) {
      bookingData.propertyArea = Number(area)
    }

    const booking = await payload.create({
      collection: 'content-bookings',
      data: bookingData,
    })

    console.log(
      `[vastgoed/valuation] Waardebepaling aangemaakt — booking ${booking.id}, ` +
        `klant: ${name}, adres: ${address}, type: ${propertyType}` +
        (area ? `, oppervlakte: ${area} m²` : ''),
    )

    return NextResponse.json({ success: true, bookingId: booking.id })
  } catch (error) {
    console.error('[vastgoed/valuation] Error:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het aanmaken van de waardebepaling' },
      { status: 500 },
    )
  }
}

// Prevent caching of API route
export const dynamic = 'force-dynamic'
