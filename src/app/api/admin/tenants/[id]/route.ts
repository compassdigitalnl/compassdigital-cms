import { NextRequest, NextResponse } from 'next/server'
import { Client } from 'pg'

/**
 * Get Tenant Details
 * GET /api/admin/tenants/[id]
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = new Client({
    connectionString: process.env.PLATFORM_DATABASE_URL || process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  })

  try {
    await client.connect()

    const result = await client.query(
      'SELECT * FROM tenants WHERE id = $1',
      [params.id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      )
    }

    const tenant = result.rows[0]

    return NextResponse.json({
      tenant: {
        ...tenant,
        wizard_data: JSON.parse(tenant.wizard_data || '{}'),
        metadata: JSON.parse(tenant.metadata || '{}'),
      },
    })
  } catch (error) {
    console.error('Get tenant error:', error)
    return NextResponse.json(
      { error: 'Failed to get tenant' },
      { status: 500 }
    )
  } finally {
    await client.end()
  }
}

/**
 * Update Tenant
 * PATCH /api/admin/tenants/[id]
 *
 * Body: { databaseUrl?, status?, name?, metadata? }
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = new Client({
    connectionString: process.env.PLATFORM_DATABASE_URL || process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  })

  try {
    const body = await req.json()
    const { databaseUrl, status, name, metadata } = body

    await client.connect()

    // Check tenant exists
    const existingResult = await client.query(
      'SELECT * FROM tenants WHERE id = $1',
      [params.id]
    )

    if (existingResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      )
    }

    // Build update query dynamically
    const updates: string[] = []
    const values: any[] = []
    let paramIndex = 1

    if (databaseUrl !== undefined) {
      updates.push(`database_url = $${paramIndex}`)
      values.push(databaseUrl)
      paramIndex++

      // If database URL is provided, activate tenant
      if (databaseUrl !== 'PENDING_DATABASE_CREATION') {
        updates.push(`status = $${paramIndex}`)
        values.push('active')
        paramIndex++
      }
    }

    if (status !== undefined) {
      updates.push(`status = $${paramIndex}`)
      values.push(status)
      paramIndex++
    }

    if (name !== undefined) {
      updates.push(`name = $${paramIndex}`)
      values.push(name)
      paramIndex++
    }

    if (metadata !== undefined) {
      updates.push(`metadata = $${paramIndex}`)
      values.push(JSON.stringify(metadata))
      paramIndex++
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No updates provided' },
        { status: 400 }
      )
    }

    updates.push(`updated_at = NOW()`)
    values.push(params.id)

    const query = `
      UPDATE tenants
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `

    const result = await client.query(query, values)
    const tenant = result.rows[0]

    // Audit log
    await client.query(
      `INSERT INTO audit_log (tenant_id, action, resource_type, resource_id, details)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        tenant.id,
        'updated',
        'tenant',
        tenant.id,
        JSON.stringify(body),
      ]
    )

    return NextResponse.json({
      success: true,
      tenant: {
        ...tenant,
        wizard_data: JSON.parse(tenant.wizard_data || '{}'),
        metadata: JSON.parse(tenant.metadata || '{}'),
      },
    })
  } catch (error) {
    console.error('Update tenant error:', error)
    return NextResponse.json(
      {
        error: 'Failed to update tenant',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await client.end()
  }
}

/**
 * Delete Tenant (Soft Delete)
 * DELETE /api/admin/tenants/[id]
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = new Client({
    connectionString: process.env.PLATFORM_DATABASE_URL || process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  })

  try {
    await client.connect()

    // Soft delete - set status to 'deleted'
    const result = await client.query(
      `UPDATE tenants
       SET status = 'deleted', updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [params.id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      )
    }

    // Audit log
    await client.query(
      `INSERT INTO audit_log (tenant_id, action, resource_type, resource_id, details)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        params.id,
        'deleted',
        'tenant',
        params.id,
        JSON.stringify({ soft_delete: true }),
      ]
    )

    return NextResponse.json({
      success: true,
      message: 'Tenant soft deleted',
    })
  } catch (error) {
    console.error('Delete tenant error:', error)
    return NextResponse.json(
      { error: 'Failed to delete tenant' },
      { status: 500 }
    )
  } finally {
    await client.end()
  }
}
