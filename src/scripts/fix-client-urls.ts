/**
 * Fix Client URLs - Update Script
 *
 * Updates all existing client deploymentUrl and adminUrl fields
 * from .yourplatform.com to .compassdigital.nl
 */

import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') })
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { getPayload } from 'payload'
import config from '@payload-config'

const PLATFORM_BASE_URL = process.env.PLATFORM_BASE_URL || 'compassdigital.nl'

async function fixClientUrls() {
  console.log('🔧 Starting client URL fix...')
  console.log(`📍 Platform base URL: ${PLATFORM_BASE_URL}`)

  const payload = await getPayload({ config })

  try {
    // Fetch all clients
    const { docs: clients } = await payload.find({
      collection: 'clients',
      limit: 1000,
    })

    console.log(`📊 Found ${clients.length} clients to process`)

    let updated = 0
    let skipped = 0

    for (const client of clients) {
      const updates: any = {}
      let needsUpdate = false

      // Check and fix deploymentUrl
      if (client.deploymentUrl && client.deploymentUrl.includes('.yourplatform.com')) {
        const newUrl = client.deploymentUrl.replace('.yourplatform.com', `.${PLATFORM_BASE_URL}`)
        updates.deploymentUrl = newUrl
        needsUpdate = true
        console.log(`  📝 ${client.name}: ${client.deploymentUrl} → ${newUrl}`)
      }

      // Check and fix adminUrl
      if (client.adminUrl && client.adminUrl.includes('.yourplatform.com')) {
        const newUrl = client.adminUrl.replace('.yourplatform.com', `.${PLATFORM_BASE_URL}`)
        updates.adminUrl = newUrl
        needsUpdate = true
        console.log(`  📝 ${client.name} (admin): ${client.adminUrl} → ${newUrl}`)
      }

      // Alternative: Generate URLs from domain if missing
      if (!client.deploymentUrl && client.domain) {
        updates.deploymentUrl = `https://${client.domain}.${PLATFORM_BASE_URL}`
        needsUpdate = true
        console.log(`  ✨ ${client.name}: Generated deploymentUrl: ${updates.deploymentUrl}`)
      }

      if (!client.adminUrl && client.domain) {
        updates.adminUrl = `https://${client.domain}.${PLATFORM_BASE_URL}/admin`
        needsUpdate = true
        console.log(`  ✨ ${client.name}: Generated adminUrl: ${updates.adminUrl}`)
      }

      if (needsUpdate) {
        await payload.update({
          collection: 'clients',
          id: client.id,
          data: updates,
        })
        updated++
      } else {
        skipped++
      }
    }

    console.log('\n✅ URL fix complete!')
    console.log(`   Updated: ${updated} clients`)
    console.log(`   Skipped: ${skipped} clients (already correct)`)
    console.log(`\n🎯 All client URLs now use: .${PLATFORM_BASE_URL}`)

  } catch (error) {
    console.error('❌ Error fixing client URLs:', error)
    throw error
  }

  process.exit(0)
}

// Run the fix
fixClientUrls().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
