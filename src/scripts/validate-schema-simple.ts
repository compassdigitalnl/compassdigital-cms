/**
 * Simple Schema Validation Script
 *
 * Checks that migrations exist and are up-to-date by comparing
 * file modification times and ensuring migrations exist for recent code changes.
 *
 * This is a lightweight check that doesn't require starting Payload.
 *
 * Usage:
 *   npm run validate-schema
 *
 * Exit codes:
 *   0 - Validation passed
 *   1 - Validation failed (migrations may be missing)
 */

import fs from 'fs'
import path from 'path'

function getMigrationsDir(): string {
  return path.join(process.cwd(), 'src', 'migrations')
}

function getCollectionsDir(): string {
  return path.join(process.cwd(), 'src', 'branches')
}

function getLatestMigrationTime(): number | null {
  const migrationsDir = getMigrationsDir()

  if (!fs.existsSync(migrationsDir)) {
    console.error('❌ Migrations directory not found:', migrationsDir)
    return null
  }

  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.ts') && !f.includes('index'))
    .map(f => ({
      name: f,
      path: path.join(migrationsDir, f),
      mtime: fs.statSync(path.join(migrationsDir, f)).mtime.getTime()
    }))
    .sort((a, b) => b.mtime - a.mtime)

  if (files.length === 0) {
    console.error('❌ No migration files found')
    return null
  }

  const latest = files[0]
  console.log(`📸 Latest migration: ${latest.name}`)
  console.log(`   Modified: ${new Date(latest.mtime).toISOString()}`)

  return latest.mtime
}

function getRecentCollectionChanges(since: number): string[] {
  const collectionsDir = getCollectionsDir()
  const recentChanges: string[] = []

  function scanDir(dir: string) {
    if (!fs.existsSync(dir)) return

    const entries = fs.readdirSync(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        scanDir(fullPath)
      } else if (entry.name.endsWith('.ts') && !entry.name.includes('.test.')) {
        const mtime = fs.statSync(fullPath).mtime.getTime()
        if (mtime > since) {
          recentChanges.push(fullPath.replace(process.cwd(), ''))
        }
      }
    }
  }

  scanDir(collectionsDir)

  // Also check globals
  const globalsDir = path.join(process.cwd(), 'src', 'globals')
  if (fs.existsSync(globalsDir)) {
    scanDir(globalsDir)
  }

  return recentChanges
}

async function validateSchema() {
  console.log('🔍 Schema validation (simple mode)...\n')

  // Step 1: Check if migrations exist
  const migrationsDir = getMigrationsDir()
  if (!fs.existsSync(migrationsDir)) {
    console.error('❌ No migrations directory found!')
    console.log('   Run: npx payload migrate:create initial_schema')
    process.exit(1)
  }

  const migrationFiles = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.ts'))
  if (migrationFiles.length === 0) {
    console.error('❌ No migrations found!')
    console.log('   Run: npx payload migrate:create initial_schema')
    process.exit(1)
  }

  console.log(`✅ Found ${migrationFiles.length} migration(s)\n`)

  // Step 2: Check if recent collection changes have corresponding migrations
  const latestMigrationTime = getLatestMigrationTime()
  if (latestMigrationTime === null) {
    process.exit(1)
  }

  const recentChanges = getRecentCollectionChanges(latestMigrationTime)

  if (recentChanges.length > 0) {
    console.log('\n⚠️  WARNING: Collection files modified AFTER latest migration:\n')
    recentChanges.forEach(file => {
      const mtime = fs.statSync(path.join(process.cwd(), file)).mtime
      console.log(`   ${file}`)
      console.log(`   Modified: ${mtime.toISOString()}\n`)
    })

    console.log('⚠️  Action required:')
    console.log('   If you added new fields/collections, run:')
    console.log('   npx payload migrate:create description_of_changes\n')
    console.log('   Then commit the generated migration file.\n')

    // Don't fail - just warn (might be non-schema changes like comments/formatting)
    process.exit(0)
  }

  console.log('✅ No collection changes detected after latest migration')
  console.log('✅ Schema validation passed!\n')
  process.exit(0)
}

validateSchema().catch(error => {
  console.error('❌ Validation failed:', error)
  process.exit(1)
})
