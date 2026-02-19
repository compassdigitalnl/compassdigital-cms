/**
 * migrate.ts
 *
 * Standalone migration script — always exits cleanly.
 * Use this instead of `payload migrate` in deploy scripts to avoid hanging.
 *
 * Usage:
 *   npm run migrate
 *
 * In Ploi deploy script:
 *   npm run migrate
 */

import { getPayload } from 'payload'
import config from '@payload-config'

// Hard kill after 90 seconds — safety net if anything hangs
const hardKill = setTimeout(() => {
  console.log('[migrate] Safety timeout reached (90s) — force exit')
  process.exit(0)
}, 90_000)
// .unref() so this timer doesn't prevent natural exit if everything finishes sooner
hardKill.unref()

async function runMigrations() {
  console.log('[migrate] Starting Payload migrations...')

  let payload: any = null

  try {
    payload = await getPayload({ config })
  } catch (err: any) {
    console.error('[migrate] Failed to initialize Payload:', err?.message || err)
    process.exit(1)
  }

  try {
    // Force migration without interactive prompt
    // This is safe for production deployments where we want auto-migrations
    await payload.db.migrate({ forceAcceptWarning: true })
    console.log('[migrate] ✅ Migrations completed successfully')
  } catch (err: any) {
    const msg = err?.message || ''
    if (
      msg.includes('No migrations') ||
      msg.includes('up to date') ||
      msg.includes('already applied') ||
      msg.includes('nothing to migrate')
    ) {
      console.log('[migrate] ✅ No pending migrations — already up to date')
    } else {
      console.error('[migrate] ❌ Migration error:', msg || err)
      // Still exit 0 — a migration error on prod shouldn't prevent pm2 restart
      // The app will start anyway and surface the error through Payload's admin
    }
  }

  // Destroy DB connection, but don't wait more than 5 seconds
  try {
    await Promise.race([
      payload.db.destroy?.(),
      new Promise((resolve) => setTimeout(resolve, 5_000)),
    ])
  } catch {
    // ignore
  }

  process.exit(0)
}

runMigrations()
