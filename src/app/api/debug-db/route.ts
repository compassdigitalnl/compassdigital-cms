import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Temporary debug endpoint - checks DB tables and auth
 * DELETE after debugging!
 */
export async function GET(req: Request) {
  const url = new URL(req.url)
  const secret = url.searchParams.get('secret')

  if (secret !== process.env.PAYLOAD_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results: Record<string, any> = {}

  try {
    const payload = await getPayload({ config })
    const db = (payload.db as any).drizzle

    // Check which tables exist
    const tables = await db.run(`SELECT name FROM sqlite_master WHERE type='table' ORDER BY name`)
    results.tables = tables.rows?.map((r: any) => r[0] || r.name) || tables

    // Check users_sessions count
    try {
      const sessions = await db.run(`SELECT COUNT(*) as count FROM users_sessions`)
      results.sessions_count = sessions.rows?.[0]?.[0] ?? sessions.rows?.[0]?.count ?? sessions
    } catch (e: any) {
      results.sessions_error = e.message
    }

    // Check users count and columns
    try {
      const users = await db.run(`PRAGMA table_info(users)`)
      results.users_columns = users.rows?.map((r: any) => r[1] || r.name) || users
    } catch (e: any) {
      results.users_columns_error = e.message
    }

    // Check clients table
    try {
      const clients = await db.run(`SELECT COUNT(*) as count FROM clients`)
      results.clients_count = clients.rows?.[0]?.[0] ?? clients.rows?.[0]?.count ?? clients
    } catch (e: any) {
      results.clients_error = e.message
    }

    // Try loading user 1
    try {
      const user = await payload.findByID({ collection: 'users', id: 1 })
      results.user_1 = { id: user.id, email: user.email, roles: user.roles }
    } catch (e: any) {
      results.user_1_error = e.message
    }

  } catch (e: any) {
    results.init_error = e.message
    results.stack = e.stack?.split('\n').slice(0, 5).join('\n')
  }

  return NextResponse.json(results)
}
