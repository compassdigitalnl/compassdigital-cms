#!/usr/bin/env node

/**
 * Test Shared Database Mode
 *
 * Verifies that:
 * 1. PLATFORM_DATABASE_URL is accessible
 * 2. We can create a test database: client_test_aboland
 * 3. Database already exists check works
 */

import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import pg from 'pg'

const { Client } = pg
const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: join(__dirname, '.env') })

const PLATFORM_DATABASE_URL = process.env.PLATFORM_DATABASE_URL
const USE_SHARED = process.env.RAILWAY_USE_SHARED_DATABASE

console.log('\n🗄️  Shared Database Test\n')
console.log('━'.repeat(60))

// Step 1: Check configuration
console.log('\n1️⃣ Checking configuration...')

if (!PLATFORM_DATABASE_URL) {
  console.error('❌ PLATFORM_DATABASE_URL not configured in .env')
  process.exit(1)
}
console.log(`✅ PLATFORM_DATABASE_URL configured`)
console.log(`   ${PLATFORM_DATABASE_URL.substring(0, 30)}...`)

if (USE_SHARED !== 'true') {
  console.warn(`⚠️  RAILWAY_USE_SHARED_DATABASE is "${USE_SHARED}" (expected "true")`)
} else {
  console.log(`✅ RAILWAY_USE_SHARED_DATABASE=true`)
}

// Step 2: Connect to shared database
console.log('\n2️⃣ Connecting to shared PostgreSQL...')

// Connect to 'postgres' admin database to create new databases
const adminUrl = PLATFORM_DATABASE_URL.replace(/\/[^/]*$/, '/postgres')
const adminClient = new Client({ connectionString: adminUrl })

try {
  await adminClient.connect()
  console.log('✅ Connected to PostgreSQL admin database')
} catch (error) {
  console.error('❌ Failed to connect:', error.message)
  process.exit(1)
}

// Step 3: Test database creation
const testDbName = 'client_test_aboland'
console.log(`\n3️⃣ Testing database creation: ${testDbName}...`)

try {
  // Check if exists
  const existing = await adminClient.query(
    `SELECT 1 FROM pg_database WHERE datname = $1`,
    [testDbName]
  )

  if (existing.rowCount > 0) {
    console.log(`⚠️  Database '${testDbName}' already exists`)

    // Drop it first for clean test
    console.log(`   Dropping existing database...`)
    await adminClient.query(`DROP DATABASE "${testDbName}"`)
    console.log(`   ✅ Dropped successfully`)
  }

  // Create database
  console.log(`   Creating database '${testDbName}'...`)
  await adminClient.query(`CREATE DATABASE "${testDbName}"`)
  console.log(`   ✅ Created successfully`)

  // Verify it exists
  const verify = await adminClient.query(
    `SELECT 1 FROM pg_database WHERE datname = $1`,
    [testDbName]
  )

  if (verify.rowCount === 0) {
    console.error(`   ❌ Database was not created!`)
    process.exit(1)
  }

  console.log(`   ✅ Verified database exists`)

  // Build connection string for the new database
  const clientDbUrl = PLATFORM_DATABASE_URL.replace(/\/[^/]*$/, `/${testDbName}`)
  console.log(`\n   Client connection string:`)
  console.log(`   ${clientDbUrl}`)

  // Test connection to new database
  console.log(`\n4️⃣ Testing connection to new database...`)
  const clientDbClient = new Client({ connectionString: clientDbUrl })
  await clientDbClient.connect()
  console.log(`   ✅ Connected to ${testDbName}`)

  // Run a simple query
  const result = await clientDbClient.query('SELECT version()')
  console.log(`   ✅ PostgreSQL version:`, result.rows[0].version.substring(0, 50) + '...')

  await clientDbClient.end()

  // Cleanup: Drop test database
  console.log(`\n5️⃣ Cleanup: Dropping test database...`)
  await adminClient.query(`DROP DATABASE "${testDbName}"`)
  console.log(`   ✅ Dropped ${testDbName}`)

} catch (error) {
  console.error('❌ Error during database operations:', error.message)
  await adminClient.end()
  process.exit(1)
}

await adminClient.end()

console.log('\n━'.repeat(60))
console.log('\n✅ Shared Database Test PASSED!\n')
console.log('   Summary:')
console.log('   • PLATFORM_DATABASE_URL is accessible')
console.log('   • Can create databases: client_[domain]')
console.log('   • Can connect to newly created databases')
console.log('   • Duplicate check works correctly')
console.log('\n   ✅ Ready for Aboland provisioning!')
console.log('\n')
