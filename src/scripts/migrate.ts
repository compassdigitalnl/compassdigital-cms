/**
 * migrate.ts
 *
 * Standalone migration script — exits cleanly after running.
 * Use this instead of `payload migrate` in deploy scripts to avoid hanging.
 *
 * Usage:
 *   npm run migrate
 *
 * In Ploi deploy script:
 *   NODE_OPTIONS="--no-deprecation" npm run migrate
 */

import { getPayload } from 'payload'
import config from '@payload-config'

async function runMigrations() {
  console.log('[migrate] Starting Payload migrations...')

  const payload = await getPayload({ config })

  try {
    // Run all pending migrations
    await payload.db.migrate()
    console.log('[migrate] ✅ Migrations completed successfully')
  } catch (err: any) {
    // If no pending migrations, that's fine
    if (err?.message?.includes('No migrations') || err?.message?.includes('up to date')) {
      console.log('[migrate] ✅ No pending migrations — already up to date')
    } else {
      console.error('[migrate] ❌ Migration error:', err?.message || err)
      process.exit(1)
    }
  } finally {
    // Always close DB connection and exit cleanly
    await payload.db.destroy()
    process.exit(0)
  }
}

runMigrations()
