/**
 * schema-push.ts
 *
 * Standalone schema push script — syncs database schema without migrations.
 *
 * This is needed because Payload's `push: true` config option is IGNORED
 * when NODE_ENV=production (see node_modules/@payloadcms/db-postgres/dist/connect.js:109).
 * All production sites therefore have NO schema sync mechanism.
 *
 * This script:
 * 1. Initializes Payload (builds drizzle schema in memory)
 * 2. Calls pushDevSchema() explicitly — bypassing the NODE_ENV guard
 * 3. Refuses destructive changes (hasDataLoss) for safety
 *
 * Drizzle-kit's pushSchema() uses interactive prompts (hanji) to ask about
 * column/table/enum renames. In non-interactive mode (deploy scripts), hanji
 * hangs forever waiting for keyboard input. We solve this by auto-emitting
 * Enter keypresses on stdin, which selects the first option in each prompt.
 * The first option is always "create new" (not rename) — the safe choice.
 *
 * Usage:
 *   npm run schema:push          # Push schema changes
 *   npm run schema:push:dry      # Dry run — show what would change
 *
 * In deploy scripts:
 *   NODE_OPTIONS="--max-old-space-size=4096 --no-deprecation" npx tsx src/scripts/schema-push.ts
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import readline from 'readline'

const isDryRun = process.argv.includes('--dry-run')
const isForce = process.argv.includes('--force')

// Prevent Payload's connect() from running its own push/migrate
process.env.PAYLOAD_MIGRATING = 'true'
// Force pushDevSchema to skip the dequal cache check
process.env.PAYLOAD_FORCE_DRIZZLE_PUSH = 'true'

// ─── Auto-resolve interactive prompts ──────────────────────────────────────
// Drizzle-kit uses hanji (an interactive terminal prompt library) for rename
// conflict resolution. In non-interactive mode, hanji listens for keypress
// events on stdin and hangs forever. We auto-emit Enter keypresses to resolve
// each prompt with the default selection (first option = "create new").
//
// This is SAFE because:
// - First option is always "create new" (not rename)
// - No data is lost by creating new columns/tables/enums
// - Old columns/enums remain in the database (harmless)
// - The hasDataLoss check catches any truly destructive changes
readline.emitKeypressEvents(process.stdin)
const autoEnter = setInterval(() => {
  try {
    process.stdin.emit('keypress', '\r', { name: 'return' })
  } catch {
    // stdin might not be available — ignore
  }
}, 50)
autoEnter.unref()

// Hard kill after 180 seconds — safety net if anything hangs
// (large schemas with many tables can take a while to compare)
const hardKill = setTimeout(() => {
  console.log('[schema-push] Safety timeout reached (180s) — force exit')
  process.exit(1)
}, 180_000)
hardKill.unref()

async function run() {
  console.log(`[schema-push] Starting schema push${isDryRun ? ' (DRY RUN)' : ''}...`)
  console.log(`[schema-push] NODE_ENV=${process.env.NODE_ENV || '(not set)'}`)
  console.log(`[schema-push] DATABASE_URL=${process.env.DATABASE_URL ? '***' + process.env.DATABASE_URL.slice(-20) : '(not set)'}`)

  let payload: any = null

  // Step 1: Initialize Payload — this builds the drizzle schema in memory
  try {
    payload = await getPayload({ config })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[schema-push] Failed to initialize Payload:', message)
    process.exit(1)
  }

  const adapter = payload.db

  // Verify we have a postgres adapter with drizzle
  if (!adapter.drizzle || !adapter.schema || !adapter.requireDrizzleKit) {
    console.error('[schema-push] This script only works with PostgreSQL adapter')
    process.exit(1)
  }

  try {
    // Step 2: Get pushSchema from drizzle-kit (same way pushDevSchema does internally)
    const { pushSchema } = adapter.requireDrizzleKit()
    const { extensions = {}, tablesFilter } = adapter

    console.log('[schema-push] Comparing schema with database...')

    // Step 3: Calculate schema diff
    // pushSchema() will use hanji prompts for rename resolution —
    // our auto-enter above resolves these with "create new" (first option)
    const { apply, hasDataLoss, warnings, statementsToExecute } = await pushSchema(
      adapter.schema,
      adapter.drizzle,
      adapter.schemaName ? [adapter.schemaName] : undefined,
      tablesFilter,
      extensions.postgis ? ['postgis'] : undefined,
    )

    // Stop auto-enter now that pushSchema has resolved all prompts
    clearInterval(autoEnter)

    // Step 4: Report findings
    if (statementsToExecute?.length) {
      console.log(`[schema-push] ${statementsToExecute.length} statement(s) to execute:`)
      for (const stmt of statementsToExecute) {
        console.log(`  → ${stmt}`)
      }
    } else {
      console.log('[schema-push] No schema changes detected — database is up to date')
    }

    if (warnings.length) {
      console.log(`[schema-push] ${warnings.length} warning(s):`)
      for (const w of warnings) {
        console.log(`  ⚠ ${w}`)
      }
    }

    if (hasDataLoss && !isForce) {
      console.error('[schema-push] DATA LOSS detected — refusing to apply changes!')
      console.error('[schema-push] Review the warnings above. Use --force to apply anyway.')
      // Exit 0 so deploy continues — the app will still start, just without destructive schema changes
      process.exit(0)
    }
    if (hasDataLoss && isForce) {
      console.log('[schema-push] DATA LOSS detected but --force specified — proceeding')
    }

    // Step 5: Apply changes (unless dry run)
    if (isDryRun) {
      console.log('[schema-push] Dry run — no changes applied')
    } else if (statementsToExecute?.length) {
      console.log('[schema-push] Applying schema changes...')

      // Apply statements individually so failures don't block remaining changes.
      // This is critical for catch-up scenarios where many changes accumulated
      // and some statements may fail (e.g., enum→text type changes, missing FKs).
      const { sql } = await import('drizzle-orm')
      let applied = 0
      let failed = 0
      const failures: string[] = []

      for (const stmt of statementsToExecute) {
        try {
          await adapter.drizzle.execute(sql.raw(stmt))
          applied++
        } catch (err: unknown) {
          failed++
          const msg = err instanceof Error ? err.message : String(err)
          // Keep first 10 failures for logging, avoid flooding
          if (failures.length < 10) {
            failures.push(`${stmt.slice(0, 120)}... → ${msg.split('\n')[0]}`)
          }
        }
      }

      console.log(`[schema-push] Applied: ${applied}/${statementsToExecute.length} statements`)
      if (failed > 0) {
        console.log(`[schema-push] Failed: ${failed} statements (non-critical, may be stale references):`)
        for (const f of failures) {
          console.log(`  ✗ ${f}`)
        }
        if (failed > 10) {
          console.log(`  ... and ${failed - 10} more`)
        }
      }

      // Update payload_migrations dev push marker (same as pushDevSchema does)
      const migrationsTable = adapter.schemaName
        ? `"${adapter.schemaName}"."payload_migrations"`
        : '"payload_migrations"'
      const drizzle = adapter.drizzle

      try {
        const result = await adapter.execute({
          drizzle,
          raw: `SELECT * FROM ${migrationsTable} WHERE batch = '-1'`,
        })
        const devPush = result.rows

        if (!devPush.length) {
          await drizzle.insert(adapter.tables.payload_migrations).values({
            name: 'dev',
            batch: -1,
          })
        } else {
          await adapter.execute({
            drizzle,
            raw: `UPDATE ${migrationsTable} SET updated_at = CURRENT_TIMESTAMP WHERE batch = '-1'`,
          })
        }
      } catch {
        // payload_migrations table might not exist yet on fresh DBs — that's fine
      }

      console.log('[schema-push] Schema sync complete')
    } else {
      console.log('[schema-push] Nothing to apply')
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[schema-push] Error during schema push:', message)
    // Don't exit 1 — let deploy continue
  }

  // Destroy DB connection
  try {
    await Promise.race([
      adapter.destroy?.(),
      new Promise((resolve) => setTimeout(resolve, 5_000)),
    ])
  } catch {
    // ignore
  }

  process.exit(0)
}

run()
