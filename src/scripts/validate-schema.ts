/**
 * Schema Validation Script
 *
 * Verifies that all fields defined in Payload collections have corresponding
 * database tables/columns in the migration snapshot.
 *
 * This prevents the common issue where a developer adds new fields to a collection
 * but forgets to generate a migration with `npx payload migrate:create`.
 *
 * Usage:
 *   npm run validate-schema
 *
 * Exit codes:
 *   0 - Schema is valid (all fields have migrations)
 *   1 - Schema is invalid (missing migrations for some fields)
 *
 * See: docs/MIGRATION_VALIDATION_GUIDE.md
 */

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import fs from 'fs'
import path from 'path'
import type { Field, CollectionConfig } from 'payload'

interface SchemaSnapshot {
  tables: Record<string, {
    name: string
    columns: Record<string, any>
  }>
}

/**
 * Get the latest migration snapshot (JSON file)
 */
function getLatestMigrationSnapshot(): SchemaSnapshot | null {
  const migrationsDir = path.join(process.cwd(), 'src', 'migrations')

  if (!fs.existsSync(migrationsDir)) {
    console.error('❌ Migrations directory not found:', migrationsDir)
    return null
  }

  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.json'))
    .sort()
    .reverse()

  if (files.length === 0) {
    console.error('❌ No migration snapshots found in:', migrationsDir)
    return null
  }

  const latestSnapshot = files[0]
  const snapshotPath = path.join(migrationsDir, latestSnapshot)

  console.log('📸 Reading snapshot:', latestSnapshot)

  try {
    const content = fs.readFileSync(snapshotPath, 'utf-8')
    const data = JSON.parse(content)
    return data
  } catch (error) {
    console.error('❌ Failed to parse snapshot:', error)
    return null
  }
}

/**
 * Extract all field names from a Payload collection
 */
function extractFieldNames(fields: Field[], parentName: string = ''): string[] {
  const names: string[] = []

  for (const field of fields) {
    if (!('name' in field)) continue

    const fieldName = field.name
    const fullName = parentName ? `${parentName}_${fieldName}` : fieldName

    // Add the field itself
    names.push(fullName)

    // Recursively process nested fields
    if ('fields' in field && Array.isArray(field.fields)) {
      // For groups, nested fields become columns like "group_field_name"
      if (field.type === 'group') {
        names.push(...extractFieldNames(field.fields, fullName))
      }
      // For arrays, a separate table is created like "collection_array_name"
      else if (field.type === 'array') {
        // Arrays create their own tables, we'll check those separately
        names.push(...extractFieldNames(field.fields, fieldName))
      }
    }

    // For tabs, extract fields from each tab
    if ('tabs' in field && Array.isArray(field.tabs)) {
      for (const tab of field.tabs) {
        if ('fields' in tab && Array.isArray(tab.fields)) {
          names.push(...extractFieldNames(tab.fields, parentName))
        }
      }
    }
  }

  return names
}

/**
 * Get table name for a collection
 */
function getTableName(collectionSlug: string): string {
  return collectionSlug.replace(/-/g, '_')
}

/**
 * Get column name for a field (converts camelCase to snake_case)
 */
function getColumnName(fieldName: string): string {
  return fieldName.replace(/([A-Z])/g, '_$1').toLowerCase()
}

/**
 * Validate a single collection against the schema snapshot
 */
function validateCollection(
  collection: CollectionConfig,
  snapshot: SchemaSnapshot,
): { valid: boolean; missingColumns: string[] } {
  const tableName = getTableName(collection.slug)
  const table = snapshot.tables[`public.${tableName}`]

  if (!table) {
    console.warn(`⚠️  Table "${tableName}" not found in snapshot (collection may be feature-flagged or virtual)`)
    return { valid: true, missingColumns: [] }
  }

  const fieldNames = extractFieldNames(collection.fields)
  const missingColumns: string[] = []

  for (const fieldName of fieldNames) {
    const columnName = getColumnName(fieldName)

    // Skip internal Payload fields
    if (['id', 'createdAt', 'updatedAt'].includes(fieldName)) continue

    // Check if column exists in snapshot
    if (!table.columns[columnName]) {
      missingColumns.push(columnName)
    }
  }

  return { valid: missingColumns.length === 0, missingColumns }
}

/**
 * Main validation function
 */
async function validateSchema() {
  console.log('🔍 Starting schema validation...\n')

  // Step 1: Load latest migration snapshot
  const snapshot = getLatestMigrationSnapshot()
  if (!snapshot) {
    process.exit(1)
  }

  // Step 2: Load Payload config
  const payload = await getPayload({ config: configPromise })
  const collections = payload.config.collections

  console.log(`📦 Found ${collections.length} collections\n`)

  // Step 3: Validate each collection
  let allValid = true
  const invalidCollections: Array<{ name: string; missingColumns: string[] }> = []

  for (const collection of collections) {
    const { valid, missingColumns } = validateCollection(collection, snapshot)

    if (!valid) {
      allValid = false
      invalidCollections.push({ name: collection.slug, missingColumns })
      console.log(`❌ ${collection.slug}: Missing ${missingColumns.length} columns`)
      console.log(`   ${missingColumns.join(', ')}\n`)
    } else {
      console.log(`✅ ${collection.slug}`)
    }
  }

  // Step 4: Report results
  console.log('\n' + '='.repeat(60))

  if (allValid) {
    console.log('✅ Schema validation PASSED')
    console.log('   All collection fields have corresponding database columns.')
    process.exit(0)
  } else {
    console.log('❌ Schema validation FAILED')
    console.log(`   ${invalidCollections.length} collections have missing migrations\n`)

    console.log('📝 Action required:')
    console.log('   Run: npx payload migrate:create')
    console.log('   This will generate a migration for the missing columns.\n')

    console.log('📚 Collections with missing columns:')
    for (const { name, missingColumns } of invalidCollections) {
      console.log(`   - ${name}: ${missingColumns.length} columns`)
    }

    process.exit(1)
  }
}

// Run validation
validateSchema()
  .catch((error) => {
    console.error('❌ Validation failed with error:', error)
    process.exit(1)
  })
