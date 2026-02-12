#!/usr/bin/env node
import { Client } from 'pg'

const DATABASE_URL = 'postgresql://postgres:eBTNOrSGwkADvgAVJKyQtllGSjugdtrN@shinkansen.proxy.rlwy.net:29352/railway'

async function resetDatabase() {
  console.log('🗑️  Resetting Railway PostgreSQL database...')
  console.log('')

  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  })

  try {
    await client.connect()
    console.log('✅ Connected to database')

    // Drop all tables by dropping and recreating schema
    console.log('🔥 Dropping all tables...')
    await client.query('DROP SCHEMA public CASCADE')
    await client.query('CREATE SCHEMA public')
    await client.query('GRANT ALL ON SCHEMA public TO postgres')
    await client.query('GRANT ALL ON SCHEMA public TO public')

    console.log('✅ Database reset complete!')
    console.log('')
    console.log('Next step: Start dev server to create fresh schema')
    console.log('  npm run dev')

  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

resetDatabase()
