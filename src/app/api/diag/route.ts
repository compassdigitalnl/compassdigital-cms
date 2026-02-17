import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Diagnostic endpoint - temporarily added to debug admin 500 error
 * Counts all collections and reports failures
 * Protected with DIAG_KEY env variable
 * REMOVE AFTER DEBUGGING
 */
export async function GET(request: NextRequest) {
  const diagKey = process.env.DIAG_KEY || 'debug-compassdigital-2026'
  const key = request.nextUrl.searchParams.get('key')

  if (key !== diagKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayload({ config })

    const collections = [
      'users',
      'pages',
      'blog-posts',
      'faqs',
      'media',
      'cases',
      'testimonials',
      'services',
      'partners',
      'product-categories',
      'brands',
      'products',
      'customer-groups',
      'orderLists',
      'orders',
      'client-requests',
      'clients',
      'deployments',
      'forms',
      'form-submissions',
      'redirects',
    ]

    const results: Record<string, any> = {}

    for (const collection of collections) {
      try {
        const result = await payload.count({
          collection: collection as any,
          overrideAccess: true, // skip access control for diagnostics
        })
        results[collection] = { ok: true, count: result.totalDocs }
      } catch (err: any) {
        results[collection] = { ok: false, error: err?.message || String(err) }
      }
    }

    // Also check DB tables directly
    let tables: string[] = []
    try {
      const db = payload.db as any
      if (db?.drizzle) {
        const tableList = await db.drizzle.run(`SELECT name FROM sqlite_master WHERE type='table' ORDER BY name`)
        tables = (tableList?.rows || []).map((r: any) => r.name || r[0])
      }
    } catch (err: any) {
      tables = [`Error listing tables: ${err?.message}`]
    }

    return NextResponse.json({
      ok: true,
      collections: results,
      tables,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        error: error?.message || String(error),
        stack: error?.stack?.split('\n').slice(0, 10),
      },
      { status: 500 }
    )
  }
}
