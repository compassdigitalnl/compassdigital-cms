/**
 * One-time database fix endpoint
 * Creates missing users_sessions table on production SQLite database
 *
 * Usage: GET /api/fix-db?secret=<PAYLOAD_SECRET>
 * REMOVE THIS FILE after running once on production.
 */
import { createClient } from '@libsql/client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  // Security: only allow with correct secret
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

    // 1. Create users_sessions table if missing
    await client.execute(`
      CREATE TABLE IF NOT EXISTS \`users_sessions\` (
        \`_order\` integer NOT NULL,
        \`_parent_id\` integer NOT NULL,
        \`id\` text PRIMARY KEY NOT NULL,
        \`created_at\` text NOT NULL,
        \`expires_at\` text NOT NULL,
        FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
      )
    `)
    results.push('users_sessions table: OK')

    await client.execute(
      `CREATE INDEX IF NOT EXISTS \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`)`,
    )
    await client.execute(
      `CREATE INDEX IF NOT EXISTS \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`)`,
    )
    results.push('users_sessions indexes: OK')

    // 2. Create users_addresses table if missing
    await client.execute(`
      CREATE TABLE IF NOT EXISTS \`users_addresses\` (
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
      )
    `)
    results.push('users_addresses table: OK')

    // 3. Mark migration as done in payload_migrations
    const existing = await client.execute(
      `SELECT id FROM payload_migrations WHERE name = '20260216_171738' LIMIT 1`,
    )
    if (existing.rows.length === 0) {
      await client.execute(
        `INSERT INTO payload_migrations (name, batch) VALUES ('20260216_171738', 1)`,
      )
      results.push('Migration marked as done: OK')
    } else {
      results.push('Migration already marked as done: SKIP')
    }

    client.close()

    return NextResponse.json({
      success: true,
      message: 'Database fixed! Remove /api/fix-db/route.ts from codebase.',
      results,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
