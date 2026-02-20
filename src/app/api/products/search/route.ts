import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

/**
 * GET /api/products/search?q=query&limit=10
 * Search products by name, SKU, or EAN for quick add functionality
 */
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const { searchParams } = new URL(request.url)

    const query = searchParams.get('q') || ''
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        docs: [],
        totalDocs: 0,
        message: 'Query too short (min 2 characters)',
      })
    }

    // Search products by title, SKU, or EAN
    const { docs, totalDocs } = await payload.find({
      collection: 'products',
      where: {
        and: [
          {
            status: {
              equals: 'published',
            },
          },
          {
            or: [
              {
                title: {
                  contains: query,
                },
              },
              {
                sku: {
                  contains: query,
                },
              },
              {
                ean: {
                  equals: query, // Exact match for EAN/barcode
                },
              },
            ],
          },
        ],
      },
      limit,
      depth: 2, // Populate brand relationship
      sort: '-createdAt',
    })

    // Transform docs to simpler format for frontend
    const results = docs.map((doc: any) => ({
      id: doc.id,
      title: doc.title,
      sku: doc.sku || '',
      ean: doc.ean || '',
      brand: typeof doc.brand === 'object' ? doc.brand?.name || '' : '',
      price: doc.price || 0,
      stock: doc.stock || 0,
      stockStatus: doc.stockStatus || 'in-stock',
      priceUnit: doc.priceUnit || 'stuk',
      size: doc.size || '',
      shortDescription: doc.shortDescription || '',
    }))

    return NextResponse.json({
      success: true,
      docs: results,
      totalDocs,
      query,
    })
  } catch (error: any) {
    console.error('Error searching products:', error)
    return NextResponse.json(
      {
        error: 'Failed to search products',
        message: error.message,
      },
      { status: 500 },
    )
  }
}
