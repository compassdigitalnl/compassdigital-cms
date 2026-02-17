/**
 * One-time database fix endpoint
 * Adds ALL missing columns/tables to the production SQLite database.
 *
 * Usage: GET /api/fix-db?secret=<PAYLOAD_SECRET>
 * REMOVE THIS FILE after running once on production.
 */
import { createClient } from '@libsql/client'
import { NextRequest, NextResponse } from 'next/server'

async function safeRun(
  client: ReturnType<typeof createClient>,
  sql: string,
  label: string,
): Promise<string> {
  try {
    await client.execute(sql)
    return `${label}: OK`
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    if (msg.includes('already exists') || msg.includes('duplicate column')) {
      return `${label}: already exists (skipped)`
    }
    return `${label}: ERROR - ${msg}`
  }
}

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (!secret || secret !== process.env.PAYLOAD_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const databaseURL = process.env.DATABASE_URL
  if (!databaseURL || databaseURL.startsWith('postgres')) {
    return NextResponse.json({ error: 'Only runs on SQLite databases' }, { status: 400 })
  }

  try {
    const client = createClient({ url: databaseURL })
    const results: string[] = []

    // ─── 1. Check existing columns in users table ────────────────────────
    const tableInfo = await client.execute(`PRAGMA table_info(users)`)
    const existingCols = new Set(tableInfo.rows.map((r: { name?: string }) => r.name as string))
    results.push(`Existing users columns: ${Array.from(existingCols).join(', ')}`)

    // ─── 2. Add missing columns to users table ───────────────────────────
    const missingCols: Array<{ name: string; def: string }> = [
      { name: 'first_name', def: `ALTER TABLE users ADD COLUMN "first_name" text` },
      { name: 'last_name', def: `ALTER TABLE users ADD COLUMN "last_name" text` },
      { name: 'phone', def: `ALTER TABLE users ADD COLUMN "phone" text` },
      {
        name: 'account_type',
        def: `ALTER TABLE users ADD COLUMN "account_type" text DEFAULT 'individual'`,
      },
      { name: 'company_name', def: `ALTER TABLE users ADD COLUMN "company_name" text` },
      { name: 'company_kvk_number', def: `ALTER TABLE users ADD COLUMN "company_kvk_number" text` },
      { name: 'company_vat_number', def: `ALTER TABLE users ADD COLUMN "company_vat_number" text` },
      {
        name: 'company_invoice_email',
        def: `ALTER TABLE users ADD COLUMN "company_invoice_email" text`,
      },
      { name: 'client_type', def: `ALTER TABLE users ADD COLUMN "client_type" text` },
      { name: 'client_id', def: `ALTER TABLE users ADD COLUMN "client_id" integer` },
    ]

    for (const col of missingCols) {
      if (!existingCols.has(col.name)) {
        results.push(await safeRun(client, col.def, `ADD COLUMN users.${col.name}`))
      } else {
        results.push(`users.${col.name}: already exists (skip)`)
      }
    }

    // ─── 3. Create users_sessions table ──────────────────────────────────
    results.push(
      await safeRun(
        client,
        `CREATE TABLE IF NOT EXISTS \`users_sessions\` (
          \`_order\` integer NOT NULL,
          \`_parent_id\` integer NOT NULL,
          \`id\` text PRIMARY KEY NOT NULL,
          \`created_at\` text NOT NULL,
          \`expires_at\` text NOT NULL,
          FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
        )`,
        'users_sessions table',
      ),
    )
    results.push(
      await safeRun(
        client,
        `CREATE INDEX IF NOT EXISTS \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`)`,
        'users_sessions order_idx',
      ),
    )
    results.push(
      await safeRun(
        client,
        `CREATE INDEX IF NOT EXISTS \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`)`,
        'users_sessions parent_idx',
      ),
    )

    // ─── 4. Create users_addresses table ─────────────────────────────────
    results.push(
      await safeRun(
        client,
        `CREATE TABLE IF NOT EXISTS \`users_addresses\` (
          \`_order\` integer NOT NULL,
          \`_parent_id\` integer NOT NULL,
          \`id\` text PRIMARY KEY NOT NULL,
          \`type\` text DEFAULT 'both' NOT NULL,
          \`street\` text NOT NULL,
          \`house_number\` text NOT NULL,
          \`house_number_addition\` text,
          \`postal_code\` text NOT NULL,
          \`city\` text NOT NULL,
          \`country\` text DEFAULT 'Nederland',
          \`is_default\` integer DEFAULT false,
          FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
        )`,
        'users_addresses table',
      ),
    )

    // ─── 5. Create users_roles table if missing ───────────────────────────
    results.push(
      await safeRun(
        client,
        `CREATE TABLE IF NOT EXISTS \`users_roles\` (
          \`order\` integer NOT NULL,
          \`parent_id\` integer NOT NULL,
          \`value\` text,
          \`id\` integer PRIMARY KEY NOT NULL,
          FOREIGN KEY (\`parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
        )`,
        'users_roles table',
      ),
    )

    // ─── 6. Verify the query actually works now ───────────────────────────
    try {
      await client.execute(`SELECT id, name, first_name, last_name, phone, account_type,
        company_name, company_kvk_number, company_vat_number, company_invoice_email,
        client_type, client_id FROM users LIMIT 1`)
      results.push('Verification query: SUCCESS - all columns exist!')
    } catch (e: unknown) {
      results.push(
        `Verification query: FAILED - ${e instanceof Error ? e.message : String(e)}`,
      )
    }

    // ─── 7. Mark migration as done ────────────────────────────────────────
    try {
      const existing = await client.execute(
        `SELECT id FROM payload_migrations WHERE name = '20260216_171738' LIMIT 1`,
      )
      if (existing.rows.length === 0) {
        await client.execute(
          `INSERT INTO payload_migrations (name, batch) VALUES ('20260216_171738', 1)`,
        )
        results.push('Migration marked as done: OK')
      } else {
        results.push('Migration already marked as done: skip')
      }
    } catch (e: unknown) {
      results.push(`Migration tracking: ${e instanceof Error ? e.message : String(e)}`)
    }

    client.close()

    return NextResponse.json({
      success: true,
      message: 'Database fix complete! Restart PM2 to apply, then remove this endpoint.',
      results,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
