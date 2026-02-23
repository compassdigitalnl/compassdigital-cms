#!/usr/bin/env node
/**
 * check-migrations.mjs — Pre-migration safety check
 *
 * Usage: node /home/ploi/scripts/check-migrations.mjs <database_name>
 *
 * Exit codes:
 *   0 = SAFE — migration history exists, safe to run new migrations
 *   1 = DANGER — data exists but migration state is broken (would wipe data!)
 *   2 = FRESH — empty database, safe to run initial setup
 *   3 = ERROR
 */

import pg from 'pg'
const { Client } = pg

const DB_NAME = process.argv[2]
if (!DB_NAME) {
  console.error('Usage: node check-migrations.mjs <database_name>')
  process.exit(3)
}

const CONN = `postgresql://postgres:eBTNOrSGwkADvgAVJKyQtllGSjugdtrN@shinkansen.proxy.rlwy.net:29352/${DB_NAME}`
const client = new Client({ connectionString: CONN })

try {
  await client.connect()

  // 1. Check if payload_migrations table exists
  const { rows: migTableCheck } = await client.query(
    `SELECT to_regclass('public.payload_migrations') AS exists`
  )
  const hasMigrationTable = !!migTableCheck[0]?.exists

  // 2. Count public tables
  const { rows: tableCount } = await client.query(
    `SELECT count(*) as n FROM pg_tables WHERE schemaname = 'public'`
  )
  const totalTables = parseInt(tableCount[0].n)

  // 3. Check for data in critical tables
  let hasData = false
  let dataDetails = []
  const criticalTables = ['users', 'pages', 'settings', 'media', 'products', 'theme', 'header']
  for (const table of criticalTables) {
    try {
      const { rows } = await client.query(`SELECT count(*) as n FROM "${table}"`)
      const count = parseInt(rows[0].n)
      if (count > 0) {
        hasData = true
        dataDetails.push(`${table}: ${count}`)
      }
    } catch {
      // table doesn't exist
    }
  }

  console.log(`[check] Database: ${DB_NAME}`)
  console.log(`[check] Tabellen: ${totalTables}`)
  console.log(`[check] Data aanwezig: ${hasData}`)
  if (dataDetails.length > 0) {
    console.log(`[check] Data in: ${dataDetails.join(', ')}`)
  }

  // 4. If migration table exists, check its content
  if (hasMigrationTable) {
    const { rows: migs } = await client.query(
      'SELECT id, name, batch, created_at FROM payload_migrations ORDER BY id'
    )
    console.log(`[check] Migration tabel: JA (${migs.length} entries)`)

    if (migs.length === 0) {
      // Migration table exists but is EMPTY — very dangerous
      if (hasData) {
        console.log(`[check] STATUS: GEVAAR — migration tabel is LEEG maar database heeft data!`)
        console.log(`[check] Alle migraties zouden opnieuw draaien en data vernietigen.`)
        console.log(`[check] ACTIE: Seed de payload_migrations tabel handmatig.`)
        process.exit(1)
      }
    }

    // Check for dev migration (batch -1) — Payload asks to drop DB for these
    const hasDev = migs.some((m) => m.batch === '-1' || m.batch === -1)
    if (hasDev) {
      console.log(`[check] STATUS: GEVAAR — Dev migratie (batch -1) gevonden!`)
      console.log(`[check] Payload zal vragen om de database te droppen.`)
      console.log(`[check] ACTIE: DELETE FROM payload_migrations WHERE batch = '-1'`)
      process.exit(1)
    }

    // List migrations
    for (const m of migs) {
      console.log(`[check]   ${m.id}: ${m.name} (batch ${m.batch}, ${m.created_at})`)
    }

    console.log(`[check] STATUS: VEILIG — migration history is intact`)
    process.exit(0)
  }

  // No migration table at all
  console.log(`[check] Migration tabel: NEE`)

  if (totalTables > 5 || hasData) {
    console.log(`[check] STATUS: GEVAAR — er zijn ${totalTables} tabellen maar GEEN migration history!`)
    console.log(`[check] Dit betekent dat de database met db.push() is gemaakt.`)
    console.log(`[check] Als je nu 'payload migrate' draait, worden ALLE migraties als nieuw gezien.`)
    console.log(`[check] Dit kan DROP TABLE uitvoeren en ALLE data vernietigen.`)
    console.log(`[check] ACTIE: Maak eerst een backup, dan seed de payload_migrations tabel.`)
    process.exit(1)
  }

  // Truly fresh empty database
  console.log(`[check] STATUS: LEEG — verse database, veilig voor initieel setup`)
  process.exit(2)

} catch (err) {
  console.error(`[check] FOUT: ${err.message}`)
  process.exit(3)
} finally {
  await client.end()
}
