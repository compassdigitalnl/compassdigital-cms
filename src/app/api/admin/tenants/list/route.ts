import { NextRequest, NextResponse } from 'next/server'
import { Client } from 'pg'

/**
 * List All Tenants
 * GET /api/admin/tenants/list
 *
 * Query params:
 *   - status: filter by status (active, pending, suspended, deleted)
 *   - type: filter by type (website, webshop)
 *   - limit: max results (default 100)
 *   - offset: pagination offset (default 0)
 */
export async function GET(req: NextRequest) {
  const client = new Client({
    connectionString: process.env.PLATFORM_DATABASE_URL || process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  })

  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    await client.connect()

    // Build query with filters
    let query = `
      SELECT
        id, name, subdomain, type, status,
        created_at, updated_at,
        (CASE WHEN database_url = 'PENDING_DATABASE_CREATION' THEN false ELSE true END) as has_database
      FROM tenants
      WHERE 1=1
    `
    const params: any[] = []
    let paramIndex = 1

    if (status) {
      query += ` AND status = $${paramIndex}`
      params.push(status)
      paramIndex++
    }

    if (type) {
      query += ` AND type = $${paramIndex}`
      params.push(type)
      paramIndex++
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
    params.push(limit, offset)

    const result = await client.query(query, params)

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM tenants WHERE 1=1'
    const countParams: any[] = []
    let countParamIndex = 1

    if (status) {
      countQuery += ` AND status = $${countParamIndex}`
      countParams.push(status)
      countParamIndex++
    }

    if (type) {
      countQuery += ` AND type = $${countParamIndex}`
      countParams.push(type)
    }

    const countResult = await client.query(countQuery, countParams)
    const total = parseInt(countResult.rows[0].total)

    return NextResponse.json({
      tenants: result.rows,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    })
  } catch (error) {
    console.error('List tenants error:', error)
    return NextResponse.json(
      {
        error: 'Failed to list tenants',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await client.end()
  }
}
