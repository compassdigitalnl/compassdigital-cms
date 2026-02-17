/**
 * Deploy First Client - Complete Workflow
 *
 * This script:
 * 1. Creates a test client in the database
 * 2. Triggers the provisioning workflow (Ploi deployment)
 * 3. Monitors real-time progress
 * 4. Shows final results
 */

import dotenv from 'dotenv'
import path from 'path'

// Load both .env and .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env') })
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { getPayload } from 'payload'
import config from '@payload-config'

const CLIENT_DATA = {
  name: 'Test Client 1',
  domain: 'testclient1',  // Will become: testclient1.compassdigital.nl
  contactEmail: 'test@example.com',
  contactName: 'Test Contact',
  template: 'corporate',
  plan: 'starter',
  billingStatus: 'trial',
}

async function deployFirstClient() {
  console.log('🚀 FIRST CLIENT DEPLOYMENT\n')
  console.log('═'.repeat(60))
  console.log('')

  try {
    // Step 1: Initialize Payload
    console.log('1️⃣  Initializing Payload CMS...')
    const payload = await getPayload({ config })
    console.log('   ✅ Payload ready\n')

    // Step 2: Check if client exists
    console.log('2️⃣  Checking for existing client...')
    const { docs: existing } = await payload.find({
      collection: 'clients',
      where: {
        domain: {
          equals: CLIENT_DATA.domain,
        },
      },
    })

    let client
    if (existing.length > 0) {
      client = existing[0]
      console.log(`   ℹ️  Client already exists: ${client.name} (${client.id})`)
      console.log(`   📍 Domain: ${client.domain}.compassdigital.nl`)
      console.log(`   🔧 Status: ${client.status}\n`)
    } else {
      // Step 3: Create client
      console.log('3️⃣  Creating test client in database...')
      client = await payload.create({
        collection: 'clients',
        data: CLIENT_DATA,
      })
      console.log('   ✅ Client created!')
      console.log(`   📝 ID: ${client.id}`)
      console.log(`   👤 Name: ${client.name}`)
      console.log(`   🌍 Domain: ${client.domain}.compassdigital.nl\n`)
    }

    // Step 4: Prepare provisioning
    console.log('4️⃣  Preparing deployment...')
    console.log(`   🎯 Provider: Ploi (VPS)`)
    console.log(`   🖥️  Server: prod-sityzr-saas-01`)
    console.log(`   📦 Site: ${client.domain}.compassdigital.nl\n`)

    // Step 5: Show next steps
    console.log('5️⃣  NEXT STEPS:\n')
    console.log('   Option A: Deploy via Platform UI')
    console.log('   ─────────────────────────────────')
    console.log('   1. Open: http://localhost:3020/platform/clients')
    console.log(`   2. Click on: ${client.name}`)
    console.log('   3. Click: "Launch Site" button')
    console.log('   4. Watch real-time progress!\n')

    console.log('   Option B: Deploy via API (Advanced)')
    console.log('   ────────────────────────────────────────')
    console.log('   Run this command:\n')
    console.log(`   curl -X POST http://localhost:3020/api/wizard/provision-site \\`)
    console.log(`     -H "Content-Type: application/json" \\`)
    console.log(`     -d '{`)
    console.log(`       "clientId": "${client.id}",`)
    console.log(`       "deploymentProvider": "ploi",`)
    console.log(`       "sseConnectionId": "deploy-${Date.now()}",`)
    console.log(`       "wizardData": {`)
    console.log(`         "siteName": "${client.name}",`)
    console.log(`         "industry": "general"`)
    console.log(`       }`)
    console.log(`     }'`)
    console.log('')

    console.log('═'.repeat(60))
    console.log('\n✅ Ready to deploy!\n')
    console.log('📋 Client Details:')
    console.log(`   ID: ${client.id}`)
    console.log(`   Name: ${client.name}`)
    console.log(`   Domain: ${client.domain}.compassdigital.nl`)
    console.log(`   Status: ${client.status}`)
    console.log('')

  } catch (error: any) {
    console.error('\n❌ Error:', error.message)
    console.error('\nStack:', error.stack)
    process.exit(1)
  }

  process.exit(0)
}

// Run deployment
deployFirstClient()
