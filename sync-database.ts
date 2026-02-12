#!/usr/bin/env tsx
/**
 * Force Payload CMS to sync full database schema
 * This creates ALL collections tables in PostgreSQL
 */

// Load environment variables from .env file
import { config as dotenvConfig } from 'dotenv'
import path from 'path'

// Load .env file
dotenvConfig({ path: path.resolve(process.cwd(), '.env') })

import { getPayload } from 'payload'
import config from './src/payload.config'

async function syncDatabase() {
  console.log('🗄️  Starting Payload database sync...')
  console.log('')

  try {
    // Initialize Payload (this triggers schema sync)
    console.log('Initializing Payload CMS...')
    const payload = await getPayload({ config })

    console.log('✅ Payload initialized successfully!')
    console.log('')
    console.log('📊 Collections synced:')

    // List all collections
    const collections = Object.keys(payload.collections)
    collections.forEach((collection) => {
      console.log(`  ✓ ${collection}`)
    })

    console.log('')
    console.log('📊 Globals synced:')

    // List all globals
    const globals = Object.keys(payload.globals)
    globals.forEach((global) => {
      console.log(`  ✓ ${global}`)
    })

    console.log('')
    console.log('🎉 Database schema sync complete!')
    console.log('')
    console.log('Next steps:')
    console.log('1. Verify tables exist in Railway dashboard')
    console.log('2. Test: https://cms.compassdigital.nl/admin')
    console.log('3. Create your first admin user')
    console.log('')

    process.exit(0)
  } catch (error) {
    console.error('❌ Failed to sync database:')
    console.error(error)
    process.exit(1)
  }
}

syncDatabase()
