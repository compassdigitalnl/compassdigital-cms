import { NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

/**
 * GET /api/support/categories
 * Fetch active support categories (public)
 */
export async function GET() {
  try {
    const payload = await getPayloadHMR({ config: configPromise })

    const result = await payload.find({
      collection: 'support-categories',
      where: { isActive: { equals: true } },
      sort: 'name',
      limit: 50,
      depth: 0,
    })

    return NextResponse.json({
      success: true,
      docs: result.docs,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories', message }, { status: 500 })
  }
}
