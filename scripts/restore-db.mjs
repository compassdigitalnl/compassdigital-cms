#!/usr/bin/env node
/**
 * restore-db.mjs — Restore a database from a JSON backup
 *
 * Usage: node /home/ploi/scripts/restore-db.mjs <backup_file.json.gz>
 *
 * WARNING: This TRUNCATES all tables and re-inserts data.
 * Schema must already exist (run migrations first if needed).
 */

import pg from 'pg'
import { readFileSync } from 'fs'
import { gunzipSync } from 'zlib'
import { readdir } from 'fs/promises'

const { Client } = pg

const arg = process.argv[2]

if (!arg) {
  console.error('Usage: node restore-db.mjs <backup_file.json.gz>')
  console.error('   or: node restore-db.mjs <database_name>  (shows available backups)')
  process.exit(1)
}

let BACKUP_FILE = arg

// If argument is a database name (no .json.gz), show available backups
if (!arg.endsWith('.json.gz')) {
  const BACKUP_DIR = `/home/ploi/backups/${arg}`
  try {
    const files = await readdir(BACKUP_DIR)
    const backups = files.filter(f => f.endsWith('.json.gz')).sort().reverse()
    if (backups.length === 0) {
      console.error(`[restore] Geen backups gevonden in ${BACKUP_DIR}`)
      process.exit(1)
    }
    console.log(`[restore] Beschikbare backups voor ${arg}:`)
    backups.forEach((f, i) => console.log(`  ${i + 1}. ${f}`))
    console.log(`\n[restore] Gebruik: node restore-db.mjs ${BACKUP_DIR}/${backups[0]}`)
    process.exit(0)
  } catch {
    console.error(`[restore] Backup directory niet gevonden: ${BACKUP_DIR}`)
    process.exit(1)
  }
}

console.log(`[restore] Lezen van ${BACKUP_FILE}...`)
const compressed = readFileSync(BACKUP_FILE)
const backup = JSON.parse(gunzipSync(compressed).toString())

console.log(`[restore] Database: ${backup.database}`)
console.log(`[restore] Backup datum: ${backup.timestamp}`)
console.log(`[restore] Reden: ${backup.reason}`)
console.log(`[restore] Tabellen: ${Object.keys(backup.tables).length}`)

const totalRows = Object.values(backup.tables).reduce((sum, t) => sum + (t.count || 0), 0)
console.log(`[restore] Totaal rijen: ${totalRows}`)

// Safety confirmation via environment variable
if (process.env.CONFIRM_RESTORE !== 'YES') {
  console.log(`\n[restore] WAARSCHUWING: Dit overschrijft ALLE data in ${backup.database}!`)
  console.log(`[restore] Voer uit met: CONFIRM_RESTORE=YES node restore-db.mjs ${BACKUP_FILE}`)
  process.exit(0)
}

const CONN = `postgresql://postgres:eBTNOrSGwkADvgAVJKyQtllGSjugdtrN@shinkansen.proxy.rlwy.net:29352/${backup.database}`
const client = new Client({ connectionString: CONN })
await client.connect()

console.log(`[restore] Verbonden met ${backup.database}. Start restore...`)

// Disable triggers/FK checks during restore
await client.query('SET session_replication_role = replica;')

const tableNames = Object.keys(backup.tables)

// Truncate all tables with data first (CASCADE for FK safety)
console.log(`[restore] Tabellen legen...`)
for (const tablename of tableNames) {
  if (tablename === 'payload_migrations') continue // Never truncate migrations
  try {
    await client.query(`TRUNCATE "${tablename}" CASCADE`)
  } catch {
    // table might not exist in current schema
  }
}

// Insert data
let totalRestored = 0

for (const tablename of tableNames) {
  const tableData = backup.tables[tablename]
  if (!tableData.data || tableData.data.length === 0) continue

  const rows = tableData.data
  const columns = Object.keys(rows[0])
  const quotedColumns = columns.map((c) => `"${c}"`).join(', ')

  // Insert in batches of 50
  const batchSize = 50
  let tableRestored = 0

  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize)
    const values = []
    const placeholders = []

    batch.forEach((row, batchIdx) => {
      const rowPlaceholders = columns.map((col, colIdx) => {
        values.push(row[col])
        return `$${batchIdx * columns.length + colIdx + 1}`
      })
      placeholders.push(`(${rowPlaceholders.join(', ')})`)
    })

    const sql = `INSERT INTO "${tablename}" (${quotedColumns}) VALUES ${placeholders.join(', ')} ON CONFLICT DO NOTHING`

    try {
      const result = await client.query(sql, values)
      tableRestored += result.rowCount || 0
    } catch (e) {
      console.error(`\n[restore] Fout bij ${tablename} (batch ${i}): ${e.message}`)
    }
  }

  totalRestored += tableRestored
  process.stdout.write(`\r[restore] ${tablename}: ${tableRestored}/${rows.length} rijen hersteld`)
}

// Re-enable triggers
await client.query('SET session_replication_role = DEFAULT;')

// Fix sequences
console.log(`\n[restore] Sequences herstellen...`)
const { rows: seqInfo } = await client.query(`
  SELECT c.relname as table_name, a.attname as column_name, s.relname as sequence_name
  FROM pg_class s
  JOIN pg_depend d ON d.objid = s.oid
  JOIN pg_class c ON c.oid = d.refobjid
  JOIN pg_attribute a ON a.attrelid = c.oid AND a.attnum = d.refobjsubid
  WHERE s.relkind = 'S' AND c.relkind = 'r'
`)

for (const seq of seqInfo) {
  try {
    await client.query(
      `SELECT setval('"${seq.sequence_name}"', COALESCE((SELECT MAX("${seq.column_name}") FROM "${seq.table_name}"), 1))`
    )
  } catch {
    // ignore
  }
}

await client.end()
console.log(`[restore] Klaar! ${totalRestored} rijen hersteld.`)
