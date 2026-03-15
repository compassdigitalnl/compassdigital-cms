import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Vastgoed Search API
 *
 * GET /api/vastgoed/search
 *
 * Zoekt in de properties collection met gecombineerde filters.
 * Retourneert gesorteerde resultaten met paginatie.
 *
 * Query params:
 * - city?: string
 * - minPrice?: number
 * - maxPrice?: number
 * - propertyType?: string
 * - minBedrooms?: number
 * - minArea?: number
 * - maxArea?: number
 * - energyLabel?: string
 * - status?: string (beschikbaar/onder-bod/verkocht/verhuurd)
 * - sort?: string (prijs-oplopend/prijs-aflopend/nieuwste/oppervlakte)
 * - page?: number (default 1)
 * - limit?: number (default 12)
 */

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const city = searchParams.get('city')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const propertyType = searchParams.get('propertyType')
    const minBedrooms = searchParams.get('minBedrooms')
    const minArea = searchParams.get('minArea')
    const maxArea = searchParams.get('maxArea')
    const energyLabel = searchParams.get('energyLabel')
    const status = searchParams.get('status')
    const sort = searchParams.get('sort')
    const page = Math.max(1, Number(searchParams.get('page')) || 1)
    const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit')) || 12))

    const payload = await getPayload({ config: configPromise })

    // Build where clause
    const conditions: any[] = [
      { status: { equals: 'published' } },
    ]

    if (city) {
      conditions.push({ city: { contains: city } })
    }

    if (minPrice) {
      conditions.push({ askingPrice: { greater_than_equal: Number(minPrice) } })
    }

    if (maxPrice) {
      conditions.push({ askingPrice: { less_than_equal: Number(maxPrice) } })
    }

    if (propertyType) {
      conditions.push({ propertyType: { equals: propertyType } })
    }

    if (minBedrooms) {
      conditions.push({ bedrooms: { greater_than_equal: Number(minBedrooms) } })
    }

    if (minArea) {
      conditions.push({ livingArea: { greater_than_equal: Number(minArea) } })
    }

    if (maxArea) {
      conditions.push({ livingArea: { less_than_equal: Number(maxArea) } })
    }

    if (energyLabel) {
      conditions.push({ energyLabel: { equals: energyLabel } })
    }

    if (status) {
      conditions.push({ listingStatus: { equals: status } })
    }

    // Sort mapping
    let sortField = '-createdAt' // default: nieuwste
    switch (sort) {
      case 'prijs-oplopend':
        sortField = 'askingPrice'
        break
      case 'prijs-aflopend':
        sortField = '-askingPrice'
        break
      case 'nieuwste':
        sortField = '-createdAt'
        break
      case 'oppervlakte':
        sortField = '-livingArea'
        break
    }

    const result = await payload.find({
      collection: 'properties',
      where: {
        and: conditions,
      },
      sort: sortField,
      page,
      limit,
    })

    return NextResponse.json({
      properties: result.docs,
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
      page: result.page,
      limit: result.limit,
    })
  } catch (error) {
    console.error('[vastgoed/search] Error:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het zoeken' },
      { status: 500 },
    )
  }
}

// Prevent caching of API route
export const dynamic = 'force-dynamic'
