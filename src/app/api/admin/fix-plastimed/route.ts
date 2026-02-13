/**
 * Fix Plastimed Client
 * GET /api/admin/fix-plastimed
 */

import { NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import config from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayloadHMR({ config })

    // Find the Plasteimd/Plastimed client
    const { docs } = await payload.find({
      collection: 'clients',
      where: {
        or: [
          { domain: { equals: 'plasteimd' } },
          { domain: { equals: 'plastimed' } },
          { name: { contains: 'Plasti' } },
        ],
      },
    })

    if (docs.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Plastimed client not found',
      })
    }

    const client = docs[0]
    console.log('Found client:', client.name, 'ID:', client.id)

    // Update with correct values
    const updated = await payload.update({
      collection: 'clients',
      id: client.id,
      data: {
        domain: 'plastimed', // Fix typo
        deploymentUrl: 'https://plastimed.compassdigital.nl',
        adminUrl: 'https://plastimed.compassdigital.nl/admin',
        databaseUrl: 'postgresql://user:pass@localhost:5432/plastimed_db',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Plastimed client fixed successfully',
      before: {
        domain: client.domain,
        deploymentUrl: client.deploymentUrl,
        adminUrl: client.adminUrl,
        databaseUrl: client.databaseUrl,
      },
      after: {
        domain: updated.domain,
        deploymentUrl: updated.deploymentUrl,
        adminUrl: updated.adminUrl,
        databaseUrl: updated.databaseUrl,
      },
    })
  } catch (error: any) {
    console.error('Error fixing Plastimed:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 })
  }
}
