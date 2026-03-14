import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Toerisme Search API
 *
 * GET /api/toerisme/search
 *
 * Zoekt in de tours collection met gecombineerde filters.
 * Query params: destination?, continent?, category?, minPrice?, maxPrice?,
 *               minDuration?, maxDuration?, page?, limit?, sort?
 */

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const destination = searchParams.get('destination')
    const continent = searchParams.get('continent')
    const category = searchParams.get('category')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const minDuration = searchParams.get('minDuration')
    const maxDuration = searchParams.get('maxDuration')
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = Math.min(parseInt(searchParams.get('limit') || '12', 10), 100)
    const sort = searchParams.get('sort') || '-createdAt'

    const payload = await getPayload({ config: configPromise })

    // Build where conditions
    const conditions: any[] = [
      { status: { equals: 'published' } },
    ]

    // Destination filter (by relationship ID or destination slug)
    if (destination) {
      // Try to find destination by slug first
      try {
        const destResult = await payload.find({
          collection: 'destinations',
          where: { slug: { equals: destination } },
          limit: 1,
        })
        if (destResult.docs.length > 0) {
          conditions.push({ destination: { equals: destResult.docs[0].id } })
        }
      } catch {
        // If destinations collection doesn't exist or query fails, skip
      }
    }

    // Continent filter (via destination's continent field)
    if (continent) {
      try {
        const destResult = await payload.find({
          collection: 'destinations',
          where: { continent: { equals: continent } },
          limit: 100,
        })
        const destIds = destResult.docs.map((d) => d.id)
        if (destIds.length > 0) {
          conditions.push({ destination: { in: destIds } })
        } else {
          // No destinations found for this continent — return empty
          return NextResponse.json({
            docs: [],
            totalDocs: 0,
            totalPages: 0,
            page,
          })
        }
      } catch {
        // If destinations collection doesn't exist, skip
      }
    }

    // Category filter
    if (category) {
      conditions.push({ category: { equals: category } })
    }

    // Price range filter
    if (minPrice) {
      conditions.push({ price: { greater_than_equal: Number(minPrice) } })
    }
    if (maxPrice) {
      conditions.push({ price: { less_than_equal: Number(maxPrice) } })
    }

    // Duration range filter
    if (minDuration) {
      conditions.push({ duration: { greater_than_equal: Number(minDuration) } })
    }
    if (maxDuration) {
      conditions.push({ duration: { less_than_equal: Number(maxDuration) } })
    }

    const result = await payload.find({
      collection: 'tours',
      where: {
        and: conditions,
      },
      limit,
      page,
      sort,
      depth: 2,
    })

    return NextResponse.json({
      docs: result.docs,
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
      page: result.page,
    })
  } catch (error) {
    console.error('[toerisme/search] Error:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het zoeken' },
      { status: 500 },
    )
  }
}

// Prevent caching of API route
export const dynamic = 'force-dynamic'
