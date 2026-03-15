import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Onderwijs Search API
 *
 * GET /api/onderwijs/search
 *
 * Zoekt in de courses collection met gecombineerde filters.
 * Retourneert gesorteerde resultaten met paginatie.
 *
 * Query params:
 * - q?: string (tekst zoeken in titel)
 * - category?: string (categorie slug)
 * - level?: string (beginner/gevorderd/expert)
 * - minPrice?: number
 * - maxPrice?: number
 * - minRating?: number
 * - sort?: string (populair/nieuwste/prijs-laag/prijs-hoog/beoordeling)
 * - page?: number (default 1)
 * - limit?: number (default 12)
 */

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const q = searchParams.get('q')
    const category = searchParams.get('category')
    const level = searchParams.get('level')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const minRating = searchParams.get('minRating')
    const sort = searchParams.get('sort')
    const page = Math.max(1, Number(searchParams.get('page')) || 1)
    const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit')) || 12))

    const payload = await getPayload({ config: configPromise })

    // Build where clause
    const conditions: any[] = [
      { status: { equals: 'published' } },
    ]

    if (q) {
      conditions.push({ title: { contains: q } })
    }

    if (category) {
      // Category filter by slug — need to find category ID first
      try {
        const catResult = await payload.find({
          collection: 'course-categories',
          where: { slug: { equals: category } },
          limit: 1,
        })
        if (catResult.docs.length > 0) {
          conditions.push({ category: { equals: catResult.docs[0].id } })
        }
      } catch {
        // Ignore invalid category
      }
    }

    if (level) {
      conditions.push({ level: { equals: level } })
    }

    if (minPrice) {
      conditions.push({ price: { greater_than_equal: Number(minPrice) } })
    }

    if (maxPrice) {
      // Special case: maxPrice 0 means free courses
      if (Number(maxPrice) === 0) {
        conditions.push({ price: { equals: 0 } })
      } else {
        conditions.push({ price: { less_than_equal: Number(maxPrice) } })
      }
    }

    if (minRating) {
      conditions.push({ rating: { greater_than_equal: Number(minRating) } })
    }

    // Sort mapping
    let sortField = '-studentCount' // default: populairste
    switch (sort) {
      case 'populair':
        sortField = '-studentCount'
        break
      case 'nieuwste':
        sortField = '-createdAt'
        break
      case 'prijs-laag':
        sortField = 'price'
        break
      case 'prijs-hoog':
        sortField = '-price'
        break
      case 'beoordeling':
        sortField = '-rating'
        break
    }

    const result = await payload.find({
      collection: 'courses',
      where: {
        and: conditions,
      },
      sort: sortField,
      page,
      limit,
      depth: 1,
    })

    return NextResponse.json({
      courses: result.docs,
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
      page: result.page,
      limit: result.limit,
    })
  } catch (error) {
    console.error('[onderwijs/search] Error:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het zoeken' },
      { status: 500 },
    )
  }
}

// Prevent caching of API route
export const dynamic = 'force-dynamic'
