import { NextRequest, NextResponse } from 'next/server'
import { Client } from 'pg'

/**
 * Create New Tenant (Klant)
 * POST /api/admin/tenants/create
 *
 * Body: { name, type, wizardData }
 * Returns: { tenant, instructions }
 */
export async function POST(req: NextRequest) {
  const client = new Client({
    connectionString: process.env.PLATFORM_DATABASE_URL || process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  })

  try {
    const { name, type, wizardData } = await req.json()

    // Validate input
    if (!name || !type) {
      return NextResponse.json(
        { error: 'Name and type are required' },
        { status: 400 }
      )
    }

    if (!['website', 'webshop'].includes(type)) {
      return NextResponse.json(
        { error: 'Type must be "website" or "webshop"' },
        { status: 400 }
      )
    }

    // Generate tenant ID from name
    const tenantId = name
      .toLowerCase()
      .replace(/\s+/g, '-') // Spaces to dashes
      .replace(/[^a-z0-9-]/g, '') // Remove special chars
      .substring(0, 30) // Max 30 chars

    const subdomain = tenantId

    await client.connect()

    // Check if subdomain already exists
    const existingResult = await client.query(
      'SELECT id FROM tenants WHERE subdomain = $1',
      [subdomain]
    )

    if (existingResult.rows.length > 0) {
      return NextResponse.json(
        { error: `Subdomain "${subdomain}" already exists` },
        { status: 400 }
      )
    }

    // Create tenant record (database_url = placeholder for now)
    const insertResult = await client.query(
      `INSERT INTO tenants (id, name, subdomain, database_url, type, wizard_data, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        tenantId,
        name,
        subdomain,
        'PENDING_DATABASE_CREATION', // Placeholder
        type,
        JSON.stringify(wizardData || {}),
        'pending',
      ]
    )

    const tenant = insertResult.rows[0]

    // Audit log
    await client.query(
      `INSERT INTO audit_log (tenant_id, action, resource_type, resource_id, details)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        tenant.id,
        'created',
        'tenant',
        tenant.id,
        JSON.stringify({ name, type }),
      ]
    )

    return NextResponse.json({
      success: true,
      tenant: {
        id: tenant.id,
        name: tenant.name,
        subdomain: tenant.subdomain,
        type: tenant.type,
        status: tenant.status,
        url: `https://${tenant.subdomain}.cms.compassdigital.nl`,
        adminUrl: `https://${tenant.subdomain}.cms.compassdigital.nl/admin`,
      },
      instructions: {
        step1: 'Go to Railway dashboard: https://railway.app',
        step2: 'Click "+ Create" → Database → PostgreSQL',
        step3: `Name it: tenant-${tenant.id}`,
        step4: 'Wait 2 minutes for database to provision',
        step5: 'Click service → Connect tab → Copy DATABASE_URL',
        step6: `Update tenant via: PATCH /api/admin/tenants/${tenant.id}`,
        step7: `Body: { "databaseUrl": "postgresql://..." }`,
      },
    })
  } catch (error) {
    console.error('Create tenant error:', error)
    return NextResponse.json(
      {
        error: 'Failed to create tenant',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await client.end()
  }
}
