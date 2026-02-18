import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Diagnostic + Repair endpoint - temporarily added to debug admin 500 error
 *
 * GET  /api/diag?key=...        → diagnose (show collection counts + DB tables)
 * POST /api/diag?key=...&fix=1  → diagnose AND repair users_sessions schema if broken
 *
 * REMOVE AFTER DEBUGGING
 */

async function diagnose(payload: any) {
  const collections = [
    'users', 'pages', 'blog-posts', 'faqs', 'media', 'cases', 'testimonials',
    'services', 'partners', 'product-categories', 'brands', 'products',
    'customer-groups', 'orderLists', 'orders', 'client-requests', 'clients',
    'deployments', 'forms', 'form-submissions', 'redirects',
  ]

  const results: Record<string, any> = {}
  for (const collection of collections) {
    try {
      const result = await payload.count({
        collection: collection as any,
        overrideAccess: true,
      })
      results[collection] = { ok: true, count: result.totalDocs }
    } catch (err: any) {
      results[collection] = { ok: false, error: err?.message || String(err) }
    }
  }

  // List DB tables
  let tables: string[] = []
  let usersSessionsColumns: string[] = []
  let payloadMigrations: any[] = []

  try {
    const db = payload.db as any
    if (db?.drizzle) {
      const tableList = await db.drizzle.run(`SELECT name FROM sqlite_master WHERE type='table' ORDER BY name`)
      tables = (tableList?.rows || []).map((r: any) => r.name || r[0])

      // Check users_sessions columns
      try {
        const cols = await db.drizzle.run(`PRAGMA table_info(users_sessions)`)
        usersSessionsColumns = (cols?.rows || []).map((r: any) => r.name || r[1])
      } catch (e: any) {
        usersSessionsColumns = [`Error: ${e?.message}`]
      }

      // Check payload_migrations
      try {
        const migs = await db.drizzle.run(`SELECT name, batch FROM payload_migrations ORDER BY id`)
        payloadMigrations = (migs?.rows || []).map((r: any) => ({ name: r.name || r[0], batch: r.batch || r[1] }))
      } catch (e: any) {
        payloadMigrations = [{ error: e?.message }]
      }
    }
  } catch (err: any) {
    tables = [`Error listing tables: ${err?.message}`]
  }

  return { collections: results, tables, usersSessionsColumns, payloadMigrations }
}

export async function GET(request: NextRequest) {
  const diagKey = process.env.DIAG_KEY || 'debug-compassdigital-2026'
  const key = request.nextUrl.searchParams.get('key')

  if (key !== diagKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayload({ config })
    const data = await diagnose(payload)
    const envCheck = {
      DISABLED_COLLECTIONS: process.env.DISABLED_COLLECTIONS || '(not set)',
      DATABASE_URL: process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/:[^:@]+@/, ':***@') : '(not set)',
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
    }
    return NextResponse.json({ ok: true, envCheck, ...data, timestamp: new Date().toISOString() })
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || String(error), stack: error?.stack?.split('\n').slice(0, 10) },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const diagKey = process.env.DIAG_KEY || 'debug-compassdigital-2026'
  const key = request.nextUrl.searchParams.get('key')
  const fix = request.nextUrl.searchParams.get('fix') === '1'

  if (key !== diagKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayload({ config })
    const db = payload.db as any

    const fixResults: any[] = []

    if (fix && db?.drizzle) {
      // Step 1: Check users_sessions schema
      try {
        const cols = await db.drizzle.run(`PRAGMA table_info(users_sessions)`)
        const colNames = (cols?.rows || []).map((r: any) => r.name || r[1])
        fixResults.push({ step: 'check_users_sessions_cols', columns: colNames })

        const hasParentId = colNames.includes('_parent_id')
        const hasOrder = colNames.includes('_order')

        if (!hasParentId || !hasOrder) {
          // Wrong schema - drop and recreate
          fixResults.push({ step: 'dropping_users_sessions', reason: `Missing columns: ${!hasParentId ? '_parent_id ' : ''}${!hasOrder ? '_order' : ''}`.trim() })

          await db.drizzle.run(`DROP TABLE IF EXISTS users_sessions`)
          fixResults.push({ step: 'dropped_users_sessions', ok: true })

          await db.drizzle.run(`CREATE TABLE IF NOT EXISTS "users_sessions" (
            "_order" integer NOT NULL,
            "_parent_id" integer NOT NULL,
            "id" text PRIMARY KEY NOT NULL,
            "created_at" text,
            "expires_at" text NOT NULL,
            FOREIGN KEY ("_parent_id") REFERENCES "users"("id") ON UPDATE no action ON DELETE cascade
          )`)
          fixResults.push({ step: 'recreated_users_sessions', ok: true })

          await db.drizzle.run(`CREATE INDEX IF NOT EXISTS "users_sessions_order_idx" ON "users_sessions" ("_order")`)
          await db.drizzle.run(`CREATE INDEX IF NOT EXISTS "users_sessions_parent_id_idx" ON "users_sessions" ("_parent_id")`)
          fixResults.push({ step: 'created_indexes', ok: true })
        } else {
          fixResults.push({ step: 'users_sessions_schema_ok', ok: true })
        }
      } catch (e: any) {
        fixResults.push({ step: 'fix_users_sessions_error', error: e?.message })
      }

      // Step 2: Check which key tables are missing and create them
      const requiredTables = [
        'clients', 'clients_enabled_features', 'clients_disabled_collections',
        'deployments', 'client_requests',
        'order_lists', 'order_lists_items', 'order_lists_share_with',
        'orders', 'orders_items',
        'blog_posts', 'faqs', 'media', 'cases', 'testimonials', 'services', 'partners',
        'products', 'products_rels', 'product_categories', 'brands', 'customer_groups',
      ]

      try {
        const tableList = await db.drizzle.run(`SELECT name FROM sqlite_master WHERE type='table'`)
        const existingTables = new Set((tableList?.rows || []).map((r: any) => r.name || r[0]))

        const missing = requiredTables.filter(t => !existingTables.has(t))
        fixResults.push({ step: 'missing_tables', missing })
      } catch (e: any) {
        fixResults.push({ step: 'check_missing_tables_error', error: e?.message })
      }

      // Step 3: Delete migration record to force re-run
      try {
        await db.drizzle.run(`DELETE FROM payload_migrations WHERE name = '20260216_171738'`)
        fixResults.push({ step: 'deleted_migration_record', ok: true })
      } catch (e: any) {
        fixResults.push({ step: 'delete_migration_record_error', error: e?.message })
      }

      // Step 4: Run migrations
      try {
        await payload.db.migrate()
        fixResults.push({ step: 'migration_ran', ok: true })
      } catch (e: any) {
        fixResults.push({ step: 'migration_error', error: e?.message })
      }
    }

    const data = await diagnose(payload)
    return NextResponse.json({ ok: true, fixResults, ...data, timestamp: new Date().toISOString() })
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || String(error), stack: error?.stack?.split('\n').slice(0, 10) },
      { status: 500 }
    )
  }
}
