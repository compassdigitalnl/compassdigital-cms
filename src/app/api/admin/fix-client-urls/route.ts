/**
 * Admin Endpoint: Fix Client URLs
 * GET /api/admin/fix-client-urls
 *
 * Updates all client deploymentUrl and adminUrl from .yourplatform.com to .compassdigital.nl
 * Run this once after setting PLATFORM_BASE_URL
 */

import { NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import config from '@payload-config'

const PLATFORM_BASE_URL = process.env.PLATFORM_BASE_URL || 'compassdigital.nl'

export async function GET() {
  try {
    console.log('🔧 Starting client URL fix...')
    console.log(`📍 Platform base URL: ${PLATFORM_BASE_URL}`)

    const payload = await getPayloadHMR({ config })

    // Fetch all clients
    const { docs: clients } = await payload.find({
      collection: 'clients',
      limit: 1000,
    })

    console.log(`📊 Found ${clients.length} clients to process`)

    const results = []
    let updated = 0
    let skipped = 0

    for (const client of clients) {
      const updates: any = {}
      let needsUpdate = false
      const changes = []

      // Check and fix deploymentUrl
      if (client.deploymentUrl && client.deploymentUrl.includes('.yourplatform.com')) {
        const oldUrl = client.deploymentUrl
        const newUrl = client.deploymentUrl.replace('.yourplatform.com', `.${PLATFORM_BASE_URL}`)
        updates.deploymentUrl = newUrl
        needsUpdate = true
        changes.push(`deploymentUrl: ${oldUrl} → ${newUrl}`)
      }

      // Check and fix adminUrl
      if (client.adminUrl && client.adminUrl.includes('.yourplatform.com')) {
        const oldUrl = client.adminUrl
        const newUrl = client.adminUrl.replace('.yourplatform.com', `.${PLATFORM_BASE_URL}`)
        updates.adminUrl = newUrl
        needsUpdate = true
        changes.push(`adminUrl: ${oldUrl} → ${newUrl}`)
      }

      // Generate URLs from domain if missing
      if (!client.deploymentUrl && client.domain) {
        updates.deploymentUrl = `https://${client.domain}.${PLATFORM_BASE_URL}`
        needsUpdate = true
        changes.push(`Generated deploymentUrl: ${updates.deploymentUrl}`)
      }

      if (!client.adminUrl && client.domain) {
        updates.adminUrl = `https://${client.domain}.${PLATFORM_BASE_URL}/admin`
        needsUpdate = true
        changes.push(`Generated adminUrl: ${updates.adminUrl}`)
      }

      if (needsUpdate) {
        await payload.update({
          collection: 'clients',
          id: client.id,
          data: updates,
        })
        updated++
        results.push({
          clientId: client.id,
          clientName: client.name,
          changes,
        })
        console.log(`  ✅ Updated: ${client.name}`)
      } else {
        skipped++
      }
    }

    const summary = {
      success: true,
      message: 'Client URLs fixed successfully',
      platformBaseUrl: PLATFORM_BASE_URL,
      stats: {
        total: clients.length,
        updated,
        skipped,
      },
      results,
    }

    console.log('\n✅ URL fix complete!')
    console.log(`   Updated: ${updated} clients`)
    console.log(`   Skipped: ${skipped} clients (already correct)`)

    return NextResponse.json(summary)

  } catch (error: any) {
    console.error('❌ Error fixing client URLs:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}
