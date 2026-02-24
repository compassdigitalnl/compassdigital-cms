#!/usr/bin/env node
/**
 * backup-db.mjs — Backup a single Payload CMS client database (pure Node.js)
 *
 * Usage: node /home/ploi/scripts/backup-db.mjs <database_name> [reason]
 * Example: node /home/ploi/scripts/backup-db.mjs client_plastimed01 pre-deploy
 *
 * Output: /home/ploi/backups/<database_name>/<timestamp>_<reason>.json.gz
 * Retention: keeps last 10 backups per database
 */

import pg from 'pg'
import { createWriteStream } from 'fs'
import { mkdir, readdir, unlink } from 'fs/promises'
import { createGzip } from 'zlib'
import { pipeline } from 'stream/promises'
import { Readable } from 'stream'

const { Client } = pg

const DB_NAME = process.argv[2]
const REASON = process.argv[3] || 'manual'

if (!DB_NAME) {
  console.error('Usage: node backup-db.mjs <database_name> [reason]')
  process.exit(1)
}

const CONN = `postgresql://postgres:eBTNOrSGwkADvgAVJKyQtllGSjugdtrN@shinkansen.proxy.rlwy.net:29352/${DB_NAME}`
const TIMESTAMP = new Date().toISOString().replace(/[-:]/g, '').replace('T', '_').slice(0, 15)
const BACKUP_DIR = `/home/ploi/backups/${DB_NAME}`
const BACKUP_FILE = `${BACKUP_DIR}/${TIMESTAMP}_${REASON}.json.gz`

await mkdir(BACKUP_DIR, { recursive: true })

const client = new Client({ connectionString: CONN })

try {
  await client.connect()
} catch (err) {
  console.error(`[backup] FOUT: Kan niet verbinden met ${DB_NAME}: ${err.message}`)
  process.exit(1)
}

console.log(`[backup] Start backup van ${DB_NAME} (reden: ${REASON})...`)

// Get all public tables
const { rows: tables } = await client.query(
  `SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename`
)

// Get all sequences and their current values
const { rows: sequences } = await client.query(`
  SELECT sequencename, last_value, start_value, increment_by
  FROM pg_sequences
  WHERE schemaname = 'public'
  ORDER BY sequencename
`)

const backup = {
  database: DB_NAME,
  timestamp: new Date().toISOString(),
  reason: REASON,
  version: '1.0',
  sequences: {},
  tables: {},
}

// Save sequences
for (const seq of sequences) {
  backup.sequences[seq.sequencename] = {
    last_value: seq.last_value,
    start_value: seq.start_value,
    increment_by: seq.increment_by,
  }
}

let totalRows = 0
let tablesWithData = 0

for (const { tablename } of tables) {
  try {
    const { rows: countResult } = await client.query(
      `SELECT count(*) as n FROM "${tablename}"`
    )
    const count = parseInt(countResult[0].n)

    if (count === 0) {
      backup.tables[tablename] = { count: 0, data: [] }
      continue
    }

    // Get column info for proper ordering
    const { rows: columns } = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = $1
      ORDER BY ordinal_position
    `, [tablename])

    // Export in batches of 500 to avoid memory issues
    const allRows = []
    let offset = 0
    const batchSize = 500

    while (offset < count) {
      const { rows } = await client.query(
        `SELECT row_to_json(t) as row FROM (SELECT * FROM "${tablename}" LIMIT ${batchSize} OFFSET ${offset}) t`
      )
      allRows.push(...rows.map((r) => r.row))
      offset += batchSize
    }

    backup.tables[tablename] = {
      count,
      columns: columns.map(c => ({ name: c.column_name, type: c.data_type })),
      data: allRows,
    }
    totalRows += count
    tablesWithData++
    process.stdout.write(`\r[backup] ${tablename}: ${count} rijen geexporteerd`)
  } catch (err) {
    console.error(`\n[backup] Fout bij ${tablename}: ${err.message}`)
    backup.tables[tablename] = { count: 0, data: [], error: err.message }
  }
}

console.log(`\n[backup] Totaal: ${totalRows} rijen in ${tablesWithData} tabellen (van ${tables.length} totaal)`)

// Write gzipped JSON
const jsonString = JSON.stringify(backup)
const gzip = createGzip({ level: 6 })
const output = createWriteStream(BACKUP_FILE)

await pipeline(Readable.from(jsonString), gzip, output)

await client.end()

// File size
const { statSync } = await import('fs')
const fileSize = (statSync(BACKUP_FILE).size / 1024).toFixed(1)
console.log(`[backup] Opgeslagen: ${BACKUP_FILE} (${fileSize} KB)`)

// Retention: keep last 10
try {
  const files = await readdir(BACKUP_DIR)
  const backupFiles = files.filter((f) => f.endsWith('.json.gz')).sort().reverse()
  for (const f of backupFiles.slice(10)) {
    await unlink(`${BACKUP_DIR}/${f}`)
    console.log(`[backup] Oud backup verwijderd: ${f}`)
  }
  console.log(`[backup] ${Math.min(backupFiles.length, 10)} backups bewaard`)
} catch {
  // ignore retention errors
}

console.log(`[backup] Klaar.`)
