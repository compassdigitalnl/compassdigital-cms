/**
 * Initialize Platform Database Schema
 * Run: npx tsx src/scripts/init-platform-db.ts
 */

import { Client } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const SQL_SCHEMA = `
-- =====================================================
-- PLATFORM DATABASE SCHEMA - Multi-Tenant SaaS
-- =====================================================

-- Tenants Table (klanten/projects)
CREATE TABLE IF NOT EXISTS tenants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  subdomain TEXT UNIQUE NOT NULL,
  database_url TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  wizard_data JSONB,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Admin Users Table (jij + team)
CREATE TABLE IF NOT EXISTS platform_admins (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Audit Log
CREATE TABLE IF NOT EXISTS audit_log (
  id SERIAL PRIMARY KEY,
  tenant_id TEXT REFERENCES tenants(id) ON DELETE CASCADE,
  admin_id INTEGER REFERENCES platform_admins(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tenants_subdomain ON tenants(subdomain);
CREATE INDEX IF NOT EXISTS idx_tenants_status ON tenants(status);
CREATE INDEX IF NOT EXISTS idx_tenants_type ON tenants(type);
CREATE INDEX IF NOT EXISTS idx_audit_tenant ON audit_log(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log(created_at DESC);

-- Constraints
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'check_tenant_type'
  ) THEN
    ALTER TABLE tenants ADD CONSTRAINT check_tenant_type
      CHECK (type IN ('website', 'webshop'));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'check_tenant_status'
  ) THEN
    ALTER TABLE tenants ADD CONSTRAINT check_tenant_status
      CHECK (status IN ('active', 'pending', 'suspended', 'deleted'));
  END IF;
END $$;
`

async function initPlatformDatabase() {
  const databaseUrl = process.env.PLATFORM_DATABASE_URL || process.env.DATABASE_URL

  if (!databaseUrl) {
    console.error('❌ No DATABASE_URL found in environment variables')
    process.exit(1)
  }

  console.log('🔗 Connecting to database...')
  console.log(`   ${databaseUrl.substring(0, 30)}...`)

  const client = new Client({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false, // Railway requires SSL
    },
  })

  try {
    await client.connect()
    console.log('✅ Connected to database\n')

    console.log('📦 Creating platform schema...')
    await client.query(SQL_SCHEMA)
    console.log('✅ Schema created successfully\n')

    // Verify tables
    console.log('🔍 Verifying tables...')
    const result = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name IN ('tenants', 'platform_admins', 'audit_log')
      ORDER BY table_name
    `)

    console.log('✅ Tables found:')
    result.rows.forEach((row) => {
      console.log(`   - ${row.table_name}`)
    })

    // Count tenants
    const countResult = await client.query('SELECT COUNT(*) as count FROM tenants')
    console.log(`\n📊 Total tenants: ${countResult.rows[0].count}`)

    console.log('\n🎉 Platform database initialized successfully!')
  } catch (error) {
    console.error('❌ Error initializing database:')
    console.error(error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

initPlatformDatabase()
